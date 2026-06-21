import { createClient } from '@/lib/supabase/server'
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [
    { count: execCount },
    { count: providerCount },
    { count: connectedCount },
    { count: featuredCount },
    { count: rfqCount },
  ] = await Promise.all([
    supabase.from('executive_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }).eq('tier', 'connected'),
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }).eq('tier', 'featured'),
    supabase.from('rfq_requests').select('*', { count: 'exact', head: true }),
  ])

  const mrrConnected = (connectedCount ?? 0) * 100
  const mrrFeatured  = (featuredCount ?? 0) * 499
  const mrr = mrrConnected + mrrFeatured

  // Recent signups
  const { data: recentExecs } = await supabase
    .from('executive_profiles')
    .select('first_name, last_name, company_name, company_ticker, created_at, is_founding_member')
    .order('created_at', { ascending: false })
    .limit(8)

  const { data: recentProviders } = await supabase
    .from('provider_profiles')
    .select('company_name, tier, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--color-navy)' }}>Admin Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Executives', value: execCount ?? 0, icon: Users, color: 'var(--color-navy)' },
          { label: 'Providers', value: providerCount ?? 0, icon: Building2, color: 'var(--color-blue)' },
          { label: 'Paying Providers', value: (connectedCount ?? 0) + (featuredCount ?? 0), icon: TrendingUp, color: '#10b981' },
          { label: 'Est. MRR (CAD)', value: `$${mrr.toLocaleString()}`, icon: DollarSign, color: 'var(--color-gold)' },
        ].map(s => (
          <div key={s.label} className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: 'var(--color-gray)' }}>{s.label}</span>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Tier breakdown */}
        <div className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Provider Tier Breakdown</h2>
          {[
            { label: 'Featured',  count: featuredCount ?? 0,  color: '#92400e', bg: '#fef3c7', mrr: (featuredCount ?? 0) * 499 },
            { label: 'Connected', count: connectedCount ?? 0, color: '#1e40af', bg: '#dbeafe', mrr: (connectedCount ?? 0) * 100 },
            { label: 'Listed',    count: (providerCount ?? 0) - (connectedCount ?? 0) - (featuredCount ?? 0), color: '#6b7280', bg: '#f3f4f6', mrr: 0 },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full w-24 text-center" style={{ backgroundColor: t.bg, color: t.color }}>{t.label}</span>
              <span className="text-sm font-bold flex-1" style={{ color: 'var(--color-navy)' }}>{t.count} providers</span>
              {t.mrr > 0 && <span className="text-xs font-semibold" style={{ color: '#10b981' }}>${t.mrr.toLocaleString()}/mo</span>}
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Platform Activity</h2>
          {[
            { label: 'Total RFQs sent', value: rfqCount ?? 0 },
            { label: 'Featured MRR', value: `$${mrrFeatured.toLocaleString()}` },
            { label: 'Connected MRR', value: `$${mrrConnected.toLocaleString()}` },
            { label: 'ARR estimate', value: `$${(mrr * 12).toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="flex justify-between py-2.5 border-b last:border-0 text-sm" style={{ borderColor: 'var(--color-border)' }}>
              <span style={{ color: 'var(--color-gray)' }}>{s.label}</span>
              <span className="font-bold" style={{ color: 'var(--color-navy)' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Recent Executives</h2>
          <div className="space-y-2">
            {recentExecs?.map((e: any) => (
              <div key={e.created_at} className="flex items-center gap-2 py-1.5 text-sm border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--color-navy)' }}>{e.first_name} {e.last_name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-gray)' }}>{e.company_name}{e.company_ticker && ` · ${e.company_ticker}`}</p>
                </div>
                {e.is_founding_member && <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>FM</span>}
                <span className="text-xs shrink-0" style={{ color: 'var(--color-gray-light)' }}>{new Date(e.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Recent Providers</h2>
          <div className="space-y-2">
            {recentProviders?.map((p: any) => (
              <div key={p.created_at} className="flex items-center gap-2 py-1.5 text-sm border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--color-navy)' }}>{p.company_name}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                  style={{
                    backgroundColor: p.tier === 'featured' ? '#fef3c7' : p.tier === 'connected' ? '#dbeafe' : '#f3f4f6',
                    color: p.tier === 'featured' ? '#92400e' : p.tier === 'connected' ? '#1e40af' : '#6b7280',
                  }}>{p.tier}</span>
                <span className="text-xs shrink-0" style={{ color: 'var(--color-gray-light)' }}>{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
