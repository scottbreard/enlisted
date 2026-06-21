import Nav from '@/components/Nav'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORY_LABELS: Record<string, string> = {
  market_maker: 'Market Maker',
  ir_firm: 'IR Firm',
  transfer_agent: 'Transfer Agent',
  corporate_secretary: 'Corporate Secretary',
  securities_law: 'Securities Law',
  auditor_accounting: 'Auditor & Accounting',
  investment_bank: 'Investment Bank',
  outsourced_ceo: 'Outsourced CEO',
  outsourced_cfo: 'Outsourced CFO',
  financial_printer: 'Financial Printer',
  news_wire: 'News Wire',
  pr_communications: 'PR & Communications',
  ir_website: 'IR Website & Digital',
  social_media_management: 'Social Media',
  compliance_consultant: 'Compliance',
  research_analyst: 'Research Analyst',
  listing_advisor: 'Listing Advisor',
  investor_events: 'Investor Events',
  esg_governance: 'ESG & Governance',
  data_analytics: 'Data & Analytics',
  other: 'Other',
}

const TIER_BADGE: Record<string, string> = {
  enterprise: 'bg-amber-100 text-amber-800',
  premium: 'bg-purple-100 text-purple-800',
  professional: 'bg-blue-100 text-blue-800',
  starter: 'bg-slate-100 text-slate-600',
}

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  let query = supabase
    .from('providers')
    .select('id, name, slug, service_category, description, listing_tier, website_url, exchanges_served')
    .eq('status', 'active')
    .order('listing_tier', { ascending: false })

  if (category) query = query.eq('service_category', category)

  const { data: providers } = await query

  return (
    <>
      <Nav />
      <main className="flex-1 bg-white">
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Provider Directory</h1>
            <p className="text-slate-500">Every service provider for Canadian public companies — TSX, TSXV, CSE, and NEO.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 flex gap-10">
          {/* Sidebar filters */}
          <aside className="w-56 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Category</p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/providers"
                  className={`block text-sm px-3 py-2 rounded-lg font-medium transition-colors ${!category ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All Categories
                </Link>
              </li>
              {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    href={`/providers?category=${slug}`}
                    className={`block text-sm px-3 py-2 rounded-lg font-medium transition-colors ${category === slug ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Provider grid */}
          <div className="flex-1">
            {!providers || providers.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <p className="text-lg font-medium mb-2">No providers yet in this category.</p>
                <p className="text-sm">Founding Partner spots are open — be the first listed.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {providers.map((p) => (
                  <Link
                    key={p.id}
                    href={`/providers/${p.slug}`}
                    className="border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-6 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-sm">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${TIER_BADGE[p.listing_tier] ?? TIER_BADGE.starter}`}>
                        {p.listing_tier}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">{p.name}</h3>
                    <p className="text-xs font-medium text-blue-600 mb-2">{CATEGORY_LABELS[p.service_category] ?? p.service_category}</p>
                    {p.description && (
                      <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{p.description}</p>
                    )}
                    {p.exchanges_served && p.exchanges_served.length > 0 && (
                      <div className="flex gap-1 mt-3 flex-wrap">
                        {p.exchanges_served.map((ex: string) => (
                          <span key={ex} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{ex}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
