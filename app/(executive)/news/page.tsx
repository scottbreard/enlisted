'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, TrendingUp, Globe, AlertCircle } from 'lucide-react'

interface Article {
  title: string
  link: string
  pubDate: string
  description: string
  source: string
  ticker: string | null
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [ticker, setTicker] = useState<string | null>(null)
  const [sector, setSector] = useState<string | null>(null)
  const [company, setCompany] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'company' | 'market'>('all')

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/news')
      if (!res.ok) throw new Error('Failed to load news')
      const data = await res.json()
      setArticles(data.articles ?? [])
      setTicker(data.ticker)
      setSector(data.sector)
      setCompany(data.company)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = articles.filter(a => {
    if (filter === 'company') return a.ticker !== null
    if (filter === 'market') return a.ticker === null
    return true
  })

  const companyCount = articles.filter(a => a.ticker !== null).length
  const marketCount  = articles.filter(a => a.ticker === null).length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>News Feed</h1>
          {company && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
              {ticker && <span className="font-bold" style={{ color: 'var(--color-blue)' }}>{ticker} · </span>}
              {company}{sector && ` · ${sector}`}
            </p>
          )}
        </div>
        <button onClick={() => load(true)} disabled={refreshing}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border disabled:opacity-50"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* No ticker warning */}
      {!ticker && !loading && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl border-2" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)' }}>
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--color-gold)' }} />
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>Add your ticker to see company-specific news</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
              Go to <a href="/profile" className="underline">My Profile</a> and set your exchange + ticker symbol.
            </p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all',     label: `All (${articles.length})` },
          { key: 'company', label: `${ticker ?? 'Company'} (${companyCount})` },
          { key: 'market',  label: `Canadian Markets (${marketCount})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as any)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: filter === f.key ? 'var(--color-navy)' : 'white',
              color: filter === f.key ? 'white' : 'var(--color-gray)',
              border: `1px solid ${filter === f.key ? 'var(--color-navy)' : 'var(--color-border)'}`,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 animate-pulse" style={{ borderColor: 'var(--color-border)' }}>
              <div className="h-4 rounded mb-3 w-3/4" style={{ backgroundColor: '#e5e7eb' }} />
              <div className="h-3 rounded mb-2 w-full" style={{ backgroundColor: '#f3f4f6' }} />
              <div className="h-3 rounded w-1/2" style={{ backgroundColor: '#f3f4f6' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📡</p>
          <p className="font-bold" style={{ color: 'var(--color-navy)' }}>Couldn&apos;t load news</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--color-gray)' }}>{error}</p>
          <button onClick={() => load()} className="text-sm font-bold px-4 py-2 rounded-xl text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📰</p>
          <p className="font-bold" style={{ color: 'var(--color-navy)' }}>No articles found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>Try a different filter or refresh.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article, i) => (
            <a key={i} href={article.link} target="_blank" rel="noopener noreferrer"
              className="block bg-white border rounded-2xl p-5 hover:shadow-md transition-shadow group"
              style={{ borderColor: article.ticker ? 'var(--color-blue)' : 'var(--color-border)' }}>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: article.ticker ? 'var(--color-blue-light)' : '#f3f4f6' }}>
                  {article.ticker
                    ? <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-blue)' }} />
                    : <Globe className="w-4 h-4" style={{ color: 'var(--color-gray)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-bold text-sm leading-snug group-hover:underline" style={{ color: 'var(--color-navy)' }}>
                      {article.title}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-gray-light)' }} />
                  </div>
                  {article.description && (
                    <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--color-gray)' }}>
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-gray-light)' }}>
                      {article.source}
                    </span>
                    {article.ticker && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-blue-light)', color: 'var(--color-blue)' }}>
                        {article.ticker}
                      </span>
                    )}
                    {article.pubDate && (
                      <span className="text-xs" style={{ color: 'var(--color-gray-light)' }}>
                        {timeAgo(article.pubDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
