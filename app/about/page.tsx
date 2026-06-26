import Link from 'next/link'
import { Building2, ArrowRight, Users, Briefcase, Globe, Shield, TrendingUp, CheckCircle } from 'lucide-react'

const HOW_IT_WORKS_EXEC = [
  { step: '1', title: 'Register free', body: 'Sign up with your company name and ticker. We verify you against SEDAR+ to confirm your listed status.' },
  { step: '2', title: 'Set your profile', body: 'Add your exchange, fiscal year end, and sector. Your compliance calendar auto-generates instantly.' },
  { step: '3', title: 'Browse the directory', body: 'Search 106 service categories. Filter by exchange coverage, location, and tier.' },
  { step: '4', title: 'Send RFQs', body: 'Request quotes directly from Connected and Featured providers. Track responses in your dashboard.' },
]

const HOW_IT_WORKS_PROVIDER = [
  { step: '1', title: 'Create your listing', body: 'Register your firm, pick your service categories, and choose a plan. Listed is free forever.' },
  { step: '2', title: 'Build your profile', body: 'Add your description, team, case studies, and exchange coverage. Tier determines what\'s visible.' },
  { step: '3', title: 'Get found', body: 'Verified executives browse the directory daily. Featured providers appear at the top of every category page.' },
  { step: '4', title: 'Receive RFQs', body: 'Connected providers receive inbound quote requests with a 24-hour head start. Featured providers see them instantly.' },
]

const MARKETS = [
  { flag: '🇨🇦', name: 'Canada', exchanges: 'TSX · TSXV · CSE · NEO', status: 'Launching Q3 2026', live: true },
  { flag: '🇦🇺', name: 'Australia', exchanges: 'ASX · NSX', status: 'Q4 2026', live: false },
  { flag: '🇬🇧', name: 'United Kingdom', exchanges: 'LSE · AIM', status: 'Q1 2027', live: false },
  { flag: '🇺🇸', name: 'United States', exchanges: 'NYSE · Nasdaq · OTC', status: 'Q3 2027', live: false },
]

const VALUES = [
  { icon: Shield, title: 'Independent', body: 'Enlisted has no commercial relationships with any service provider beyond the listing fee. Our rankings are based on tier and profile completeness — not kickbacks.' },
  { icon: Users, title: 'Executive-first', body: 'Every product decision starts with the executive. The platform is free for them because their attention is the asset. We never sell or share their data with providers.' },
  { icon: Globe, title: 'Built for public markets', body: 'We understand NI 51-102, continuous disclosure, AGM timelines, and what an IRO actually needs. This is not a generic B2B directory.' },
  { icon: TrendingUp, title: 'Transparent pricing', body: 'Flat monthly rates. No commissions on deals closed, no lead fees, no success fees. What you see on the pricing page is what you pay.' },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-6 h-6" style={{ color: 'var(--color-navy)' }} />
            <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-navy)' }}>
              Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-gold)' }}>ca</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--color-gray)' }}>
            <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
            <Link href="/pricing" className="hover:text-[var(--color-navy)] transition-colors">Pricing</Link>
            <Link href="/about" className="font-bold" style={{ color: 'var(--color-navy)' }}>About</Link>
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
        <section className="py-24 px-6 text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--color-gold)' }}>
              About Enlisted
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              The marketplace public company executives have always needed.
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Enlisted Inc. is an independent, AI-powered platform connecting the executives of publicly listed companies
              with every professional service provider they need — from IR firms and market makers to securities lawyers,
              transfer agents, auditors, and 90 other specialist categories.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold mb-5" style={{ color: 'var(--color-navy)' }}>
                Why Enlisted exists
              </h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--color-gray)' }}>
                <p>
                  Running a public company is operationally complex. A CEO of a TSXV mining junior needs a transfer agent,
                  a securities lawyer, a market maker, an IR firm, a news wire, and an auditor — and they need to find all
                  of them without a reliable, independent source.
                </p>
                <p>
                  Word of mouth, LinkedIn cold calls, and conference hallways have been the only way to find service
                  providers for decades. Enlisted changes that.
                </p>
                <p>
                  We built the directory that public company executives deserved — organized by service category,
                  verified by exchange, and free to access. Service providers pay a flat subscription to appear with
                  full contact details and receive inbound RFQs.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                '4,000+ public companies listed on TSX, TSXV, CSE, and NEO',
                '92 professional service categories purpose-built for capital markets',
                'AI compliance calendar auto-generated from NI 51-102',
                'Executives verified against SEDAR+ data',
                'Flat pricing — no commissions, no lead fees',
              ].map(f => (
                <div key={f} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--color-blue)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-navy)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — Executives */}
        <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--color-navy)', color: 'white' }}>
                <Users className="w-4 h-4" /> For Executives
              </div>
              <h2 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>How it works — free forever</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {HOW_IT_WORKS_EXEC.map(({ step, title, body }) => (
                <div key={step} className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white mb-4" style={{ backgroundColor: 'var(--color-navy)' }}>
                    {step}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--color-navy)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>{body}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/register/executive" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
                Register as an Executive <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it works — Providers */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--color-gold)', color: 'white' }}>
                <Briefcase className="w-4 h-4" /> For Service Providers
              </div>
              <h2 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>How it works — pay to be found</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {HOW_IT_WORKS_PROVIDER.map(({ step, title, body }) => (
                <div key={step} className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white mb-4" style={{ backgroundColor: 'var(--color-gold)' }}>
                    {step}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--color-navy)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>{body}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/pricing" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-white" style={{ backgroundColor: 'var(--color-gold)' }}>
                View Pricing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-gold-light)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--color-navy)' }}>
              How we operate
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {VALUES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--color-navy)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Markets roadmap */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--color-navy)' }}>
              Global expansion roadmap
            </h2>
            <p className="text-center text-base mb-12" style={{ color: 'var(--color-gray)' }}>
              Launching in Canada first, then expanding to every major public market.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {MARKETS.map(({ flag, name, exchanges, status, live }) => (
                <div
                  key={name}
                  className="flex items-center gap-4 p-5 rounded-2xl"
                  style={{
                    border: live ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                    backgroundColor: live ? 'var(--color-gold-light)' : 'white',
                  }}
                >
                  <span className="text-3xl">{flag}</span>
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: 'var(--color-navy)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{exchanges}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: live ? 'var(--color-gold)' : '#f3f4f6',
                      color: live ? 'white' : 'var(--color-gray)',
                    }}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-extrabold text-white" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              SB
            </div>
            <blockquote className="text-2xl font-bold text-white leading-relaxed mb-6">
              &ldquo;I built Enlisted because I spent years helping public companies find service providers
              and watched them rely entirely on who they happened to meet at a conference.
              The executives running TSX and TSXV companies deserved something better.&rdquo;
            </blockquote>
            <p className="font-bold" style={{ color: 'var(--color-gold)' }}>Scott Breard</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Founder, Enlisted Inc.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>
              Join Enlisted today
            </h2>
            <p className="text-lg mb-10" style={{ color: 'var(--color-gray)' }}>
              Free for executives. Simple flat pricing for service providers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register/executive" className="font-bold px-8 py-4 rounded-xl text-white text-lg inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-navy)' }}>
                Register as Executive <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="font-bold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 border" style={{ borderColor: 'var(--color-navy)', color: 'var(--color-navy)' }}>
                View Provider Pricing
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--color-gray-light)' }}>
          <span>© 2026 Enlisted Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/directory" className="hover:text-[var(--color-navy)] transition-colors">Directory</Link>
            <Link href="/pricing" className="hover:text-[var(--color-navy)] transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-[var(--color-navy)] transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
