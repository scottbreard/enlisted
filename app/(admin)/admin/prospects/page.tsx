import { createAdminClient } from '@/lib/supabase/admin'
import ProspectList from './ProspectList'
import Link from 'next/link'

export const metadata = { title: 'Executive Prospects — Enlisted Admin' }

const PAGE_SIZE = 50

export default async function AdminProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; exchange?: string; title?: string; has?: string; contacted?: string; page?: string }>
}) {
  const { q = '', exchange = '', title = '', has = '', contacted = '', page = '1' } = await searchParams
  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const db = createAdminClient()

  let query = db
    .from('executive_prospects')
    .select('*, issuers(symbol, exchange_code, website, ir_email, general_email)', { count: 'exact' })

  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,company_name.ilike.%${q}%`)
  if (title === 'CEO') query = query.ilike('title', '%CEO%')
  else if (title === 'CFO') query = query.ilike('title', '%CFO%')
  else if (title === 'IR') query = query.or('title.ilike.%investor relations%,title.ilike.%IR%')
  else if (title === 'Director') query = query.ilike('title', '%director%')
  if (has === 'email') query = query.not('email', 'is', null)
  if (has === 'phone') query = query.not('phone', 'is', null)
  if (contacted === 'yes') query = query.not('contacted_at', 'is', null)
  if (contacted === 'no') query = query.is('contacted_at', null)

  const { data: prospects, count } = await query
    .order('company_name')
    .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1)

  // Exchange filter happens on the joined issuer — filter in JS when set
  const rows = (prospects ?? []).filter((p: any) => !exchange || p.issuers?.exchange_code === exchange)

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  const filters = { q, exchange, title, has, contacted }
  const qs = (over: Record<string, string>) => {
    const params = new URLSearchParams({ ...filters, ...over })
    for (const [k, v] of [...params.entries()]) if (!v) params.delete(k)
    return `/admin/prospects?${params.toString()}`
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Executive Prospects</h1>
        <p className="text-sm" style={{ color: 'var(--color-gray)' }}>{(count ?? 0).toLocaleString()} prospects</p>
      </div>
      <p className="text-sm mb-6" style={{ color: 'var(--color-gray)' }}>
        Imported and scraped public-company executives. Not registered users — see{' '}
        <Link href="/admin/executives" className="underline" style={{ color: 'var(--color-blue)' }}>Executives</Link> for accounts.
      </p>

      <ProspectList
        rows={rows}
        filters={filters}
        pageNum={pageNum}
        totalPages={totalPages}
        qsBase={qs({})}
      />
    </div>
  )
}
