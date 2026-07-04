import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Creates the provider profile server-side so registration works even when
// email confirmation is pending (no client session yet).
export async function POST(req: NextRequest) {
  try {
    const { user_id, company_name, category_id, market_code } = await req.json()
    if (!user_id || !company_name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const admin = createAdminClient()

    // The user must exist in auth and not already own a profile
    const { data: userData, error: userErr } = await admin.auth.admin.getUserById(user_id)
    if (userErr || !userData.user) return NextResponse.json({ error: 'Invalid user' }, { status: 400 })

    const { data: existing } = await admin.from('provider_profiles').select('id').eq('user_id', user_id).maybeSingle()
    if (existing) return NextResponse.json({ ok: true, provider_id: existing.id })

    const slug = `${slugify(company_name)}-${Math.random().toString(36).substring(2, 6)}`
    const { data: profile, error } = await admin.from('provider_profiles').insert({
      user_id,
      company_name,
      slug,
      email: userData.user.email,
      tier: 'free',
      is_active: true,
      primary_market_code: market_code ?? 'CA',
    }).select('id').single()
    if (error || !profile) return NextResponse.json({ error: error?.message ?? 'Profile creation failed' }, { status: 500 })

    if (category_id) {
      await admin.from('provider_categories').insert({ provider_id: profile.id, category_id, is_primary: true })
    }
    return NextResponse.json({ ok: true, provider_id: profile.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
