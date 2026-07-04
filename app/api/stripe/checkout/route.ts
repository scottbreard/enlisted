import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICES, TIER_NAMES, MAX_FEATURED_PER_CATEGORY } from '@/lib/stripe'

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

    // Featured is capped per category (see MAX_FEATURED_PER_CATEGORY)
    if (tier === 'featured') {
      const { data: primaryCat } = await supabase
        .from('provider_categories')
        .select('category_id, service_categories(name)')
        .eq('provider_id', profile.id)
        .order('is_primary', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (primaryCat) {
        const { data: peers } = await supabase
          .from('provider_categories')
          .select('provider_id')
          .eq('category_id', primaryCat.category_id)
        const peerIds = (peers ?? []).map(p => p.provider_id).filter(id => id !== profile.id)
        if (peerIds.length) {
          const { count } = await supabase
            .from('provider_profiles')
            .select('*', { count: 'exact', head: true })
            .in('id', peerIds)
            .eq('tier', 'featured')
            .eq('is_active', true)
          if ((count ?? 0) >= MAX_FEATURED_PER_CATEGORY) {
            const catName = (primaryCat as any).service_categories?.name ?? 'your category'
            return NextResponse.json(
              { error: `All ${MAX_FEATURED_PER_CATEGORY} Featured spots in ${catName} are taken. Email hello@enlisted.ca to join the waitlist.` },
              { status: 409 }
            )
          }
        }
      }
    }

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

    // Bill anchor: Sept 1 2026 — pay now, annual term starts Sept 1
    const sept1 = Math.floor(new Date('2026-09-01T00:00:00Z').getTime() / 1000)
    const now = Math.floor(Date.now() / 1000)
    const billingAnchor = sept1 > now ? sept1 : undefined

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      currency: 'cad',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/billing?success=1`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/provider/billing?cancelled=1`,
      subscription_data: {
        metadata: { provider_id: profile.id, tier },
        ...(billingAnchor && interval === 'year' ? { billing_cycle_anchor: billingAnchor, proration_behavior: 'none' } : {}),
      },
      metadata: { provider_id: profile.id, tier },
      automatic_tax: { enabled: true },
      billing_address_collection: 'required',
      customer_update: { address: 'auto', name: 'auto' },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
