import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Building2, ChevronRight, Globe, Mail, Phone, Star } from 'lucide-react'
import { getMarketCode } from '@/lib/market'

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ir_firm:               'Investor relations firms help TSX, TSXV, CSE, and NEO listed companies build shareholder value through strategic communications, roadshows, and retail investor outreach. Compare Canadian IR agencies by exchange expertise and sector focus.',
  market_maker:          'Registered market makers and designated brokers provide continuous two-sided quotes for Canadian public company shares, improving liquidity and reducing bid-ask spreads on TSX, TSXV, CSE, and NEO.',
  securities_law:        'Securities lawyers advise Canadian public companies on prospectus filings, continuous disclosure obligations, M&A, and regulatory compliance under provincial securities law and exchange rules.',
  auditor_accounting:    'Audit firms and accounting practices serving Canadian public issuers provide financial statement audits, NI 52-110 audit committee support, and IFRS or ASPE reporting for TSX, TSXV, CSE, and NEO companies.',
  transfer_agent:        'Transfer agents maintain shareholder registers, process share transfers and dividends, and manage DRS services for Canadian public companies listed on TSX, TSXV, CSE, and NEO.',
  outsourced_cfo:        'Outsourced CFO firms provide part-time or interim chief financial officer services to smaller listed companies, handling financial reporting, treasury, and board-level financial governance.',
  pr_communications:     'PR and communications firms help Canadian public companies craft news releases, manage media relations, and build brand awareness with retail and institutional investors.',
  ir_website:            'IR website and digital agencies design investor relations websites, shareholder portals, and digital communications tools that meet Canadian disclosure requirements.',
  compliance_consultant: 'Compliance consultants help Canadian listed companies navigate continuous disclosure, insider reporting, NI 51-102, NI 45-106, and exchange filing requirements.',
  research_analyst:      'Independent equity research analysts provide paid and sponsored research coverage for small and mid-cap Canadian public companies seeking institutional visibility.',
  investor_events:       'Investor conference organizers and event firms connect Canadian listed companies with institutional investors, family offices, and retail shareholders through conferences, roadshows, and virtual events.',
  esg_governance:        'ESG and governance consultants help Canadian public companies build environmental, social, and governance programs, prepare sustainability reports, and meet shareholder and regulatory expectations.',
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase.from('service_categories').select('name, group_name').eq('slug', category).single()
  if (!cat) return { title: 'Not Found' }
  const description = CATEGORY_DESCRIPTIONS[category]
    ?? `Browse ${cat.name} service providers for Canadian public companies on TSX, TSXV, CSE, and NEO listed on Enlisted.ca.`
  return {
    title: `${cat.name} for Canadian Public Companies`,
    description,
    openGraph: {
      title: `${cat.name} — Enlisted.ca`,
      description,
    },
  }
}

const TIER_ORDER: Record<string, number> = { featured: 0, connected: 1, listed: 2 }
const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  featured:  { label: 'Featured',  color: '#92400e', bg: '#fef3c7' },
  connected: { label: 'Connected', color: '#1e40af', bg: '#dbeafe' },
  listed:    { label: 'Listed',    color: '#6b7280', bg: '#f3f4f6' },
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const supabase = await createClient()
  const marketCode = getMarketCode()

  const { data: cat } = await supabase
    .from('service_categories')
    .select('*')
    .eq('slug', category)
    .single()

  if (!cat) notFound()

  // Get providers in this category for this market
  const { data: providerCategories } = await supabase
    .from('provider_categories')
    .select('provider_id, is_primary')
    .eq('category_id', cat.id)

  const providerIds = providerCategories?.map(pc => pc.provider_id) ?? []

  let providers: any[] = []
  if (providerIds.length > 0) {
    const { data } = await supabase
      .from('provider_profiles')
      .select('*')
      .in('id', providerIds)
      .eq('is_active', true)
      .eq('approval_status', 'approved')
      .eq('primary_market_code', marketCode)
      .order('created_at')
    providers = (data ?? []).sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9))
  }

  // Related categories in same group
  const { data: related } = await supabase
    .from('service_categories')
    .select('slug, name')
    .eq('group_name', cat.group_name)
    .neq('slug', category)
    .limit(6)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>
      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: 'var(--color-canada)' }} />
            <span className="text-lg font-extrabold" style={{ color: 'var(--color-canada)' }}>
              Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-canada)' }}>ca</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
            <Link href="/register/executive" className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
              Register Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="text-white py-14 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/directory" className="hover:text-white">Directory</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{cat.name}</span>
          </div>
          <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>{cat.group_name}</p>
          <h1 className="text-4xl font-extrabold mb-2">{cat.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            {providers.length} provider{providers.length !== 1 ? 's' : ''} listed · Canada
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Main content */}
        <div className="flex-1">
          {CATEGORY_DESCRIPTIONS[category] && (
            <div className="bg-white border rounded-2xl px-6 py-5 mb-6" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gray)' }}>
                {CATEGORY_DESCRIPTIONS[category]}
              </p>
            </div>
          )}
          {providers.length === 0 ? (
            <div className="bg-white border rounded-2xl p-16 text-center" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-4xl mb-4">🔍</p>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-navy)' }}>No providers listed yet</h2>
              <p className="mb-6" style={{ color: 'var(--color-gray)' }}>Be the first {cat.name} firm on Enlisted.</p>
              <Link href="/register/provider" className="font-bold px-6 py-3 rounded-xl text-white inline-block" style={{ backgroundColor: 'var(--color-navy)' }}>
                List Your Firm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {providers.map(provider => {
                const tier = TIER_LABELS[provider.tier] ?? TIER_LABELS.free
                const isFree = provider.tier === 'listed'
                return (
                  <div
                    key={provider.id}
                    className="bg-white border rounded-2xl p-6 hover:shadow-md transition-shadow"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-extrabold text-white"
                        style={{ backgroundColor: isFree ? '#e5e7eb' : 'var(--color-navy)' }}>
                        {isFree ? (
                          <span style={{ color: 'var(--color-gray)' }}>
                            {provider.company_name.charAt(0)}
                          </span>
                        ) : provider.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={provider.logo_url} alt={provider.company_name} className="w-full h-full object-contain rounded-xl" />
                        ) : (
                          provider.company_name.charAt(0)
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-extrabold text-lg" style={{ color: 'var(--color-navy)' }}>
                            {isFree ? provider.company_name : (
                              <Link href={`/directory/${category}/${provider.slug}`} className="hover:underline">
                                {provider.company_name}
                              </Link>
                            )}
                          </h3>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: tier.bg, color: tier.color }}>
                            {tier.label}
                          </span>
                          {provider.is_verified && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                              ✓ Verified
                            </span>
                          )}
                        </div>

                        {!isFree && provider.tagline && (
                          <p className="text-sm mb-2" style={{ color: 'var(--color-gray)' }}>{provider.tagline}</p>
                        )}
                        {!isFree && provider.description && (
                          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-gray)' }}>{provider.description}</p>
                        )}

                        {!isFree && (
                          <div className="flex items-center gap-4 flex-wrap">
                            {provider.website_url && (
                              <a href={provider.website_url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--color-blue)' }}>
                                <Globe className="w-3 h-3" /> Website
                              </a>
                            )}
                            {provider.email && (
                              <a href={`mailto:${provider.email}`}
                                className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--color-blue)' }}>
                                <Mail className="w-3 h-3" /> Email
                              </a>
                            )}
                            {provider.phone && (
                              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-gray)' }}>
                                <Phone className="w-3 h-3" /> {provider.phone}
                              </span>
                            )}
                          </div>
                        )}

                        {isFree && (
                          <p className="text-xs italic" style={{ color: 'var(--color-gray-light)' }}>
                            Contact details available on paid listings
                          </p>
                        )}
                      </div>

                      {!isFree && (
                        <Link href={`/directory/${category}/${provider.slug}`}
                          className="shrink-0 text-sm font-bold px-4 py-2 rounded-xl text-white"
                          style={{ backgroundColor: 'var(--color-navy)' }}>
                          View Profile
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          {/* Related categories */}
          {related && related.length > 0 && (
            <div className="bg-white border rounded-2xl p-5 mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-navy)' }}>Related Categories</h3>
              <ul className="space-y-2">
                {related.map(r => (
                  <li key={r.slug}>
                    <Link href={`/directory/${r.slug}`} className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
            <p className="font-bold mb-1">List your firm</p>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Reach every public company executive in Canada.
            </p>
            <Link href="/register/provider" className="block text-center text-sm font-bold py-2 rounded-lg" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>
              Get Listed
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
