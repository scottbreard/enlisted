import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICES, TIER_NAMES } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { tier, interval } = await req.json() as { tier: string; interval: 'month' | 'year' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('provider_profiles')
      .select('id, company_name, stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })

    if (!['listed', 'featured'].includes(tier)) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    const priceConfig = PRICES[tier]
    if (!priceConfig) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

    const priceId = interval === 'year' ? priceConfig.annual : priceConfig.monthly
    if (!priceId) return NextResponse.json({ error: 'Price not configured yet' }, { status: 400 })

    // Create or retrieve Stripe customer
    let customerId = profile.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.company_name,
        metadata: { provider_id: profile.id, user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('provider_profiles').update({ stripe_customer_id: customerId }).eq('id', profile.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      currency: 'cad',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/billing?success=1`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/provider/billing?cancelled=1`,
      subscription_data: {
        metadata: { provider_id: profile.id, tier },
      },
      metadata: { provider_id: profile.id, tier },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
