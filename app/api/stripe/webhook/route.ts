import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Lazy-initialized so missing keys don't crash the build
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// Map Stripe price IDs back to tier names
function tierFromPriceId(priceId: string): string | null {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_CONNECTED_MONTHLY ?? '__']: 'listed',
    [process.env.STRIPE_PRICE_CONNECTED_ANNUAL  ?? '__']: 'listed',
    [process.env.STRIPE_PRICE_FEATURED_MONTHLY  ?? '__']: 'featured',
    [process.env.STRIPE_PRICE_FEATURED_ANNUAL   ?? '__']: 'featured',
  }
  return map[priceId] ?? null
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const providerId = session.metadata?.provider_id
        const tier = session.metadata?.tier
        if (providerId && tier) {
          await getSupabaseAdmin()
            .from('provider_profiles')
            .update({
              tier,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
              subscription_interval: session.mode === 'subscription' ? null : null,
            })
            .eq('id', providerId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const providerId = sub.metadata?.provider_id
        if (!providerId) break

        const priceId = sub.items.data[0]?.price?.id
        const tier = priceId ? tierFromPriceId(priceId) : null

        await getSupabaseAdmin()
          .from('provider_profiles')
          .update({
            ...(tier ? { tier } : {}),
            stripe_subscription_id: sub.id,
            subscription_status: sub.status,
            subscription_interval: sub.items.data[0]?.plan?.interval ?? null,
          })
          .eq('id', providerId)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const providerId = sub.metadata?.provider_id
        if (providerId) {
          await getSupabaseAdmin()
            .from('provider_profiles')
            .update({ tier: 'free', subscription_status: 'cancelled', stripe_subscription_id: null })
            .eq('id', providerId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        if (customerId) {
          await getSupabaseAdmin()
            .from('provider_profiles')
            .update({ subscription_status: 'past_due' })
            .eq('stripe_customer_id', customerId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
