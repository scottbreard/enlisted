-- ============================================================
-- Enlisted — Phase 1 Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type service_category as enum (
  'fractional_cfo',
  'ir_firm',
  'market_maker',
  'corporate_secretary',
  'news_release_writer',
  'ir_web',
  'ir_video',
  'other'
);

create type listing_tier as enum (
  'free',
  'basic',
  'pro',
  'featured'
);

create type provider_status as enum (
  'pending',
  'active',
  'suspended'
);

create type exchange as enum (
  'TSX',
  'TSXV',
  'CSE',
  'NEO'
);

create type subscription_plan as enum (
  'basic',
  'pro',
  'featured'
);

create type subscription_status as enum (
  'active',
  'cancelled',
  'past_due'
);

-- ============================================================
-- PROVIDERS
-- Service providers who list themselves in the directory
-- ============================================================

create table providers (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Identity
  name              text not null,
  slug              text not null unique,

  -- Categorization
  service_category  service_category not null,
  listing_tier      listing_tier not null default 'free',
  status            provider_status not null default 'pending',

  -- Public profile
  description       text,
  logo_url          text,
  website_url       text,
  linkedin_url      text,
  twitter_url       text,

  -- Contact (private — not shown publicly)
  contact_name      text,
  contact_email     text,
  contact_phone     text,

  -- Auth link — the Supabase user who owns this profile
  user_id           uuid references auth.users(id) on delete set null
);

-- Auto-update updated_at on any change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger providers_updated_at
  before update on providers
  for each row execute function update_updated_at();

-- Row Level Security
alter table providers enable row level security;

-- Anyone can read active providers (public directory)
create policy "Public can view active providers"
  on providers for select
  using (status = 'active');

-- Owners can read their own provider regardless of status
create policy "Owners can view own provider"
  on providers for select
  using (auth.uid() = user_id);

-- Owners can update their own provider
create policy "Owners can update own provider"
  on providers for update
  using (auth.uid() = user_id);

-- Authenticated users can create a provider
create policy "Authenticated users can create provider"
  on providers for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- PUBLIC COMPANIES
-- Canadian public companies (TSX, TSXV, CSE, NEO)
-- ============================================================

create table public_companies (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  name          text not null,
  ticker        text not null,
  exchange      exchange not null,
  sector        text,
  website_url   text,
  description   text,

  unique (ticker, exchange)
);

create trigger public_companies_updated_at
  before update on public_companies
  for each row execute function update_updated_at();

alter table public_companies enable row level security;

-- Public companies are readable by everyone
create policy "Public can view companies"
  on public_companies for select
  using (true);

-- Only authenticated users can insert (for CSV import)
create policy "Authenticated users can insert companies"
  on public_companies for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update companies"
  on public_companies for update
  using (auth.uid() is not null);

-- ============================================================
-- EXECUTIVES
-- Key people at public companies
-- ============================================================

create table executives (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  company_id    uuid not null references public_companies(id) on delete cascade,

  name          text not null,
  title         text,
  email         text,
  phone         text,
  linkedin_url  text
);

create trigger executives_updated_at
  before update on executives
  for each row execute function update_updated_at();

alter table executives enable row level security;

create policy "Public can view executives"
  on executives for select
  using (true);

create policy "Authenticated users can insert executives"
  on executives for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update executives"
  on executives for update
  using (auth.uid() is not null);

-- ============================================================
-- SUBSCRIPTIONS
-- Which providers have paid, at what tier
-- ============================================================

create table subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  provider_id             uuid not null references providers(id) on delete cascade,

  plan                    subscription_plan not null,
  status                  subscription_status not null default 'active',

  amount_cents            integer not null,
  currency                text not null default 'CAD',

  start_date              date not null,
  renewal_date            date,

  -- Stripe placeholder — null until Phase 3
  stripe_subscription_id  text
);

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();

alter table subscriptions enable row level security;

-- Providers can only see their own subscriptions
create policy "Providers can view own subscriptions"
  on subscriptions for select
  using (
    provider_id in (
      select id from providers where user_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES (for common lookups)
-- ============================================================

create index on providers (service_category);
create index on providers (listing_tier);
create index on providers (status);
create index on providers (slug);
create index on public_companies (ticker);
create index on public_companies (exchange);
create index on executives (company_id);
create index on subscriptions (provider_id);
