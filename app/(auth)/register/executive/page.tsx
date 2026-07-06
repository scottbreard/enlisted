import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'
import ExecutiveRegisterForm from './ExecutiveRegisterForm'

export const metadata: Metadata = {
  title: 'Create Your Free Executive Account',
  description:
    'Free forever for CEOs, CFOs, IROs, and corporate secretaries of listed companies. Browse 92 categories of service providers, compliance calendar, provider vault, and more.',
}

const benefits = [
  'Browse 92 categories of service providers',
  'Compliance calendar auto-built for your exchange',
  'Private vault to manage your provider relationships',
  'AI assistant trained on Canadian public markets',
  'Founding Executive status — only 500 spots',
]

function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden="true">
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
      </div>
      <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
      <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
      </div>
      <div className="h-32 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
      <div className="h-11 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
    </div>
  )
}

export default function ExecutiveRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
        <EnlistedLogo size={28} variant="dark" />
        <div>
          <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>
            Free for executives. Always.
          </p>
          <h2 className="text-3xl font-extrabold mb-6 leading-tight">
            Every service your public company needs — in one place.
          </h2>
          <ul className="space-y-4">
            {benefits.map(item => (
              <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-white">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>© 2026 Enlisted Inc.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: 'var(--color-blue-light)' }}>
        <div className="w-full max-w-lg">
          <div className="lg:hidden text-center mb-8">
            <EnlistedLogo size={28} />
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border p-8 anim-fade-up" style={{ borderColor: 'var(--color-border)' }}>
            <h1 className="text-2xl font-extrabold mb-1 anim-fade-up" style={{ color: 'var(--color-navy)' }}>
              Create your free account
            </h1>
            <p className="text-sm mb-4" style={{ color: 'var(--color-gray)' }}>
              For CEOs, CFOs, IROs, and corporate secretaries of listed companies.
            </p>

            <Suspense fallback={<FormSkeleton />}>
              <ExecutiveRegisterForm />
            </Suspense>
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
