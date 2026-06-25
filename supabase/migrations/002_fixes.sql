-- Migration 002: phase1 fixes
-- Run date: 2026-06-23

-- 1. Add 'connected' to provider_profiles.tier constraint
alter table provider_profiles
  drop constraint if exists provider_profiles_tier_check;

alter table provider_profiles
  add constraint provider_profiles_tier_check
  check (tier in ('free', 'listed', 'connected', 'featured', 'professional', 'premium', 'enterprise'));

-- 2. Allow anonymous inserts of profile_view events into provider_analytics
--    (required for public directory pages to track profile views)
create policy "Public can insert profile views"
  on provider_analytics
  for insert
  with check (event_type = 'profile_view');
