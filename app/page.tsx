import Link from 'next/link'
import Image from 'next/image'
import {
  TrendingUp, Users, FileText, Scale, BarChart2, Briefcase,
  Radio, Globe, Shield, Search, Calendar, Leaf,
  ArrowRight, CheckCircle, Star, Building2
} from 'lucide-react'

const categories = [
  { label: 'IR Firms', slug: 'ir_firm', icon: TrendingUp },
  { label: 'Market Makers', slug: 'market_maker', icon: BarChart2 },
  { label: 'Transfer Agents', slug: 'transfer_agent', icon: Users },
  { label: 'Securities Law', slug: 'securities_law', icon: Scale },
  { label: 'Auditors & Accounting', slug: 'auditor_accounting', icon: FileText },
  { label: 'Outsourced CFO', slug: 'outsourced_cfo', icon: Briefcase },
  { label: 'PR & Communications', slug: 'pr_communications', icon: Radio },
  { label: 'IR Website & Digital', slug: 'ir_website', icon: Globe },
  { label: 'Compliance', slug: 'compliance_consultant', icon: Shield },
  { label: 'Research Analysts', slug: 'research_analyst', icon: Search },
  { label: 'Investor Events', slug: 'investor_events', icon: Calendar },
  { label: 'ESG & Governance', slug: 'esg_governance', icon: Leaf },
]

const exchanges = ['TSX', 'TSXV', 'CSE', 'NEO']

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Nav ── */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[var(--color-navy)]" />
            <span className="text-xl font-extrabold text-[var(--color-navy)] tracking-tight">
              Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-gold)' }}>ca</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-gray)]">
            <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
            <Link href="/pricing" className="hover:text-[var(--color-navy)] transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-[var(--color-navy)] transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-[var(--color-navy)] hover:underline">
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
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
          <Image
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2070&q=80"
            alt="Stock market"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B3A6B 60%, #122850 100%)' }} />

          <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36">
            {/* Exchange pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {exchanges.map(ex => (
                <span
                  key={ex}
                  className="text-xs font-bold px-3 py-1 rounded-full border tracking-wider"
                  style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', backgroundColor: 'rgba(184,134,11,0.1)' }}
                >
                  {ex}
                </span>
              ))}
              <span className="text-xs text-white/40 ml-1">+ ASX · LSE · NYSE coming soon</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-3xl">
              Every service your{' '}
              <span style={{ color: 'var(--color-gold)' }}>public company</span>{' '}
              needs.
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
              The independent marketplace connecting Canadian public company executives with IR firms, market makers, legal counsel, and 90+ specialist categories. Free for executives. Always.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register/executive"
                className="font-bold px-8 py-4 rounded-xl text-lg transition-colors inline-flex items-center gap-2 text-[var(--color-navy)]"
                style={{ backgroundColor: 'var(--color-gold)' }}
              >
                Register Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/directory"
                className="font-semibold px-8 py-4 rounded-xl text-lg transition-colors border text-white"
                style={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                Browse Providers
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10">
              {[
                { value: '500+', label: 'Founding Member spots' },
                { value: '92', label: 'Service categories' },
                { value: '4', label: 'Canadian exchanges' },
                { value: 'Free', label: 'For executives, always' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-extrabold" style={{ color: 'var(--color-gold)' }}>{s.value}</p>
                  <p className="text-sm text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Category grid ── */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
                92 Categories · 15 Groups
              </p>
              <h2 className="text-4xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>
                Browse by category
              </h2>
              <p className="text-[var(--color-gray)] text-lg">Every function a public company needs, in one place.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.slug}
                    href={`/directory?category=${cat.slug}`}
                    className="group border rounded-2xl p-5 transition-all hover:shadow-lg flex flex-col gap-3"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: 'var(--color-blue-light)', color: 'var(--color-navy)' }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold leading-tight transition-colors group-hover:text-[var(--color-navy)]" style={{ color: 'var(--color-gray-dark)' }}>
                      {cat.label}
                    </span>
                  </Link>
                )
              })}
            </div>
            <div className="text-center mt-8">
              <Link href="/directory" className="font-semibold hover:underline text-sm" style={{ color: 'var(--color-blue)' }}>
                View all 92 categories →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Executive value prop ── */}
        <section className="py-24 px-6" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80"
                alt="Business professionals"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--color-navy)' }}>Free for executives</p>
                  <p className="text-xs" style={{ color: 'var(--color-gray)' }}>Full access, always</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>
                For CEOs, CFOs & IROs
              </p>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--color-navy)' }}>
                Built for the people running public companies.
              </h2>
              <p className="leading-relaxed mb-8 text-lg" style={{ color: 'var(--color-gray)' }}>
                Enlisted is free for every executive at a TSX, TSXV, CSE, or NEO company. Search, compare, and connect with vetted service providers — plus manage your contracts, track compliance deadlines, and monitor your stock.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Service provider directory with 90+ categories',
                  'Compliance calendar auto-generated for your exchange',
                  'Private vault to manage your provider relationships',
                  'AI assistant trained on Canadian public markets',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-gold)' }} />
                    <span className="font-medium" style={{ color: 'var(--color-gray-dark)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register/executive"
                className="font-semibold px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2 text-white"
                style={{ backgroundColor: 'var(--color-navy)' }}
              >
                Register as an Executive — Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Founding Member banner ── */}
        <section className="py-10 px-6" style={{ backgroundColor: 'var(--color-gold-light)', borderTop: '1px solid #e8d5a0', borderBottom: '1px solid #e8d5a0' }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-gold)' }}>Limited Offer</p>
              <h3 className="text-2xl font-extrabold" style={{ color: 'var(--color-navy)' }}>
                Founding Member spots — only 500 available
              </h3>
              <p className="mt-1" style={{ color: 'var(--color-gray)' }}>
                The first 500 executives to register receive permanent Founding Member status and exclusive benefits.
              </p>
            </div>
            <Link
              href="/register/executive"
              className="shrink-0 font-bold px-8 py-4 rounded-xl text-white transition-colors whitespace-nowrap"
              style={{ backgroundColor: 'var(--color-navy)' }}
            >
              Claim Your Spot
            </Link>
          </div>
        </section>

        {/* ── Provider CTA ── */}
        <section className="relative overflow-hidden py-24 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80"
            alt="Toronto skyline"
            fill
            className="object-cover opacity-10"
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>
              For Service Providers
            </p>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Reach every public company executive in Canada.
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Get your firm in front of the CEOs, CFOs, and IR officers of every TSX, TSXV, CSE, and NEO company. Founding Partner pricing available now — 20% off year one.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register/provider"
                className="font-bold px-8 py-4 rounded-xl text-lg transition-colors"
                style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
              >
                Get Listed from $499/yr
              </Link>
              <Link
                href="/pricing"
                className="font-semibold px-8 py-4 rounded-xl text-lg text-white border transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                See All Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#0e2347' }} className="text-white/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-white font-extrabold text-lg">
            Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-gold)' }}>ca</span>
          </span>
          <span>© 2026 Enlisted Inc. All rights reserved.</span>
          <span>enlisted.ca · enlisted.au · enlisted.co.uk · enlisted.us</span>
        </div>
      </footer>
    </div>
  )
}
