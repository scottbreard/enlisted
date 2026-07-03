-- Sales tracking on executive prospects
alter table executive_prospects
  add column if not exists contacted_at timestamptz,
  add column if not exists notes text;

-- Website-discovery tracking (null = not attempted; guessed | not_found)
alter table issuers add column if not exists website_search_status text;
