import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  const { type, email, firstName, companyName, foundingNumber } = await req.json()

  if (!resend) {
    // Key not configured yet — log and return OK so registration never fails
    console.log(`[email] welcome email skipped (no RESEND_API_KEY): ${type} → ${email}`)
    return NextResponse.json({ ok: true, skipped: true })
  }

  try {
    if (type === 'executive') {
      await resend.emails.send({
        from: 'Enlisted <welcome@enlisted.ca>',
        to: email,
        subject: foundingNumber
          ? `Welcome to Enlisted — You're Founding Member #${foundingNumber}`
          : 'Welcome to Enlisted',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222">
            <div style="background:#1B3A6B;padding:32px;text-align:center">
              <h1 style="color:white;margin:0;font-size:28px;font-weight:900">
                Enlisted<span style="color:#B8860B">.</span>
              </h1>
            </div>
            <div style="padding:40px 32px">
              <p style="font-size:18px;font-weight:700;color:#1B3A6B">Welcome, ${firstName}.</p>
              ${foundingNumber ? `
              <div style="background:#FDF3DC;border:2px solid #B8860B;border-radius:12px;padding:16px;margin:16px 0">
                <p style="margin:0;font-weight:700;color:#B8860B;font-size:14px">⭐ Founding Member #${foundingNumber} of 500</p>
                <p style="margin:4px 0 0;font-size:13px;color:#555">Your Founding Member badge is permanent and will appear on your profile.</p>
              </div>` : ''}
              <p style="color:#555;line-height:1.6">Your Enlisted account is ready. Here's what to do next:</p>
              <ol style="color:#555;line-height:2;padding-left:20px">
                <li>Complete your profile — add your ticker and exchange</li>
                <li>Your compliance calendar will auto-generate from your exchange rules</li>
                <li>Browse the directory to find your service providers</li>
                <li>Try the AI assistant — ask it anything about running a public company</li>
              </ol>
              <div style="text-align:center;margin:32px 0">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                  style="background:#1B3A6B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
                  Go to My Dashboard →
                </a>
              </div>
              <p style="color:#888;font-size:12px">Enlisted Inc. · enlisted.ca · Free for public company executives, always.</p>
            </div>
          </div>
        `,
      })
    } else {
      await resend.emails.send({
        from: 'Enlisted <welcome@enlisted.ca>',
        to: email,
        subject: `${companyName} is now listed on Enlisted`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222">
            <div style="background:#1B3A6B;padding:32px;text-align:center">
              <h1 style="color:white;margin:0;font-size:28px;font-weight:900">
                Enlisted<span style="color:#B8860B">.</span>
              </h1>
            </div>
            <div style="padding:40px 32px">
              <p style="font-size:18px;font-weight:700;color:#1B3A6B">Welcome, ${companyName}.</p>
              <p style="color:#555;line-height:1.6">
                Your provider account is created. Here's what to do next to start attracting executives:
              </p>
              <ol style="color:#555;line-height:2;padding-left:20px">
                <li>Add your tagline and description</li>
                <li>Upload your logo</li>
                <li>Add your website and contact email</li>
                <li>Upgrade to Connected ($100/mo) to receive RFQs and show full contact details</li>
              </ol>
              <div style="text-align:center;margin:32px 0">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/provider/dashboard"
                  style="background:#1B3A6B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
                  Complete My Profile →
                </a>
              </div>
              <p style="color:#888;font-size:12px">Enlisted Inc. · enlisted.ca</p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[email] welcome send failed:', err)
    return NextResponse.json({ ok: true, error: 'send failed' }) // never block registration
  }
}
