import Link from 'next/link'
import { ArrowRight, Shield, Users, TrendingUp } from 'lucide-react'
import HomeNav from '@/components/HomeNav'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Enlisted.ca — The Marketplace for Canadian Public Company Services',
  description: 'Enlisted.ca is built for the executives running Canada\'s public companies. A division of Stock Marketing Inc., we\'re the independent marketplace connecting listed company executives with every professional service they need.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>
      <HomeNav />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden text-white py-20 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #0e2347 100%)' }} />
          <div className="relative max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>
              About Enlisted.ca
            </p>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Built for the people running Canada's public companies.
            </h1>
            <p className="text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
              Finding the right IR firm, securities lawyer, or transfer agent shouldn't take weeks of cold calls and conflicted referrals. We built the platform we wished existed.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>Our Mission</p>
                <h2 className="text-3xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--color-navy)' }}>
                  Give every public company executive independent access to the best service providers in Canada.
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-gray)' }}>
                  Canada has over 3,000 publicly listed companies. Their CEOs, CFOs, COOs, and IROs need lawyers, auditors, IR firms, market makers, transfer agents, and dozens of other specialists — yet there has never been a single, independent place to find, compare, and connect with them.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--color-gray)' }}>
                  Enlisted.ca changes that. We are the global marketplace for public company services, starting with Canada.
                </p>
              </div>
              <div className="space-y-5">
                {[
                  {
                    icon: Shield,
                    title: 'Vetted',
                    desc: 'Every service provider is reviewed before going live. No spam, no shell companies, no misleading claims.',
                  },
                  {
                    icon: Users,
                    title: 'Free for executives. Always.',
                    desc: 'We are funded entirely by service providers who pay to be listed. Executives never pay — not now, not ever.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Built for Canadian public markets',
                    desc: 'TSX, TSXV, CSE, and NEO. Canadian compliance rules, Canadian exchanges, Canadian service providers.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#f8f9fc' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ color: 'var(--color-navy)' }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why executives use Enlisted */}
        <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>For Executives</p>
              <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>
                Why public company executives use Enlisted
              </h2>
              <p className="text-lg" style={{ color: 'var(--color-gray)' }}>
                Running a public company means managing relationships with dozens of service providers simultaneously — often without any central system to track them.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  number: '01',
                  title: 'Find providers faster',
                  desc: 'Stop relying on word-of-mouth referrals from advisors who may have conflicts. Search 90+ categories, filter by exchange, and compare firms side by side.',
                },
                {
                  number: '02',
                  title: 'Stay on top of compliance',
                  desc: 'Your compliance calendar is auto-generated based on your exchange and fiscal year end. NI 51-102 deadlines, AGM dates, and filing windows — all tracked.',
                },
                {
                  number: '03',
                  title: 'Manage your providers',
                  desc: 'Store contracts, contacts, and notes in your private vault. Know exactly who you work with, when contracts expire, and who to call in a crisis.',
                },
                {
                  number: '04',
                  title: 'Request proposals quickly',
                  desc: 'Send a Request for Quote to multiple providers at once. Let them compete for your business on your terms and timeline.',
                },
                {
                  number: '05',
                  title: 'AI assistant for public markets',
                  desc: 'Ask anything about Canadian securities law, exchange rules, disclosure requirements, or IR best practices. Trained on Canadian public market knowledge.',
                },
                {
                  number: '06',
                  title: 'Always free',
                  desc: 'Enlisted is free for every executive at a TSX, TSXV, CSE, or NEO listed company. No trial. No credit card. No catch.',
                },
              ].map(({ number, title, desc }) => (
                <div key={number} className="bg-white rounded-2xl p-6 border" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-3xl font-extrabold mb-3" style={{ color: 'var(--color-gold)' }}>{number}</p>
                  <p className="font-bold mb-2" style={{ color: 'var(--color-navy)' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-gold)' }}>The Company</p>
                <h2 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>
                  A division of Stock Marketing Inc.
                </h2>
                <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--color-gray)' }}>
                  Enlisted.ca is a division of <strong style={{ color: 'var(--color-navy)' }}>Stock Marketing Inc.</strong>, a Canadian company with deep roots in public markets. We have spent years working alongside the executives, IR professionals, and service providers who make Canadian capital markets function.
                </p>
                <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--color-gray)' }}>
                  That experience made one thing clear: the people doing the hardest work — the CFOs, IROs, and corporate secretaries of small and mid-cap public companies — had no independent, comprehensive resource for finding and managing their professional service relationships.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--color-gray)' }}>
                  We built Enlisted.ca to fix that. Canada is Phase 1. Australia, the UK, and the US follow.
                </p>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl p-6 border-2" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)' }}>
                  <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>Our Purpose</p>
                  <p className="text-xl font-bold leading-snug" style={{ color: 'var(--color-navy)' }}>
                    "To give every public company executive — regardless of company size or market cap — independent, unbiased access to the best professional services in their market."
                  </p>
                </div>
                <div className="rounded-2xl p-6 border" style={{ backgroundColor: '#f8f9fc', borderColor: 'var(--color-border)' }}>
                  <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-gray)' }}>Enlisted.ca by the numbers</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: '3,000+', label: 'Canadian public companies' },
                      { value: '92', label: 'Service categories' },
                      { value: '4', label: 'Canadian exchanges' },
                      { value: '$0', label: 'Cost to executives' },
                    ].map(({ value, label }) => (
                      <div key={label}>
                        <p className="text-2xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{value}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-5 border" style={{ backgroundColor: '#f8f9fc', borderColor: 'var(--color-border)' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-navy)' }}>Questions or partnership inquiries?</p>
                  <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
                    Reach us at{' '}
                    <a href="mailto:hello@enlisted.ca" style={{ color: 'var(--color-blue)' }}>hello@enlisted.ca</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Enlisted is free for public company executives. Register in under 2 minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register/executive"
                className="font-bold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
                style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>
                Register as an Executive <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/directory"
                className="font-semibold px-8 py-4 rounded-xl text-lg text-white border"
                style={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                Browse Providers
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer style={{ backgroundColor: '#0e2347' }} className="text-white/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-white font-extrabold text-lg">Enlisted.ca</span>
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
