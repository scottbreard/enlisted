-- ─────────────────────────────────────────────────────────────
-- 005_provider_approval.sql
-- Adds approval workflow to provider_profiles.
-- ─────────────────────────────────────────────────────────────

alter table provider_profiles
  add column if not exists approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected')),
  add column if not exists rejection_reason text,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by text;

-- Existing active providers are retrospectively approved
update provider_profiles
  set approval_status = 'approved', approved_at = created_at
  where is_active = true and approval_status = 'pending';

-- Index for admin queue queries
create index if not exists idx_provider_profiles_approval
  on provider_profiles (approval_status, created_at desc);
