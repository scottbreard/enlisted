import { createClient } from '@/lib/supabase/server'
import { DollarSign, TrendingUp } from 'lucide-react'

export default async function AdminRevenuePage() {
  const supabase = await createClient()

  const [
    { count: connected },
    { count: featured },
    { data: recentSubs },
  ] = await Promise.all([
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }).eq('tier', 'listed').eq('subscription_status', 'active'),
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }).eq('tier', 'featured').eq('subscription_status', 'active'),
    supabase.from('provider_profiles')
      .select('company_name, tier, subscription_status, subscription_interval, created_at')
      .in('tier', ['listed', 'featured'])
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const mrrConnected = (connected ?? 0) * 100
  const mrrFeatured  = (featured ?? 0) * 1000
  const mrr = mrrConnected + mrrFeatured
  const arr = mrr * 12

  const TIER_STYLE: Record<string, { color: string; bg: string }> = {
    featured: { color: '#92400e', bg: '#fef3c7' },
    listed:   { color: '#1e40af', bg: '#dbeafe' },
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--color-navy)' }}>Revenue</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'MRR (active subs)', value: `$${mrr.toLocaleString()}`, sub: 'CAD / month', icon: DollarSign },
          { label: 'ARR (run rate)',     value: `$${arr.toLocaleString()}`, sub: 'CAD / year',  icon: TrendingUp },
          { label: 'Active Subscriptions', value: (connected ?? 0) + (featured ?? 0), sub: `${connected} connected · ${featured} featured`, icon: DollarSign },
        ].map(s => (
          <div key={s.label} className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-gray)' }}>{s.label}</p>
            <p className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-navy)' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-5 mb-6" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Revenue Breakdown</h2>
        {[
          { label: 'Featured Partners', count: featured ?? 0, rate: 499, color: '#92400e', bg: '#fef3c7' },
          { label: 'Connected Partners', count: connected ?? 0, rate: 100, color: '#1e40af', bg: '#dbeafe' },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full w-36 text-center" style={{ backgroundColor: row.bg, color: row.color }}>{row.label}</span>
            <span className="text-sm" style={{ color: 'var(--color-gray)' }}>{row.count} × ${row.rate}/mo</span>
            <span className="ml-auto font-bold" style={{ color: 'var(--color-navy)' }}>${(row.count * row.rate).toLocaleString()}/mo</span>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: '#f8f9fc' }}>
          <h2 className="font-extrabold text-sm" style={{ color: 'var(--color-navy)' }}>Recent Subscriptions</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
              {['Company', 'Tier', 'Interval', 'Status', 'Joined'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold" style={{ color: 'var(--color-gray)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentSubs?.map((p: any) => {
              const t = TIER_STYLE[p.tier] ?? { color: '#6b7280', bg: '#f3f4f6' }
              return (
                <tr key={p.created_at + p.company_name} className="border-b last:border-0 hover:bg-gray-50" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-5 py-3 font-semibold" style={{ color: 'var(--color-navy)' }}>{p.company_name}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: t.bg, color: t.color }}>{p.tier}</span>
                  </td>
                  <td className="px-5 py-3 text-xs capitalize" style={{ color: 'var(--color-gray)' }}>{p.subscription_interval ?? 'monthly'}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: p.subscription_status === 'active' ? '#10b981' : '#ef4444' }}>
                    {p.subscription_status ?? 'active'}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: 'var(--color-gray-light)' }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
