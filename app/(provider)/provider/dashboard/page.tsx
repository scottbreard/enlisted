'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, Send, Star, TrendingUp, ArrowRight, CheckCircle, Circle, Clock } from 'lucide-react'

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  featured: { label: 'Featured', color: '#92400e', bg: '#fef3c7' },
  listed:   { label: 'Listed',   color: '#1e40af', bg: '#dbeafe' },
  free:     { label: 'Free',     color: '#6b7280', bg: '#f3f4f6' },
}

const TIER_NEXT: Record<string, { next: string; price: string }> = {
  free:   { next: 'Listed',   price: '$100/mo' },
  listed: { next: 'Featured', price: '$500/mo' },
}

const TIER_FEATURES: Record<string, string[]> = {
  free:     ['Name + category in directory', 'No contact details shown', 'No RFQ access'],
  listed:   ['Full contact details + logo', '300-word description, up to 3 categories', 'RFQ access (24h after Featured)', 'Basic analytics'],
  featured: ['Top placement (rotated)', 'Unlimited categories + all exchanges', 'Priority RFQ window + direct messaging', 'Video, team page, case studies', 'Quarterly blog post + verified badge'],
}

export default function ProviderDashboardPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ views: 0, rfqs: 0, categories: 0, avgRating: 0 })
  const [recentViews, setRecentViews] = useState<any[]>([])
  const [recentRfqs, setRecentRfqs] = useState<any[]>([])

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

      // Analytics: total profile views
      const { count: viewCount } = await supabase
        .from('provider_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', p.id)
        .eq('event_type', 'profile_view')

      // RFQ count
      const { count: rfqCount } = await supabase
        .from('rfq_requests')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', p.id)

      // Category count
      const { count: catCount } = await supabase
        .from('provider_categories')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', p.id)

      setStats({
        views: viewCount ?? 0,
        rfqs: rfqCount ?? 0,
        categories: catCount ?? 0,
        avgRating: p.average_rating ?? 0,
      })

      // Recent analytics events
      const { data: analytics } = await supabase
        .from('provider_analytics')
        .select('*')
        .eq('provider_id', p.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentViews(analytics ?? [])

      // Recent RFQs
      const { data: rfqs } = await supabase
        .from('rfq_requests')
        .select('*')
        .eq('provider_id', p.id)
        .order('created_at', { ascending: false })
        .limit(3)
      setRecentRfqs(rfqs ?? [])
    }
    load()
  }, [])

  if (!profile) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-navy)' }} />
    </div>
  )

  const tier = TIER_LABELS[profile.tier] ?? TIER_LABELS.listed
  const tierUpgrade = TIER_NEXT[profile.tier]
  const features = TIER_FEATURES[profile.tier] ?? []
  const isFree = profile.tier === 'free'

  const onboardingSteps = [
    {
      label: 'Add your tagline',
      description: 'A one-line summary of what your firm does — shown in search results.',
      done: !!profile.tagline,
      href: '/provider/profile',
    },
    {
      label: 'Write your description',
      description: 'Tell executives what makes your firm the right choice.',
      done: !!profile.description,
      href: '/provider/profile',
    },
    {
      label: 'Add website & contact email',
      description: 'Required to appear with full details on Connected and Featured plans.',
      done: !!(profile.website_url && profile.email),
      href: '/provider/profile',
    },
    {
      label: 'Add your logo',
      description: 'Providers with logos get significantly more profile clicks.',
      done: !!profile.logo_url,
      href: '/provider/profile',
    },
    {
      label: 'Choose your plan',
      description: 'Upgrade to Connected ($100/mo) to show contact details and receive RFQs.',
      done: profile.tier !== 'free',
      href: '/provider/billing',
    },
  ]
  const stepsComplete = onboardingSteps.filter(s => s.done).length
  const onboardingDone = stepsComplete === onboardingSteps.length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>
            Welcome back, {profile.company_name}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
            Here&apos;s how your listing is performing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: tier.bg, color: tier.color }}>
            {tier.label} Plan
          </span>
          {profile.slug && (
            <Link href={`/directory/${profile.primary_category_slug ?? ''}/${profile.slug}`}
              target="_blank"
              className="text-sm font-semibold px-4 py-2 rounded-xl border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
              View Public Profile →
            </Link>
          )}
        </div>
      </div>

      {/* Onboarding checklist */}
      {!onboardingDone && (
        <div className="mb-8 bg-white border-2 rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-gold)' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--color-gold-light)' }}>
            <div>
              <p className="font-extrabold text-sm" style={{ color: 'var(--color-navy)' }}>
                Get your listing ready — {stepsComplete} of {onboardingSteps.length} complete
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
                Complete your profile to start appearing in executive searches.
              </p>
            </div>
            <div className="w-32 hidden sm:block">
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(stepsComplete / onboardingSteps.length) * 100}%`, backgroundColor: 'var(--color-gold)' }}
                />
              </div>
              <p className="text-xs text-right mt-1 font-semibold" style={{ color: 'var(--color-gold)' }}>
                {Math.round((stepsComplete / onboardingSteps.length) * 100)}%
              </p>
            </div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {onboardingSteps.map((step, i) => (
              <li key={i}>
                <Link
                  href={step.done ? '#' : step.href}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                  style={{ pointerEvents: step.done ? 'none' : 'auto' }}
                >
                  {step.done
                    ? <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#10b981' }} />
                    : <Circle className="w-5 h-5 shrink-0" style={{ color: 'var(--color-border)' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{
                      color: step.done ? 'var(--color-gray-light)' : 'var(--color-navy)',
                      textDecoration: step.done ? 'line-through' : 'none',
                    }}>
                      {step.label}
                    </p>
                    {!step.done && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{step.description}</p>
                    )}
                  </div>
                  {!step.done && <ArrowRight className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Profile Views', value: stats.views, icon: Eye, color: 'var(--color-blue)' },
          { label: 'RFQs Received', value: stats.rfqs, icon: Send, color: 'var(--color-navy)' },
          { label: 'Categories Listed', value: stats.categories, icon: TrendingUp, color: '#10b981' },
          { label: 'Avg Rating', value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—', icon: Star, color: 'var(--color-gold)' },
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

      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 space-y-6">

          {/* Recent RFQs */}
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Recent RFQs</h2>
              <Link href="/provider/rfq" className="text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>View all →</Link>
            </div>
            {isFree ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📬</p>
                <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-navy)' }}>RFQs require a paid plan</p>
                <p className="text-xs mb-4" style={{ color: 'var(--color-gray)' }}>Upgrade to Listed ($100/mo) to receive quote requests from executives.</p>
                <Link href="/provider/billing" className="text-sm font-bold px-4 py-2 rounded-xl text-white inline-block" style={{ backgroundColor: 'var(--color-navy)' }}>
                  Upgrade Plan
                </Link>
              </div>
            ) : recentRfqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm" style={{ color: 'var(--color-gray)' }}>No RFQs yet. They&apos;ll appear here when executives reach out.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRfqs.map((rfq: any) => (
                  <div key={rfq.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f8f9fc' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                      <Send className="w-3.5 h-3.5" style={{ color: 'var(--color-navy)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-navy)' }}>{rfq.title ?? 'RFQ Request'}</p>
                      <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{new Date(rfq.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: rfq.status === 'open' ? '#d1fae5' : '#f3f4f6',
                        color: rfq.status === 'open' ? '#065f46' : '#6b7280',
                      }}>
                      {rfq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent profile views */}
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Recent Activity</h2>
              <Link href="/provider/analytics" className="text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>Full analytics →</Link>
            </div>
            {recentViews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">👀</p>
                <p className="text-sm" style={{ color: 'var(--color-gray)' }}>No views recorded yet. Share your profile to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentViews.map((event: any) => (
                  <div key={event.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                    <Eye className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-gray-light)' }} />
                    <p className="text-xs flex-1" style={{ color: 'var(--color-gray)' }}>Profile view</p>
                    <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>{new Date(event.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Current plan */}
          <div className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>Your Plan</h3>
            <div className="mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: tier.bg, color: tier.color }}>
                {tier.label}
              </span>
            </div>
            <ul className="space-y-1.5 mb-4">
              {features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-gray)' }}>
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                  {f}
                </li>
              ))}
            </ul>
            {tierUpgrade && (
              <Link href="/provider/billing"
                className="flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl text-white w-full"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                Upgrade to {tierUpgrade.next} · {tierUpgrade.price}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>Quick Actions</h3>
            <div className="space-y-2">
              {[
                { href: '/provider/profile', label: 'Edit Profile', icon: '✏️' },
                { href: '/provider/rfq',     label: 'View RFQ Inbox', icon: '📬' },
                { href: '/provider/analytics', label: 'See Analytics', icon: '📊' },
                { href: '/directory',        label: 'Browse Directory', icon: '🔍' },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ color: 'var(--color-navy)' }}>
                  <span>{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Listing status */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-blue-light)' }}>
            <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-navy)' }}>Listing Status</h3>
            <div className="flex items-center gap-2 text-xs font-semibold mb-1">
              {profile.is_active ? (
                <><CheckCircle className="w-4 h-4 text-green-500" /> <span className="text-green-700">Active — visible in directory</span></>
              ) : (
                <><Clock className="w-4 h-4 text-amber-500" /> <span className="text-amber-700">Pending activation</span></>
              )}
            </div>
            {profile.is_verified && (
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#065f46' }}>
                <CheckCircle className="w-4 h-4" /> Verified provider
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
