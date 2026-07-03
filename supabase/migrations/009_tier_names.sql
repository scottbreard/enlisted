-- ─────────────────────────────────────────────────────────────
-- 009_tier_names.sql
-- Align tier constraint with current app naming: free / listed / featured.
-- (002 used the old naming where 'listed' meant free and 'connected'
--  was the paid tier — app code now inserts 'free' and sells 'listed'.)
-- ─────────────────────────────────────────────────────────────

alter table provider_profiles
  drop constraint if exists provider_profiles_tier_check;

-- Old naming → new naming
update provider_profiles set tier = 'free'   where tier = 'listed';
update provider_profiles set tier = 'listed' where tier = 'connected';

alter table provider_profiles
  add constraint provider_profiles_tier_check
  check (tier in ('free', 'listed', 'featured'));
