import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendProviderApprovedEmail, sendProviderRejectedEmail } from '@/lib/email'

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  return ADMIN_EMAILS.includes(user.email ?? '')
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  if (!await assertAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { action, reason, ...fields } = body

  const { data: { user } } = await supabase.auth.getUser()

  // Approve
  if (action === 'approve') {
    const { data: provider, error } = await supabase
      .from('provider_profiles')
      .update({
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user!.email,
        rejection_reason: null,
      })
      .eq('id', id)
      .select('email, company_name, slug')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (provider?.email) {
      sendProviderApprovedEmail({
        to: provider.email,
        companyName: provider.company_name,
        slug: provider.slug,
      }).catch(() => {})
    }
    return NextResponse.json({ ok: true })
  }

  // Reject
  if (action === 'reject') {
    const { data: provider, error } = await supabase
      .from('provider_profiles')
      .update({
        approval_status: 'rejected',
        rejection_reason: reason ?? 'No reason provided.',
        approved_at: null,
        approved_by: null,
      })
      .eq('id', id)
      .select('email, company_name')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (provider?.email) {
      sendProviderRejectedEmail({
        to: provider.email,
        companyName: provider.company_name,
        reason: reason ?? 'No reason provided.',
      }).catch(() => {})
    }
    return NextResponse.json({ ok: true })
  }

  // Toggle active
  if (action === 'toggle_active') {
    const { data: current } = await supabase
      .from('provider_profiles')
      .select('is_active')
      .eq('id', id)
      .single()
    const { error } = await supabase
      .from('provider_profiles')
      .update({ is_active: !current?.is_active })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Edit fields (company_name, tagline, description, tier)
  if (Object.keys(fields).length > 0) {
    const allowed = ['company_name', 'tagline', 'description', 'tier', 'email', 'website_url', 'phone']
    const safe = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)))
    const { error } = await supabase
      .from('provider_profiles')
      .update(safe)
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'No valid action' }, { status: 400 })
}
