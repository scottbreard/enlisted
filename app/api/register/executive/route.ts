import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Creates the executive profile server-side so registration works even when
// email confirmation is pending (no client session yet). Also assigns
// Founding Executive status atomically.
export async function POST(req: NextRequest) {
  try {
    const { user_id, first_name, last_name, title, company_name, company_ticker, sector, market_code } = await req.json()
    if (!user_id || !first_name || !last_name || !company_name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: userData, error: userErr } = await admin.auth.admin.getUserById(user_id)
    if (userErr || !userData.user) return NextResponse.json({ error: 'Invalid user' }, { status: 400 })

    const { data: existing } = await admin.from('executive_profiles').select('id, founding_member_number').eq('user_id', user_id).maybeSingle()
    if (existing) return NextResponse.json({ ok: true, founding_number: existing.founding_member_number })

    const market = market_code ?? 'CA'
    const { count } = await admin
      .from('executive_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_founding_member', true)
      .eq('market_code', market)
    const isFounding = (count ?? 0) < 500
    const foundingNumber = isFounding ? (count ?? 0) + 1 : null

    const { error } = await admin.from('executive_profiles').insert({
      user_id,
      first_name,
      last_name,
      title: title ?? null,
      company_name,
      company_ticker: company_ticker || null,
      sector: sector ?? null,
      is_founding_member: isFounding,
      founding_member_number: foundingNumber,
      referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      market_code: market,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, founding_number: foundingNumber })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
