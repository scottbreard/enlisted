import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getMarket } from '@/lib/market'

const BASE = `https://${getMarket().domain}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                              priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/directory`,               priority: 0.9, changeFrequency: 'daily'  },
    { url: `${BASE}/pricing`,                 priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/about`,                   priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/login`,                   priority: 0.4, changeFrequency: 'yearly'  },
    { url: `${BASE}/register/executive`,      priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/register/provider`,       priority: 0.8, changeFrequency: 'monthly' },
  ]

  // Category pages — high SEO value
  const { data: categories } = await supabase
    .from('service_categories')
    .select('slug, updated_at')

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map(cat => ({
    url: `${BASE}/directory/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  // Provider profile pages (connected + featured tiers only — listed have no content)
  const { data: providers } = await supabase
    .from('provider_profiles')
    .select(`
      slug, updated_at,
      provider_categories(
        category_id, is_primary,
        service_categories(slug)
      )
    `)
    .eq('is_active', true)
    .in('tier', ['connected', 'featured'])

  const providerRoutes: MetadataRoute.Sitemap = []
  for (const p of providers ?? []) {
    const primaryCat = (p.provider_categories as any[])?.find((pc: any) => pc.is_primary)
    const catSlug = primaryCat?.service_categories?.slug
    if (catSlug && p.slug) {
      providerRoutes.push({
        url: `${BASE}/directory/${catSlug}/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        priority: 0.7,
        changeFrequency: 'weekly' as const,
      })
    }
  }

  return [...staticRoutes, ...categoryRoutes, ...providerRoutes]
}
