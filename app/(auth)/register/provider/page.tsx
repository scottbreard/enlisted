'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import EnlistedLogo from '@/components/EnlistedLogo'
import { getMarketCode } from '@/lib/market'

const EXCHANGE_GROUPS = [
  { market: 'Canada', code: 'CA', exchanges: ['TSX', 'TSXV', 'CSE', 'NEO'] },
  { market: 'United States', code: 'US', exchanges: ['NYSE', 'Nasdaq', 'OTC'] },
  { market: 'United Kingdom', code: 'UK', exchanges: ['LSE', 'AIM'] },
  { market: 'Australia', code: 'AU', exchanges: ['ASX', 'NSX'] },
]

const schema = z.object({
  company_name: z.string().min(2, 'Required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
  website_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProviderRegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([])
  const [exchangeError, setExchangeError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function toggleExchange(exchange: string) {
    setSelectedExchanges(prev =>
      prev.includes(exchange) ? prev.filter(e => e !== exchange) : [...prev, exchange]
    )
    setExchangeError('')
  }

  async function onSubmit(data: FormData) {
    setServerError('')
    if (selectedExchanges.length === 0) {
      setExchangeError('Select at least one exchange you service.')
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { role: 'provider' } },
    })
    if (authError || !authData.user) {
      setServerError(authError?.message ?? 'Registration failed. Try again.')
      return
    }

    // Generate unique slug
    const baseSlug = slugify(data.company_name)
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

    const { error: profileError } = await supabase.from('provider_profiles').insert({
      user_id: authData.user.id,
      company_name: data.company_name,
      slug,
      email: data.email,
      website_url: data.website_url || null,
      tier: 'free',
      is_active: true,
      primary_market_code: getMarketCode(),
    })

    if (profileError) {
      setServerError('Account created but profile setup failed. Please contact support.')
      return
    }

    // Save selected exchanges
    const { data: profile } = await supabase
      .from('provider_profiles')
      .select('id')
      .eq('user_id', authData.user.id)
      .single()

    if (profile && selectedExchanges.length > 0) {
      await supabase.from('provider_exchanges').insert(
        selectedExchanges.map(code => ({ provider_id: profile.id, exchange_code: code }))
      )
    }

    // Send welcome email (fire and forget)
    fetch('/api/email/welcome-provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: data.email, companyName: data.company_name, tier: 'free' }),
    }).catch(() => {})

    router.push('/provider/dashboard')
  }

  const tiers = [
    { name: 'Free', price: '$0', features: ['Name + category + city only', 'No contact details shown', 'No website or logo'], highlight: false },
    { name: 'Listed', price: '$100/mo or $1,000/yr', features: ['Full contact + logo', '300-word description', 'RFQ access'], highlight: true },
    { name: 'Featured', price: '$1,000/mo or $10,000/yr', features: ['Top placement', '750-word profile + case studies', 'Video + email blasts', 'AI Assistant + homepage feature'], highlight: false },
  ]

  return (
    <div className="min-h-screen px-6 py-12" style={{ backgroundColor: 'var(--color-blue-light)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-6"><EnlistedLogo size={28} /></div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-navy)' }}>
            List your firm on Enlisted
          </h1>
          <p style={{ color: 'var(--color-gray)' }}>
            Get listed in Canada's directory for public company services. Start free, upgrade anytime.
          </p>
        </div>

        {/* Tier preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className="bg-white rounded-xl p-4 border text-center"
              style={{
                borderColor: tier.highlight ? 'var(--color-gold)' : 'var(--color-border)',
                boxShadow: tier.highlight ? '0 0 0 2px var(--color-gold)' : undefined,
              }}
            >
              {tier.highlight && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block" style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
                  Popular
                </span>
              )}
              <p className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>{tier.name}</p>
              <p className="text-lg font-extrabold my-1" style={{ color: 'var(--color-navy)' }}>{tier.price}</p>
              <ul className="text-xs space-y-1 text-left" style={{ color: 'var(--color-gray)' }}>
                {tier.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Registration form */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-lg mx-auto" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-extrabold mb-1" style={{ color: 'var(--color-navy)' }}>Create your provider account</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-gray)' }}>
            You'll set up your full profile and choose a paid tier after registering.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Company Name</label>
              <input
                {...register('company_name')}
                placeholder="XYZ IR Group Inc."
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: errors.company_name ? '#ef4444' : 'var(--color-border)' }}
              />
              {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Website</label>
              <input
                {...register('website_url')}
                placeholder="https://yourfirm.com"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: errors.website_url ? '#ef4444' : 'var(--color-border)' }}
              />
              {errors.website_url && <p className="text-red-500 text-xs mt-1">{errors.website_url.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@yourfirm.com"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: errors.email ? '#ef4444' : 'var(--color-border)' }}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: errors.password ? '#ef4444' : 'var(--color-border)' }}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Exchange selection */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-gray-dark)' }}>
                Which stock exchanges do you service? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {EXCHANGE_GROUPS.map(({ market, exchanges }) => (
                  <div key={market}>
                    <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--color-gray-light)' }}>{market}</p>
                    <div className="flex flex-wrap gap-2">
                      {exchanges.map(ex => {
                        const active = selectedExchanges.includes(ex)
                        return (
                          <button
                            key={ex}
                            type="button"
                            onClick={() => toggleExchange(ex)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                            style={{
                              backgroundColor: active ? 'var(--color-navy)' : 'white',
                              color: active ? 'white' : 'var(--color-gray)',
                              borderColor: active ? 'var(--color-navy)' : 'var(--color-border)',
                            }}
                          >
                            {ex}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {exchangeError && <p className="text-red-500 text-xs mt-2">{exchangeError}</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-navy)' }}
            >
              {isSubmitting ? 'Creating account…' : 'Create Provider Account'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--color-gray-light)' }}>
              By registering you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-gray)' }}>
          Are you a pubco executive?{' '}
          <Link href="/register/executive" className="font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>
            Register free here
          </Link>
          {' · '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
