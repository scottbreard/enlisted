-- ─────────────────────────────────────────────────────────────
-- 010_issuers.sql
-- All listed Canadian issuers (TSX / TSXV / CSE / NEO).
-- Source: Cboe Canada symbol listings (daily public CSV).
-- Powers exec-registration company lookup/verification and the
-- compliance calendar; refreshed by scripts/seed/issuers.mjs.
-- ─────────────────────────────────────────────────────────────

create table if not exists issuers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  symbol text not null,
  exchange_code text not null,      -- TSX | TSXV | CSE | NEO
  market_code text not null default 'CA',
  cusip text,
  currency text default 'CAD',
  is_etf boolean default false,
  is_live boolean default true,
  source text default 'cboe',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (exchange_code, symbol)
);

create index if not exists idx_issuers_name on issuers using gin (to_tsvector('english', name));
create index if not exists idx_issuers_exchange on issuers (exchange_code) where is_live;

alter table issuers enable row level security;

-- Public read (company names/tickers are public data)
create policy "issuers_public_read" on issuers for select using (true);
