import Link from 'next/link'
import EnlistedLogo from '@/components/EnlistedLogo'
import SiteFooter from '@/components/SiteFooter'

export const metadata = {
  title: 'How Listings Work — Enlisted.ca Methodology',
  description: 'How firms are listed on Enlisted, what Featured means, how paid placement is disclosed, and how we handle conflicts of interest.',
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fc' }}>

      <header className="nav-blur border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <EnlistedLogo size={24} />
          <div className="flex items-center gap-3">
            <Link href="/directory" className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>Directory</Link>
            <Link href="/about" className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>About</Link>
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto px-6 py-14 w-full">
        <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>Methodology</p>
        <h1 className="text-4xl font-extrabold mb-3 anim-fade-up" style={{ color: 'var(--color-navy)' }}>How listings work</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-gray)' }}>
          Enlisted is funded by service providers who pay to be listed; membership is free for executives.
          This page explains exactly how firms get into the directory, what payment does and does not buy,
          and how we handle conflicts of interest.
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--color-gray-dark)' }}>

          <section>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>How firms get listed</h2>
            <p>Listings come from three sources:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Public registers and rankings.</strong> Where a verifiable third-party register exists for a category, we use it. Our audit category is built from the Canadian Public Accountability Board (CPAB) register of firms authorized to audit reporting issuers; legal categories draw on peer-reviewed practice-area rankings; market making draws on exchange-registered firms.</li>
              <li><strong>Public activity.</strong> Firms named in the public disclosure record of Canadian issuers — for example, IR and communications firms identified in issuers&apos; own news releases.</li>
              <li><strong>Direct registration.</strong> Firms that create or claim their own listing. Every directly registered firm is reviewed before its listing goes live.</li>
            </ul>
            <p className="mt-3">Inclusion in the directory is never sold. No firm can pay to be added to a category it does not serve, and no firm can pay to have a competitor removed.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>What paid tiers buy — and don&apos;t</h2>
            <p>Paid tiers buy <strong>presentation and placement, not inclusion or endorsement</strong>:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Free</strong> listings show a firm&apos;s name, categories, and city.</li>
              <li><strong>Listed</strong> ($1,200/yr) adds the firm&apos;s full profile: logo, website, contact details, and description.</li>
              <li><strong>Featured</strong> ($6,000/yr) is paid placement at the top of the firm&apos;s primary category, capped at five firms per category, and always displayed with a &quot;Featured&quot; label. Within tiers, ordering is alphabetical — payment buys the Featured tier itself, not ranking within it.</li>
            </ul>
            <p className="mt-3">A Featured label means the firm pays for prominence. It is not a rating, a recommendation, or a certification by Enlisted.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>What &quot;reviewed&quot; means</h2>
            <p>Before a claimed or directly registered listing goes live, we check that the firm exists, operates the website it claims, and offers services in the categories it selects. Where a category has a third-party gate (CPAB registration for reporting-issuer audit, exchange registration for market making), we apply it. We do not assess service quality, and a listing is not advice to engage any firm.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>Ownership and conflicts of interest</h2>
            <p>Enlisted.ca is a division of <strong>Stock Marketing Inc.</strong>, a Toronto company that provides online marketing services to public companies.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Stock Marketing Inc. maintains its own listing in the directory, in the categories it serves. It is subject to the same tier rules, caps, and labels as any other firm, and its listing is disclosed here as a house listing.</li>
              <li>No competitor of Stock Marketing Inc. is excluded, demoted, or otherwise treated differently because of the ownership relationship. Category placement and tier rules apply identically to all firms.</li>
              <li>Executive data on Enlisted — including RFQs and vault contents — is never shared with Stock Marketing Inc.&apos;s services business.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>Corrections and disputes</h2>
            <p>Directory data is compiled from public sources and firm submissions, and errors are possible. If your firm&apos;s listing is inaccurate, outdated, or you want it removed, email <a href="mailto:hello@enlisted.ca" className="underline" style={{ color: 'var(--color-blue)' }}>hello@enlisted.ca</a> and we will correct or remove it promptly. Firms can also <Link href="/register/provider" className="underline" style={{ color: 'var(--color-blue)' }}>claim their listing</Link> to control it directly.</p>
          </section>

        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
