import Link from 'next/link'
import EnlistedLogo from '@/components/EnlistedLogo'

export const metadata = {
  title: 'Privacy Policy — Enlisted.ca',
  description: 'Privacy Policy describing how Enlisted Inc. collects, uses, and protects personal information in compliance with PIPEDA.',
}

const EFFECTIVE = 'June 26, 2026'
const COMPANY = 'Stock Marketing Inc. (operating as Enlisted.ca)'
const PRIVACY_EMAIL = 'privacy@enlisted.ca'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>

      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <EnlistedLogo size={24} />
          <div className="flex items-center gap-3">
            <Link href="/terms" className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>Terms of Service</Link>
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>Legal</p>
          <h1 className="text-4xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>Privacy Policy</h1>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Effective date: {EFFECTIVE} · Last updated: {EFFECTIVE}</p>
          <div className="mt-4 p-4 rounded-xl border-l-4 text-sm" style={{ borderColor: 'var(--color-blue)', backgroundColor: 'var(--color-blue-light)', color: 'var(--color-gray-dark)' }}>
            {COMPANY} ("<strong>Enlisted</strong>," "<strong>we</strong>," "<strong>us</strong>") is committed to protecting your privacy. This Policy explains how we collect, use, disclose, and safeguard personal information in compliance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable provincial privacy laws.
          </div>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--color-gray-dark)' }}>

          <Section title="1. Scope">
            <p>This Policy applies to personal information collected through the Enlisted.ca platform, website, and related services (the "<strong>Platform</strong>") about:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Executive Users</strong> — executives and officers of TSX, TSXV, CSE, and NEO listed companies; and</li>
              <li><strong>Provider Users</strong> — employees, principals, and representatives of service provider firms.</li>
            </ul>
            <p className="mt-3">This Policy does not apply to information about corporate entities (which is not personal information) or to third-party websites linked from the Platform.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong>2.1 Information You Provide Directly</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Account registration:</strong> name, email address, password (hashed), job title, company name, exchange listing, stock ticker, sector, fiscal year end;</li>
              <li><strong>Profile information:</strong> professional biography, photo, phone number, LinkedIn or website URL, team member details (Provider Users);</li>
              <li><strong>Payment information:</strong> billing address and payment card details — collected and stored by Stripe, Inc. on our behalf; we do not store full card numbers;</li>
              <li><strong>Communications:</strong> content of RFQs, messages, support requests, and feedback submitted through the Platform; and</li>
              <li><strong>Newsletter and marketing:</strong> email address and preferences if you subscribe.</li>
            </ul>
            <p className="mt-4"><strong>2.2 Information Collected Automatically</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Usage data:</strong> pages viewed, features accessed, search queries, time spent, click-through data, and referring URLs;</li>
              <li><strong>Device and log data:</strong> IP address, browser type and version, operating system, device identifiers, and error logs; and</li>
              <li><strong>Cookies and similar technologies:</strong> as described in Section 8 below.</li>
            </ul>
            <p className="mt-4"><strong>2.3 Information from Third Parties</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Publicly available information from SEDAR+, exchange websites, and corporate registries to verify executive eligibility and company listings; and</li>
              <li>Payment transaction data from Stripe, Inc.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Personal Information">
            <p>We use personal information only for the purposes for which it was collected or to which you have consented, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Account management:</strong> creating and maintaining your account, verifying eligibility, and authenticating access;</li>
              <li><strong>Platform operation:</strong> displaying your profile, enabling directory searches, facilitating RFQs, generating compliance calendars, and delivering AI assistant responses;</li>
              <li><strong>Billing:</strong> processing subscription payments, issuing invoices, and managing billing disputes;</li>
              <li><strong>Communications:</strong> sending transactional emails (account confirmations, password resets, billing receipts, RFQ notifications), service updates, and, where you have consented, marketing communications;</li>
              <li><strong>Analytics and improvement:</strong> understanding how the Platform is used, identifying bugs, and improving features — using aggregated or de-identified data where possible;</li>
              <li><strong>Legal compliance:</strong> complying with applicable laws, responding to lawful requests from public authorities, and enforcing our Terms of Service; and</li>
              <li><strong>Safety and security:</strong> detecting, investigating, and preventing fraudulent, abusive, or unlawful activity.</li>
            </ul>
          </Section>

          <Section title="4. Legal Bases for Processing">
            <p>We rely on the following legal bases to collect and use personal information:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Contractual necessity:</strong> processing required to perform the agreement with you (account management, Platform delivery, billing);</li>
              <li><strong>Consent:</strong> marketing emails, optional profile fields, and cookies requiring consent — which you may withdraw at any time;</li>
              <li><strong>Legitimate interests:</strong> analytics, security, fraud prevention, and product improvement, where our interests are not overridden by your privacy rights; and</li>
              <li><strong>Legal obligation:</strong> complying with applicable laws and lawful orders.</li>
            </ul>
          </Section>

          <Section title="5. Disclosure of Personal Information">
            <p>We do not sell personal information. We may share personal information in the following circumstances:</p>
            <p className="mt-3"><strong>5.1 With Other Users.</strong> When an Executive User sends an RFQ to a Provider User, we share the executive's name, company, and contact information solely to enable the provider to respond. Provider profiles — including contact details for Connected and Featured plans — are displayed to verified Executive Users as part of the directory.</p>
            <p className="mt-3"><strong>5.2 With Service Providers.</strong> We engage trusted third-party processors under written data processing agreements, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase, Inc.</strong> — database, authentication, and infrastructure (servers in the United States);</li>
              <li><strong>Stripe, Inc.</strong> — payment processing (United States);</li>
              <li><strong>Resend, Inc.</strong> — transactional email delivery (United States);</li>
              <li><strong>Anthropic, PBC</strong> — AI language model processing for the AI Assistant feature (United States); and</li>
              <li><strong>Vercel, Inc.</strong> — web hosting and content delivery (United States).</li>
            </ul>
            <p className="mt-3"><strong>5.3 Legal Requirements.</strong> We may disclose personal information if required by law, court order, or governmental authority, or if we believe in good faith that disclosure is necessary to protect the rights, property, or safety of Enlisted, our users, or the public.</p>
            <p className="mt-3"><strong>5.4 Business Transfers.</strong> In the event of a merger, acquisition, financing, or sale of all or substantially all of our assets, personal information may be transferred as part of the transaction. We will notify affected users before personal information is transferred and becomes subject to a different privacy policy.</p>
          </Section>

          <Section title="6. International Transfers">
            <p>Our service providers are primarily located in the United States. By using the Platform, you acknowledge that your personal information may be transferred to and processed in the United States and other countries whose privacy laws may differ from Canadian law.</p>
            <p className="mt-3">We take steps to ensure that transfers are protected by appropriate safeguards, including contractual clauses requiring recipients to protect personal information to a standard comparable to PIPEDA.</p>
          </Section>

          <Section title="7. Data Retention">
            <p>We retain personal information for as long as necessary to fulfil the purposes for which it was collected, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Active accounts:</strong> for the duration of the account;</li>
              <li><strong>Closed accounts:</strong> up to 3 years after closure, to resolve disputes, enforce agreements, and comply with legal obligations;</li>
              <li><strong>Billing records:</strong> 7 years from the transaction date, as required by Canadian tax law; and</li>
              <li><strong>Marketing consent records:</strong> for the period of consent and 3 years thereafter, as required by CASL.</li>
            </ul>
            <p className="mt-3">When personal information is no longer required, we securely delete or anonymise it.</p>
          </Section>

          <Section title="8. Cookies and Tracking Technologies">
            <p>We use the following categories of cookies and similar technologies:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Strictly necessary cookies:</strong> required for authentication, security, and session management. These cannot be disabled without impairing Platform functionality.</li>
              <li><strong>Analytics cookies:</strong> used to understand how users interact with the Platform (e.g., pages visited, features used). We use aggregated, anonymised analytics.</li>
              <li><strong>Preference cookies:</strong> used to remember your settings (e.g., language, display preferences).</li>
            </ul>
            <p className="mt-3">You may control non-essential cookies through your browser settings. Note that disabling certain cookies may affect Platform functionality. We do not use advertising or cross-site tracking cookies.</p>
          </Section>

          <Section title="9. Canadian Anti-Spam Legislation (CASL)">
            <p>We send commercial electronic messages only with your express or implied consent as defined under CASL. Specifically:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Transactional messages</strong> (account confirmations, billing receipts, password resets, RFQ notifications) do not require separate consent as they are necessary to deliver the Platform;</li>
              <li><strong>Marketing messages</strong> (newsletters, product updates, promotional offers) are sent only with your express consent, which you may withdraw at any time by clicking "Unsubscribe" in any email or contacting us at <a href={`mailto:${PRIVACY_EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{PRIVACY_EMAIL}</a>.</li>
            </ul>
            <p className="mt-3">We maintain records of consent as required by CASL.</p>
          </Section>

          <Section title="10. Security">
            <p>We implement administrative, technical, and physical safeguards to protect personal information against unauthorised access, disclosure, alteration, and destruction, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>TLS encryption for data in transit;</li>
              <li>AES-256 encryption for data at rest (via Supabase);</li>
              <li>Row-level security policies on all database tables;</li>
              <li>Access controls limiting employee and contractor access to personal information on a need-to-know basis; and</li>
              <li>Regular security reviews.</li>
            </ul>
            <p className="mt-3">No method of transmission over the Internet or electronic storage is completely secure. In the event of a privacy breach that creates a real risk of significant harm, we will notify affected individuals and the Office of the Privacy Commissioner of Canada as required by PIPEDA.</p>
          </Section>

          <Section title="11. Your Privacy Rights">
            <p>Subject to applicable law, you have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Access:</strong> request a copy of the personal information we hold about you;</li>
              <li><strong>Correction:</strong> request correction of inaccurate or incomplete personal information;</li>
              <li><strong>Withdrawal of consent:</strong> withdraw consent for processing based on consent (which may affect your ability to use certain features);</li>
              <li><strong>Deletion:</strong> request deletion of your personal information, subject to our legal obligations to retain certain records; and</li>
              <li><strong>Complaint:</strong> lodge a complaint with the Office of the Privacy Commissioner of Canada at <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-blue)' }}>www.priv.gc.ca</a>.</li>
            </ul>
            <p className="mt-3">To exercise these rights, please contact our Privacy Officer at <a href={`mailto:${PRIVACY_EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{PRIVACY_EMAIL}</a>. We will respond within 30 days. We may need to verify your identity before processing certain requests.</p>
          </Section>

          <Section title="12. Children's Privacy">
            <p>The Platform is not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected information from a minor, please contact us at <a href={`mailto:${PRIVACY_EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{PRIVACY_EMAIL}</a> and we will promptly delete it.</p>
          </Section>

          <Section title="13. Links to Third-Party Sites">
            <p>The Platform may contain links to third-party websites. This Policy does not apply to those websites. We encourage you to review the privacy policies of any third-party sites you visit. Enlisted is not responsible for the privacy practices of third parties.</p>
          </Section>

          <Section title="14. Amendments to this Policy">
            <p>We may update this Policy from time to time to reflect changes in our practices or applicable law. We will notify you of material changes by posting the updated Policy on the Platform and, where required, by email. The date of the most recent update appears at the top of this Policy. Your continued use of the Platform after any update constitutes acceptance of the revised Policy.</p>
          </Section>

          <Section title="15. Contact — Privacy Officer">
            <p>Questions, requests, or complaints regarding this Policy or our privacy practices should be directed to our Privacy Officer:</p>
            <div className="mt-3 p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'white' }}>
              <p className="font-bold" style={{ color: 'var(--color-navy)' }}>Privacy Officer — {COMPANY}</p>
              <p>Email: <a href={`mailto:${PRIVACY_EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{PRIVACY_EMAIL}</a></p>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-gray)' }}>Toronto, Ontario, Canada</p>
              <p className="mt-2 text-xs" style={{ color: 'var(--color-gray)' }}>We will acknowledge receipt of your inquiry within 2 business days and respond substantively within 30 calendar days.</p>
            </div>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t flex flex-wrap gap-4 text-sm" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/terms" className="hover:underline" style={{ color: 'var(--color-blue)' }}>Terms of Service →</Link>
          <Link href="/about" className="hover:underline" style={{ color: 'var(--color-blue)' }}>About Enlisted →</Link>
          <Link href="/" className="hover:underline" style={{ color: 'var(--color-blue)' }}>Back to Home →</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>{title}</h2>
      <div style={{ color: 'var(--color-gray-dark)' }}>{children}</div>
    </section>
  )
}
