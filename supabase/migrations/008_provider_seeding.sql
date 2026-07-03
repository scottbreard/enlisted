-- ─────────────────────────────────────────────────────────────
-- 008_provider_seeding.sql
-- Columns to support pre-seeded (unclaimed) provider profiles.
-- Seeded profiles have user_id = null until claimed.
-- ─────────────────────────────────────────────────────────────

alter table provider_profiles
  add column if not exists source text,            -- e.g. 'cpab', 'ciri', 'manual'
  add column if not exists source_ref text,        -- e.g. CPAB FirmNumber
  add column if not exists claimed_at timestamptz, -- set when a real user claims the listing
  add column if not exists seed_data jsonb;        -- raw scraped facts (client count, contact name, etc.)

-- One profile per source record
create unique index if not exists idx_provider_profiles_source
  on provider_profiles (source, source_ref)
  where source is not null;
