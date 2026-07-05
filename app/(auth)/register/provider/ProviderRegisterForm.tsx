'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { getMarketCode } from '@/lib/market'
import { ChevronDown, Search, Star, Zap } from 'lucide-react'

const schema = z.object({
  company_name: z.string().min(2, 'Required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})
type FormData = z.infer<typeof schema>

type Category = { id: string; slug: string; name: string; group_name: string }

const PLANS: Record<string, { name: string; price: string; icon: typeof Zap; color: string; bg: string }> = {
  listed:   { name: 'Listed',   price: '$1,200/yr', icon: Zap,  color: '#1e40af', bg: '#dbeafe' },
  featured: { name: 'Featured', price: '$6,000/yr', icon: Star, color: '#92400e', bg: '#fef3c7' },
}

export default function ProviderRegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = PLANS[searchParams.get('plan') ?? ''] ? (searchParams.get('plan') as string) : null
  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryError, setCategoryError] = useState('')
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    supabase.from('service_categories').select('id, slug, name, group_name').order('sort_order')
      .then(({ data }) => setCategories(data ?? []))
  }, [])

  const grouped = categories.reduce<Record<string, Category[]>>((acc, cat) => {
    if (!acc[cat.group_name]) acc[cat.group_name] = []
    acc[cat.group_name].push(cat)
    return acc
  }, {})

  const filtered = search.trim()
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : null

  const nextUrl = plan ? `/provider/billing?plan=${plan}` : '/provider/dashboard'

  async function onSubmit(data: FormData) {
    setServerError('')
    if (!selectedCategory) {
      setCategoryError('Select your primary service category.')
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { role: 'provider' },
        emailRedirectTo: `${window.location.origin}${nextUrl}`,
      },
    })
    if (authError || !authData.user) {
      setServerError(authError?.message ?? 'Registration failed. Try again.')
      return
    }

    // Profile is created server-side so it works even before email confirmation
    const res = await fetch('/api/register/provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: authData.user.id,
        company_name: data.company_name,
        category_id: selectedCategory.id,
        market_code: getMarketCode(),
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setServerError(err.error ?? 'Account created but profile setup failed. Please contact support.')
      return
    }

    // Email confirmation pending — the confirm link continues to billing/dashboard
    if (!authData.session) {
      setConfirmSent(true)
      return
    }
    router.push(nextUrl)
  }

  return (
    <>
      <p className="text-sm text-center mb-8" style={{ color: 'var(--color-gray)' }}>
        {plan
          ? 'Create your account — payment is the next step.'
          : 'Free to list — upgrade anytime to unlock your full profile.'}
      </p>

      {plan && (() => { const P = PLANS[plan]; const Icon = P.icon; return (
        <div className="mb-5 flex items-center gap-3 p-4 rounded-2xl border-2 bg-white" style={{ borderColor: P.color }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: P.bg }}>
            <Icon className="w-5 h-5" style={{ color: P.color }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold" style={{ color: 'var(--color-navy)' }}>{P.name} plan — {P.price} CAD</p>
            <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
              After creating your account you&apos;ll continue to secure checkout. Annual term begins September 1, 2026.
            </p>
          </div>
        </div>
      )})()}

      {confirmSent ? (
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-3xl mb-3">📬</p>
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--color-navy)' }}>Check your email</h2>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
            We sent you a confirmation link.
            {plan
              ? ' Click it to verify your email and you’ll be taken straight to secure checkout.'
              : ' Click it to verify your email and access your dashboard.'}
          </p>
        </div>
      ) : (
      <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: 'var(--color-border)' }}>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Company name */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Company Name *
            </label>
            <input
              {...register('company_name')}
              placeholder="XYZ IR Group Inc."
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[var(--color-navy)] transition-colors"
              style={{ borderColor: errors.company_name ? '#ef4444' : 'var(--color-border)' }}
            />
            {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
          </div>

          {/* Category picker */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Primary Service Category *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setDropdownOpen(o => !o); setSearch('') }}
                className="w-full px-3 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between"
                style={{ borderColor: categoryError ? '#ef4444' : 'var(--color-border)', color: selectedCategory ? 'var(--color-gray-dark)' : 'var(--color-gray-light)' }}
              >
                <span>{selectedCategory ? selectedCategory.name : 'Select your category…'}</span>
                <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border shadow-xl overflow-hidden" style={{ borderColor: 'var(--color-border)', maxHeight: 320 }}>
                  {/* Search */}
                  <div className="p-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ backgroundColor: '#f5f7fb' }}>
                      <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-gray-light)' }} />
                      <input
                        autoFocus
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search categories…"
                        className="flex-1 text-xs bg-transparent outline-none"
                        style={{ color: 'var(--color-gray-dark)' }}
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
                    {filtered ? (
                      filtered.length === 0 ? (
                        <p className="text-xs text-center py-6" style={{ color: 'var(--color-gray-light)' }}>No matches</p>
                      ) : (
                        <div className="py-1">
                          {filtered.map(cat => (
                            <button key={cat.id} type="button"
                              onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); setCategoryError('') }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-blue-light)] transition-colors"
                              style={{ color: 'var(--color-gray-dark)' }}>
                              {cat.name}
                              <span className="ml-2 text-xs" style={{ color: 'var(--color-gray-light)' }}>{cat.group_name}</span>
                            </button>
                          ))}
                        </div>
                      )
                    ) : (
                      Object.entries(grouped).map(([group, cats]) => (
                        <div key={group}>
                          <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-gray-light)' }}>{group}</p>
                          {cats.map(cat => (
                            <button key={cat.id} type="button"
                              onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); setCategoryError('') }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-blue-light)] transition-colors"
                              style={{
                                color: 'var(--color-gray-dark)',
                                backgroundColor: selectedCategory?.id === cat.id ? 'var(--color-blue-light)' : undefined,
                                fontWeight: selectedCategory?.id === cat.id ? 600 : undefined,
                              }}>
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {categoryError && <p className="text-red-500 text-xs mt-1">{categoryError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@yourfirm.com"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[var(--color-navy)] transition-colors"
              style={{ borderColor: errors.email ? '#ef4444' : 'var(--color-border)' }}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Password *
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="Min. 8 characters"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[var(--color-navy)] transition-colors"
              style={{ borderColor: errors.password ? '#ef4444' : 'var(--color-border)' }}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
            {isSubmitting ? 'Creating account…' : plan ? 'Create Account & Continue to Payment' : 'Create Free Listing'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--color-gray-light)' }}>
            By registering you agree to our{' '}
            <Link href="/terms" className="underline" style={{ color: 'var(--color-blue)' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline" style={{ color: 'var(--color-blue)' }}>Privacy Policy</Link>.
          </p>
        </form>
      </div>
      )}

      {/* What you get free — hidden when signing up for a paid plan */}
      {!plan && (
      <div className="mt-5 bg-white rounded-2xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gray-light)' }}>What you get free</p>
        <ul className="space-y-2">
          {[
            'Your firm listed by name and category',
            'Searchable by verified public company executives',
            'Access to browse the full directory',
            'Upgrade anytime to unlock your full profile',
          ].map(f => (
            <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-gray)' }}>
              <span className="mt-0.5 text-emerald-500 font-bold">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>
      )}
    </>
  )
}
