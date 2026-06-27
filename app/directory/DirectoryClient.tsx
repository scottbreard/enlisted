'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

const GROUP_ICONS: Record<string, string> = {
  'Legal & Compliance':              '⚖️',
  'Finance & Accounting':            '📊',
  'Capital Markets & Trading':       '📈',
  'Corporate Administration':        '🏛️',
  'Investor Relations':              '📣',
  'Communications & Media':          '📰',
  'Digital & Technology':            '💻',
  'Executive & Board':               '👔',
  'Insurance & Risk':                '🛡️',
  'Specialized Finance':             '💰',
  'Printing, Design & Production':   '🎨',
  'Education, Research & Governance':'🎓',
  'Data & Analytics':                '🔍',
  'Sector-Specific Services':        '⛏️',
  'Events & Access':                 '🎤',
}

const EXCHANGES = ['TSX', 'TSXV', 'CSE', 'NEO']

type Category = {
  slug: string
  name: string
  group_name: string
  sort_order: number
}

export default function DirectoryClient({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState('')
  const [exchange, setExchange] = useState<string | null>(null)

  const filtered = categories.filter(cat =>
    !query || cat.name.toLowerCase().includes(query.toLowerCase()) ||
    cat.group_name.toLowerCase().includes(query.toLowerCase())
  )

  // Group filtered categories
  const groups: Record<string, Category[]> = {}
  for (const cat of filtered) {
    if (!groups[cat.group_name]) groups[cat.group_name] = []
    groups[cat.group_name]!.push(cat)
  }

  const categoryHref = (slug: string) =>
    exchange ? `/directory/${slug}?exchange=${exchange}` : `/directory/${slug}`

  const hasResults = filtered.length > 0

  return (
    <>
      {/* Search + exchange filter bar */}
      <div className="sticky top-16 z-40 bg-white border-b px-6 py-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-gray-light)' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search categories… e.g. IR, audit, market maker"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray-dark)' }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4" style={{ color: 'var(--color-gray-light)' }} />
              </button>
            )}
          </div>

          {/* Exchange pills */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-gray)' }}>Exchange:</span>
            <button
              onClick={() => setExchange(null)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                backgroundColor: !exchange ? 'var(--color-navy)' : 'white',
                color: !exchange ? 'white' : 'var(--color-gray)',
                border: `1px solid ${!exchange ? 'var(--color-navy)' : 'var(--color-border)'}`,
              }}
            >
              All
            </button>
            {EXCHANGES.map(ex => (
              <button
                key={ex}
                onClick={() => setExchange(exchange === ex ? null : ex)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: exchange === ex ? 'var(--color-gold)' : 'white',
                  color: exchange === ex ? 'white' : 'var(--color-gray)',
                  border: `1px solid ${exchange === ex ? 'var(--color-gold)' : 'var(--color-border)'}`,
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter summary */}
        {(query || exchange) && (
          <div className="max-w-7xl mx-auto mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--color-gray)' }}>
            <span>{filtered.length} {filtered.length === 1 ? 'category' : 'categories'}</span>
            {query && <span>matching &ldquo;<strong>{query}</strong>&rdquo;</span>}
            {exchange && <span>on <strong>{exchange}</strong></span>}
            <button onClick={() => { setQuery(''); setExchange(null) }} className="underline hover:no-underline ml-1" style={{ color: 'var(--color-blue)' }}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Category groups */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!hasResults ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-navy)' }}>No categories match &ldquo;{query}&rdquo;</p>
            <p className="text-sm mb-4" style={{ color: 'var(--color-gray)' }}>Try a different search term or browse all categories.</p>
            <button onClick={() => setQuery('')} className="text-sm font-bold px-4 py-2 rounded-xl text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groups).map(([groupName, cats]) => (
              <div key={groupName}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{GROUP_ICONS[groupName] ?? '📁'}</span>
                  <div>
                    <h2 className="text-xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{groupName}</h2>
                    <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>{cats.length} {cats.length === 1 ? 'category' : 'categories'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cats.map(cat => (
                    <Link
                      key={cat.slug}
                      href={categoryHref(cat.slug)}
                      className="bg-white border rounded-xl px-4 py-3 hover:shadow-md hover:border-blue-300 transition-all group"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <p className="text-sm font-semibold group-hover:text-blue-700 transition-colors leading-snug" style={{ color: 'var(--color-gray-dark)' }}>
                        {cat.name}
                      </p>
                      {exchange && (
                        <p className="text-xs mt-1 font-bold" style={{ color: 'var(--color-gold)' }}>{exchange}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Provider CTA */}
        <div className="mt-16 rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-navy)' }}>
          <h2 className="text-2xl font-extrabold text-white mb-2">Are you a service provider?</h2>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>Get listed in Canada's directory for public company services.</p>
          <Link href="/register/provider" className="font-bold px-8 py-3 rounded-xl inline-block" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>
            List Your Firm →
          </Link>
        </div>
      </div>
    </>
  )
}
