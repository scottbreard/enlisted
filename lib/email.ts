import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = 'Enlisted.ca <hello@enlisted.ca>'

export async function sendProviderWelcomeEmail({
  to,
  companyName,
  tier,
}: {
  to: string
  companyName: string
  tier: string
}) {
  if (!resend) return

  const tierLabel = tier === 'featured' ? 'Featured' : tier === 'listed' ? 'Listed' : 'Free'

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to Enlisted.ca — ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;border:1px solid #dddddd;">

        <!-- Header -->
        <tr><td style="background:#1B3A6B;padding:32px 40px;">
          <p style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">
            En<span style="color:#D9A421;">listed</span><span style="color:rgba(255,255,255,0.45);">.ca</span>
          </p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">
            The marketplace for Canadian public company services
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#1B3A6B;">
            Welcome to Enlisted, ${companyName}
          </h1>
          <p style="margin:0 0 16px;color:#555555;font-size:15px;line-height:1.6;">
            Your listing has been received and is under review. We typically complete reviews within 1 business day.
          </p>
          <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6;">
            Your current plan: <strong style="color:#1B3A6B;">${tierLabel}</strong>
          </p>

          <div style="background:#f8f9fc;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-weight:700;color:#1B3A6B;font-size:14px;">What happens next:</p>
            <ol style="margin:0;padding-left:20px;color:#555555;font-size:14px;line-height:2;">
              <li>Our team reviews your profile for accuracy</li>
              <li>You'll receive a confirmation email once approved</li>
              <li>Your listing goes live in the Enlisted directory</li>
              <li>Canadian public company executives can find and contact you</li>
            </ol>
          </div>

          <div style="background:#FDF3DC;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-weight:700;color:#B8860B;font-size:14px;">Executives arrive September 1</p>
            <p style="margin:0 0 12px;color:#555555;font-size:14px;line-height:1.6;">
              We onboard providers first — on purpose — so the directory is complete the day the first
              executive logs in. Our launch outreach covers 13,000+ executives and directors across every
              TSX, TSXV, CSE, and NEO issuer, and every registration is verified against exchange listings.
            </p>
            <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
              And they don't visit once: their free dashboard includes a compliance calendar with their
              exchange's filing deadlines, a live stock dashboard and news feed, and a contract vault with
              renewal reminders. Every visit puts them in front of the directory — and your listing.
            </p>
          </div>

          <p style="margin:0 0 24px;color:#555555;font-size:14px;line-height:1.6;">
            While you wait, log in to complete your profile — a fuller profile means better visibility once
            approved. A complete profile before September 1 means you're there on day one.
          </p>

          <a href="https://enlisted.ca/provider/profile"
            style="display:inline-block;background:#1B3A6B;color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:14px;">
            Complete Your Profile →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #dddddd;">
          <p style="margin:0;color:#888888;font-size:12px;line-height:1.6;">
            Enlisted Inc. · Toronto, Ontario, Canada<br>
            Questions? Reply to this email or contact <a href="mailto:hello@enlisted.ca" style="color:#2E75B6;">hello@enlisted.ca</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}

export async function sendProviderApprovedEmail({
  to,
  companyName,
  slug,
  categorySlug,
}: {
  to: string
  companyName: string
  slug: string
  categorySlug: string | null
}) {
  if (!resend) return

  // Listing pages live at /directory/[category]/[slug]; without a category
  // the best we can send is the directory root
  const listingUrl = categorySlug
    ? `https://enlisted.ca/directory/${categorySlug}/${slug}`
    : 'https://enlisted.ca/directory'

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your Enlisted listing is live — ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;border:1px solid #dddddd;">

        <tr><td style="background:#1B3A6B;padding:32px 40px;">
          <p style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">En<span style="color:#D9A421;">listed</span><span style="color:rgba(255,255,255,0.45);">.ca</span></p>
        </td></tr>

        <tr><td style="padding:40px;">
          <div style="width:48px;height:48px;background:#d1fae5;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <span style="font-size:24px;">✅</span>
          </div>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#1B3A6B;">You're live on Enlisted</h1>
          <p style="margin:0 0 16px;color:#555555;font-size:15px;line-height:1.6;">
            <strong>${companyName}</strong> is now visible to Canadian public company executives in the Enlisted directory.
          </p>
          <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6;">
            Executives searching for your service categories can now find and contact you directly.
          </p>

          <div style="display:flex;gap:12px;margin-bottom:24px;">
            <a href="${listingUrl}"
              style="display:inline-block;background:#1B3A6B;color:white;text-decoration:none;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;margin-right:12px;">
              View Your Listing →
            </a>
            <a href="https://enlisted.ca/provider/profile"
              style="display:inline-block;border:2px solid #dddddd;color:#1B3A6B;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;">
              Edit Profile
            </a>
          </div>

          <div style="background:#FDF3DC;border-radius:12px;padding:20px;">
            <p style="margin:0 0 8px;font-weight:700;color:#B8860B;font-size:14px;">Maximize your visibility</p>
            <ul style="margin:0;padding-left:20px;color:#555555;font-size:14px;line-height:2;">
              <li>Add a company logo and team photos</li>
              <li>Write a compelling 200–750 word description</li>
              <li>Select all relevant service categories</li>
              <li>Link your exchanges to target the right executives</li>
            </ul>
          </div>
        </td></tr>

        <tr><td style="padding:24px 40px;border-top:1px solid #dddddd;">
          <p style="margin:0;color:#888888;font-size:12px;line-height:1.6;">
            Enlisted Inc. · Toronto, Ontario, Canada<br>
            Questions? <a href="mailto:hello@enlisted.ca" style="color:#2E75B6;">hello@enlisted.ca</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}

export async function sendProviderRejectedEmail({
  to,
  companyName,
  reason,
}: {
  to: string
  companyName: string
  reason: string
}) {
  if (!resend) return

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your Enlisted listing needs attention — ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;border:1px solid #dddddd;">

        <tr><td style="background:#1B3A6B;padding:32px 40px;">
          <p style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">En<span style="color:#D9A421;">listed</span><span style="color:rgba(255,255,255,0.45);">.ca</span></p>
        </td></tr>

        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#1B3A6B;">Your listing needs a revision</h1>
          <p style="margin:0 0 16px;color:#555555;font-size:15px;line-height:1.6;">
            We reviewed <strong>${companyName}</strong>'s listing and need you to make some updates before we can approve it.
          </p>

          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-weight:700;color:#991b1b;font-size:14px;">Reason for revision:</p>
            <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.6;">${reason}</p>
          </div>

          <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6;">
            Please log in, update your profile, and reply to this email when you're ready for another review.
          </p>

          <a href="https://enlisted.ca/provider/profile"
            style="display:inline-block;background:#1B3A6B;color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:14px;">
            Update Your Profile →
          </a>
        </td></tr>

        <tr><td style="padding:24px 40px;border-top:1px solid #dddddd;">
          <p style="margin:0;color:#888888;font-size:12px;line-height:1.6;">
            Enlisted Inc. · Toronto, Ontario, Canada<br>
            Questions? Reply to this email or contact <a href="mailto:hello@enlisted.ca" style="color:#2E75B6;">hello@enlisted.ca</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}
