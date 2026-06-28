import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChevronRight, Star, Globe, ArrowRight } from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'
import DirectoryClient from './DirectoryClient'
import { getMarketCode } from '@/lib/market'

export const metadata = {
  title: 'Service Provider Directory — Enlisted',
  description: 'Browse 106 categories of professional service providers serving TSX, TSXV, CSE, and NEO listed companies.',
}

export default async function DirectoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/directory')
  const marketCode = getMarketCode()

  const [
    { data: categories },
    { count: providerCount },
    { data: featuredProviders },
  ] = await Promise.all([
    supabase
      .from('service_categories')
      .select('slug, name, group_name, sort_order')
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('provider_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('approval_status', 'approved')
      .eq('primary_market_code', marketCode),
    supabase
      .from('provider_profiles')
      .select(`
        id, company_name, slug, tagline, logo_url, website_url, tier,
        provider_categories ( service_categories ( name, slug ) )
      `)
      .eq('tier', 'featured')
      .eq('is_active', true)
      .eq('approval_status', 'approved')
      .eq('primary_market_code', marketCode)
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>

      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <EnlistedLogo size={26} />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--color-gray)' }}>
            <Link href="/pricing" className="hover:text-[var(--color-navy)] transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-[var(--color-navy)] transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
            <Link href="/register/executive" className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
              Register Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="text-white py-14 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Directory</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Service Provider Directory</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            {categories?.length ?? 106} categories · {providerCount ?? 0} providers · Free to browse
          </p>
        </div>
      </div>

      {/* Featured providers spotlight */}
      {featuredProviders && featuredProviders.length > 0 && (
        <div className="bg-white border-b px-6 py-10" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" style={{ color: 'var(--color-gold)' }} />
                <h2 className="text-lg font-extrabold" style={{ color: 'var(--color-navy)' }}>Featured Partners</h2>
              </div>
              <Link href="/pricing" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-blue)' }}>
                Become a Featured Partner →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProviders.map((p: any) => {
                const primaryCat = p.provider_categories?.[0]?.service_categories
                return (
                  <Link
                    key={p.id}
                    href={primaryCat?.slug ? `/directory/${primaryCat.slug}/${p.slug}` : `/directory/${p.slug}`}
                    className="flex items-start gap-4 p-4 rounded-2xl border hover:shadow-md transition-all group"
                    style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)' }}
                  >
                    {/* Logo or initials */}
                    <div
                      className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-sm font-extrabold text-white overflow-hidden"
                      style={{ backgroundColor: 'var(--color-navy)' }}
                    >
                      {p.logo_url
                        ? <img src={p.logo_url} alt={p.company_name} className="w-full h-full object-contain" />
                        : p.company_name.slice(0, 2).toUpperCase()
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="font-bold text-sm truncate" style={{ color: 'var(--color-navy)' }}>{p.company_name}</p>
                        <Star className="w-3 h-3 fill-current shrink-0" style={{ color: 'var(--color-gold)' }} />
                      </div>
                      {primaryCat && (
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-blue)' }}>{primaryCat.name}</p>
                      )}
                      {p.tagline && (
                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--color-gray)' }}>{p.tagline}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-gold)' }} />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search + category grid (client component) */}
      <DirectoryClient categories={categories ?? []} />
    </div>
  )
}
