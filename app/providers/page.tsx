import Link from 'next/link'
import { Check, ArrowRight, Users, Inbox, BarChart2, Mail, Star, Zap, CalendarClock, LineChart, FolderLock } from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    badge: null,
    highlight: false,
    description: 'Your firm appears in the directory by name and category. No contact details or website shown.',
    cta: 'Create Free Listing',
    features: ['Name in directory', 'Service category listed', 'City shown', 'Searchable by executives'],
    missing: ['Logo or website', 'Contact details', 'RFQ access', 'Analytics'],
  },
  {
    name: 'Listed',
    price: '$1,200/yr',
    badge: 'Most Popular',
    highlight: true,
    description: 'Full profile, direct contact details, logo, and full visibility to verified public company executives.',
    cta: 'Get Listed',
    features: ['Logo + website link', 'Full contact details', '300-word description', 'Exchange badges', 'Analytics dashboard'],
    missing: [],
  },
  {
    name: 'Featured',
    price: '$6,000/yr',
    badge: 'Only 5 per category',
    highlight: false,
    description: 'Top placement in your category, monthly newsletter feature, video profile, and AI Assistant. Limited to 5 firms per category.',
    cta: 'Get Featured',
    features: ['Top of category placement', '750-word profile + case studies', 'Team profiles + video embed', 'Logo + website link in the monthly executive newsletter', 'AI Assistant trained on public markets', 'Homepage feature rotation'],
    missing: [],
  },
]

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Register and build your profile',
    body: 'Create your listing in minutes. Add your logo, description, service categories, and the exchanges you serve. Every provider is reviewed by Enlisted before going live.',
  },
  {
    num: '02',
    title: 'Executives find you when they need you',
    body: 'When a CFO, CEO, or IRO searches for your service category, your firm appears in front of them — not buried in a Google search or dependent on who called last.',
  },
  {
    num: '03',
    title: 'Receive RFQs and respond directly',
    body: 'Executives send structured Requests for Quote directly through the platform. You respond, they choose. No middlemen, no lead fees, no commissions.',
  },
]

const CATEGORIES = [
  'Securities Law', 'IR Firms', 'Audit & Assurance', 'Market Making', 'Transfer Agents',
  'CFO Services', 'Corporate Finance', 'M&A Advisory', 'Capital Raising', 'ESG Advisory',
  'D&O Insurance', 'Board Recruitment', 'Financial PR', 'EDGAR / SEDAR Filing',
  'Corporate Secretary', 'Annual Report Design', 'Proxy Advisory', 'Stock Surveillance',
  'Shareholder Analytics',
]

export default function ProvidersPage() {
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
            <Link href="/register/provider"
              className="text-sm font-bold px-4 py-2 rounded-lg text-white btn-glow"
              style={{ backgroundColor: 'var(--color-gold)' }}>
              List Your Firm
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="py-24 px-6 text-center" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase anim-fade-up"
              style={{ backgroundColor: 'rgba(212,160,23,0.15)', color: 'var(--color-gold)', border: '1px solid rgba(212,160,23,0.3)' }}>
              For Service Providers
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight anim-fade-up anim-d-1">
              Get in front of the executives<br />
              <span className="text-gold-sheen">running Canada's public companies.</span>
            </h1>
            <p className="text-xl mb-10 leading-relaxed anim-fade-up anim-d-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Enlisted is the only platform where TSX, TSXV, CSE, and NEO executives
              go to find and hire professional service providers. No cold calls. No trade shows.
              No referral luck.
            </p>
            <div className="flex flex-wrap justify-center gap-4 anim-fade-up anim-d-3">
              <Link href="/register/provider"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base btn-glow btn-glow-gold"
                style={{ backgroundColor: 'var(--color-gold)', color: 'white' }}>
                List Your Firm Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base border btn-glow"
                style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}>
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FAFBFD' }}>
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '92', label: 'Service categories' },
              { num: '4', label: 'Canadian exchanges at launch' },
              { num: '13,000+', label: 'Executives & directors in our launch outreach' },
              { num: '$0', label: 'Commission on any deal' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--color-navy)' }}>{num}</div>
                <div className="text-sm" style={{ color: 'var(--color-gray)' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Problem */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>The problem</p>
              <h2 className="text-4xl font-extrabold mb-5 tracking-tight" style={{ color: 'var(--color-navy)' }}>
                Reaching public company executives<br />is harder than it should be.
              </h2>
              <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-gray)' }}>
                Cold outreach gets ignored. Conference booths are expensive. Word of mouth is slow.
                And generic business directories don't filter for listed companies.
                You need a better channel — one where the audience is already looking.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  title: 'A verified, exclusive audience',
                  body: "Every executive on Enlisted is verified against their company's exchange listing. You're not reaching anyone — you're reaching the CEOs, CFOs, and IROs of Canadian public companies.",
                },
                {
                  icon: Inbox,
                  title: 'Inbound, not outbound',
                  body: 'Executives search for your service category when they have a real need. You receive a structured RFQ with budget, timeline, and context — not a cold lead. No chasing required.',
                },
                {
                  icon: BarChart2,
                  title: 'Built for your sector',
                  body: 'Enlisted is purpose-built for the public company ecosystem. Every provider category, every exchange badge, every compliance context is designed specifically for this market.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-navy)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>How it works</p>
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-navy)' }}>
                From listing to new client in three steps.
              </h2>
            </div>
            <div className="space-y-8">
              {HOW_IT_WORKS.map(({ num, title, body }) => (
                <div key={num} className="flex gap-8 items-start">
                  <div className="text-5xl font-extrabold shrink-0 leading-none" style={{ color: 'var(--color-gold)', opacity: 0.4 }}>{num}</div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-navy)' }}>{title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--color-gray)' }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The two questions every provider asks */}
        <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>Straight answers</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">
                The two questions every provider asks us.
              </h2>
              <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                You're evaluating an advertising spend, so you deserve real answers — not marketplace hand-waving.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Q1 — how many executives */}
              <div className="rounded-2xl p-8" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}>
                <h3 className="text-xl font-bold text-white mb-3">&ldquo;How many executives are on Enlisted?&rdquo;</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Executives onboard from <strong className="text-white">September 1, 2026</strong> — and that's deliberate.
                  We fill the directory first, because the first CFO who logs in needs to find
                  every service she'll ever need already here. That's you.
                </p>
                <ul className="space-y-3 mb-5">
                  {[
                    <>Our launch outreach covers <strong className="text-white">13,000+ executives and directors</strong> across TSX, TSXV, CSE, and NEO issuers. Every public company is on the public record — we know exactly who the audience is, and we contact them directly.</>,
                    <>Every registration is <strong className="text-white">verified against exchange listings</strong>. Officers and directors of listed companies only — no students, no consultants, no tire-kickers.</>,
                    <><strong className="text-white">700+ firms</strong> are already in the directory ahead of the executive launch.</>,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--color-gold)' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  We publish real numbers, not vanity metrics. Email{' '}
                  <a href="mailto:hello@enlisted.ca" className="underline" style={{ color: 'var(--color-gold)' }}>hello@enlisted.ca</a>{' '}
                  any time and we'll tell you exactly how executive registration is tracking.
                </p>
              </div>

              {/* Q2 — what keeps them coming back */}
              <div className="rounded-2xl p-8" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}>
                <h3 className="text-xl font-bold text-white mb-3">&ldquo;What keeps executives coming back?&rdquo;</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Enlisted isn't a phone book executives visit once. It's a free working dashboard
                  for the public-company side of their job — and every visit puts them in front of your listing.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: CalendarClock, title: 'Compliance calendar', body: 'Filing deadlines auto-generated from their exchange. Missing one means a press release — they check it monthly at minimum.' },
                    { icon: LineChart, title: 'Stock dashboard + news feed', body: 'Their ticker, live price, and market news — a reason to log in every trading day.' },
                    { icon: FolderLock, title: 'Provider vault', body: 'Every contract and renewal date in one place. When a renewal comes up, they\'re shopping — in your category.' },
                    { icon: Mail, title: 'Monthly executive newsletter', body: 'Sent to every verified executive, with every Featured provider\'s logo and link in every issue.' },
                  ].map(({ icon: Icon, title, body }) => (
                    <li key={title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(212,160,23,0.15)' }}>
                        <Icon className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-center text-base font-semibold mt-10" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Providers who list before September 1 are in the directory the day the first executive logs in.
            </p>
          </div>
        </section>

        {/* What executives see — free vs Featured */}
        <section className="py-20 px-6" style={{ backgroundColor: '#FAFBFD' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>What executives see</p>
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight" style={{ color: 'var(--color-navy)' }}>
                Your listing, free vs. Featured.
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-gray)' }}>
                This is exactly how your firm appears in the directory at each tier.
              </p>
            </div>

            <div className="space-y-5">
              {/* Free mock */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-gray-light)' }}>Free listing</p>
                <div className="bg-white border rounded-2xl p-6 flex items-start gap-4" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-extrabold" style={{ backgroundColor: '#e5e7eb', color: 'var(--color-gray)' }}>Y</div>
                  <div>
                    <h3 className="font-extrabold text-lg" style={{ color: 'var(--color-navy)' }}>Your Firm Inc.</h3>
                    <p className="text-xs italic mt-1" style={{ color: 'var(--color-gray-light)' }}>Toronto, ON · Contact details available on paid listings</p>
                  </div>
                </div>
              </div>

              {/* Featured mock */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-gold)' }}>Featured listing — top of category</p>
                <div className="bg-white border-2 rounded-2xl p-6 flex items-start gap-4 shadow-lg" style={{ borderColor: 'var(--color-gold)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-extrabold text-white" style={{ backgroundColor: 'var(--color-navy)' }}>Y</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-extrabold text-lg" style={{ color: 'var(--color-navy)' }}>Your Firm Inc.</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>✓ Verified</span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-gray)' }}>Your tagline, in front of every executive who searches your category.</p>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-gray)' }}>A full 750-word profile, team page, case studies, and video — with your logo, exchange badges, and direct contact details shown to verified executives.</p>
                    <div className="flex items-center gap-4 flex-wrap text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>
                      <span>Website</span><span>Email</span><span>(416) 555-0123</span>
                      <span className="px-2 py-0.5 rounded-lg font-bold" style={{ backgroundColor: '#f3f4f6', color: 'var(--color-gray)' }}>TSX</span>
                      <span className="px-2 py-0.5 rounded-lg font-bold" style={{ backgroundColor: '#f3f4f6', color: 'var(--color-gray)' }}>TSXV</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold px-4 py-2 rounded-xl text-white" style={{ backgroundColor: 'var(--color-navy)' }}>View Profile</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>Pricing</p>
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight" style={{ color: 'var(--color-navy)' }}>
                Start free. Upgrade when you're ready.
              </h2>
              <p className="text-lg" style={{ color: 'var(--color-gray)' }}>
                No commissions. No lead fees. One flat annual rate.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {TIERS.map((tier) => (
                <div key={tier.name}
                  className="rounded-2xl overflow-hidden flex flex-col bg-white"
                  style={{
                    border: tier.highlight ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                    boxShadow: tier.highlight ? '0 8px 40px rgba(212,160,23,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                  }}>
                  <div className="h-8 flex items-center justify-center text-xs font-extrabold tracking-widest uppercase"
                    style={{
                      backgroundColor: tier.highlight ? 'var(--color-gold)' : tier.badge ? 'var(--color-navy)' : 'transparent',
                      color: tier.badge ? 'white' : 'transparent',
                    }}>
                    {tier.badge ?? ''}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold mb-1" style={{ color: 'var(--color-navy)' }}>{tier.name}</h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-gray)' }}>{tier.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{tier.price}</span>
                    </div>
                    <Link href={tier.name === 'Free' ? '/register/provider' : `/register/provider?plan=${tier.name.toLowerCase()}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm mt-5 mb-7 btn-glow"
                      style={{
                        backgroundColor: tier.highlight ? 'var(--color-gold)' : 'var(--color-navy)',
                        color: 'white',
                      }}>
                      {tier.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                    {tier.name === 'Featured' && (
                      <a href="https://calendly.com/scott-dirona/enlisted-introductory-call" target="_blank" rel="noopener noreferrer"
                        className="block text-center text-sm font-semibold py-2.5 rounded-xl border mb-7 -mt-5"
                        style={{ borderColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>
                        Book a call with the founder first
                      </a>
                    )}
                    <ul className="space-y-2.5 flex-1">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                          <span style={{ color: 'var(--color-gray-dark)' }}>{f}</span>
                        </li>
                      ))}
                      {tier.missing.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--color-border)' }} />
                          <span style={{ color: 'var(--color-gray-light)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm" style={{ color: 'var(--color-gray-light)' }}>
              All prices in CAD. Annual subscription — cancels at year end.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-6 border-t" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FAFBFD' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>Service categories</p>
            <h2 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--color-navy)' }}>92 service categories</h2>
            <div className="flex flex-wrap justify-center gap-2.5 mb-6">
              {CATEGORIES.map(c => (
                <span key={c} className="text-sm px-3.5 py-1.5 rounded-full border font-medium"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)', backgroundColor: 'white' }}>
                  {c}
                </span>
              ))}
              <span className="text-sm px-3.5 py-1.5 rounded-full font-bold"
                style={{ backgroundColor: 'var(--color-blue-light)', color: 'var(--color-navy)' }}>
                + 73 more
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-gray-light)' }}>
              Don't see your category? <Link href="/contact" className="underline" style={{ color: 'var(--color-blue)' }}>Contact us</Link> — we add new categories regularly.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 text-center" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="max-w-2xl mx-auto">
            <Star className="w-10 h-10 mx-auto mb-5" style={{ color: 'var(--color-gold)' }} />
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to list your firm?
            </h2>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Executives arrive September 1 — and the directory they see that day is being built now.
              Create a free listing in minutes, upgrade to Listed for full visibility, or claim one of
              five Featured spots in your category before they're gone.
            </p>
            <Link href="/register/provider"
              className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-xl text-lg"
              style={{ backgroundColor: 'var(--color-gold)', color: 'white' }}>
              List Your Firm — It's Free <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.88)' }}>
              Every provider is reviewed by Enlisted before going live in the directory.
            </p>
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
            <Link href="/about" className="hover:text-[var(--color-navy)] transition-colors">About</Link>
            <Link href="/login" className="hover:text-[var(--color-navy)] transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
