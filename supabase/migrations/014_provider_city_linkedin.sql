-- The provider profile editor collects City and LinkedIn URL, but the
-- columns were never added, so every profile save was rejected (42703).
-- Run this in the Supabase SQL editor (same as migrations 001–013).

alter table provider_profiles add column if not exists city text;
alter table provider_profiles add column if not exists linkedin_url text;
