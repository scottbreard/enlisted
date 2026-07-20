import Link from 'next/link'
import { Check, ArrowRight, Star } from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'

const TIERS = [
  {
    name: 'Free',
    badge: null,
    annual: 0,
    description: 'Your company name and service category appear in the directory. No contact details, no website — no cost.',
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
    annual: 1200,
    description: 'Full profile, direct contact details, logo, and full visibility to verified public company executives.',
    cta: 'Get Started',
    ctaHref: '/register/provider?plan=listed',
    highlight: true,
    features: [
      'Everything in Free',
      'Logo + website link',
      'Full contact details',
      '300-word company description',
      'Exchange badges (TSX, TSXV, etc.)',
      'Full profile visibility to executives',
      'Basic analytics dashboard',
    ],
    featureStatus: [true, true, true, true, true, true, true],
  },
  {
    name: 'Featured',
    badge: 'Only 5 per category',
    annual: 6000,
    description: 'Top placement, video, monthly newsletter feature, and homepage feature. Limited to 5 firms per category.',
    cta: 'Get Featured',
    ctaHref: '/register/provider?plan=featured',
    highlight: false,
    features: [
      'Everything in Listed',
      'Top of category placement',
      '750-word profile + case studies',
      'Team profiles + video embed',
      'Logo + website link in the monthly executive newsletter',
      'Homepage feature rotation',
    ],
    featureStatus: [true, true, true, true, true, true, true],
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <header className="nav-blur border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <EnlistedLogo size={28} />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--color-gray)' }}>
            <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
            <Link href="/about" className="hover:text-[var(--color-navy)] transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
            <Link href="/register/executive" className="text-sm font-bold px-4 py-2 rounded-lg text-white btn-glow" style={{ backgroundColor: 'var(--color-navy)' }}>
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
            <h1 className="text-5xl font-extrabold text-white mb-5 leading-tight anim-fade-up">
              Simple, transparent pricing
            </h1>
            <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.88)' }}>
              Reach verified public company executives across TSX, TSXV, CSE, and NEO.
              No commissions. No lead fees. One flat annual rate.
            </p>
          </div>

          {/* Guarantee + ROI */}
          <div className="max-w-5xl mx-auto mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-2xl p-5 flex items-start gap-3" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>No commissions. No lead fees.</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
                  One flat annual price. Every client you win through Enlisted is 100% yours.
                </p>
              </div>
            </div>
            <div className="bg-white border rounded-2xl p-5 flex items-start gap-3" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xl">📈</span>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>The math is simple</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
                  One engagement from one public company pays for Featured many times over. A conference booth costs more — and lasts three days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="px-6 pb-20 -mt-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="bg-white rounded-2xl overflow-hidden flex flex-col card-lift"
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
                    {tier.annual === 0 ? (
                      <div className="text-5xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Free</div>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-extrabold" style={{ color: 'var(--color-navy)' }}>
                          ${tier.annual.toLocaleString()}
                        </span>
                        <span className="text-sm mb-2" style={{ color: 'var(--color-gray)' }}>/yr CAD</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={tier.ctaHref}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm mb-8 btn-glow"
                    style={{
                      backgroundColor: tier.highlight ? 'var(--color-gold)' : 'var(--color-navy)',
                      color: 'white',
                    }}
                  >
                    {tier.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                  {tier.name === 'Featured' && (
                    <a href="https://calendly.com/scott-dirona/enlisted-introductory-call" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm mb-8 -mt-5 border"
                      style={{ borderColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>
                      Book a call with us first
                    </a>
                  )}

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

        {/* FAQ */}
        <section className="px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--color-navy)' }}>
              Common questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'How many executives are registered right now?',
                  a: 'Executives onboard from September 1, 2026 — providers launch first, deliberately, so the directory is complete on the day the first executive logs in. Our launch outreach covers 13,000+ executives and directors across every TSX, TSXV, CSE, and NEO issuer, and every registration is verified against exchange listings. We share real registration numbers with any provider who asks — email hello@enlisted.ca.',
                },
                {
                  q: 'What will keep executives logging in?',
                  a: 'Enlisted is a free working dashboard for the public-company side of their job, not a directory they visit once: a compliance calendar auto-generated from their exchange’s filing deadlines, a live stock dashboard and news feed for their ticker, a vault that tracks contracts and renewal dates, and RFQs when they need to hire. Each of those is a recurring reason to return — and every visit puts them in front of the directory. Featured providers also appear in the monthly newsletter sent to every verified executive.',
                },
                {
                  q: 'How does Enlisted verify executives?',
                  a: 'Executives register with their company ticker. We cross-reference SEDAR+ filings and exchange data to confirm they are officers or directors of a listed company. Verification is ongoing — if a company delists, access is reviewed.',
                },
                {
                  q: 'Can I cancel my provider subscription anytime?',
                  a: 'Yes. Subscriptions are annual and cancel at end of the year — no prorated refunds, but you keep access through the paid period.',
                },
                {
                  q: 'How does the newsletter feature work on the Featured plan?',
                  a: 'Enlisted sends a monthly newsletter to our verified executive list. Every Featured provider is included with their logo and a link to their website — recurring visibility in front of executives without separate promotional emails.',
                },
                {
                  q: 'What is an RFQ?',
                  a: 'A Request for Quote. Executives send structured requests describing a service need, budget, and timeline. RFQs are delivered exclusively to Featured providers.',
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
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.88)' }}>
              Join the marketplace purpose-built for Canadian public companies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register/provider" className="font-bold px-8 py-4 rounded-xl text-[var(--color-navy)] text-lg" style={{ backgroundColor: 'var(--color-gold)' }}>
                List Your Firm
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--color-gray-light)' }}>
          <span className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <EnlistedLogo size={16} />
            <span>© 2026 Enlisted.ca, a division of Stock Marketing Inc. All rights reserved.</span>
          </span>
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
