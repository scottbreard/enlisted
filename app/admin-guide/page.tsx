export const metadata = { title: 'Enlisted Admin Guide' }

const GOLD = '#D4A017'
const NAVY = '#1B3A6B'

export default function AdminGuidePage() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style dangerouslySetInnerHTML={{ __html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #1a1a1a; background: #fff; line-height: 1.55; }
          @page { size: A4; margin: 16mm 14mm; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          .cover { background: ${NAVY}; color: #fff; padding: 36px 32px 28px; margin-bottom: 20px; border-radius: 8px; }
          .cover-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
          .cover h1 { font-size: 22px; font-weight: 600; margin-bottom: 6px; }
          .cover p { font-size: 13px; color: rgba(255,255,255,0.7); }
          .cover .conf { display: inline-block; margin-top: 10px; background: rgba(212,160,23,0.2); color: ${GOLD}; font-size: 11px; padding: 3px 10px; border-radius: 20px; border: 1px solid ${GOLD}; }
          .section { margin-bottom: 20px; break-inside: avoid; }
          .sec-title { font-size: 11px; font-weight: 600; color: ${NAVY}; text-transform: uppercase; letter-spacing: .07em; background: #EEF3FA; padding: 7px 12px; border-radius: 6px; margin-bottom: 10px; }
          .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 16px; margin-bottom: 8px; break-inside: avoid; }
          .card h3 { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 6px; }
          .card p, .card li { font-size: 12.5px; color: #555; line-height: 1.6; }
          .card ul { padding-left: 16px; margin-top: 4px; }
          .card li { margin-bottom: 3px; }
          .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .step { display: flex; gap: 10px; margin-bottom: 9px; }
          .step-num { width: 22px; height: 22px; border-radius: 50%; background: ${NAVY}; color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
          .step h4 { font-size: 12.5px; font-weight: 600; color: #111; margin-bottom: 2px; }
          .step p { font-size: 12px; color: #555; }
          .step ul { font-size: 12px; color: #555; padding-left: 14px; margin-top: 3px; }
          .badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
          .b { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; }
          .b-green { background: #d1fae5; color: #065f46; }
          .b-red { background: #fee2e2; color: #991b1b; }
          .b-amber { background: #fef3c7; color: #92400e; }
          .b-blue { background: #dbeafe; color: #1e40af; }
          .b-gray { background: #f3f4f6; color: #374151; }
          .b-navy { background: #EEF3FA; color: ${NAVY}; }
          .code { font-family: 'Courier New', monospace; font-size: 11.5px; background: #f3f4f6; padding: 1px 5px; border-radius: 3px; color: #555; }
          .warn { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 9px 13px; font-size: 11.5px; color: #92400e; margin-top: 8px; }
          hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
          .footer { font-size: 10px; color: #aaa; text-align: center; padding-bottom: 8px; }
          .url { font-family: 'Courier New', monospace; font-size: 11px; background: #f3f4f6; padding: 1px 5px; border-radius: 3px; color: #555; }
        ` }} />
      </head>
      <body>
        <div className="cover">
          <div className="cover-logo">
            <svg width="38" height="22" viewBox="0 0 58 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="4" width="7" height="29.5" fill={GOLD}/><rect x="50" y="4" width="7" height="29.5" fill={GOLD}/><rect x="8" y="1" width="42" height="5" fill={GOLD}/><rect x="8" y="6" width="1.4" height="16" fill={GOLD}/><rect x="16.12" y="6" width="1.4" height="16" fill={GOLD}/><rect x="24.24" y="6" width="1.4" height="16" fill={GOLD}/><rect x="32.36" y="6" width="1.4" height="16" fill={GOLD}/><rect x="40.48" y="6" width="1.4" height="16" fill={GOLD}/><rect x="48.6" y="6" width="1.4" height="16" fill={GOLD}/><rect x="12.76" y="6" width="0.4" height="16" fill={GOLD}/><rect x="20.88" y="6" width="0.4" height="16" fill={GOLD}/><rect x="29" y="6" width="0.4" height="16" fill={GOLD}/><rect x="37.12" y="6" width="0.4" height="16" fill={GOLD}/><rect x="45.24" y="6" width="0.4" height="16" fill={GOLD}/><rect x="9.4" y="11.5" width="6.72" height="0.4" fill={GOLD}/><rect x="9.4" y="17" width="6.72" height="0.4" fill={GOLD}/><rect x="17.52" y="11.5" width="6.72" height="0.4" fill={GOLD}/><rect x="17.52" y="17" width="6.72" height="0.4" fill={GOLD}/><rect x="25.64" y="11.5" width="6.72" height="0.4" fill={GOLD}/><rect x="25.64" y="17" width="6.72" height="0.4" fill={GOLD}/><rect x="33.76" y="11.5" width="6.72" height="0.4" fill={GOLD}/><rect x="33.76" y="17" width="6.72" height="0.4" fill={GOLD}/><rect x="41.88" y="11.5" width="6.72" height="0.4" fill={GOLD}/><rect x="41.88" y="17" width="6.72" height="0.4" fill={GOLD}/><rect x="8" y="22" width="42" height="3.5" fill={GOLD}/><rect x="8" y="25.5" width="1.4" height="8" fill={GOLD}/><rect x="16.12" y="25.5" width="1.4" height="8" fill={GOLD}/><rect x="24.24" y="25.5" width="1.4" height="8" fill={GOLD}/><rect x="32.36" y="25.5" width="1.4" height="8" fill={GOLD}/><rect x="40.48" y="25.5" width="1.4" height="8" fill={GOLD}/><rect x="48.6" y="25.5" width="1.4" height="8" fill={GOLD}/><rect x="17.52" y="25.5" width="6.72" height="8" fill={GOLD}/><rect x="25.64" y="25.5" width="6.72" height="8" fill={GOLD}/><rect x="33.76" y="25.5" width="6.72" height="8" fill={GOLD}/><rect x="8" y="33" width="42" height="0.5" fill={GOLD}/>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 700, color: GOLD, letterSpacing: '-0.02em' }}>Enlisted.ca</span>
          </div>
          <h1>Admin Panel Guide</h1>
          <p>Complete reference for managing providers, executives, and platform data.</p>
          <div className="conf">Confidential — internal use only</div>
        </div>

        <div className="section">
          <div className="sec-title">Accessing the admin panel</div>
          <div className="card">
            <h3>Login & access</h3>
            <p>Admin access is restricted to email addresses in the <span className="code">ADMIN_EMAILS</span> environment variable on Vercel. Any other login redirects to the executive dashboard.</p>
            <div style={{ marginTop: 10 }}>
              <div className="step"><div className="step-num">1</div><div><h4>Sign in at enlisted.ca/login</h4><p>Use your admin email and password.</p></div></div>
              <div className="step"><div className="step-num">2</div><div><h4>Navigate to /admin</h4><p>You'll land on the Overview dashboard. If redirected to /dashboard, your email is not in ADMIN_EMAILS.</p></div></div>
            </div>
            <div className="badges">
              <span className="b b-navy">/admin</span>
              <span className="b b-navy">/admin/providers</span>
              <span className="b b-navy">/admin/executives</span>
              <span className="b b-navy">/admin/revenue</span>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="sec-title">Overview dashboard — /admin</div>
          <div className="two-col">
            <div className="card">
              <h3>Live stats</h3>
              <ul>
                <li>Total executives registered</li>
                <li>Total providers (all tiers)</li>
                <li>Paying providers (Listed + Featured)</li>
                <li>Estimated MRR in CAD</li>
                <li>ARR run rate</li>
                <li>Total RFQs sent on platform</li>
              </ul>
            </div>
            <div className="card">
              <h3>Recent activity feeds</h3>
              <ul>
                <li>Last 8 executive signups with company and Founding Member badge</li>
                <li>Last 8 provider signups with tier</li>
                <li>Provider tier breakdown with per-tier MRR</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="sec-title">Providers — /admin/providers</div>

          <div className="card">
            <h3>Reviewing & approving new providers</h3>
            <p>Every new provider lands in <span className="b b-amber">Pending Review</span> and is hidden from the public directory until approved.</p>
            <div style={{ marginTop: 10 }}>
              <div className="step"><div className="step-num">1</div><div><h4>Open "Pending Review" tab at /admin/providers</h4><p>Each card shows company name, tier, email, service categories, and date.</p></div></div>
              <div className="step"><div className="step-num">2</div><div><h4>Click the ˅ chevron to expand a provider</h4><p>Review their tagline, description, website, email, and phone number.</p></div></div>
              <div className="step"><div className="step-num">3</div><div><h4>Approve or Reject</h4><p><span className="b b-green">Approve</span> makes them live in the directory immediately. <span className="b b-red">Reject</span> prompts for a reason — this message is stored on their record and can be shown to them.</p></div></div>
            </div>
            <div className="warn">⚠ Rejected providers are not deleted — they move to the Rejected tab and can be re-approved at any time.</div>
          </div>

          <div className="card">
            <h3>Editing a provider profile</h3>
            <p>Available for providers in any tab (Pending, Approved, or Rejected).</p>
            <div style={{ marginTop: 10 }}>
              <div className="step"><div className="step-num">1</div><div><h4>Expand the provider card → click "Edit Profile"</h4><p>An inline edit form appears.</p></div></div>
              <div className="step"><div className="step-num">2</div><div><h4>Fields you can edit</h4><ul><li>Company name</li><li>Tagline</li><li>Email address</li><li>Website URL</li><li>Description (long text)</li><li>Tier — Free / Listed / Featured</li></ul></div></div>
              <div className="step"><div className="step-num">3</div><div><h4>Click "Save Changes"</h4><p>Updates apply immediately. Page refreshes to confirm.</p></div></div>
            </div>
          </div>

          <div className="two-col">
            <div className="card">
              <h3>Deactivating a provider</h3>
              <p>Hides them from the public directory without deleting their account or subscription data.</p>
              <ul style={{ marginTop: 8 }}>
                <li>Expand card → click <span className="b b-gray">Deactivate</span></li>
                <li>Removed from /directory immediately</li>
                <li>Restore via <span className="b b-green">Reactivate</span> button</li>
              </ul>
            </div>
            <div className="card">
              <h3>Revoking an approved provider</h3>
              <p>On an approved provider the Reject button reads <span className="b b-red">Revoke</span>. Prompts for a reason and moves them to the Rejected tab, removing from directory.</p>
            </div>
          </div>

          <div className="card">
            <h3>Deleting a provider permanently</h3>
            <p>There is no delete button in the admin UI — this prevents accidental data loss. To permanently remove a provider:</p>
            <ul style={{ marginTop: 6 }}>
              <li>Delete the row in Supabase Table Editor → <span className="code">provider_profiles</span></li>
              <li>This cascades to their categories, analytics, and team records</li>
            </ul>
            <div className="warn">⚠ If the provider has an active Stripe subscription, cancel it in the Stripe dashboard first. Deletion is irreversible.</div>
          </div>

          <div className="card">
            <h3>Provider status reference</h3>
            <div className="badges">
              <span className="b b-amber">Pending — awaiting review</span>
              <span className="b b-green">Approved — live in directory</span>
              <span className="b b-red">Rejected — hidden, reason stored</span>
              <span className="b b-green">Active — visible</span>
              <span className="b b-red">Inactive — hidden (deactivated)</span>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="sec-title">Executives — /admin/executives</div>

          <div className="two-col">
            <div className="card">
              <h3>Searching executives</h3>
              <p>Search by first name, last name, company name, or ticker. Toggle Active / Suspended tabs. Shows up to 200 results per view.</p>
            </div>
            <div className="card">
              <h3>Table columns</h3>
              <ul>
                <li>Name & user ID</li>
                <li>Company & ticker</li>
                <li>Title (CEO, CFO, IRO…)</li>
                <li>Founding Member number</li>
                <li>Registration date</li>
                <li>Actions</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h3>Suspending & reactivating an executive</h3>
            <div className="step"><div className="step-num">1</div><div><h4>Click "Suspend" on the executive row</h4><p>Their account is deactivated immediately. On next login they are redirected to /suspended.</p></div></div>
            <div className="step"><div className="step-num">2</div><div><h4>To reinstate: switch to Suspended tab → click "Reactivate"</h4><p>Full access is restored immediately.</p></div></div>
          </div>

          <div className="card">
            <h3>Permanently removing an executive</h3>
            <div className="step"><div className="step-num">1</div><div><h4>Click "Remove" — an inline confirmation appears</h4><p>You must click "Confirm" to proceed.</p></div></div>
            <div className="step"><div className="step-num">2</div><div><h4>Record and auth account are permanently deleted</h4><p>Cascades to exchanges, vault, contacts, and compliance events.</p></div></div>
            <div className="warn">⚠ The executive cannot log back in with that email without re-registering from scratch.</div>
          </div>

          <div className="card">
            <h3>Adding an executive manually</h3>
            <p>No admin "add" button exists. Options:</p>
            <ul style={{ marginTop: 6 }}>
              <li>Use the normal flow at enlisted.ca/register/executive on their behalf, or</li>
              <li>Insert directly into <span className="code">executive_profiles</span> in Supabase after creating their auth user in the Auth dashboard</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <div className="sec-title">Revenue — /admin/revenue</div>
          <div className="two-col">
            <div className="card">
              <h3>Metrics displayed</h3>
              <ul>
                <li>MRR — active subscriptions only</li>
                <li>ARR — MRR × 12 run rate</li>
                <li>Active subscription count by tier</li>
                <li>Per-tier MRR contribution</li>
                <li>Last 20 paying providers with tier, billing interval, status</li>
              </ul>
            </div>
            <div className="card">
              <h3>Pricing rates (CAD)</h3>
              <div className="badges" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="b b-blue">Listed — $100/mo or $1,000/yr</span>
                <span className="b b-amber">Featured — $1,000/mo or $10,000/yr</span>
                <span className="b b-gray">Free — $0</span>
              </div>
              <p style={{ marginTop: 10 }}>MRR is estimated from tier counts in the database. Stripe is the billing source of truth.</p>
            </div>
          </div>

          <div className="card">
            <h3>Managing billing & subscriptions</h3>
            <p>All subscription management (cancellations, refunds, plan changes, invoices) must be done in the Stripe dashboard — the admin panel does not have direct Stripe controls yet.</p>
            <ul style={{ marginTop: 8 }}>
              <li>To change a provider's displayed tier: edit in admin UI (affects what features they see)</li>
              <li>To change their billing: update separately in Stripe dashboard</li>
            </ul>
            <div className="warn">⚠ Changing a provider's tier in the admin UI does NOT affect their Stripe subscription. Always update both.</div>
          </div>
        </div>

        <div className="section">
          <div className="sec-title">Admin access control</div>
          <div className="card">
            <h3>Adding or removing admin users</h3>
            <p>Admin access is controlled by the <span className="code">ADMIN_EMAILS</span> environment variable in Vercel (comma-separated list).</p>
            <ul style={{ marginTop: 8 }}>
              <li>To grant access: add email to ADMIN_EMAILS in Vercel → redeploy</li>
              <li>To revoke access: remove email → redeploy</li>
              <li>No code change needed — env var update only</li>
            </ul>
            <div className="warn">⚠ Anyone in ADMIN_EMAILS has full admin access. There are no role tiers within admin at this stage.</div>
          </div>
        </div>

        <hr />
        <div className="footer">Enlisted Inc. — Admin Guide v1.0 — June 2026 — Confidential</div>
      </body>
    </html>
  )
}
