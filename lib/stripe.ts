import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

// Price IDs — create in Stripe dashboard (Products), paste IDs here
export const PRICES: Record<string, { monthly: string; annual: string; amount_monthly: number; amount_annual: number }> = {
  connected: {
    monthly: process.env.STRIPE_PRICE_CONNECTED_MONTHLY ?? '',
    annual:  process.env.STRIPE_PRICE_CONNECTED_ANNUAL  ?? '',
    amount_monthly: 10000,  // $100.00 CAD
    amount_annual:  100000, // $1,000.00 CAD
  },
  featured: {
    monthly: process.env.STRIPE_PRICE_FEATURED_MONTHLY ?? '',
    annual:  process.env.STRIPE_PRICE_FEATURED_ANNUAL  ?? '',
    amount_monthly: 49900,  // $499.00 CAD
    amount_annual:  499000, // $4,990.00 CAD
  },
}

export const TIER_NAMES: Record<string, string> = {
  listed:    'Listed',
  connected: 'Connected',
  featured:  'Featured',
}
