'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import EnlistedLogo from '@/components/EnlistedLogo'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError('Invalid email or password.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ backgroundColor: 'var(--color-blue-light)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <EnlistedLogo size={32} />
          <p className="mt-2 text-sm" style={{ color: 'var(--color-gray)' }}>Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: 'var(--color-border)' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ borderColor: errors.email ? '#ef4444' : 'var(--color-border)' }}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold" style={{ color: 'var(--color-gray-dark)' }}>
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--color-blue)' }}>
                  Forgot password?
                </Link>
              </div>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
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
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-gray)' }}>
          Don't have an account?{' '}
          <Link href="/register/executive" className="font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>
            Register free
          </Link>
        </p>
      </div>
    </div>
  )
}
