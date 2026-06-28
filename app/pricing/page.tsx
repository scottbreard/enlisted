'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, ArrowRight, Zap, Star, Shield } from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'

const TIERS = [
  {
    name: 'Free',
    badge: null,
    monthly: 0,
    annual: 0,
    description: 'Your company name and service category appear in the directory. No contact details, no website — free forever.',
    cta: 'Create Free Listing',
    ctaHref: '/register/provider',
    highlight: false,
    features: [
      'Company name in directory',
      'Service category listed',
      'City shown',
      'Searchable by executives',
      'No logo or website link',
      'No contact details shown',
      'No RFQ access',
    ],
    featureStatus: [true, true, true, true, false, false, false],
  },
  {
    name: 'Listed',
    badge: 'Most Popular',
    monthly: 100,
    annual: 1000,
    description: 'Full profile, direct contact details, logo, and inbound RFQs from verified public company executives.',
    cta: 'Get Started',
    ctaHref: '/register/provider',
    highlight: true,
    features: [
      'Everything in Free',
      'Logo + website link',
      'Full contact details',
      '300-word company description',
      'Exchange badges (TSX, TSXV, etc.)',
      'Receive RFQ requests',
      'Basic analytics dashboard',
    ],
    featureStatus: [true, true, true, true, true, true, true],
  },
  {
    name: 'Featured',
    badge: 'Maximum Visibility',
    monthly: 1000,
    annual: 10000,
    description: 'Top placement, video, email blasts to executives, AI Assistant trained on public markets, and homepage feature.',
    cta: 'Get Featured',
    ctaHref: '/register/provider',
    highlight: false,
    features: [
      'Everything in Listed',
      'Top of category placement',
      '750-word profile + case studies',
      'Team profiles + video embed',
      'Email blasts to executives',
      'AI Assistant trained on public markets',
      'Homepage feature rotation',
    ],
    featureStatus: [true, true, true, true, true, true, true],
  },
]

const EXEC_FEATURES = [
  'Full access to all 92 service categories',
  'Send RFQs to any Connected or Featured provider',
  'AI Assistant trained on public markets',
  'Compliance calendar — auto-generated from your exchange',
  'Stock dashboard with live price + chart',
  'Company news feed (ticker + Canadian markets)',
  'Rolodex — personal contact manager',
  'Provider vault — track contracts & renewals',
  'Founding Executive badge (first 500)',
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <EnlistedLogo size={28} />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--color-gray)' }}>
            <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
            <Link href="/pricing" className="font-bold" style={{ color: 'var(--color-navy)' }}>Pricing</Link>
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
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>
              For Service Providers
            </p>
            <h1 className="text-5xl font-extrabold text-white mb-5 leading-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Reach verified public company executives across TSX, TSXV, CSE, and NEO.
              No commissions. No lead fees. Flat monthly rate.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-2 py-2">
              <button
                onClick={() => setAnnual(false)}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  backgroundColor: !annual ? 'white' : 'transparent',
                  color: !annual ? 'var(--color-navy)' : 'rgba(255,255,255,0.7)',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2"
                style={{
                  backgroundColor: annual ? 'white' : 'transparent',
                  color: annual ? 'var(--color-navy)' : 'rgba(255,255,255,0.7)',
                }}
              >
                Annual
                <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-gold)', color: 'white' }}>
                  2 months free
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="px-6 pb-20 -mt-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="bg-white rounded-2xl overflow-hidden flex flex-col"
                style={{
                  border: tier.highlight ? `2px solid var(--color-gold)` : `1px solid var(--color-border)`,
                  boxShadow: tier.highlight ? '0 8px 40px rgba(184,134,11,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                {/* Badge */}
                <div
                  className="h-8 flex items-center justify-center text-xs font-extrabold tracking-widest uppercase"
                  style={{
                    backgroundColor: tier.highlight ? 'var(--color-gold)' : tier.badge ? 'var(--color-navy)' : 'transparent',
                    color: tier.badge ? 'white' : 'transparent',
                  }}
                >
                  {tier.badge ?? ''}
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--color-navy)' }}>{tier.name}</h2>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-gray)' }}>{tier.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    {tier.monthly === 0 ? (
                      <div className="text-5xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Free</div>
                    ) : (
                      <>
                        <div className="flex items-end gap-1">
                          <span className="text-5xl font-extrabold" style={{ color: 'var(--color-navy)' }}>
                            ${annual ? Math.round(tier.annual / 12) : tier.monthly}
                          </span>
                          <span className="text-sm mb-2" style={{ color: 'var(--color-gray)' }}>/mo CAD</span>
                        </div>
                        {annual && (
                          <p className="text-xs mt-1" style={{ color: 'var(--color-gold)' }}>
                            Billed ${tier.annual.toLocaleString()}/yr — save ${(tier.monthly * 12 - tier.annual).toLocaleString()}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={tier.ctaHref}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm mb-8 transition-all"
                    style={{
                      backgroundColor: tier.highlight ? 'var(--color-gold)' : 'var(--color-navy)',
                      color: 'white',
                    }}
                  >
                    {tier.cta} <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: tier.featureStatus[i] ? '#10b981' : 'var(--color-border)' }}
                        />
                        <span style={{ color: tier.featureStatus[i] ? 'var(--color-gray-dark)' : 'var(--color-gray-light)' }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Executive section */}
        <section className="px-6 py-20" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--color-navy)', color: 'white' }}>
              <Shield className="w-4 h-4" /> For Executives
            </div>
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>
              Always free for public company executives
            </h2>
            <p className="text-lg mb-10" style={{ color: 'var(--color-gray)' }}>
              Every feature, every category, every tool — no credit card, no trial, no expiry.
              Enlisted exists to serve the people running public companies.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mb-10">
              {EXEC_FEATURES.map(f => (
                <div key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-gray-dark)' }}>
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                  {f}
                </div>
              ))}
            </div>
            <Link
              href="/register/executive"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-white text-lg"
              style={{ backgroundColor: 'var(--color-navy)' }}
            >
              Register as an Executive <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs mt-3" style={{ color: 'var(--color-gray-light)' }}>
              First 500 executives receive a permanent Founding Executive badge.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--color-navy)' }}>
              Common questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'How does Enlisted verify executives?',
                  a: 'Executives register with their company ticker. We cross-reference SEDAR+ filings and exchange data to confirm they are officers or directors of a listed company. Verification is ongoing — if a company delists, access is reviewed.',
                },
                {
                  q: 'Can I cancel my provider subscription anytime?',
                  a: 'Yes. Monthly plans cancel at end of the current billing period. Annual plans cancel at end of the year — no prorated refunds, but you keep access through the paid period.',
                },
                {
                  q: 'What counts as an "email blast" on the Featured plan?',
                  a: 'Once per month, you can send a curated email to executives in your target categories and exchanges — filtered by sector, market cap, and exchange. We handle delivery through our verified executive list.',
                },
                {
                  q: 'What is an RFQ?',
                  a: 'A Request for Quote. Executives send structured requests describing a service need, budget, and timeline. Connected providers see RFQs after a 24-hour window; Featured providers see them instantly.',
                },
                {
                  q: 'Is pricing in CAD?',
                  a: 'Yes — all pricing is in Canadian dollars for the CA market. When we launch in Australia, UK, and US, local pricing in AUD, GBP, and USD will apply.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--color-navy)' }}>{q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 py-20 text-center" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-2xl mx-auto">
            <Star className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to get listed?</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Join the marketplace purpose-built for Canadian public companies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register/provider" className="font-bold px-8 py-4 rounded-xl text-[var(--color-navy)] text-lg" style={{ backgroundColor: 'var(--color-gold)' }}>
                List Your Firm
              </Link>
              <Link href="/register/executive" className="font-bold px-8 py-4 rounded-xl text-white text-lg border" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                Register as Executive
              </Link>
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
