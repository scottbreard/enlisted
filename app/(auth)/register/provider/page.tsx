import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import EnlistedLogo from '@/components/EnlistedLogo'
import ProviderRegisterForm from './ProviderRegisterForm'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'List Your Firm on Enlisted',
  description:
    'Get your firm in front of the executives of publicly listed companies. Free to list across 92 professional service categories — upgrade anytime to unlock your full profile.',
}

function FormSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-5 w-72 max-w-full mx-auto rounded mb-8" style={{ backgroundColor: 'rgba(27,58,107,0.08)' }} />
      <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
        <div className="h-16 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
        <div className="h-11 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }} />
      </div>
    </div>
  )
}

export default function ProviderRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
    <div className="flex-1 px-6 py-12" style={{ backgroundColor: 'var(--color-blue-light)' }}>
      <div className="max-w-lg mx-auto">

        <div className="text-center">
          <div className="mb-5 flex justify-center"><EnlistedLogo size={28} /></div>
          <h1 className="text-3xl font-extrabold mb-2 anim-fade-up" style={{ color: 'var(--color-navy)' }}>
            List your firm on Enlisted
          </h1>
        </div>

        <Suspense fallback={<FormSkeleton />}>
          <ProviderRegisterForm />
        </Suspense>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-gray)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign in</Link>
        </p>

      </div>
    </div>
    <SiteFooter />
    </div>
  )
}
