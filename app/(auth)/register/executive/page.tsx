'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { Building2, CheckCircle, Star } from 'lucide-react'

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

export default function ExecutiveRegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const [foundingCount, setFoundingCount] = useState<number | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    supabase
      .from('executive_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_founding_member', true)
      .then(({ count }) => setFoundingCount(count ?? 0))
  }, [])

  async function onSubmit(data: FormData) {
    setServerError('')

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { role: 'executive' } },
    })
    if (authError || !authData.user) {
      setServerError(authError?.message ?? 'Registration failed. Try again.')
      return
    }

    // 2. Check founding member count
    const { count } = await supabase
      .from('executive_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_founding_member', true)
    const isFoundingMember = (count ?? 0) < 500
    const foundingNumber = isFoundingMember ? (count ?? 0) + 1 : null

    // 3. Generate referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()

    // 4. Create executive profile
    const { error: profileError } = await supabase.from('executive_profiles').insert({
      user_id: authData.user.id,
      first_name: data.first_name,
      last_name: data.last_name,
      title: data.title,
      company_name: data.company_name,
      company_ticker: data.company_ticker || null,
      sector: data.sector,
      is_founding_member: isFoundingMember,
      founding_member_number: foundingNumber,
      referral_code: referralCode,
    })

    if (profileError) {
      setServerError('Account created but profile setup failed. Please contact support.')
      return
    }

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

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
        <Link href="/" className="inline-flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          <span className="text-xl font-extrabold">Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span></span>
        </Link>
        <div>
          <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>
            Free for executives. Always.
          </p>
          <h2 className="text-3xl font-extrabold mb-6 leading-tight">
            Every service your public company needs — in one place.
          </h2>
          <ul className="space-y-4">
            {[
              'Browse 92 categories of service providers',
              'Compliance calendar auto-built for your exchange',
              'Private vault to manage your provider relationships',
              'AI assistant trained on Canadian public markets',
              'Founding Member status — only 500 spots',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>© 2026 Enlisted Inc.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: 'var(--color-blue-light)' }}>
        <div className="w-full max-w-lg">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <Building2 className="w-6 h-6" style={{ color: 'var(--color-navy)' }} />
              <span className="text-xl font-extrabold" style={{ color: 'var(--color-navy)' }}>
                Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span>
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: 'var(--color-border)' }}>
            <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--color-navy)' }}>
              Create your free account
            </h1>
            <p className="text-sm mb-4" style={{ color: 'var(--color-gray)' }}>
              For CEOs, CFOs, IROs, and corporate secretaries of listed companies.
            </p>

            {/* Founding member counter */}
            {foundingCount !== null && foundingCount < 500 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 text-sm font-semibold"
                style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-navy)', border: '1px solid var(--color-gold)' }}>
                <Star className="w-4 h-4 shrink-0 fill-current" style={{ color: 'var(--color-gold)' }} />
                <span>
                  <span className="font-extrabold" style={{ color: 'var(--color-gold)' }}>{500 - foundingCount} </span>
                  Founding Member {500 - foundingCount === 1 ? 'spot' : 'spots'} remaining
                </span>
              </div>
            )}
            {foundingCount !== null && foundingCount >= 500 && (
              <div className="px-4 py-2.5 rounded-xl mb-5 text-sm" style={{ backgroundColor: '#f3f4f6', color: 'var(--color-gray)' }}>
                Founding Member spots are full — you'll still get full free access.
              </div>
            )}

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
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Company Name</label>
                <input {...register('company_name')} placeholder="Acme Mining Corp." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: errors.company_name ? '#ef4444' : 'var(--color-border)' }} />
                {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
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
          </div>

          <p className="text-center text-sm mt-4" style={{ color: 'var(--color-gray)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>
              Sign in
            </Link>
            {' · '}
            <Link href="/register/provider" className="font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>
              Register as a provider
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
