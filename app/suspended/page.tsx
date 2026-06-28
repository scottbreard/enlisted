import Link from 'next/link'
import { Building2 } from 'lucide-react'

export const metadata = { title: 'Account Suspended — Enlisted' }

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#f8f9fc' }}>
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Building2 className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
        <span className="text-xl font-extrabold" style={{ color: 'var(--color-gold)' }}>
          Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-gold)' }}>ca</span>
        </span>
      </Link>
      <div className="bg-white border rounded-2xl p-12 max-w-md w-full" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-4xl mb-4">🔒</p>
        <h1 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>Account suspended</h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-gray)' }}>
          Your account has been suspended following our executive vetting review. If you believe this is an error, please contact us.
        </p>
        <a
          href="mailto:hello@enlisted.ca"
          className="inline-block text-sm font-bold px-6 py-3 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}
