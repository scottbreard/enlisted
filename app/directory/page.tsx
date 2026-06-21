import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Building2, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Service Provider Directory — Enlisted',
  description: 'Browse 92 categories of professional service providers serving TSX, TSXV, CSE, and NEO listed companies.',
}

const GROUP_ICONS: Record<string, string> = {
  'Legal & Compliance': '⚖️',
  'Finance & Accounting': '📊',
  'Capital Markets & Trading': '📈',
  'Corporate Administration': '🏛️',
  'Investor Relations': '📣',
  'Communications & Media': '📰',
  'Digital & Technology': '💻',
  'Executive & Board': '👔',
  'Insurance & Risk': '🛡️',
  'Specialized Finance': '💰',
  'Printing, Design & Production': '🎨',
  'Education, Research & Governance': '🎓',
  'Data & Analytics': '🔍',
  'Sector-Specific Services': '⛏️',
  'Events & Access': '🎤',
}

export default async function DirectoryPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  // Group categories
  const groups: Record<string, typeof categories> = {}
  for (const cat of categories ?? []) {
    if (!groups[cat.group_name]) groups[cat.group_name] = []
    groups[cat.group_name]!.push(cat)
  }

  const { count: providerCount } = await supabase
    .from('provider_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>
      {/* Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
            <span className="text-lg font-extrabold" style={{ color: 'var(--color-navy)' }}>
              Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span>
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

      {/* Hero */}
      <div className="text-white py-16 px-6" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Directory</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Service Provider Directory</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            {categories?.length ?? 92} categories · {providerCount ?? 0} providers · Free to browse
          </p>
        </div>
      </div>

      {/* Category groups */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {Object.entries(groups).map(([groupName, cats]) => (
            <div key={groupName}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{GROUP_ICONS[groupName] ?? '📁'}</span>
                <div>
                  <h2 className="text-xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{groupName}</h2>
                  <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>{cats?.length} categories</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {cats?.map(cat => (
                  <Link
                    key={cat.slug}
                    href={`/directory/${cat.slug}`}
                    className="bg-white border rounded-xl px-4 py-3 hover:shadow-md hover:border-blue-300 transition-all group"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <p className="text-sm font-semibold group-hover:text-blue-700 transition-colors leading-snug" style={{ color: 'var(--color-gray-dark)' }}>
                      {cat.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-navy)' }}>
          <h2 className="text-2xl font-extrabold text-white mb-2">Are you a service provider?</h2>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>Get listed and reach every public company executive in Canada.</p>
          <Link href="/register/provider" className="font-bold px-8 py-3 rounded-xl inline-block" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>
            List Your Firm →
          </Link>
        </div>
      </div>
    </div>
  )
}
