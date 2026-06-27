import { MetadataRoute } from 'next'
import { getMarket } from '@/lib/market'

export default function robots(): MetadataRoute.Robots {
  const market = getMarket()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/profile',
          '/compliance',
          '/vault',
          '/rfq',
          '/news',
          '/rolodex',
          '/provider/',
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: `https://${market.domain}/sitemap.xml`,
  }
}
