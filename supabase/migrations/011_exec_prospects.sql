-- ─────────────────────────────────────────────────────────────
-- 011_exec_prospects.sql
-- 1) Contact-enrichment columns on issuers (websites, IR emails …)
-- 2) executive_prospects: scraped/imported exec contacts, kept
--    separate from executive_profiles (registered users).
-- ─────────────────────────────────────────────────────────────

alter table issuers
  add column if not exists website text,
  add column if not exists ir_url text,
  add column if not exists newsroom_url text,
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists general_email text,
  add column if not exists ir_email text,
  add column if not exists province text,
  add column if not exists enriched_at timestamptz;

create table if not exists executive_prospects (
  id uuid primary key default gen_random_uuid(),
  issuer_id uuid references issuers(id) on delete set null,
  first_name text not null,
  last_name text not null,
  title text,                       -- CEO | CFO | Investor Relations | …
  company_name text not null,
  email text,
  phone text,
  linkedin_url text,
  source text default 'import',
  invited_at timestamptz,           -- set when a launch invitation is sent
  registered_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (company_name, first_name, last_name, title)
);

create index if not exists idx_exec_prospects_issuer on executive_prospects (issuer_id);
create index if not exists idx_exec_prospects_email on executive_prospects (email) where email is not null;

alter table executive_prospects enable row level security;
-- No public policies: service-role/admin access only.
