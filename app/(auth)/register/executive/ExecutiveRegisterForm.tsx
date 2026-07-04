'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { Star, Search, BadgeCheck } from 'lucide-react'
import { getMarketCode } from '@/lib/market'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  company_name: z.string().min(1, 'Required'),
  company_ticker: z.string().optional(),
  exchange: z.enum(['TSX', 'TSXV', 'CSE', 'NEO'], { error: 'Select an exchange' }),
  sector: z.string().min(1, 'Required'),
  fiscal_year_end: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})
type FormData = z.infer<typeof schema>

const exchanges = ['TSX', 'TSXV', 'CSE', 'NEO']
const sectors = [
  'Mining & Metals', 'Oil & Gas', 'Biotech & Pharma', 'Technology',
  'Cannabis', 'Clean Energy', 'Real Estate', 'Financial Services',
  'Agriculture', 'Consumer', 'Industrials', 'Other',
]
const fiscalYearEnds = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const titles = ['CEO', 'CFO', 'COO', 'IRO', 'Corporate Secretary', 'President', 'Executive Chairman', 'Other']

export default function ExecutiveRegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Return path after signup (internal paths only — no open redirects)
  const rawNext = searchParams.get('next') ?? ''
  const nextUrl = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'
  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)
  const [foundingCount, setFoundingCount] = useState<number | null>(null)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Issuer type-ahead: search the live TSX/TSXV/CSE/NEO listing database
  type Issuer = { id: string; name: string; symbol: string; exchange_code: string }
  const [issuerQuery, setIssuerQuery] = useState('')
  const [issuerResults, setIssuerResults] = useState<Issuer[]>([])
  const [selectedIssuer, setSelectedIssuer] = useState<Issuer | null>(null)
  const [issuerOpen, setIssuerOpen] = useState(false)
  const [manualCompany, setManualCompany] = useState(false)

  useEffect(() => {
    if (selectedIssuer || manualCompany || issuerQuery.trim().length < 2) { setIssuerResults([]); return }
    const t = setTimeout(async () => {
      const q = issuerQuery.trim()
      const { data } = await supabase
        .from('issuers')
        .select('id, name, symbol, exchange_code')
        .eq('is_live', true)
        .eq('is_etf', false)
        .or(`name.ilike.%${q}%,symbol.ilike.${q}%`)
        .order('name')
        .limit(8)
      setIssuerResults(data ?? [])
      setIssuerOpen(true)
    }, 200)
    return () => clearTimeout(t)
  }, [issuerQuery, selectedIssuer, manualCompany])

  function pickIssuer(issuer: Issuer) {
    setSelectedIssuer(issuer)
    setIssuerOpen(false)
    setIssuerQuery(issuer.name)
    setValue('company_name', issuer.name, { shouldValidate: true })
    setValue('company_ticker', issuer.symbol)
    setValue('exchange', issuer.exchange_code as FormData['exchange'], { shouldValidate: true })
  }

  function clearIssuer() {
    setSelectedIssuer(null)
    setIssuerQuery('')
    setValue('company_name', '')
    setValue('company_ticker', '')
  }

  useEffect(() => {
    supabase
      .from('executive_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_founding_member', true)
      .eq('market_code', getMarketCode())
      .then(({ count }) => setFoundingCount(count ?? 0))
  }, [])

  async function onSubmit(data: FormData) {
    setServerError('')

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { role: 'executive' },
        emailRedirectTo: `${window.location.origin}${nextUrl}`,
      },
    })
    if (authError || !authData.user) {
      setServerError(authError?.message ?? 'Registration failed. Try again.')
      return
    }

    // 2. Create profile server-side (works even before email confirmation);
    //    founding status is assigned there atomically
    const res = await fetch('/api/register/executive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: authData.user.id,
        first_name: data.first_name,
        last_name: data.last_name,
        title: data.title,
        company_name: data.company_name,
        company_ticker: data.company_ticker,
        sector: data.sector,
        market_code: getMarketCode(),
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setServerError(err.error ?? 'Account created but profile setup failed. Please contact support.')
      return
    }
    const { founding_number: foundingNumber } = await res.json()

    // Send welcome email (fire and forget — never block redirect)
    fetch('/api/email/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'executive',
        email: data.email,
        firstName: data.first_name,
        foundingNumber,
      }),
    }).catch(() => {})

    // Email confirmation pending — the confirm link continues to the return path
    if (!authData.session) {
      setConfirmSent(true)
      return
    }
    router.push(nextUrl)
  }

  return (
    <>
      {/* Founding member counter */}
      {foundingCount !== null && foundingCount < 500 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-navy)', border: '1px solid var(--color-gold)' }}>
          <Star className="w-4 h-4 shrink-0 fill-current" style={{ color: 'var(--color-gold)' }} />
          <span>
            <span className="font-extrabold" style={{ color: 'var(--color-gold)' }}>{500 - foundingCount} </span>
            Founding Executive {500 - foundingCount === 1 ? 'spot' : 'spots'} remaining
          </span>
        </div>
      )}
      {foundingCount !== null && foundingCount >= 500 && (
        <div className="px-4 py-2.5 rounded-xl mb-5 text-sm" style={{ backgroundColor: '#f3f4f6', color: 'var(--color-gray)' }}>
          Founding Executive spots are full — you&apos;ll still get full free access.
        </div>
      )}

      {confirmSent ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-3">📬</p>
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--color-navy)' }}>Check your email</h2>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
            We sent you a confirmation link. Click it to verify your email and access your account.
          </p>
        </div>
      ) : (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>First Name</label>
            <input {...register('first_name')} placeholder="Jane" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: errors.first_name ? '#ef4444' : 'var(--color-border)' }} />
            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Last Name</label>
            <input {...register('last_name')} placeholder="Smith" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: errors.last_name ? '#ef4444' : 'var(--color-border)' }} />
            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Title</label>
          <select {...register('title')} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: errors.title ? '#ef4444' : 'var(--color-border)' }}>
            <option value="">Select your title</option>
            {titles.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Company</label>
          {manualCompany ? (
            <>
              <input {...register('company_name')} placeholder="Acme Mining Corp." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: errors.company_name ? '#ef4444' : 'var(--color-border)' }} />
              <p className="text-xs mt-1" style={{ color: 'var(--color-gray-light)' }}>
                Manual entry — your account will be verified by our team.{' '}
                <button type="button" className="underline" onClick={() => { setManualCompany(false); clearIssuer() }}>Search listings instead</button>
              </p>
            </>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: errors.company_name ? '#ef4444' : selectedIssuer ? '#10b981' : 'var(--color-border)' }}>
                {selectedIssuer
                  ? <BadgeCheck className="w-4 h-4 shrink-0" style={{ color: '#10b981' }} />
                  : <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />}
                <input
                  value={issuerQuery}
                  onChange={e => { setIssuerQuery(e.target.value); if (selectedIssuer) clearIssuer() }}
                  onFocus={() => issuerResults.length && setIssuerOpen(true)}
                  placeholder="Search your listed company or ticker…"
                  className="flex-1 outline-none bg-transparent"
                />
                {selectedIssuer && (
                  <span className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                    {selectedIssuer.exchange_code}:{selectedIssuer.symbol}
                  </span>
                )}
              </div>
              {issuerOpen && issuerResults.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border shadow-xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                  {issuerResults.map(i => (
                    <button key={i.id} type="button" onClick={() => pickIssuer(i)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-blue-light)] flex items-center justify-between gap-2">
                      <span style={{ color: 'var(--color-gray-dark)' }}>{i.name}</span>
                      <span className="text-xs font-bold shrink-0" style={{ color: 'var(--color-gray-light)' }}>{i.exchange_code}:{i.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--color-gray-light)' }}>
                Matched against all 9,900+ TSX, TSXV, CSE &amp; NEO listings.{' '}
                <button type="button" className="underline" onClick={() => { setManualCompany(true); clearIssuer() }}>Can&apos;t find your company?</button>
              </p>
            </div>
          )}
          {errors.company_name && <p className="text-red-500 text-xs mt-1">Select your company from the list</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Ticker Symbol</label>
            <input {...register('company_ticker')} placeholder="ACM" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Exchange</label>
            <select {...register('exchange')} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: errors.exchange ? '#ef4444' : 'var(--color-border)' }}>
              <option value="">Select</option>
              {exchanges.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {errors.exchange && <p className="text-red-500 text-xs mt-1">{errors.exchange.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Sector</label>
            <select {...register('sector')} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: errors.sector ? '#ef4444' : 'var(--color-border)' }}>
              <option value="">Select</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Fiscal Year End</label>
            <select {...register('fiscal_year_end')} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: errors.fiscal_year_end ? '#ef4444' : 'var(--color-border)' }}>
              <option value="">Select month</option>
              {fiscalYearEnds.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.fiscal_year_end && <p className="text-red-500 text-xs mt-1">{errors.fiscal_year_end.message}</p>}
          </div>
        </div>

        <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Email Address</label>
            <input {...register('email')} type="email" placeholder="you@company.com" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: errors.email ? '#ef4444' : 'var(--color-border)' }} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Password</label>
            <input {...register('password')} type="password" placeholder="Min. 8 characters" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: errors.password ? '#ef4444' : 'var(--color-border)' }} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
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
          {isSubmitting ? 'Creating account…' : 'Create Free Account'}
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--color-gray-light)' }}>
          By registering you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
      )}
    </>
  )
}
