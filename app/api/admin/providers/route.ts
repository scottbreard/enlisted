import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const EXCHANGE_GROUPS: Record<string, string> = {
  TSX: 'CA', TSXV: 'CA', CSE: 'CA', NEO: 'CA',
  NYSE: 'US', Nasdaq: 'US', OTC: 'US',
  LSE: 'UK', AIM: 'UK',
  ASX: 'AU', NSX: 'AU',
}

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  return ADMIN_EMAILS.includes(user.email ?? '')
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  if (!await assertAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { company_name, email, website_url, tier, exchanges } = await req.json()

  if (!company_name || !email || !exchanges?.length) {
    return NextResponse.json({ error: 'company_name, email, and exchanges are required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Create user and send invite email — they click to set their password
  const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { role: 'provider' },
  })
  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 })
  }

  const slug = `${slugify(company_name)}-${Math.random().toString(36).substring(2, 6)}`

  // Determine primary market from first exchange selected
  const primaryMarket = EXCHANGE_GROUPS[exchanges[0]] ?? 'CA'

  const { data: profile, error: profileError } = await admin
    .from('provider_profiles')
    .insert({
      user_id: invite.user.id,
      company_name,
      slug,
      email,
      website_url: website_url || null,
      tier: tier ?? 'free',
      is_active: true,
      primary_market_code: primaryMarket,
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: 'admin',
    })
    .select('id')
    .single()

  if (profileError) {
    // Roll back the user if profile creation fails
    await admin.auth.admin.deleteUser(invite.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Save exchanges
  await admin.from('provider_exchanges').insert(
    exchanges.map((code: string) => ({ provider_id: profile.id, exchange_code: code }))
  )

  return NextResponse.json({ ok: true, slug })
}
