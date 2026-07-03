-- Track which issuer websites have been scraped for exec names
-- (null = not yet attempted; ok | no_team_page | error)
alter table issuers add column if not exists exec_scrape_status text;
create index if not exists idx_issuers_scrape on issuers (exec_scrape_status) where website is not null;
