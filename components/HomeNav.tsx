'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'

export default function HomeNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <EnlistedLogo size={20} />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--color-gray)' }}>
          <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
          <Link href="/about" className="hover:text-[var(--color-navy)] transition-colors">About</Link>
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>
            Sign In
          </Link>
          <Link
            href="/register/executive"
            className="text-sm font-bold px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: 'var(--color-navy)' }}
          >
            Register Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open
            ? <X className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
            : <Menu className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <nav className="px-6 py-2">
            {[
              { href: '/directory', label: 'Directory' },
              { href: '/about', label: 'About' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center py-3.5 text-sm font-medium border-b"
                style={{ color: 'var(--color-gray-dark)', borderColor: 'var(--color-border)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 py-4 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-center py-3 text-sm font-semibold rounded-xl border"
              style={{ color: 'var(--color-navy)', borderColor: 'var(--color-border)' }}
            >
              Sign In
            </Link>
            <Link
              href="/register/executive"
              onClick={() => setOpen(false)}
              className="block text-center py-3 text-sm font-bold rounded-xl text-white"
              style={{ backgroundColor: 'var(--color-navy)' }}
            >
              Register Free — Executives
            </Link>
            <Link
              href="/register/provider"
              onClick={() => setOpen(false)}
              className="block text-center py-3 text-sm font-bold rounded-xl"
              style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-navy)', border: '1px solid var(--color-gold)' }}
            >
              List Your Firm
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
