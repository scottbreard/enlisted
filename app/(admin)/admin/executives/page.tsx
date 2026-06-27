import { createClient } from '@/lib/supabase/server'
import ExecutiveActions from './ExecutiveActions'

export const metadata = { title: 'Executives — Enlisted Admin' }

export default async function AdminExecutivesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q = '', status = 'active' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('executive_profiles')
    .select('*')
    .eq('is_active', status !== 'suspended')
    .order('created_at', { ascending: false })
    .limit(200)

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,company_name.ilike.%${q}%,company_ticker.ilike.%${q}%`
    )
  }

  const { data: executives } = await query

  const [
    { count: activeCount },
    { count: suspendedCount },
    { count: foundingCount },
  ] = await Promise.all([
    supabase.from('executive_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('executive_profiles').select('*', { count: 'exact', head: true }).eq('is_active', false),
    supabase.from('executive_profiles').select('*', { count: 'exact', head: true }).eq('is_founding_member', true),
  ])

  const tabs = [
    { key: 'active',    label: 'Active',    count: activeCount ?? 0,    color: '#10b981' },
    { key: 'suspended', label: 'Suspended',  count: suspendedCount ?? 0, color: '#ef4444' },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Executives</h1>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-gray)' }}>
          <span><strong style={{ color: 'var(--color-navy)' }}>{(activeCount ?? 0) + (suspendedCount ?? 0)}</strong> total</span>
          <span><strong style={{ color: 'var(--color-gold)' }}>{foundingCount ?? 0}</strong> founding</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map(tab => (
          <a
            key={tab.key}
            href={`/admin/executives?status=${tab.key}${q ? `&q=${q}` : ''}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={{
              backgroundColor: status === tab.key ? tab.color : 'white',
              color: status === tab.key ? 'white' : 'var(--color-gray)',
              borderColor: status === tab.key ? tab.color : 'var(--color-border)',
            }}
          >
            {tab.label}
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: status === tab.key ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                color: status === tab.key ? 'white' : 'var(--color-gray)',
              }}>
              {tab.count}
            </span>
          </a>
        ))}
      </div>

      {/* Search */}
      <form className="flex gap-3 mb-6">
        <input type="hidden" name="status" value={status} />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, company, or ticker…"
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ borderColor: 'var(--color-border)' }}
        />
        <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: '#f8f9fc' }}>
              {['Executive', 'Company / Ticker', 'Title', 'Founding', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold" style={{ color: 'var(--color-gray)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {executives?.map((e: any) => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-5 py-3">
                  <p className="font-semibold" style={{ color: 'var(--color-navy)' }}>
                    {e.first_name} {e.last_name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>{e.user_id?.slice(0, 8)}…</p>
                </td>
                <td className="px-5 py-3">
                  <p style={{ color: 'var(--color-gray-dark)' }}>{e.company_name}</p>
                  {e.company_ticker && (
                    <p className="text-xs font-bold" style={{ color: 'var(--color-blue)' }}>{e.company_ticker}</p>
                  )}
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: 'var(--color-gray)' }}>{e.title ?? '—'}</td>
                <td className="px-5 py-3">
                  {e.is_founding_member
                    ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
                        #{e.founding_member_number}
                      </span>
                    : <span style={{ color: 'var(--color-gray-light)' }}>—</span>
                  }
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: 'var(--color-gray-light)' }}>
                  {new Date(e.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <ExecutiveActions id={e.id} isActive={e.is_active} name={`${e.first_name} ${e.last_name}`} />
                </td>
              </tr>
            ))}
            {executives?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--color-gray-light)' }}>
                  No executives found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
