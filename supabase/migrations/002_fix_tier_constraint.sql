-- Fix provider_profiles.tier check constraint to include 'connected'
-- The original constraint omitted 'connected', causing Stripe webhook updates to fail.

alter table provider_profiles
  drop constraint if exists provider_profiles_tier_check;

alter table provider_profiles
  add constraint provider_profiles_tier_check
  check (tier in ('listed', 'connected', 'featured'));

-- Note: 'free', 'professional', 'premium', 'enterprise' are removed — they were
-- placeholder values from an earlier design. The live tier names are:
--   listed    = free, basic visibility
--   connected = $100/mo paid tier
--   featured  = $499/mo top tier
-- Any existing rows with the old tier values (free/professional/premium/enterprise)
-- should be updated to 'listed' before running this migration.
update provider_profiles
  set tier = 'listed'
  where tier not in ('listed', 'connected', 'featured');
