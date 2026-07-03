'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import EnlistedLogo from '@/components/EnlistedLogo'
import { Building2, ShieldCheck } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter your work email'),
  password: z.string().min(8, 'At least 8 characters'),
})
type FormData = z.infer<typeof schema>

export default function ClaimListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [listing, setListing] = useState<{ company_name: string; user_id: string | null } | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [serverError, setServerError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)
  const [claiming, setClaiming] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function completeClaim(): Promise<boolean> {
    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    const result = await res.json()
    if (!res.ok) {
      setServerError(result.error ?? 'Claim failed. Please contact support.')
      return false
    }
    router.push('/provider/dashboard?claimed=1')
    return true
  }

  useEffect(() => {
    supabase
      .from('provider_profiles')
      .select('company_name, user_id')
      .eq('slug', slug)
      .single()
      .then(async ({ data }) => {
        if (!data) { setNotFound(true); return }
        setListing(data)
        // Returning from the email confirmation link: session exists — finish the claim
        if (!data.user_id) {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            setClaiming(true)
            const ok = await completeClaim()
            if (!ok) setClaiming(false)
          }
        }
      })
  }, [slug])

  async function onSubmit(data: FormData) {
    setServerError('')

    // Sign in if the account exists, otherwise create it
    const { error: signInError } = await supabase.auth.signInWithPassword(data)
    if (signInError) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { role: 'provider' },
          emailRedirectTo: `${window.location.origin}/claim/${slug}`,
        },
      })
      if (signUpError) {
        setServerError(signUpError.message)
        return
      }
      // Email confirmation required — no session yet
      if (!signUpData.session) {
        setConfirmSent(true)
        return
      }
    }

    await completeClaim()
  }

  const claimed = listing?.user_id != null

  return (
    <div className="min-h-screen px-6 py-12" style={{ backgroundColor: 'var(--color-blue-light)' }}>
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-8">
          <div className="mb-5 flex justify-center"><EnlistedLogo size={28} /></div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-navy)' }}>
            Claim your listing
          </h1>
          {listing && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border" style={{ borderColor: 'var(--color-border)' }}>
              <Building2 className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>{listing.company_name}</span>
            </div>
          )}
        </div>

        {notFound ? (
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
              Listing not found.{' '}
              <Link href="/register/provider" className="font-semibold underline" style={{ color: 'var(--color-navy)' }}>
                Create a new listing
              </Link>
            </p>
          </div>
        ) : claimed ? (
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--color-gray)' }}>
              This listing has already been claimed. If you believe this is an error, contact us.
            </p>
            <Link href="/contact" className="font-semibold underline text-sm" style={{ color: 'var(--color-navy)' }}>
              Contact support
            </Link>
          </div>
        ) : confirmSent ? (
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-3xl mb-3">📬</p>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--color-navy)' }}>Check your email</h2>
            <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
              We sent you a confirmation link. Click it to verify your email and your claim will complete automatically.
            </p>
          </div>
        ) : claiming ? (
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-6 h-6 mx-auto mb-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-navy)' }} />
            <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Completing your claim…</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: 'var(--color-border)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
                  Work Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@yourfirm.com"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[var(--color-navy)] transition-colors"
                  style={{ borderColor: errors.email ? '#ef4444' : 'var(--color-border)' }}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--color-gray-light)' }}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Use your company email — matching domains are verified instantly.
                </p>
              </div>

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
                disabled={isSubmitting || !listing}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-navy)' }}
              >
                {isSubmitting ? 'Claiming…' : 'Claim This Listing'}
              </button>

              <p className="text-xs text-center" style={{ color: 'var(--color-gray-light)' }}>
                By claiming you agree to our{' '}
                <Link href="/terms" className="underline" style={{ color: 'var(--color-blue)' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline" style={{ color: 'var(--color-blue)' }}>Privacy Policy</Link>.
              </p>
            </form>
          </div>
        )}

        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-gray)' }}>
          Not your firm?{' '}
          <Link href="/register/provider" className="font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>
            Create a new listing
          </Link>
        </p>
      </div>
    </div>
  )
}
