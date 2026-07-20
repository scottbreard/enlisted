import { createClient } from '@/lib/supabase/server'
import EnlistedLogo from '@/components/EnlistedLogo'
import PrintButton from './PrintButton'

export const metadata = {
  title: 'Enlisted for Service Providers — One-Page Overview',
  description: 'A one-page overview of the Enlisted directory for professional service providers: audience, tiers, pricing, and the September 1 launch.',
}

const CALENDLY = 'https://calendly.com/scott-dirona/enlisted-introductory-call'

export default async function OnePagerPage() {
  const supabase = await createClient()
  const { count: providerCount } = await supabase
    .from('provider_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('approval_status', 'approved')
  const firms = providerCount ? `${Math.floor(providerCount / 10) * 10}+` : '700+'

  return (
    <div className="min-h-screen bg-white">
      {/* Screen-only toolbar */}
      <div className="print:hidden border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
          One-page overview — print or save as PDF to share with your team.
        </p>
        <PrintButton />
      </div>

      {/* The page */}
      <div className="max-w-[7.6in] mx-auto px-8 py-8 print:px-0 print:py-0 text-[13px] leading-snug" style={{ color: 'var(--color-gray-dark)' }}>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b-2" style={{ borderColor: 'var(--color-navy)' }}>
          <EnlistedLogo size={22} />
          <div className="text-right text-xs" style={{ color: 'var(--color-gray)' }}>
            <p className="font-bold" style={{ color: 'var(--color-navy)' }}>The marketplace for Canadian public company services</p>
            <p>enlisted.ca · Toronto, ON</p>
          </div>
        </div>

        {/* What */}
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--color-navy)' }}>
          Get your firm in front of the executives running Canada&apos;s public companies.
        </h1>
        <p className="mb-4">
          Enlisted is the independent directory where the CEOs, CFOs, IROs, and corporate secretaries of
          TSX, TSXV, CSE, and NEO listed companies find, compare, and hire professional service providers —
          across 90+ categories, from securities law and audit to IR, market making, and transfer agency.
        </p>

        {/* Numbers */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            [firms, 'firms already listed'],
            ['13,000+', 'executives & directors in launch outreach'],
            ['90+', 'service categories'],
            ['Sept 1', 'executive launch, 2026'],
          ].map(([v, l]) => (
            <div key={l as string} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f4f7fb' }}>
              <p className="text-lg font-extrabold" style={{ color: 'var(--color-navy)' }}>{v}</p>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--color-gray)' }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Why it works */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <h2 className="font-extrabold text-sm mb-1.5" style={{ color: 'var(--color-navy)' }}>A verified audience</h2>
            <p className="text-xs">
              Only officers and directors of listed companies can register — each checked against exchange
              records. Membership is free for executives, and our launch outreach covers 13,000+ contacts
              across every Canadian issuer.
            </p>
          </div>
          <div>
            <h2 className="font-extrabold text-sm mb-1.5" style={{ color: 'var(--color-navy)' }}>Reasons to return</h2>
            <p className="text-xs">
              Executives use Enlisted as a working dashboard: exchange-specific compliance calendar,
              contract vault with renewal reminders, and RFQs when they need to hire. Every visit puts
              them in front of your listing.
            </p>
          </div>
        </div>

        {/* Tiers */}
        <table className="w-full mb-5 text-xs border-collapse">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-navy)', color: 'white' }}>
              <th className="text-left px-3 py-2 rounded-tl-lg font-bold">Tier</th>
              <th className="text-left px-3 py-2 font-bold">Annual (CAD)</th>
              <th className="text-left px-3 py-2 rounded-tr-lg font-bold">What you get</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
              <td className="px-3 py-2 font-bold" style={{ color: 'var(--color-navy)' }}>Free</td>
              <td className="px-3 py-2">$0</td>
              <td className="px-3 py-2">Name, category, and city in the directory. Searchable by executives.</td>
            </tr>
            <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
              <td className="px-3 py-2 font-bold" style={{ color: 'var(--color-navy)' }}>Listed</td>
              <td className="px-3 py-2 font-bold">$1,200</td>
              <td className="px-3 py-2">Full profile: logo, website, direct contact details, 300-word description, exchange badges, analytics.</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-bold" style={{ color: 'var(--color-gold)' }}>Featured</td>
              <td className="px-3 py-2 font-bold">$6,000</td>
              <td className="px-3 py-2">
                Top of category placement, exclusive RFQ access, logo in the monthly executive newsletter,
                750-word profile with team, case studies &amp; video. <strong>Maximum 5 firms per category.</strong>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Terms line */}
        <p className="text-[11px] mb-5" style={{ color: 'var(--color-gray)' }}>
          Annual terms anchor to September 1 — subscribe now, and your 12-month term begins the day executives
          arrive. 7-day full money-back guarantee. No commissions or lead fees, ever.
        </p>

        {/* CTA */}
        <div className="rounded-xl p-4 flex items-center justify-between gap-4" style={{ backgroundColor: 'var(--color-navy)' }}>
          <div className="text-white">
            <p className="font-extrabold text-sm">Claim your listing free — or talk to us first.</p>
            <p className="text-xs text-white/85">enlisted.ca/providers · Book a call: calendly.com/scott-dirona/enlisted-introductory-call</p>
          </div>
          <div className="text-right text-xs text-white/85 shrink-0">
            <p className="font-bold text-white">Enlisted</p>
            <p>A division of Stock Marketing Inc.</p>
          </div>
        </div>
      </div>

      {/* Screen-only footer link */}
      <div className="print:hidden text-center pb-10">
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
          className="inline-block text-sm font-bold px-6 py-3 rounded-xl text-white btn-glow" style={{ backgroundColor: 'var(--color-navy)' }}>
          Book a 30-minute call with us
        </a>
      </div>
    </div>
  )
}
