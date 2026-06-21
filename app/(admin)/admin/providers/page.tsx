import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const TIER_STYLE: Record<string, { color: string; bg: string }> = {
  featured:  { color: '#92400e', bg: '#fef3c7' },
  connected: { color: '#1e40af', bg: '#dbeafe' },
  listed:    { color: '#6b7280', bg: '#f3f4f6' },
}

export default async function AdminProvidersPage() {
  const supabase = await createClient()

  const { data: providers } = await supabase
    .from('provider_profiles')
    .select('*, provider_categories(service_categories(name))')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>All Providers</h1>
        <p className="text-sm" style={{ color: 'var(--color-gray)' }}>{providers?.length ?? 0} total</p>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: '#f8f9fc' }}>
              {['Company', 'Tier', 'Status', 'Stripe', 'Joined'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold" style={{ color: 'var(--color-gray)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {providers?.map((p: any) => {
              const t = TIER_STYLE[p.tier] ?? TIER_STYLE.listed
              return (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-5 py-3">
                    <p className="font-semibold" style={{ color: 'var(--color-navy)' }}>{p.company_name}</p>
                    {p.email && <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{p.email}</p>}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: t.bg, color: t.color }}>{p.tier}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold" style={{ color: p.is_active ? '#10b981' : '#ef4444' }}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {p.is_verified && <span className="ml-2 text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>✓ Verified</span>}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
                      {p.subscription_status ?? '—'}
                    </p>
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
