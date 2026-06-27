import Link from 'next/link'
import { Building2 } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — Enlisted.ca',
  description: 'Terms of Service governing use of the Enlisted.ca platform by executives and service providers.',
}

const EFFECTIVE = 'June 26, 2026'
const COMPANY = 'Enlisted Inc.'
const EMAIL = 'legal@enlisted.ca'

export default function TermsPage() {
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
            <Link href="/privacy" className="text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>Privacy Policy</Link>
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>Legal</p>
          <h1 className="text-4xl font-extrabold mb-3" style={{ color: 'var(--color-navy)' }}>Terms of Service</h1>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Effective date: {EFFECTIVE} · Last updated: {EFFECTIVE}</p>
          <div className="mt-4 p-4 rounded-xl border-l-4 text-sm" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gray-dark)' }}>
            Please read these Terms carefully before using Enlisted.ca. By creating an account or accessing the Platform, you agree to be bound by these Terms. If you do not agree, do not use the Platform.
          </div>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--color-gray-dark)' }}>

          <Section title="1. Parties and Agreement">
            <p>These Terms of Service ("<strong>Terms</strong>") constitute a legally binding agreement between you ("<strong>User</strong>," "<strong>you</strong>," or "<strong>your</strong>") and <strong>{COMPANY}</strong>, a corporation incorporated under the laws of the Province of Ontario, Canada ("<strong>Enlisted</strong>," "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>").</p>
            <p className="mt-3">These Terms govern your access to and use of the Enlisted.ca website, web application, application programming interfaces, and all associated services (collectively, the "<strong>Platform</strong>").</p>
            <p className="mt-3">By clicking "I agree," by creating an account, or by otherwise accessing or using the Platform, you represent that you have read, understood, and agree to be bound by these Terms, our <Link href="/privacy" className="underline" style={{ color: 'var(--color-blue)' }}>Privacy Policy</Link>, and any other policies or guidelines incorporated herein by reference.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>To use the Platform you must:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Be at least 18 years of age;</li>
              <li>Have the legal capacity to enter into binding contracts in your jurisdiction;</li>
              <li>Not be prohibited from using the Platform under applicable law; and</li>
              <li>If registering as an <strong>Executive User</strong>, hold an active executive or officer role (CEO, CFO, COO, IRO, Corporate Secretary, President, or equivalent) at a company listed on the TSX, TSXV, CSE, or NEO exchange; or</li>
              <li>If registering as a <strong>Provider User</strong>, be authorised to bind the firm or entity on whose behalf you register.</li>
            </ul>
            <p className="mt-3">We reserve the right to verify eligibility at any time and to suspend or terminate accounts that do not meet these criteria. Providing false eligibility information is a material breach of these Terms.</p>
          </Section>

          <Section title="3. Account Registration and Security">
            <p>You must provide accurate, complete, and current information during registration and keep that information updated. You are solely responsible for:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Maintaining the confidentiality of your account credentials;</li>
              <li>All activity that occurs under your account, whether or not authorised by you; and</li>
              <li>Notifying us immediately at <a href={`mailto:${EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{EMAIL}</a> if you become aware of any unauthorised access to your account.</li>
            </ul>
            <p className="mt-3">You may not share your login credentials, transfer your account, or permit any third party to access the Platform through your account. One account per natural person is permitted for Executive Users.</p>
          </Section>

          <Section title="4. Executive Users — Free Access">
            <p>Access to the Platform is provided to Executive Users at <strong>no charge</strong>. This free access is a core and permanent feature of the Platform for verified executives of TSX, TSXV, CSE, and NEO listed companies. We will provide not less than 90 days' written notice before introducing any fees for Executive Users.</p>
            <p className="mt-3">Executive Users may:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Search and browse the service provider directory;</li>
              <li>View profiles of Connected and Featured providers;</li>
              <li>Send Requests for Quotation ("<strong>RFQs</strong>") to eligible providers;</li>
              <li>Maintain a private vault of preferred providers;</li>
              <li>Access the auto-generated compliance calendar; and</li>
              <li>Use any additional tools made available to Executive Users from time to time.</li>
            </ul>
            <p className="mt-3">Executive Users must not use the Platform to solicit business from service providers, to re-sell directory information, or for any purpose other than obtaining services for their listed company.</p>
          </Section>

          <Section title="5. Provider Users — Subscription Plans">
            <p><strong>5.1 Plans.</strong> Service providers may list on the Platform under the following tiers (pricing in Canadian dollars unless otherwise indicated):</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <th className="text-left px-4 py-2 font-bold" style={{ color: 'var(--color-navy)', border: '1px solid var(--color-border)' }}>Plan</th>
                    <th className="text-left px-4 py-2 font-bold" style={{ color: 'var(--color-navy)', border: '1px solid var(--color-border)' }}>Fee</th>
                    <th className="text-left px-4 py-2 font-bold" style={{ color: 'var(--color-navy)', border: '1px solid var(--color-border)' }}>Key Features</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>Listed</td>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>Free</td>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>Name and category listed; no contact details or logo displayed</td>
                  </tr>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>Connected</td>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>$100/mo or $1,000/yr</td>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>Full contact, logo, description, RFQ access</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>Featured</td>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>$499/mo or $4,990/yr</td>
                    <td className="px-4 py-2" style={{ border: '1px solid var(--color-border)' }}>Top placement, video, AI assistant, homepage feature, email blasts</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4"><strong>5.2 Billing.</strong> Subscriptions are billed in advance on a monthly or annual basis. Payment is processed by our third-party payment processor, Stripe, Inc., pursuant to Stripe's own terms of service. By providing payment information, you authorise us to charge the applicable subscription fee on a recurring basis until your subscription is cancelled.</p>
            <p className="mt-3"><strong>5.3 Cancellation.</strong> You may cancel a subscription at any time through your billing dashboard. Cancellation takes effect at the end of the current billing period. We do not provide prorated refunds for partial periods, except where required by applicable law.</p>
            <p className="mt-3"><strong>5.4 Price Changes.</strong> We may change subscription fees upon not less than 30 days' written notice to the email address on your account. Continued use of a paid plan after the effective date of a price change constitutes acceptance of the new fee.</p>
            <p className="mt-3"><strong>5.5 Taxes.</strong> All fees are exclusive of applicable taxes including Goods and Services Tax / Harmonized Sales Tax ("<strong>GST/HST</strong>"). You are responsible for all applicable taxes arising from your subscription.</p>
          </Section>

          <Section title="6. Provider Listing Standards">
            <p>Provider Users represent and warrant that all information submitted to the Platform, including company name, description, contact details, team profiles, case studies, and exchange coverage, is:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Accurate, complete, and not misleading;</li>
              <li>Owned by or licensed to the Provider User;</li>
              <li>Compliant with all applicable laws, including securities laws, advertising standards, and professional conduct rules of any applicable self-regulatory organisation; and</li>
              <li>Free from content that is defamatory, discriminatory, harassing, or otherwise unlawful.</li>
            </ul>
            <p className="mt-3">We reserve the right to review, edit, suspend, or remove any listing that we determine, in our sole discretion, violates these standards or is otherwise harmful to the Platform or its users.</p>
          </Section>

          <Section title="7. RFQ System">
            <p>The Platform facilitates the exchange of Requests for Quotation between Executive Users and Provider Users. Enlisted is not a party to any transaction, engagement, or agreement arising from an RFQ. We do not guarantee that an Executive User will engage a provider, nor that a provider will respond to any RFQ.</p>
            <p className="mt-3">Provider Users receiving an RFQ must not use Executive User contact information for any purpose other than responding to that specific RFQ, unless the Executive User provides separate written consent.</p>
          </Section>

          <Section title="8. Prohibited Conduct">
            <p>You must not use the Platform to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Violate any applicable federal, provincial, or municipal law or regulation;</li>
              <li>Infringe the intellectual property rights of any person;</li>
              <li>Transmit spam, unsolicited commercial electronic messages, or any message that violates the <em>Canadian Anti-Spam Legislation</em> (CASL);</li>
              <li>Scrape, crawl, or systematically extract data from the Platform without our prior written consent;</li>
              <li>Reverse-engineer, decompile, or disassemble any part of the Platform;</li>
              <li>Introduce malware, viruses, or other harmful code;</li>
              <li>Attempt to gain unauthorised access to any account, system, or network associated with the Platform;</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity;</li>
              <li>Manipulate or falsify any profile, review, or listing; or</li>
              <li>Engage in any conduct that, in our reasonable opinion, damages the reputation or interests of Enlisted or the Platform's user community.</li>
            </ul>
          </Section>

          <Section title="9. Intellectual Property">
            <p><strong>9.1 Our IP.</strong> The Platform, including its software, design, trademarks, trade dress, and content created by Enlisted, is owned by or licensed to Enlisted and is protected by Canadian and international intellectual property laws. Nothing in these Terms grants you any right, title, or interest in the Platform other than the limited licence to use it in accordance with these Terms.</p>
            <p className="mt-3"><strong>9.2 Your Content.</strong> You retain ownership of content you submit to the Platform ("<strong>User Content</strong>"). By submitting User Content, you grant Enlisted a worldwide, non-exclusive, royalty-free, sublicensable licence to use, reproduce, distribute, display, and adapt that User Content solely to operate and promote the Platform.</p>
            <p className="mt-3"><strong>9.3 Feedback.</strong> Any feedback, suggestions, or ideas you provide regarding the Platform may be used by Enlisted without restriction or compensation to you.</p>
          </Section>

          <Section title="10. Third-Party Services">
            <p>The Platform integrates or links to third-party services including Stripe (payment processing), Supabase (data infrastructure), Resend (email delivery), and Anthropic (AI features). Your use of those services is governed by their respective terms. Enlisted is not responsible for the acts or omissions of any third-party service provider.</p>
          </Section>

          <Section title="11. Disclaimers">
            <p>THE PLATFORM IS PROVIDED ON AN "<strong>AS IS</strong>" AND "<strong>AS AVAILABLE</strong>" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED OR ERROR-FREE OPERATION.</p>
            <p className="mt-3">Enlisted does not verify the professional qualifications, licences, regulatory standing, or suitability of any service provider listed on the Platform. The presence of a provider listing is not an endorsement or recommendation by Enlisted. You are solely responsible for conducting your own due diligence before engaging any service provider.</p>
            <p className="mt-3">The compliance calendar is provided for informational purposes only and does not constitute legal advice. Filing deadlines may vary based on your specific circumstances. You must consult qualified legal counsel to confirm your regulatory obligations.</p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ENLISTED, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES;</li>
              <li>LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY;</li>
              <li>DAMAGES ARISING FROM YOUR RELIANCE ON ANY PROVIDER LISTING, RFQ RESPONSE, OR COMPLIANCE CALENDAR INFORMATION; OR</li>
              <li>DAMAGES EXCEEDING, IN AGGREGATE, THE GREATER OF (A) THE AMOUNT YOU PAID TO ENLISTED IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY, OR (B) ONE HUNDRED CANADIAN DOLLARS ($100 CAD).</li>
            </ul>
            <p className="mt-3">Some jurisdictions do not permit the exclusion or limitation of certain damages. To the extent such limitations are not enforceable in your jurisdiction, our liability is limited to the minimum extent permitted by law.</p>
          </Section>

          <Section title="13. Indemnification">
            <p>You agree to defend, indemnify, and hold harmless Enlisted and its directors, officers, employees, agents, and licensors from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or relating to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your use of the Platform;</li>
              <li>Your User Content;</li>
              <li>Your breach of these Terms; or</li>
              <li>Your violation of any applicable law or the rights of any third party.</li>
            </ul>
          </Section>

          <Section title="14. Termination">
            <p><strong>14.1 By You.</strong> You may close your account at any time by contacting us at <a href={`mailto:${EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{EMAIL}</a>. Closing your account does not entitle you to a refund of any prepaid subscription fees.</p>
            <p className="mt-3"><strong>14.2 By Us.</strong> We may suspend or terminate your account, with or without notice, if we reasonably determine that:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>You have breached these Terms;</li>
              <li>You no longer meet the eligibility requirements;</li>
              <li>Continuation of your account poses a risk to the Platform, other users, or Enlisted; or</li>
              <li>We are required to do so by law.</li>
            </ul>
            <p className="mt-3"><strong>14.3 Effect of Termination.</strong> Upon termination, your right to use the Platform ceases immediately. Sections 9, 11, 12, 13, 15, and 16 survive termination.</p>
          </Section>

          <Section title="15. Governing Law and Dispute Resolution">
            <p>These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles.</p>
            <p className="mt-3">Any dispute arising from these Terms or your use of the Platform that cannot be resolved by good-faith negotiation shall be submitted to binding arbitration administered by the ADR Institute of Ontario under its National Arbitration Rules, as amended. The seat of arbitration shall be Toronto, Ontario. The language of arbitration shall be English. The arbitral award shall be final and binding.</p>
            <p className="mt-3">Notwithstanding the above, either party may seek interim or injunctive relief from a court of competent jurisdiction in Toronto, Ontario to prevent irreparable harm pending arbitration.</p>
            <p className="mt-3">You agree to resolve disputes with Enlisted on an individual basis and waive any right to participate in a class action or class-wide arbitration.</p>
          </Section>

          <Section title="16. General Provisions">
            <p><strong>Entire Agreement.</strong> These Terms, together with the Privacy Policy and any applicable Subscription Order, constitute the entire agreement between you and Enlisted concerning the Platform and supersede all prior agreements or understandings.</p>
            <p className="mt-3"><strong>Severability.</strong> If any provision of these Terms is held to be unenforceable, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.</p>
            <p className="mt-3"><strong>Waiver.</strong> Our failure to enforce any provision of these Terms shall not constitute a waiver of our right to enforce it in the future.</p>
            <p className="mt-3"><strong>Assignment.</strong> You may not assign your rights or obligations under these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of substantially all of our assets.</p>
            <p className="mt-3"><strong>Notices.</strong> Legal notices to Enlisted must be sent by email to <a href={`mailto:${EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{EMAIL}</a> and by registered mail to the address below. We may send notices to the email address on your account.</p>
          </Section>

          <Section title="17. Amendments">
            <p>We may amend these Terms at any time by posting the revised version on the Platform. We will provide not less than 14 days' notice of material changes by email or by a prominent notice on the Platform. Your continued use of the Platform after the effective date of an amendment constitutes acceptance of the revised Terms.</p>
          </Section>

          <Section title="18. Contact">
            <p>Questions regarding these Terms should be directed to:</p>
            <div className="mt-3 p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'white' }}>
              <p className="font-bold" style={{ color: 'var(--color-navy)' }}>{COMPANY}</p>
              <p>Email: <a href={`mailto:${EMAIL}`} className="underline" style={{ color: 'var(--color-blue)' }}>{EMAIL}</a></p>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-gray)' }}>Toronto, Ontario, Canada</p>
            </div>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t flex flex-wrap gap-4 text-sm" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/privacy" className="hover:underline" style={{ color: 'var(--color-blue)' }}>Privacy Policy →</Link>
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
