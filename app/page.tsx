import Link from 'next/link'
import Image from 'next/image'
import {
  TrendingUp, Users, FileText, Scale, BarChart2, Briefcase,
  Radio, Globe, Shield, Search, Calendar, Leaf,
  ArrowRight, CheckCircle, Star
} from 'lucide-react'
import HomeNav from '@/components/HomeNav'
import { getMarket } from '@/lib/market'
import { createClient } from '@/lib/supabase/server'

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

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user
  const directoryHref = isLoggedIn ? '/directory' : '/register/executive'

  const market = getMarket()
  const { exchanges, copy, comingSoon } = market
  return (
    <div className="flex flex-col min-h-screen">

      <HomeNav />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #0e2347 100%)' }} />

          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: copy */}
            <div>
              {/* Exchange pills */}
              <div className="flex flex-wrap items-center gap-2 mb-7">
                {exchanges.map(ex => (
                  <span
                    key={ex}
                    className="text-xs font-bold px-3 py-1 rounded-full border tracking-wider"
                    style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', backgroundColor: 'rgba(184,134,11,0.12)' }}
                  >
                    {ex}
                  </span>
                ))}
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5">
                Find the right firm.{' '}
                <span style={{ color: 'var(--color-gold)' }}>Run a better</span>{' '}
                public company.
              </h1>
              <p className="text-lg text-white mb-8 leading-relaxed max-w-xl">
                The independent directory of professional service providers for TSX, TSXV, CSE, and NEO executives. Compare IR firms, lawyers, auditors, market makers, and 90+ categories — then manage everything in one place. Free for executives. Always.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/register/executive"
                  className="font-bold px-7 py-3.5 rounded-xl text-base transition-all inline-flex items-center gap-2 hover:brightness-110"
                  style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
                >
                  Register Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={directoryHref}
                  className="font-semibold px-7 py-3.5 rounded-xl text-base transition-all border text-white hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                  Browse Providers
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
                {[
                  { value: '92', label: 'Service categories' },
                  { value: '4', label: 'Canadian exchanges' },
                  { value: '500', label: 'Founding Member spots' },
                  { value: '$0', label: 'For executives' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-extrabold" style={{ color: 'var(--color-gold)' }}>{s.value}</p>
                    <p className="text-xs text-white/45 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: mock dashboard preview */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                {/* Dashboard header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Good morning</p>
                    <p className="text-sm font-bold text-white">Sarah Chen — CFO</p>
                    <p className="text-xs text-white/40">Aurex Mining Corp · {copy.heroMockTicker}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'rgba(184,134,11,0.2)', color: 'var(--color-gold)' }}>
                    <Star className="w-3 h-3 fill-current" /> Founding Member #12
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-px p-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {[
                    { label: 'Providers', value: '247' },
                    { label: 'Vault', value: '5' },
                    { label: 'Open RFQs', value: '2' },
                  ].map(s => (
                    <div key={s.label} className="text-center py-4" style={{ backgroundColor: 'rgba(14,35,71,0.6)' }}>
                      <p className="text-xl font-extrabold text-white">{s.value}</p>
                      <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Compliance deadlines */}
                <div className="px-5 py-4 border-b border-white/10">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Upcoming Deadlines</p>
                  <div className="space-y-2.5">
                    {[
                      { title: 'Q1 Interim Financials', days: '18d', color: '#f59e0b' },
                      { title: 'Annual Financials (AIF)', days: '47d', color: '#10b981' },
                      { title: 'AGM Notice & Proxy', days: '63d', color: '#10b981' },
                    ].map(item => (
                      <div key={item.title} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <p className="text-xs text-white/70 flex-1">{item.title}</p>
                        <p className="text-xs font-bold" style={{ color: item.color }}>{item.days}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category quick links */}
                <div className="px-5 py-4">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Top Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'IR Firms', count: 34 },
                      { name: 'Securities Law', count: 18 },
                      { name: 'Market Makers', count: 12 },
                      { name: 'Auditors', count: 27 },
                    ].map(cat => (
                      <div key={cat.name} className="rounded-xl px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-xs text-white/70">{cat.name}</p>
                        <p className="text-xs font-bold text-white">{cat.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-white/25 mt-3">Dashboard preview — your data, live</p>
            </div>
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="py-6 px-6 bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold" style={{ color: 'var(--color-gray)' }}>
            {[
              'Every listing vetted before going live',
              'Free for executives. Always.',
              'Built for TSX · TSXV · CSE · NEO',
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span style={{ color: 'var(--color-gold)' }}>✓</span> {item}
              </span>
            ))}
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
                {copy.executiveFreeNote}
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
              Reach Canadian Public Company Executives.
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {copy.providerCTA}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register/provider"
                className="font-bold px-8 py-4 rounded-xl text-lg transition-colors"
                style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
              >
                List Your Firm
              </Link>
              <Link
                href={directoryHref}
                className="font-semibold px-8 py-4 rounded-xl text-lg text-white border transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                Browse the Directory
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#0e2347' }} className="text-white/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-white font-extrabold text-lg">
            Enlisted.ca
          </span>
          <span>© 2026 Enlisted.ca, a division of Stock Marketing Inc. All rights reserved.</span>
          <span className="flex flex-wrap gap-4">
            <Link href="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
