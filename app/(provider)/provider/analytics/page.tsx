'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, TrendingUp, Send, Lock } from 'lucide-react'

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map(d => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold" style={{ color: 'var(--color-navy)' }}>{d.value > 0 ? d.value : ''}</span>
          <div className="w-full rounded-t-lg transition-all" style={{ backgroundColor: color, height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 2, opacity: d.value > 0 ? 1 : 0.15 }} />
          <span className="text-xs" style={{ color: 'var(--color-gray-light)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function last30Days() {
  const days: { label: string; date: string }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Yday' : d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      date: d.toISOString().slice(0, 10),
    })
  }
  return days
}

// Group to weekly buckets for readability
function toWeekly(dailyMap: Record<string, number>): { label: string; value: number }[] {
  const days = last30Days()
  const weeks: { label: string; value: number }[] = []
  for (let w = 0; w < 4; w++) {
    const slice = days.slice(w * 7, w * 7 + 7)
    const value = slice.reduce((sum, d) => sum + (dailyMap[d.date] ?? 0), 0)
    const start = slice[0]?.date ?? ''
    const label = `Wk ${w + 1}`
    weeks.push({ label, value })
  }
  // Add remaining days as last partial bucket if any
  const remainder = days.slice(28)
  if (remainder.length) {
    const value = remainder.reduce((sum, d) => sum + (dailyMap[d.date] ?? 0), 0)
    weeks.push({ label: 'This wk', value })
  }
  return weeks
}

export default function AnalyticsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [viewData, setViewData] = useState<{ label: string; value: number }[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [viewsThisMonth, setViewsThisMonth] = useState(0)
  const [totalRfqs, setTotalRfqs] = useState(0)
  const [openRfqs, setOpenRfqs] = useState(0)
  const [respondedRfqs, setRespondedRfqs] = useState(0)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (!p) return
      setProfile(p)

      if (p.tier === 'free') { setLoading(false); return }

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const [
        { data: allViews },
        { data: recentViews },
        { data: rfqs },
      ] = await Promise.all([
        supabase.from('provider_analytics').select('id').eq('provider_id', p.id).eq('event_type', 'profile_view'),
        supabase.from('provider_analytics').select('created_at').eq('provider_id', p.id).eq('event_type', 'profile_view').gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('rfq_requests').select('status, created_at').eq('provider_id', p.id),
      ])

      setTotalViews(allViews?.length ?? 0)
      setViewsThisMonth(recentViews?.length ?? 0)

      // Build daily map
      const dailyMap: Record<string, number> = {}
      for (const v of recentViews ?? []) {
        const day = v.created_at.slice(0, 10)
        dailyMap[day] = (dailyMap[day] ?? 0) + 1
      }
      setViewData(toWeekly(dailyMap))

      const rfqList = rfqs ?? []
      setTotalRfqs(rfqList.length)
      setOpenRfqs(rfqList.filter(r => r.status === 'open').length)
      setRespondedRfqs(rfqList.filter(r => r.status === 'responded').length)

      setLoading(false)
    }
    load()
  }, [])

  if (!profile) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-navy)' }} />
    </div>
  )

  if (profile.tier === 'free') return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>Analytics</h1>
      <div className="text-center py-16 bg-white border-2 rounded-2xl" style={{ borderColor: 'var(--color-gold)' }}>
        <Lock className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-gold)' }} />
        <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-navy)' }}>Analytics require a paid plan</p>
        <p className="text-sm mb-4" style={{ color: 'var(--color-gray)' }}>Upgrade to Connected ($100/mo) to see profile views, search appearances, and RFQ stats.</p>
        <a href="/provider/billing" className="text-sm font-bold px-5 py-2.5 rounded-xl text-white inline-block" style={{ backgroundColor: 'var(--color-navy)' }}>
          Upgrade Plan
        </a>
      </div>
    </div>
  )

  const isFeatured = profile.tier === 'featured'
  const responseRate = totalRfqs > 0 ? Math.round((respondedRfqs / totalRfqs) * 100) : 0

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>Profile performance over the last 30 days.</p>
        </div>
        {!isFeatured && (
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
            <TrendingUp className="w-3.5 h-3.5" />
            Upgrade to Featured for full analytics dashboard
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 h-28 animate-pulse" style={{ borderColor: 'var(--color-border)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Profile Views', value: totalViews, sub: `${viewsThisMonth} this month`, icon: Eye, color: 'var(--color-blue)' },
              { label: 'Total RFQs Received', value: totalRfqs, sub: `${openRfqs} open · ${respondedRfqs} responded`, icon: Send, color: 'var(--color-navy)' },
              { label: 'RFQ Response Rate', value: `${responseRate}%`, sub: totalRfqs > 0 ? `${respondedRfqs} of ${totalRfqs} responded` : 'No RFQs yet', icon: TrendingUp, color: '#10b981' },
            ].map(s => (
              <div key={s.label} className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-gray)' }}>{s.label}</span>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <p className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-navy)' }}>{s.value}</p>
                <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Views chart */}
          <div className="bg-white border rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>Profile Views — Last 30 Days</h2>
            {viewData.every(d => d.value === 0) ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-2">📊</p>
                <p className="text-sm" style={{ color: 'var(--color-gray)' }}>No views recorded yet. Share your profile link to get started.</p>
              </div>
            ) : (
              <BarChart data={viewData} color="var(--color-blue)" />
            )}
          </div>

          {/* Featured upgrade prompt */}
          {!isFeatured && (
            <div className="bg-white border-2 rounded-2xl p-6 flex items-center justify-between" style={{ borderColor: 'var(--color-gold)' }}>
              <div>
                <p className="font-extrabold mb-1" style={{ color: 'var(--color-navy)' }}>Want deeper insights?</p>
                <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Featured Partners get search-rank position tracking, message conversion rates, and RFQ click-through analytics.</p>
              </div>
              <a href="/provider/billing" className="shrink-0 text-sm font-bold px-5 py-2.5 rounded-xl text-white ml-4" style={{ backgroundColor: 'var(--color-navy)' }}>
                Upgrade to Featured
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
