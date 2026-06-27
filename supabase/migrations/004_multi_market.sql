-- ─────────────────────────────────────────────────────────────
-- 004_multi_market.sql
-- Adds market_code to tables that need market-level filtering.
-- provider_profiles already has provider_markets junction table.
-- executive_profiles, news_items, regulatory_alerts, and
-- newsletter_subscribers each get a direct market_code column.
-- ─────────────────────────────────────────────────────────────

-- 1. executive_profiles — executives belong to one market
alter table executive_profiles
  add column if not exists market_code text not null default 'CA'
    check (market_code in ('CA', 'AU', 'UK', 'US'));

-- 2. news_items — news is market-specific
alter table news_items
  add column if not exists market_code text not null default 'CA'
    check (market_code in ('CA', 'AU', 'UK', 'US'));

-- 3. regulatory_alerts — alerts are market-specific
alter table regulatory_alerts
  add column if not exists market_code text not null default 'CA'
    check (market_code in ('CA', 'AU', 'UK', 'US'));

-- 4. newsletter_subscribers — segment by market for email campaigns
alter table newsletter_subscribers
  add column if not exists market_code text not null default 'CA'
    check (market_code in ('CA', 'AU', 'UK', 'US'));

-- 5. provider_profiles — add market_code as a convenience denorm
--    (canonical source is provider_markets, but this allows simple
--     single-market queries without a join)
alter table provider_profiles
  add column if not exists primary_market_code text not null default 'CA'
    check (primary_market_code in ('CA', 'AU', 'UK', 'US'));

-- 6. Indexes for all market_code columns
create index if not exists idx_executive_profiles_market
  on executive_profiles (market_code);

create index if not exists idx_provider_profiles_primary_market
  on provider_profiles (primary_market_code, is_active);

create index if not exists idx_news_items_market
  on news_items (market_code);

create index if not exists idx_regulatory_alerts_market
  on regulatory_alerts (market_code);

create index if not exists idx_newsletter_subscribers_market
  on newsletter_subscribers (market_code);

-- 7. Ensure provider_markets has an index for market lookups
create index if not exists idx_provider_markets_market_id
  on provider_markets (market_id);

-- 8. RLS helper: expose market_code setting so app can pass it
--    via Supabase session config (set app.market_code = 'CA')
--    This lets RLS policies optionally filter by current market.
--    Usage from Next.js: supabase.rpc('set_config', { key: 'app.market_code', value: 'CA' })
--    (optional — app-layer filtering is the primary approach)
