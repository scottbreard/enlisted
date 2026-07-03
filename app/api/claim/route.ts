import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Claim a seeded (unclaimed) provider listing for the signed-in user.
// Auto-verifies when the user's email domain matches a domain already
// associated with the firm in seed_data; otherwise leaves is_verified false.
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug: string }
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createAdminClient()

    const { data: profile } = await admin
      .from('provider_profiles')
      .select('id, user_id, company_name, seed_data, website_url')
      .eq('slug', slug)
      .single()
    if (!profile) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    if (profile.user_id) return NextResponse.json({ error: 'This listing has already been claimed.' }, { status: 409 })

    const { data: existing } = await admin
      .from('provider_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (existing) return NextResponse.json({ error: 'Your account already manages a provider profile.' }, { status: 409 })

    // Domain match → auto-verify
    const userDomain = user.email.split('@')[1]?.toLowerCase()
    const knownDomains = new Set<string>()
    const sd = profile.seed_data ?? {}
    for (const e of [sd.contact_email, ...(sd.emails ?? [])].filter(Boolean)) {
      knownDomains.add(String(e).split('@')[1]?.toLowerCase())
    }
    for (const d of sd.domains ?? []) knownDomains.add(String(d).toLowerCase())
    if (profile.website_url) {
      try { knownDomains.add(new URL(profile.website_url).hostname.replace(/^www\./, '')) } catch {}
    }
    const domainMatch = !!userDomain && knownDomains.has(userDomain)

    const { error } = await admin
      .from('provider_profiles')
      .update({
        user_id: user.id,
        email: user.email,
        claimed_at: new Date().toISOString(),
        is_verified: domainMatch,
        verified_at: domainMatch ? new Date().toISOString() : null,
      })
      .eq('id', profile.id)
      .is('user_id', null)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, verified: domainMatch, company_name: profile.company_name })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
