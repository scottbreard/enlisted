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
export const PRICES: Record<string, { monthly: string; annual: string; amount_monthly: number; amount_annual: number }> = {
  listed: {
    monthly: process.env.STRIPE_PRICE_CONNECTED_MONTHLY ?? '',
    annual:  process.env.STRIPE_PRICE_CONNECTED_ANNUAL  ?? '',
    amount_monthly: 10000,  // $100.00 CAD
    amount_annual:  100000, // $1,000.00 CAD
  },
  featured: {
    monthly: process.env.STRIPE_PRICE_FEATURED_MONTHLY ?? '',
    annual:  process.env.STRIPE_PRICE_FEATURED_ANNUAL  ?? '',
    amount_monthly: 100000,  // $1,000.00 CAD
    amount_annual:  1000000, // $10,000.00 CAD
  },
}

export const TIER_NAMES: Record<string, string> = {
  free:     'Free',
  listed:   'Listed',
  featured: 'Featured',
}
