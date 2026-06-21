-- ============================================================
-- ENLISTED v3 — FULL SCHEMA (drops existing tables first)
-- ============================================================

drop table if exists subscriptions cascade;
drop table if exists executives cascade;
drop table if exists public_companies cascade;
drop table if exists providers cascade;

drop type if exists listing_tier cascade;
drop type if exists service_category cascade;
drop type if exists exchange_type cascade;
drop type if exists subscription_plan cascade;

-- ── MARKETS ──────────────────────────────────────────────────
create table if not exists markets (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  domain text not null,
  currency text not null,
  currency_symbol text not null,
  active boolean default true
);

insert into markets (code, name, domain, currency, currency_symbol) values
  ('CA', 'Canada',        'enlisted.ca',     'CAD', '$'),
  ('AU', 'Australia',     'enlisted.au',     'AUD', '$'),
  ('UK', 'United Kingdom','enlisted.co.uk',  'GBP', '£'),
  ('US', 'United States', 'enlisted.us',     'USD', '$')
on conflict (code) do nothing;

-- ── EXCHANGES ────────────────────────────────────────────────
create table if not exists exchanges (
  id uuid primary key default gen_random_uuid(),
  market_id uuid references markets(id),
  code text unique not null,
  name text not null,
  country text not null
);

insert into exchanges (market_id, code, name, country) values
  ((select id from markets where code='CA'), 'TSX',    'Toronto Stock Exchange',               'Canada'),
  ((select id from markets where code='CA'), 'TSXV',   'TSX Venture Exchange',                 'Canada'),
  ((select id from markets where code='CA'), 'CSE',    'Canadian Securities Exchange',         'Canada'),
  ((select id from markets where code='CA'), 'NEO',    'NEO Exchange',                         'Canada'),
  ((select id from markets where code='AU'), 'ASX',    'Australian Securities Exchange',       'Australia'),
  ((select id from markets where code='AU'), 'NSX',    'National Stock Exchange of Australia', 'Australia'),
  ((select id from markets where code='UK'), 'LSE',    'London Stock Exchange',                'United Kingdom'),
  ((select id from markets where code='UK'), 'AIM',    'AIM Market',                          'United Kingdom'),
  ((select id from markets where code='US'), 'NYSE',   'New York Stock Exchange',              'United States'),
  ((select id from markets where code='US'), 'NASDAQ', 'Nasdaq',                              'United States'),
  ((select id from markets where code='US'), 'OTC',    'OTC Markets',                         'United States')
on conflict (code) do nothing;

-- ── SERVICE CATEGORIES ───────────────────────────────────────
create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  group_name text not null,
  description text,
  sort_order integer default 0,
  active boolean default true
);

insert into service_categories (slug, name, group_name, sort_order) values
  ('securities-law',           'Securities Law',                    'Legal & Compliance', 10),
  ('corporate-ma-law',         'Corporate & M&A Law',               'Legal & Compliance', 11),
  ('regulatory-compliance',    'Regulatory Compliance',             'Legal & Compliance', 12),
  ('exchange-compliance',      'Exchange Compliance Advisors',      'Legal & Compliance', 13),
  ('privacy-law',              'Privacy Law',                       'Legal & Compliance', 14),
  ('employment-law',           'Employment Law',                    'Legal & Compliance', 15),
  ('ip-law',                   'IP Law',                            'Legal & Compliance', 16),
  ('audit-firms',              'Audit Firms',                       'Finance & Accounting', 20),
  ('accounting-non-audit',     'Accounting (Non-Audit)',            'Finance & Accounting', 21),
  ('outsourced-cfo',           'Outsourced CFO',                    'Finance & Accounting', 22),
  ('financial-controllers',    'Financial Controllers',             'Finance & Accounting', 23),
  ('tax-advisory',             'Tax Advisory',                      'Finance & Accounting', 24),
  ('forensic-accountants',     'Forensic Accountants',             'Finance & Accounting', 25),
  ('business-valuators',       'Business Valuators',                'Finance & Accounting', 26),
  ('financial-modeling',       'Financial Modeling',                'Finance & Accounting', 27),
  ('market-makers',            'Market Makers',                     'Capital Markets & Trading', 30),
  ('investment-banks',         'Investment Banks',                  'Capital Markets & Trading', 31),
  ('broker-dealers',           'Broker-Dealers',                    'Capital Markets & Trading', 32),
  ('stock-surveillance',       'Stock Surveillance',                'Capital Markets & Trading', 33),
  ('trading-desk',             'Trading Desk',                      'Capital Markets & Trading', 34),
  ('short-interest',           'Short Interest Intelligence',       'Capital Markets & Trading', 35),
  ('atm-programs',             'ATM Programs',                      'Capital Markets & Trading', 36),
  ('corporate-secretaries',    'Corporate Secretaries',             'Corporate Administration', 40),
  ('transfer-agents',          'Transfer Agents',                   'Corporate Administration', 41),
  ('proxy-advisory',           'Proxy Advisory',                    'Corporate Administration', 42),
  ('registered-agents',        'Registered Agents',                 'Corporate Administration', 43),
  ('sedar-edgar-filing',       'SEDAR/EDGAR Filing',                'Corporate Administration', 44),
  ('drip-administrators',      'DRIP Administrators',               'Corporate Administration', 45),
  ('ir-firms',                 'Full-Service IR Firms',             'Investor Relations', 50),
  ('boutique-ir',              'Boutique IR Consultants',           'Investor Relations', 51),
  ('institutional-outreach',   'Institutional Investor Outreach',   'Investor Relations', 52),
  ('retail-ir',                'Retail IR',                         'Investor Relations', 53),
  ('shareholder-id',           'Shareholder Identification',        'Investor Relations', 54),
  ('analyst-coverage',         'Analyst Coverage',                  'Investor Relations', 55),
  ('earnings-call-mgmt',       'Earnings Call Management',          'Investor Relations', 56),
  ('roadshow-services',        'Roadshow Services',                 'Investor Relations', 57),
  ('pr-corporate-comms',       'PR & Corporate Communications',     'Communications & Media', 60),
  ('financial-pr',             'Financial PR',                      'Communications & Media', 61),
  ('crisis-communications',    'Crisis Communications',             'Communications & Media', 62),
  ('news-wire',                'News Wire Services',                'Communications & Media', 63),
  ('press-release-writing',    'Press Release Writing',             'Communications & Media', 64),
  ('media-monitoring',         'Media Monitoring',                  'Communications & Media', 65),
  ('ir-website',               'IR Website Design',                 'Digital & Technology', 70),
  ('social-media-mgmt',        'Social Media Management',           'Digital & Technology', 71),
  ('webcasting',               'Webcasting',                        'Digital & Technology', 72),
  ('digital-marketing',        'Digital Marketing',                 'Digital & Technology', 73),
  ('data-rooms',               'Data Rooms',                        'Digital & Technology', 74),
  ('cybersecurity',            'Cybersecurity',                     'Digital & Technology', 75),
  ('ai-consultants',           'AI Consultants',                    'Digital & Technology', 76),
  ('outsourced-ceo',           'Outsourced CEO',                    'Executive & Board', 80),
  ('executive-search',         'Executive Search',                  'Executive & Board', 81),
  ('director-placement',       'Independent Director Placement',    'Executive & Board', 82),
  ('board-advisory',           'Board Advisory',                    'Executive & Board', 83),
  ('executive-coaching',       'Executive Coaching',                'Executive & Board', 84),
  ('mgmt-consulting',          'Management Consulting',             'Executive & Board', 85),
  ('do-insurance',             'D&O Insurance',                     'Insurance & Risk', 90),
  ('eo-insurance',             'E&O Insurance',                     'Insurance & Risk', 91),
  ('cyber-insurance',          'Cyber Insurance',                   'Insurance & Risk', 92),
  ('corporate-insurance',      'Corporate Insurance',               'Insurance & Risk', 93),
  ('royalty-streaming',        'Royalty & Streaming',               'Specialized Finance', 100),
  ('bridge-financing',         'Bridge Financing',                  'Specialized Finance', 101),
  ('mezzanine-finance',        'Mezzanine Finance',                 'Specialized Finance', 102),
  ('convertible-debentures',   'Convertible Debentures',            'Specialized Finance', 103),
  ('corporate-banking',        'Corporate Banking',                 'Specialized Finance', 104),
  ('fx-risk-mgmt',             'FX Risk Management',               'Specialized Finance', 105),
  ('financial-printers',       'Financial Printers',                'Printing, Design & Production', 110),
  ('annual-report-design',     'Annual Report Design',              'Printing, Design & Production', 111),
  ('corporate-branding',       'Corporate Branding',                'Printing, Design & Production', 112),
  ('investor-presentation',    'Investor Presentation Design',      'Printing, Design & Production', 113),
  ('exchange-education',       'Exchange Education',                'Education, Research & Governance', 120),
  ('equity-research',          'Equity Research',                   'Education, Research & Governance', 121),
  ('corporate-governance',     'Corporate Governance',              'Education, Research & Governance', 122),
  ('esg-reporting',            'ESG Reporting',                     'Education, Research & Governance', 123),
  ('financial-literacy',       'Financial Literacy',                'Education, Research & Governance', 124),
  ('shareholder-analytics',    'Shareholder Analytics',             'Data & Analytics', 130),
  ('esg-data',                 'ESG Data',                          'Data & Analytics', 131),
  ('market-intelligence',      'Market Intelligence',               'Data & Analytics', 132),
  ('beneficial-ownership',     'Beneficial Ownership Tracking',     'Data & Analytics', 133),
  ('alternative-data',         'Alternative Data',                  'Data & Analytics', 134),
  ('qualified-persons',        'Qualified Persons (NI 43-101)',     'Sector-Specific Services', 140),
  ('geological-consultants',   'Geological Consultants',            'Sector-Specific Services', 141),
  ('oil-gas-engineers',        'Oil & Gas Reserve Engineers',       'Sector-Specific Services', 142),
  ('cannabis-compliance',      'Cannabis Compliance',               'Sector-Specific Services', 143),
  ('biotech-regulatory',       'Biotech Regulatory Affairs',        'Sector-Specific Services', 144),
  ('real-estate-reit',         'Real Estate / REIT',                'Sector-Specific Services', 145),
  ('cleantech-esg',            'CleanTech / ESG',                   'Sector-Specific Services', 146),
  ('crypto-blockchain',        'Crypto / Blockchain',               'Sector-Specific Services', 147),
  ('agritech',                 'AgriTech',                          'Sector-Specific Services', 148),
  ('conference-organizers',    'Conference Organizers',             'Events & Access', 150),
  ('corporate-access',         'Corporate Access Platforms',        'Events & Access', 151),
  ('investor-events',          'Investor Event Organizers',         'Events & Access', 152),
  ('roadshow-logistics',       'Roadshow Logistics',                'Events & Access', 153)
on conflict (slug) do nothing;

-- ── EXECUTIVE PROFILES ───────────────────────────────────────
create table if not exists executive_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  title text,
  company_name text not null,
  company_ticker text,
  market_cap_range text check (market_cap_range in ('micro','small','mid','large')),
  sector text,
  bio text,
  avatar_url text,
  linkedin_url text,
  is_founding_member boolean default false,
  founding_member_number integer,
  referral_code text unique,
  referred_by uuid references executive_profiles(id),
  referral_count integer default 0,
  expo_push_token text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists executive_exchanges (
  executive_id uuid references executive_profiles(id) on delete cascade,
  exchange_id uuid references exchanges(id),
  fiscal_year_end text,
  listing_date date,
  is_primary boolean default false,
  primary key (executive_id, exchange_id)
);

create table if not exists executive_watchlist (
  id uuid primary key default gen_random_uuid(),
  executive_id uuid references executive_profiles(id) on delete cascade,
  category_id uuid references service_categories(id),
  created_at timestamptz default now()
);

-- ── PROVIDER PROFILES ─────────────────────────────────────────
create table if not exists provider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  company_name text not null,
  slug text unique not null,
  tagline text,
  description text,
  long_description text,
  logo_url text,
  website_url text,
  phone text,
  email text,
  video_embed_url text,
  founded_year integer,
  team_size text,
  tier text not null default 'free' check (tier in ('free','listed','featured','professional','premium','enterprise')),
  is_verified boolean default false,
  verified_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  subscription_current_period_end timestamptz,
  is_active boolean default true,
  profile_views integer default 0,
  rfq_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists provider_markets (
  provider_id uuid references provider_profiles(id) on delete cascade,
  market_id uuid references markets(id),
  primary key (provider_id, market_id)
);

create table if not exists provider_exchanges (
  provider_id uuid references provider_profiles(id) on delete cascade,
  exchange_id uuid references exchanges(id),
  primary key (provider_id, exchange_id)
);

create table if not exists provider_categories (
  provider_id uuid references provider_profiles(id) on delete cascade,
  category_id uuid references service_categories(id),
  is_primary boolean default false,
  primary key (provider_id, category_id)
);

create table if not exists provider_team (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references provider_profiles(id) on delete cascade,
  name text not null,
  title text,
  bio text,
  avatar_url text,
  linkedin_url text,
  sort_order integer default 0
);

create table if not exists provider_locations (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references provider_profiles(id) on delete cascade,
  market_id uuid references markets(id),
  region text,
  city text
);

-- ── EXECUTIVE VAULT ──────────────────────────────────────────
create table if not exists executive_vault (
  id uuid primary key default gen_random_uuid(),
  executive_id uuid references executive_profiles(id) on delete cascade,
  provider_id uuid references provider_profiles(id),
  provider_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  mandate text,
  contract_start date,
  contract_end date,
  renewal_reminder_days integer default 60,
  notes text,
  rating integer check (rating between 1 and 5),
  review_text text,
  review_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── COMPLIANCE CALENDAR ───────────────────────────────────────
create table if not exists exchange_deadline_templates (
  id uuid primary key default gen_random_uuid(),
  exchange_code text not null,
  event_name text not null,
  event_category text not null,
  months_after_fiscal_year_end integer,
  days_offset integer default 0,
  description text,
  rule_reference text
);

create table if not exists compliance_events (
  id uuid primary key default gen_random_uuid(),
  executive_id uuid references executive_profiles(id) on delete cascade,
  exchange_id uuid references exchanges(id),
  title text not null,
  description text,
  due_date date not null,
  category text not null,
  is_custom boolean default false,
  is_completed boolean default false,
  notify_30_days boolean default true,
  notify_14_days boolean default true,
  notify_3_days boolean default true,
  created_at timestamptz default now()
);

-- ── RFQ SYSTEM ───────────────────────────────────────────────
create table if not exists rfq_requests (
  id uuid primary key default gen_random_uuid(),
  executive_id uuid references executive_profiles(id) on delete cascade,
  category_id uuid references service_categories(id),
  title text not null,
  description text not null,
  budget_range text,
  timeline text,
  status text default 'open' check (status in ('open','in_review','closed')),
  created_at timestamptz default now()
);

create table if not exists rfq_responses (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid references rfq_requests(id) on delete cascade,
  provider_id uuid references provider_profiles(id) on delete cascade,
  message text not null,
  status text default 'sent' check (status in ('sent','viewed','responded','engaged','declined')),
  viewed_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- ── MEMBER DISCOUNTS ──────────────────────────────────────────
create table if not exists member_discounts (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references provider_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric not null,
  currency text,
  valid_days integer default 90,
  max_claims integer,
  claim_count integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists discount_claims (
  id uuid primary key default gen_random_uuid(),
  executive_id uuid references executive_profiles(id),
  discount_id uuid references member_discounts(id),
  claim_code text unique not null,
  claimed_at timestamptz default now(),
  expires_at timestamptz not null
);

-- ── PROVIDER ANALYTICS ────────────────────────────────────────
create table if not exists provider_analytics (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references provider_profiles(id) on delete cascade,
  event_type text not null check (event_type in ('profile_view','website_click','rfq_click','contact_click')),
  executive_id uuid references executive_profiles(id),
  market_id uuid references markets(id),
  created_at timestamptz default now()
);

-- ── CONTACTS / ROLODEX ───────────────────────────────────────
create table if not exists executive_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references executive_profiles(id) on delete cascade,
  contact_executive_id uuid references executive_profiles(id),
  contact_provider_id uuid references provider_profiles(id),
  name text,
  title text,
  company text,
  email text,
  phone text,
  notes text,
  met_at text,
  created_at timestamptz default now()
);

-- ── NEWS FEED ─────────────────────────────────────────────────
create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  url text,
  source text,
  published_at timestamptz,
  markets text[],
  sectors text[],
  exchanges text[],
  tags text[],
  ai_relevance_score numeric,
  created_at timestamptz default now()
);

-- ── REFERRALS ─────────────────────────────────────────────────
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references executive_profiles(id),
  referred_email text not null,
  referred_executive_id uuid references executive_profiles(id),
  status text default 'pending' check (status in ('pending','registered','verified')),
  reward_tier_unlocked text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- ── NEWSLETTER ────────────────────────────────────────────────
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  executive_id uuid references executive_profiles(id),
  market text,
  status text default 'active' check (status in ('active','unsubscribed')),
  created_at timestamptz default now()
);

-- ── REGULATORY ALERTS ─────────────────────────────────────────
create table if not exists regulatory_alerts (
  id uuid primary key default gen_random_uuid(),
  exchange_id uuid references exchanges(id),
  title text not null,
  summary text not null,
  full_text text,
  source_url text,
  published_at timestamptz not null,
  impact_level text check (impact_level in ('low','medium','high')),
  affected_sectors text[],
  created_at timestamptz default now()
);

-- ── RLS ───────────────────────────────────────────────────────
alter table markets                  enable row level security;
alter table exchanges                enable row level security;
alter table service_categories       enable row level security;
alter table news_items               enable row level security;
alter table regulatory_alerts        enable row level security;
alter table executive_profiles       enable row level security;
alter table executive_exchanges      enable row level security;
alter table executive_watchlist      enable row level security;
alter table executive_vault          enable row level security;
alter table executive_contacts       enable row level security;
alter table compliance_events        enable row level security;
alter table exchange_deadline_templates enable row level security;
alter table rfq_requests             enable row level security;
alter table rfq_responses            enable row level security;
alter table provider_profiles        enable row level security;
alter table provider_markets         enable row level security;
alter table provider_exchanges       enable row level security;
alter table provider_categories      enable row level security;
alter table provider_team            enable row level security;
alter table provider_locations       enable row level security;
alter table member_discounts         enable row level security;
alter table discount_claims          enable row level security;
alter table provider_analytics       enable row level security;
alter table referrals                enable row level security;
alter table newsletter_subscribers   enable row level security;

-- Public read policies
create policy "Public read" on markets                    for select using (true);
create policy "Public read" on exchanges                  for select using (true);
create policy "Public read" on service_categories        for select using (true);
create policy "Public read" on news_items                 for select using (true);
create policy "Public read" on regulatory_alerts          for select using (true);
create policy "Public read" on exchange_deadline_templates for select using (true);
create policy "Public read" on provider_profiles          for select using (is_active = true);
create policy "Public read" on provider_markets           for select using (true);
create policy "Public read" on provider_exchanges         for select using (true);
create policy "Public read" on provider_categories        for select using (true);
create policy "Public read" on provider_team              for select using (true);
create policy "Public read" on provider_locations         for select using (true);
create policy "Public read" on member_discounts           for select using (active = true);

-- Executive own-data policies
create policy "Own data" on executive_profiles   for all using (auth.uid() = user_id);
create policy "Own data" on executive_exchanges  for all using (executive_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on executive_watchlist  for all using (executive_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on executive_vault      for all using (executive_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on executive_contacts   for all using (owner_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on compliance_events    for all using (executive_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on rfq_requests         for all using (executive_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on discount_claims      for all using (executive_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on referrals            for all using (referrer_id in (select id from executive_profiles where user_id = auth.uid()));
create policy "Own data" on newsletter_subscribers for all using (executive_id in (select id from executive_profiles where user_id = auth.uid()));

-- Provider own-data policies
create policy "Own data" on provider_profiles    for all using (auth.uid() = user_id);
create policy "Own data" on provider_markets     for all using (provider_id in (select id from provider_profiles where user_id = auth.uid()));
create policy "Own data" on provider_exchanges   for all using (provider_id in (select id from provider_profiles where user_id = auth.uid()));
create policy "Own data" on provider_categories  for all using (provider_id in (select id from provider_profiles where user_id = auth.uid()));
create policy "Own data" on provider_team        for all using (provider_id in (select id from provider_profiles where user_id = auth.uid()));
create policy "Own data" on provider_locations   for all using (provider_id in (select id from provider_profiles where user_id = auth.uid()));
create policy "Own data" on member_discounts     for all using (provider_id in (select id from provider_profiles where user_id = auth.uid()));
create policy "Own data" on provider_analytics   for select using (provider_id in (select id from provider_profiles where user_id = auth.uid()));
create policy "Provider rfq responses" on rfq_responses for all using (provider_id in (select id from provider_profiles where user_id = auth.uid()));

-- ── INDEXES ───────────────────────────────────────────────────
create index on provider_profiles (tier);
create index on provider_profiles (is_active);
create index on provider_profiles (slug);
create index on provider_categories (category_id);
create index on compliance_events (executive_id, due_date);
create index on news_items (published_at desc);
create index on provider_analytics (provider_id, created_at desc);
