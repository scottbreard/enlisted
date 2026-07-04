import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/prospects/export — CSV of prospects matching the
// same filters as the admin browser (q, exchange, title, has, contacted)
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const p = req.nextUrl.searchParams
  const q = p.get('q') ?? ''
  const exchange = p.get('exchange') ?? ''
  const title = p.get('title') ?? ''
  const has = p.get('has') ?? ''
  const contacted = p.get('contacted') ?? ''

  const db = createAdminClient()
  const rows: any[] = []
  for (let from = 0; ; from += 1000) {
    let query = db
      .from('executive_prospects')
      .select('first_name, last_name, title, company_name, email, phone, linkedin_url, contacted_at, source, issuers(symbol, exchange_code, website, ir_email, general_email)')
      .order('company_name')
      .range(from, from + 999)
    if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,company_name.ilike.%${q}%`)
    if (title === 'CEO') query = query.ilike('title', '%CEO%')
    else if (title === 'CFO') query = query.ilike('title', '%CFO%')
    else if (title === 'IR') query = query.or('title.ilike.%investor relations%,title.ilike.%IR%')
    else if (title === 'Director') query = query.ilike('title', '%director%')
    if (has === 'email') query = query.not('email', 'is', null)
    if (has === 'phone') query = query.not('phone', 'is', null)
    if (contacted === 'yes') query = query.not('contacted_at', 'is', null)
    if (contacted === 'no') query = query.is('contacted_at', null)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    rows.push(...(data ?? []))
    if (!data || data.length < 1000 || rows.length >= 20000) break
  }

  const filtered = rows.filter((r: any) => !exchange || r.issuers?.exchange_code === exchange)

  const esc = (v: unknown) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const header = 'first_name,last_name,title,company,ticker,exchange,email,phone,linkedin,corporate_email,website,contacted_at,source'
  const lines = filtered.map((r: any) => [
    r.first_name, r.last_name, r.title, r.company_name,
    r.issuers?.symbol, r.issuers?.exchange_code,
    r.email, r.phone, r.linkedin_url,
    r.issuers?.ir_email ?? r.issuers?.general_email,
    r.issuers?.website, r.contacted_at, r.source,
  ].map(esc).join(','))

  return new NextResponse([header, ...lines].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="enlisted-prospects-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
