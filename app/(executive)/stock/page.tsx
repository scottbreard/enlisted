'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface StockData {
  ticker: string
  company: string
  price: number
  previousClose: number
  open: number
  dayHigh: number
  dayLow: number
  volume: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  marketCap: number
  currency: string
  exchange: string
  history: { date: string; close: number }[]
}

function fmt(n: number | null, decimals = 2) {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString('en-CA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtVolume(n: number | null) {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function fmtMarketCap(n: number | null) {
  if (!n) return '—'
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return `$${n.toLocaleString()}`
}

function MiniChart({ history, isUp }: { history: { date: string; close: number }[], isUp: boolean }) {
  if (!history.length) return null
  const prices = history.map(h => h.close)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const w = 600
  const h = 120
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 10) - 5
    return `${x},${y}`
  }).join(' ')

  const color = isUp ? '#10b981' : '#ef4444'
  const fillId = `grad-${isUp ? 'up' : 'dn'}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${fillId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function StockPage() {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [noTicker, setNoTicker] = useState(false)

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stock')
      if (res.status === 400) { setNoTicker(true); return }
      if (!res.ok) throw new Error('Could not load stock data')
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const change = data ? data.price - data.previousClose : 0
  const changePct = data?.previousClose ? (change / data.previousClose) * 100 : 0
  const isUp = change >= 0

  if (noTicker) return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>Stock Dashboard</h1>
      <div className="flex items-start gap-3 p-5 rounded-2xl border-2" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)' }}>
        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--color-gold)' }} />
        <div>
          <p className="font-bold" style={{ color: 'var(--color-navy)' }}>Set your ticker symbol first</p>
          <p className="text-sm mt-1 mb-3" style={{ color: 'var(--color-gray)' }}>Go to My Profile and enter your company&apos;s exchange + ticker to unlock this dashboard.</p>
          <Link href="/profile" className="text-sm font-bold px-4 py-2 rounded-xl text-white inline-block" style={{ backgroundColor: 'var(--color-navy)' }}>
            Go to Profile →
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Stock Dashboard</h1>
        <button onClick={() => load(true)} disabled={refreshing}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border disabled:opacity-50"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border rounded-2xl p-6 animate-pulse h-32" style={{ borderColor: 'var(--color-border)' }} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📉</p>
          <p className="font-bold mb-1" style={{ color: 'var(--color-navy)' }}>Could not load stock data</p>
          <p className="text-sm mb-4" style={{ color: 'var(--color-gray)' }}>{error}</p>
          <button onClick={() => load()} className="text-sm font-bold px-4 py-2 rounded-xl text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
            Try Again
          </button>
        </div>
      ) : data ? (
        <div className="space-y-5">

          {/* Price hero */}
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-gray-light)' }}>
                  {data.ticker} · {data.exchange} · {data.currency}
                </p>
                <p className="text-lg font-bold mb-3" style={{ color: 'var(--color-navy)' }}>{data.company}</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-extrabold" style={{ color: 'var(--color-navy)' }}>
                    ${fmt(data.price)}
                  </span>
                  <div className={`flex items-center gap-1 text-lg font-bold pb-1 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                    {isUp ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {isUp ? '+' : ''}{fmt(change)} ({isUp ? '+' : ''}{fmt(changePct)}%)
                  </div>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--color-gray-light)' }}>vs. previous close ${fmt(data.previousClose)}</p>
              </div>
            </div>
            <MiniChart history={data.history} isUp={isUp} />
            <p className="text-xs text-right mt-1" style={{ color: 'var(--color-gray-light)' }}>3-month price history · 15-min delayed</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Open',         value: `$${fmt(data.open)}` },
              { label: "Day's High",   value: `$${fmt(data.dayHigh)}` },
              { label: "Day's Low",    value: `$${fmt(data.dayLow)}` },
              { label: 'Volume',       value: fmtVolume(data.volume) },
              { label: '52-Wk High',  value: `$${fmt(data.fiftyTwoWeekHigh)}` },
              { label: '52-Wk Low',   value: `$${fmt(data.fiftyTwoWeekLow)}` },
              { label: 'Market Cap',  value: fmtMarketCap(data.marketCap) },
              { label: 'Prev. Close', value: `$${fmt(data.previousClose)}` },
            ].map(s => (
              <div key={s.label} className="bg-white border rounded-2xl p-4" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-gray)' }}>{s.label}</p>
                <p className="text-lg font-extrabold" style={{ color: 'var(--color-navy)' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* 52-week range bar */}
          {data.fiftyTwoWeekLow && data.fiftyTwoWeekHigh && data.price && (
            <div className="bg-white border rounded-2xl p-5" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--color-gray)' }}>52-WEEK RANGE</p>
              <div className="relative">
                <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
                {(() => {
                  const pct = ((data.price - data.fiftyTwoWeekLow) / (data.fiftyTwoWeekHigh - data.fiftyTwoWeekLow)) * 100
                  return (
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ left: `${Math.min(96, Math.max(2, pct))}%`, backgroundColor: isUp ? '#10b981' : '#ef4444' }} />
                  )
                })()}
              </div>
              <div className="flex justify-between mt-2 text-xs font-semibold" style={{ color: 'var(--color-gray)' }}>
                <span>${fmt(data.fiftyTwoWeekLow)}</span>
                <span>${fmt(data.fiftyTwoWeekHigh)}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-center" style={{ color: 'var(--color-gray-light)' }}>
            Data provided by Yahoo Finance. Prices are 15-minute delayed. Not financial advice.
          </p>
        </div>
      ) : null}
    </div>
  )
}
