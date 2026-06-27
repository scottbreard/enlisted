alter table executive_profiles
  add column if not exists is_active boolean not null default true;
