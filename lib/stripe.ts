import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-05-27.dahlia',
    })
  }
  return _stripe
}

// Legacy alias — prefer getStripe() in new code
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop]
  },
})

// Price IDs — create in Stripe dashboard (Products), paste IDs here
// Annual-only billing — no monthly plans
export const PRICES: Record<string, { annual: string; amount_annual: number }> = {
  listed: {
    annual: process.env.STRIPE_PRICE_CONNECTED_ANNUAL ?? '',
    amount_annual: 120000, // $1,200.00 CAD
  },
  featured: {
    annual: process.env.STRIPE_PRICE_FEATURED_ANNUAL ?? '',
    amount_annual: 600000, // $6,000.00 CAD
  },
}

export const TIER_NAMES: Record<string, string> = {
  free:     'Free',
  listed:   'Listed',
  featured: 'Featured',
}

// Featured tier is capped per category — scarcity is the product
export const MAX_FEATURED_PER_CATEGORY = 5
