'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MAX_FEATURED_PER_CATEGORY } from '@/lib/stripe'
import { Check, Zap, Star, ArrowRight, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'

const TIERS = [
  {
    key: 'listed',
    name: 'Listed',
    annual: 1200,
    icon: Zap,
    color: '#1e40af',
    bg: '#dbeafe',
    borderColor: '#3b82f6',
    features: [
      'Full contact details — address, phone, email, website, LinkedIn',
      'Company logo',
      '300-word company description',
      'Up to 3 service categories',
      'Exchange badges (TSX, TSXV, etc.)',
      'Standard placement (alphabetical within category)',

      'Basic analytics — view count & search appearances',
    ],
  },
  {
    key: 'featured',
    name: 'Featured',
    annual: 6000,
    icon: Star,
    color: '#92400e',
    bg: '#fef3c7',
    borderColor: '#f59e0b',
    popular: true,
    features: [
      'Everything in Listed',
      'Top placement in category',
      '"Featured" badge on profile + listings',
      'Homepage rotation module',
      '750-word bio, unlimited categories, all exchanges',
      'Team page (up to 10 members)',
      'Up to 5 published case studies',
      'Video embed',
      'Exclusive RFQ access from verified executives',
      'Full analytics dashboard',
      'Logo + website link in the monthly executive newsletter',
      'AI Assistant trained on public markets',
      'Priority support — 24h SLA',
    ],
  },
]

const TIER_ORDER = ['free', 'listed', 'featured']

function BillingContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')
  const planParam = ['listed', 'featured'].includes(searchParams.get('plan') ?? '') ? searchParams.get('plan') : null

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [featuredSpots, setFeaturedSpots] = useState<{ taken: number; category: string } | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setProfile(p)

      // Featured availability in this provider's primary category
      if (p) {
        const { data: primaryCat } = await supabase
          .from('provider_categories')
          .select('category_id, service_categories(name)')
          .eq('provider_id', p.id)
          .order('is_primary', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (primaryCat) {
          const { data: peers } = await supabase
            .from('provider_categories')
            .select('provider_id')
            .eq('category_id', primaryCat.category_id)
          const peerIds = (peers ?? []).map(x => x.provider_id).filter(id => id !== p.id)
          let taken = 0
          if (peerIds.length) {
            const { count } = await supabase
              .from('provider_profiles')
              .select('*', { count: 'exact', head: true })
              .in('id', peerIds)
              .eq('tier', 'featured')
              .eq('is_active', true)
            taken = count ?? 0
          }
          setFeaturedSpots({ taken, category: (primaryCat as any).service_categories?.name ?? 'your category' })
        }
      }
    }
    load()
  }, [])

  async function handleCheckout(tierKey: string) {
    setLoading(tierKey)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Something went wrong.')
    } finally {
      setPortalLoading(false)
    }
  }

  const currentTier = profile?.tier ?? 'free'
  const hasPaidPlan = currentTier !== 'free'
  const currentTierIndex = TIER_ORDER.indexOf(currentTier)

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {success && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#d1fae5' }}>
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="font-bold text-sm text-green-800">Subscription activated!</p>
            <p className="text-xs text-green-700">Your listing is now live with your new tier benefits.</p>
          </div>
        </div>
      )}
      {planParam && !hasPaidPlan && !success && (
        <div className="mb-6 p-4 rounded-2xl border-2" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>
            One step left — complete your {planParam === 'listed' ? 'Listed' : 'Featured'} subscription below.
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
            Agree to the terms, then hit Subscribe on the {planParam === 'listed' ? 'Listed' : 'Featured'} plan to continue to secure checkout.
          </p>
        </div>
      )}
      {cancelled && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#fef3c7' }}>
          <AlertCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--color-gold)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-navy)' }}>Payment was cancelled — no charge was made.</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold anim-fade-up" style={{ color: 'var(--color-navy)' }}>Billing & Plan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>All prices in CAD. Annual subscription — renews each September 1 unless cancelled. Non-refundable after 7 days.</p>
        </div>
        {hasPaidPlan && (
          <button onClick={handlePortal} disabled={portalLoading}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
            <ExternalLink className="w-4 h-4" />
            {portalLoading ? 'Opening…' : 'Manage Subscription'}
          </button>
        )}
      </div>

      {/* Current plan bar */}
      {profile && (
        <div className="bg-white border rounded-2xl p-5 mb-8 flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-gray)' }}>CURRENT PLAN</p>
            <p className="text-xl font-extrabold capitalize" style={{ color: 'var(--color-navy)' }}>{currentTier}</p>
            {profile.subscription_status && !['active', 'cancelled', null].includes(profile.subscription_status) && (
              <p className="text-xs font-semibold mt-0.5" style={{ color: profile.subscription_status === 'past_due' ? '#ef4444' : 'var(--color-gray)' }}>
                Status: {profile.subscription_status}
              </p>
            )}
          </div>
          {currentTier === 'free' ? (
            <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Choose a plan below to unlock your full profile.</p>
          ) : (
            <button onClick={handlePortal} disabled={portalLoading}
              className="text-sm font-semibold px-4 py-2 rounded-xl"
              style={{ backgroundColor: 'var(--color-blue-light)', color: 'var(--color-navy)' }}>
              {portalLoading ? 'Opening…' : 'View invoices / Cancel'}
            </button>
          )}
        </div>
      )}

      {/* Annual-only note */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#f1f3f5', color: 'var(--color-navy)' }}>
          Annual subscription · renews automatically each September 1
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
        {TIERS.map(tier => {
          const Icon = tier.icon
          const isCurrent = currentTier === tier.key
          const tierIndex = TIER_ORDER.indexOf(tier.key)
          const isDowngrade = tierIndex < currentTierIndex
          const isFeatured = tier.key === 'featured'
          const featuredFull = isFeatured && (featuredSpots?.taken ?? 0) >= MAX_FEATURED_PER_CATEGORY && currentTier !== 'featured'

          return (
            <div key={tier.key}
              className="bg-white border-2 rounded-2xl p-6 flex flex-col relative"
              style={{
                borderColor: isCurrent ? tier.borderColor : (planParam === tier.key || tier.popular) ? tier.borderColor : 'var(--color-border)',
                boxShadow: planParam === tier.key && !isCurrent ? `0 0 0 3px ${tier.borderColor}33` : undefined,
              }}>

              {tier.popular && !isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
                    Most Popular
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#10b981' }}>
                    Current Plan
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: tier.bg }}>
                  <Icon className="w-4 h-4" style={{ color: tier.color }} />
                </div>
                <h2 className="text-xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{tier.name}</h2>
              </div>

              <div className="mb-5">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold" style={{ color: 'var(--color-navy)' }}>${tier.annual.toLocaleString()}</span>
                  <span className="text-sm pb-1.5" style={{ color: 'var(--color-gray)' }}>/yr</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
                  Billed annually in CAD
                </p>
                {isFeatured && featuredSpots && (
                  <p className="text-xs font-bold mt-1.5" style={{ color: featuredFull ? '#ef4444' : 'var(--color-gold)' }}>
                    {featuredFull
                      ? `All ${MAX_FEATURED_PER_CATEGORY} Featured spots taken in ${featuredSpots.category}`
                      : `${featuredSpots.taken} of ${MAX_FEATURED_PER_CATEGORY} Featured spots taken in ${featuredSpots.category}`}
                  </p>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-gray-dark)' }}>
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: tier.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isCurrent && !isDowngrade && !featuredFull && handleCheckout(tier.key)}
                disabled={isCurrent || loading === tier.key || isDowngrade || !termsAccepted || featuredFull}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 btn-glow"
                style={{
                  backgroundColor: isCurrent ? tier.bg : 'var(--color-navy)',
                  color: isCurrent ? tier.color : 'white',
                }}>
                {loading === tier.key ? 'Redirecting to Stripe…' :
                 isCurrent ? 'Current Plan' :
                 isDowngrade ? 'Downgrade via Portal' :
                 featuredFull ? 'Category Full — Join Waitlist' :
                 <><span>Subscribe</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
              {featuredFull && (
                <p className="text-xs text-center mt-2" style={{ color: 'var(--color-gray-light)' }}>
                  Email <a href="mailto:hello@enlisted.ca" className="underline">hello@enlisted.ca</a> to join the Featured waitlist.
                </p>
              )}
              {isDowngrade && !isCurrent && (
                <p className="text-xs text-center mt-2" style={{ color: 'var(--color-gray-light)' }}>
                  Use &quot;Manage Subscription&quot; above to downgrade.
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* T&C checkbox */}
      {!hasPaidPlan && (
        <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl border" style={{ borderColor: termsAccepted ? 'var(--color-navy)' : 'var(--color-border)', backgroundColor: termsAccepted ? '#eef2ff' : '#f8f9fc' }}>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 accent-[var(--color-navy)] cursor-pointer"
            />
            <span className="text-sm" style={{ color: 'var(--color-gray-dark)' }}>
              I agree to the{' '}
              <a href="/terms/providers" target="_blank" className="font-semibold underline" style={{ color: 'var(--color-navy)' }}>
                Enlisted Provider Terms &amp; Conditions
              </a>
              . For annual subscriptions, I understand that my 12-month term begins{' '}
              <span className="font-semibold">September 1, 2026</span> — access provided immediately upon payment.
            </span>
          </label>
        </div>
      )}

      {/* Listed / free note */}
      <div className="text-center p-5 rounded-2xl" style={{ backgroundColor: '#f8f9fc' }}>
        <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-navy)' }}>Free plan — always free</p>
        <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
          Your company name and category stay in the directory at no cost. Upgrade to Listed for full profile visibility, or Featured for RFQs and top placement.
        </p>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-navy)' }} />
      </div>
    }>
      <BillingContent />
    </Suspense>
  )
}
