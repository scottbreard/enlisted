'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, Zap, Star, ArrowRight, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'

const TIERS = [
  {
    key: 'connected',
    name: 'Popular',
    monthly: 83,
    annual: 1000,
    annualSaving: 0,
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
      'RFQ access from verified executives',
      'Basic analytics — view count & search appearances',
    ],
  },
  {
    key: 'featured',
    name: 'Featured',
    monthly: 417,
    annual: 5000,
    annualSaving: 0,
    icon: Star,
    color: '#92400e',
    bg: '#fef3c7',
    borderColor: '#f59e0b',
    popular: true,
    features: [
      'Everything in Popular',
      'Top placement in category',
      '"Featured" badge on profile + listings',
      'Homepage rotation module',
      '750-word bio, unlimited categories, all exchanges',
      'Team page (up to 10 members)',
      'Up to 5 published case studies',
      'Video embed',
      'Instant RFQ access (priority window)',
      'Full analytics dashboard',
      'Email blasts to verified executives',
      'AI Assistant integration',
      'Priority support — 24h SLA',
    ],
  },
]

const TIER_ORDER = ['listed', 'connected', 'featured']

function BillingContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')

  const [profile, setProfile] = useState<any>(null)
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [loading, setLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

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
    }
    load()
  }, [])

  async function handleCheckout(tierKey: string) {
    setLoading(tierKey)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierKey, interval: billingInterval }),
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

  const currentTier = profile?.tier ?? 'listed'
  const hasPaidPlan = currentTier !== 'listed'
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
      {cancelled && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#fef3c7' }}>
          <AlertCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--color-gold)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-navy)' }}>Payment was cancelled — no charge was made.</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Billing & Plan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>All prices in CAD. Cancel monthly plans anytime. Annual plans non-refundable after 7 days.</p>
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
          {currentTier === 'listed' ? (
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

      {/* Monthly / Annual toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: '#f1f3f5' }}>
          {(['month', 'year'] as const).map(i => (
            <button key={i} onClick={() => setBillingInterval(i)}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: billingInterval === i ? 'white' : 'transparent',
                color: billingInterval === i ? 'var(--color-navy)' : 'var(--color-gray)',
                boxShadow: billingInterval === i ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}>
              {i === 'month' ? 'Monthly' : (
                <span className="flex items-center gap-2">
                  Annual — pay once
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                    2 months free
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
        {TIERS.map(tier => {
          const Icon = tier.icon
          const isCurrent = currentTier === tier.key
          const tierIndex = TIER_ORDER.indexOf(tier.key)
          const isDowngrade = tierIndex < currentTierIndex
          const monthlyEquiv = billingInterval === 'year' ? Math.round(tier.annual / 12) : tier.monthly

          return (
            <div key={tier.key}
              className="bg-white border-2 rounded-2xl p-6 flex flex-col relative"
              style={{ borderColor: isCurrent ? tier.borderColor : tier.popular ? tier.borderColor : 'var(--color-border)' }}>

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
                  <span className="text-4xl font-extrabold" style={{ color: 'var(--color-navy)' }}>${monthlyEquiv}</span>
                  <span className="text-sm pb-1.5" style={{ color: 'var(--color-gray)' }}>/mo</span>
                </div>
                {billingInterval === 'year' ? (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
                    ${tier.annual.toLocaleString()}/yr · save ${tier.annualSaving.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
                    Billed monthly · cancel anytime
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
                onClick={() => !isCurrent && !isDowngrade && handleCheckout(tier.key)}
                disabled={isCurrent || loading === tier.key || isDowngrade}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                style={{
                  backgroundColor: isCurrent ? tier.bg : 'var(--color-navy)',
                  color: isCurrent ? tier.color : 'white',
                }}>
                {loading === tier.key ? 'Redirecting to Stripe…' :
                 isCurrent ? 'Current Plan' :
                 isDowngrade ? 'Downgrade via Portal' :
                 <><span>Subscribe</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
              {isDowngrade && !isCurrent && (
                <p className="text-xs text-center mt-2" style={{ color: 'var(--color-gray-light)' }}>
                  Use &quot;Manage Subscription&quot; above to downgrade.
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Listed / free note */}
      <div className="text-center p-5 rounded-2xl" style={{ backgroundColor: '#f8f9fc' }}>
        <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-navy)' }}>Listed plan — always free</p>
        <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
          Your company name and category stay in the directory at no cost. Upgrade to Popular or Featured to show contact details, receive RFQs, and get full profile visibility.
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
