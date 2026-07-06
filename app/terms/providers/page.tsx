import Link from 'next/link'
import EnlistedLogo from '@/components/EnlistedLogo'
import SiteFooter from '@/components/SiteFooter'

export const metadata = {
  title: 'Provider Terms & Conditions — Enlisted.ca',
  description: 'Subscription terms and conditions for service providers advertising on the Enlisted platform.',
}

const EFFECTIVE = 'July 3, 2026'
const COMPANY = 'Stock Marketing Inc. (operating as Enlisted.ca)'
const EMAIL = 'legal@enlisted.ca'

export default function ProviderTermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>

      {/* Nav */}
      <header className="nav-blur border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <EnlistedLogo size={24} />
          <div className="flex items-center gap-3">
            <Link href="/terms" className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>Terms of Service</Link>
            <Link href="/privacy" className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>Privacy Policy</Link>
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>Legal</p>
          <h1 className="text-4xl font-extrabold mb-3 anim-fade-up" style={{ color: 'var(--color-navy)' }}>Provider Terms &amp; Conditions</h1>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Effective date: {EFFECTIVE} · Last updated: {EFFECTIVE}</p>
          <div className="mt-4 p-4 rounded-xl border-l-4 text-sm" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gray-dark)' }}>
            These Provider Terms &amp; Conditions supplement our <Link href="/terms" className="underline" style={{ color: 'var(--color-blue)' }}>Terms of Service</Link> and apply to service providers purchasing a paid subscription on the Enlisted platform. By completing a subscription purchase, you agree to these terms on behalf of the firm you represent.
          </div>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--color-gray-dark)' }}>

          <Section title="1. Subscription Plans and Pricing">
            <p>Enlisted offers paid subscription tiers for service providers ("<strong>Paid Listings</strong>"). Current tiers and pricing are displayed on the billing page at time of purchase. All prices are stated and billed in <strong>Canadian dollars (CAD)</strong> and are exclusive of applicable taxes (GST/HST/QST), which will be added where required by law.</p>
            <p className="mt-3">A description of the features included in each tier is provided on our <Link href="/pricing" className="underline" style={{ color: 'var(--color-blue)' }}>pricing page</Link>. We may modify tier features from time to time, provided that material reductions in features during a paid term will entitle you to a pro-rata refund upon request.</p>
          </Section>

          <Section title="2. Subscription Term and September 1 Anchor Date">
            <p>Annual subscriptions purchased before <strong>September 1, 2026</strong> are billed at the time of purchase, and the twelve (12) month subscription term is anchored to <strong>September 1, 2026</strong> — the date the Platform launches to executive users. Platform access between your purchase date and September 1, 2026 is provided at no additional charge.</p>
            <p className="mt-3">Your subscription will renew, and payment will be automatically collected, on September 1 of each subsequent year unless cancelled in accordance with Section 4.</p>
          </Section>

          <Section title="3. Billing and Payment">
            <p>Payments are processed by <strong>Stripe, Inc.</strong> By subscribing you authorise us (via Stripe) to charge your payment method the applicable subscription fee at the start of each subscription term. You are responsible for keeping your payment information current.</p>
            <p className="mt-3">If a renewal payment fails, we will retry the charge and notify you. If payment remains outstanding fourteen (14) days after the renewal date, we may downgrade your listing to the free tier until payment is received.</p>
          </Section>

          <Section title="4. Cancellation and Refunds">
            <p>You may cancel your subscription at any time through the billing portal. Cancellation takes effect at the end of the current subscription term; your paid features remain active until then.</p>
            <p className="mt-3">Annual subscription fees are <strong>refundable in full within seven (7) days of purchase</strong> and non-refundable thereafter, except: (a) as described in Section 1 for material feature reductions; (b) where we terminate your subscription without cause; or (c) where required by applicable law.</p>
          </Section>

          <Section title="5. Listing Content and Conduct">
            <p>You are solely responsible for the accuracy of your listing content — including your firm description, credentials, team information, case studies, and claimed exchange or sector expertise. You represent that:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>You are authorised to act on behalf of the firm named in the listing;</li>
              <li>All content is accurate, current, and not misleading;</li>
              <li>You hold all licences and registrations required to provide the services you advertise (including, where applicable, registration with CIRO, provincial law societies, CPA bodies, or securities regulators); and</li>
              <li>Your content does not infringe third-party rights or applicable securities, advertising, or competition law.</li>
            </ul>
            <p className="mt-3">We may review, edit for formatting, decline, or remove listing content that violates these Terms. Deliberate misrepresentation of credentials or client relationships is grounds for immediate termination without refund.</p>
          </Section>

          <Section title="6. RFQs and Executive Contact">
            <p>Featured listings may receive requests for quotation ("<strong>RFQs</strong>"), and paid listings may receive contact from executive users. You agree to use executive contact information solely to respond to the enquiry through which it was provided, and not to add executives to marketing lists or share their information with third parties without their consent. Featured-tier newsletter inclusion (your logo and website link in Enlisted's monthly executive newsletter) is managed by Enlisted, subject to our content standards and Canada's Anti-Spam Legislation (CASL).</p>
          </Section>

          <Section title="7. No Endorsement; No Guarantee of Results">
            <p>Enlisted is an independent marketplace. A listing (including a Featured placement or verification badge) is not an endorsement, recommendation, or certification of your firm by Enlisted, and you may not represent it as such. We do not guarantee any volume of profile views, RFQs, leads, or engagements.</p>
          </Section>

          <Section title="8. Termination">
            <p>We may suspend or terminate your Paid Listing for material breach of these Terms or our Terms of Service. If we terminate without cause, we will refund the unused pro-rata portion of your subscription fee. Sections 5–7 and 9 survive termination.</p>
          </Section>

          <Section title="9. General">
            <p>These Provider Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. In the event of a conflict between these Provider Terms and the Terms of Service, these Provider Terms prevail with respect to paid subscriptions. We may update these terms with thirty (30) days' notice; continued subscription after the notice period constitutes acceptance.</p>
            <p className="mt-3">Questions? Contact us at <a href={`mailto:${EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{EMAIL}</a>.</p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray-light)' }}>
          {COMPANY} · <Link href="/terms" className="underline">Terms of Service</Link> · <Link href="/privacy" className="underline">Privacy Policy</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>{title}</h2>
      {children}
    </section>
  )
}
