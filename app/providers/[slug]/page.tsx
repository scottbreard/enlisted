import Nav from '@/components/Nav'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

const CATEGORY_LABELS: Record<string, string> = {
  market_maker: 'Market Maker', ir_firm: 'IR Firm', transfer_agent: 'Transfer Agent',
  corporate_secretary: 'Corporate Secretary', securities_law: 'Securities Law',
  auditor_accounting: 'Auditor & Accounting', investment_bank: 'Investment Bank',
  outsourced_ceo: 'Outsourced CEO', outsourced_cfo: 'Outsourced CFO',
  financial_printer: 'Financial Printer', news_wire: 'News Wire',
  pr_communications: 'PR & Communications', ir_website: 'IR Website & Digital',
  social_media_management: 'Social Media', compliance_consultant: 'Compliance',
  research_analyst: 'Research Analyst', listing_advisor: 'Listing Advisor',
  investor_events: 'Investor Events', esg_governance: 'ESG & Governance',
  data_analytics: 'Data & Analytics', other: 'Other',
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!provider) notFound()

  return (
    <>
      <Nav />
      <main className="flex-1 bg-white">
        {/* Back */}
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <Link href="/providers" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">← Back to directory</Link>
        </div>

        {/* Profile header */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-2xl shrink-0">
              {provider.logo_url
                ? <img src={provider.logo_url} alt={provider.name} className="w-full h-full object-contain rounded-2xl" />
                : provider.name.slice(0, 2).toUpperCase()
              }
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-slate-900">{provider.name}</h1>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full capitalize">{provider.listing_tier}</span>
              </div>
              <p className="text-blue-600 font-semibold mb-2">{CATEGORY_LABELS[provider.service_category] ?? provider.service_category}</p>
              {provider.exchanges_served?.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {provider.exchanges_served.map((ex: string) => (
                    <span key={ex} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{ex}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              {provider.website_url && (
                <a href={provider.website_url} target="_blank" rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                  Visit Website →
                </a>
              )}
              {provider.linkedin_url && (
                <a href={provider.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="border border-slate-200 text-slate-600 hover:border-slate-300 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors text-center">
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed">
                  {provider.long_description || provider.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Contact sidebar */}
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Contact</h3>
                {provider.contact_name && <p className="text-sm font-semibold text-slate-800 mb-1">{provider.contact_name}</p>}
                {provider.contact_email && (
                  <a href={`mailto:${provider.contact_email}`} className="text-sm text-blue-600 hover:underline block mb-1">
                    {provider.contact_email}
                  </a>
                )}
                {provider.contact_phone && <p className="text-sm text-slate-500">{provider.contact_phone}</p>}
                {!provider.contact_name && !provider.contact_email && (
                  <p className="text-sm text-slate-400">Contact details not listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
