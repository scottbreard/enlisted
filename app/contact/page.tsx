import Link from 'next/link'
import { Mail, MapPin, Clock } from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'

export const metadata = {
  title: 'Contact — Enlisted',
  description: 'Get in touch with the Enlisted team. We help public company executives and service providers with questions about listings, accounts, and the platform.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <EnlistedLogo size={28} />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--color-gray)' }}>
            <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
            <Link href="/pricing" className="hover:text-[var(--color-navy)] transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-[var(--color-navy)] transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
            <Link href="/register/executive" className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
              Register Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="py-20 px-6 text-center" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl font-extrabold text-white mb-4">Get in touch</h1>
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Questions about listings, accounts, or the platform — we're here to help.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">

            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>Contact us</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <Mail className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-navy)' }}>Email</p>
                    <a href="mailto:hello@enlisted.ca" className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>
                      hello@enlisted.ca
                    </a>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>For general inquiries and support</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <MapPin className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-navy)' }}>Location</p>
                    <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Vancouver, British Columbia</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>Canada</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <Clock className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-navy)' }}>Response time</p>
                    <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Within 1 business day</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>Monday – Friday, Pacific Time</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 rounded-2xl" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                <p className="font-bold text-sm mb-2" style={{ color: 'var(--color-navy)' }}>A division of Stock Marketing Inc.</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-gray)' }}>
                  Enlisted is built and operated by Stock Marketing Inc., a Canadian company focused on capital markets infrastructure. We are independent — not affiliated with any exchange, brokerage, or advisory firm.
                </p>
              </div>
            </div>

            {/* Topic links */}
            <div>
              <h2 className="text-2xl font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>Common questions</h2>

              <div className="space-y-4">
                {[
                  {
                    title: 'Executive registration',
                    desc: 'How to register and verify your credentials as a public company executive.',
                    href: '/register/executive',
                    cta: 'Register free →',
                  },
                  {
                    title: 'Provider listings',
                    desc: 'How to create a free listing or upgrade to a paid tier for full visibility.',
                    href: '/pricing',
                    cta: 'See pricing →',
                  },
                  {
                    title: 'Browse the directory',
                    desc: 'Find and compare service providers across 92 categories.',
                    href: '/directory',
                    cta: 'Browse now →',
                  },
                  {
                    title: 'Account issues',
                    desc: 'Trouble logging in, updating your profile, or managing your subscription?',
                    href: 'mailto:hello@enlisted.ca',
                    cta: 'Email support →',
                  },
                ].map(item => (
                  <div
                    key={item.title}
                    className="bg-white border rounded-2xl p-5"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-navy)' }}>{item.title}</p>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-gray)' }}>{item.desc}</p>
                    <Link href={item.href} className="text-xs font-bold hover:underline" style={{ color: 'var(--color-blue)' }}>
                      {item.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--color-gray-light)' }}>
          <span>© 2026 Enlisted.ca, a division of Stock Marketing Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-[var(--color-navy)] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--color-navy)] transition-colors">Privacy</Link>
            <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
            <Link href="/about" className="hover:text-[var(--color-navy)] transition-colors">About</Link>
            <Link href="/login" className="hover:text-[var(--color-navy)] transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
