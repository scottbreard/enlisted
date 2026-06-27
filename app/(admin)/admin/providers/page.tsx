import { createClient } from '@/lib/supabase/server'
import ProviderReviewList from './ProviderReviewList'

export const metadata = { title: 'Providers — Enlisted Admin' }

export default async function AdminProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status = 'pending' } = await searchParams
  const supabase = await createClient()

  const [
    { data: providers },
    { count: pendingCount },
    { count: approvedCount },
    { count: rejectedCount },
  ] = await Promise.all([
    supabase
      .from('provider_profiles')
      .select('*, provider_categories(service_categories(name, slug))')
      .eq('approval_status', status)
      .order('created_at', { ascending: false }),
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }).eq('approval_status', 'approved'),
    supabase.from('provider_profiles').select('*', { count: 'exact', head: true }).eq('approval_status', 'rejected'),
  ])

  const tabs = [
    { key: 'pending',  label: 'Pending Review', count: pendingCount ?? 0,  color: '#f59e0b' },
    { key: 'approved', label: 'Approved',        count: approvedCount ?? 0, color: '#10b981' },
    { key: 'rejected', label: 'Rejected',         count: rejectedCount ?? 0, color: '#ef4444' },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Provider Review</h1>
        <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
          {(pendingCount ?? 0) > 0 && (
            <span className="font-bold" style={{ color: '#f59e0b' }}>{pendingCount} pending</span>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <a
            key={tab.key}
            href={`/admin/providers?status=${tab.key}`}
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

      <ProviderReviewList providers={providers ?? []} status={status} />
    </div>
  )
}
