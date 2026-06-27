import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Building2, ChevronRight, Globe, Mail, Phone, Link2, CheckCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: p } = await supabase.from('provider_profiles').select('company_name, tagline').eq('slug', slug).single()
  if (!p) return { title: 'Not Found' }
  return {
    title: `${p.company_name} — Enlisted`,
    description: p.tagline ?? `${p.company_name} is a service provider for Canadian public companies on Enlisted.`,
  }
}

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  featured:  { label: 'Featured',  color: '#92400e', bg: '#fef3c7' },
  connected: { label: 'Connected', color: '#1e40af', bg: '#dbeafe' },
  listed:    { label: 'Listed',    color: '#6b7280', bg: '#f3f4f6' },
}

export default async function ProviderProfilePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/directory/${category}/${slug}`)

  const { data: provider } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
      .eq('approval_status', 'approved')
    .single()

  if (!provider) notFound()

  const { data: cat } = await supabase
    .from('service_categories')
    .select('name, group_name')
    .eq('slug', category)
    .single()

  // Get team members (Better/Best)
  const { data: team } = await supabase
    .from('provider_team')
    .select('*')
    .eq('provider_id', provider.id)
    .order('sort_order')

  // Get exchanges served
  const { data: providerExchanges } = await supabase
    .from('provider_exchanges')
    .select('exchange_id, exchanges(code)')
    .eq('provider_id', provider.id)

  // Get active member discounts
  const { data: discounts } = await supabase
    .from('member_discounts')
    .select('*')
    .eq('provider_id', provider.id)
    .eq('active', true)

  // Fire analytics view (fire and forget)
  supabase.from('provider_analytics').insert({
    provider_id: provider.id,
    event_type: 'profile_view',
    market_id: null,
  }).then(() => {})

  const tier = TIER_LABELS[provider.tier] ?? TIER_LABELS.free
  const canShowTeam = provider.tier === 'featured'
  const canShowVideo = provider.tier === 'featured'

  const exchangeCodes = providerExchanges
    ?.map((pe: any) => pe.exchanges?.code)
    .filter(Boolean) ?? []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>
      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: 'var(--color-canada)' }} />
            <span className="text-lg font-extrabold" style={{ color: 'var(--color-canada)' }}>
              Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-canada)' }}>ca</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-navy)' }}>Sign In</Link>
            <Link href="/register/executive" className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
              Register Free
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-white px-6 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm" style={{ color: 'var(--color-gray-light)' }}>
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/directory" className="hover:underline">Directory</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/directory/${category}`} className="hover:underline">{cat?.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: 'var(--color-gray-dark)' }}>{provider.company_name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Main */}
        <div className="flex-1 space-y-6">

          {/* Header card */}
          <div className="bg-white border rounded-2xl p-8" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                {provider.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={provider.logo_url} alt={provider.company_name} className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  provider.company_name.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{provider.company_name}</h1>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: tier.bg, color: tier.color }}>
                    {tier.label}
                  </span>
                  {provider.is_verified && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {discounts && discounts.length > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
                      🏷️ Member Discount
                    </span>
                  )}
                </div>
                {provider.tagline && (
                  <p className="text-lg mb-3" style={{ color: 'var(--color-gray)' }}>{provider.tagline}</p>
                )}
                {exchangeCodes.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {exchangeCodes.map((code: string) => (
                      <span key={code} className="text-xs font-bold px-2 py-0.5 rounded border" style={{ borderColor: 'var(--color-navy)', color: 'var(--color-navy)' }}>
                        {code}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          {(provider.description || provider.long_description) && (
            <div className="bg-white border rounded-2xl p-8" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>About</h2>
              <div className="prose prose-sm max-w-none" style={{ color: 'var(--color-gray-dark)' }}>
                <p className="leading-relaxed">{provider.long_description ?? provider.description}</p>
              </div>
            </div>
          )}

          {/* Video (Best only) */}
          {canShowVideo && provider.video_embed_url && (
            <div className="bg-white border rounded-2xl p-8" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Video</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe src={provider.video_embed_url} className="w-full h-full" allowFullScreen />
              </div>
            </div>
          )}

          {/* Team (Better/Best) */}
          {canShowTeam && team && team.length > 0 && (
            <div className="bg-white border rounded-2xl p-8" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>Our Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {team.map((member: any) => (
                  <div key={member.id} className="text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: 'var(--color-blue)' }}>
                      {member.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.avatar_url} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                      ) : member.name.charAt(0)}
                    </div>
                    <p className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>{member.name}</p>
                    {member.title && <p className="text-xs mb-1" style={{ color: 'var(--color-gray)' }}>{member.title}</p>}
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Link2 className="w-4 h-4" style={{ color: 'var(--color-blue)' }} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Discount */}
          {discounts && discounts.length > 0 && (
            <div className="border-2 rounded-2xl p-6" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)' }}>
              <h2 className="text-lg font-extrabold mb-1" style={{ color: 'var(--color-navy)' }}>🏷️ Member Discount Available</h2>
              <p className="text-sm mb-3" style={{ color: 'var(--color-gray)' }}>
                {discounts[0].title} — {discounts[0].discount_type === 'percentage'
                  ? `${discounts[0].discount_value}% off`
                  : `$${discounts[0].discount_value} off`}
              </p>
              <Link href="/register/executive" className="text-sm font-bold px-4 py-2 rounded-lg text-white inline-block" style={{ backgroundColor: 'var(--color-navy)' }}>
                Register Free to Claim
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-4">
          {/* Contact */}
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-navy)' }}>Contact</h3>
            <div className="space-y-3">
              {provider.website_url && (
                <a href={provider.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">{provider.website_url.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {provider.email && (
                <a href={`mailto:${provider.email}`}
                  className="flex items-center gap-3 text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>
                  <Mail className="w-4 h-4 shrink-0" /> {provider.email}
                </a>
              )}
              {provider.phone && (
                <span className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-gray)' }}>
                  <Phone className="w-4 h-4 shrink-0" /> {provider.phone}
                </span>
              )}
            </div>
            <div className="mt-5 space-y-2">
              <Link href="/register/executive"
                className="block text-center text-sm font-bold py-2.5 rounded-xl text-white w-full"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                Send RFQ
              </Link>
              {provider.website_url && (
                <a href={provider.website_url} target="_blank" rel="noopener noreferrer"
                  className="block text-center text-sm font-semibold py-2.5 rounded-xl border w-full"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray-dark)' }}>
                  Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-navy)' }}>Details</h3>
            <dl className="space-y-2 text-sm">
              {provider.founded_year && (
                <div className="flex justify-between">
                  <dt style={{ color: 'var(--color-gray)' }}>Founded</dt>
                  <dd className="font-semibold" style={{ color: 'var(--color-gray-dark)' }}>{provider.founded_year}</dd>
                </div>
              )}
              {provider.team_size && (
                <div className="flex justify-between">
                  <dt style={{ color: 'var(--color-gray)' }}>Team size</dt>
                  <dd className="font-semibold" style={{ color: 'var(--color-gray-dark)' }}>{provider.team_size}</dd>
                </div>
              )}
              {cat && (
                <div className="flex justify-between">
                  <dt style={{ color: 'var(--color-gray)' }}>Category</dt>
                  <dd className="font-semibold text-right" style={{ color: 'var(--color-gray-dark)' }}>{cat.name}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
            <p className="font-bold text-sm mb-1">Register free as an executive</p>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>Access full contact details, send RFQs, and manage your providers.</p>
            <Link href="/register/executive" className="block text-center text-sm font-bold py-2 rounded-lg" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>
              Get Started Free
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
