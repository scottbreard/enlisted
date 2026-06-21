import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Uses Yahoo Finance RSS (no API key required) + filters by ticker/sector
async function fetchYahooNews(ticker: string): Promise<any[]> {
  try {
    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=CA&lang=en-CA`
    const res = await fetch(url, {
      next: { revalidate: 900 }, // cache 15 min
      headers: { 'User-Agent': 'Enlisted/1.0' },
    })
    if (!res.ok) return []
    const xml = await res.text()

    // Parse RSS items from XML
    const items: any[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1]
      const title   = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ?? item.match(/<title>(.*?)<\/title>/)?.[1] ?? ''
      const link    = item.match(/<link>(.*?)<\/link>/)?.[1] ?? ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? ''
      const desc    = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ?? item.match(/<description>(.*?)<\/description>/)?.[1] ?? ''
      if (title && link) {
        items.push({ title, link, pubDate, description: desc.replace(/<[^>]+>/g, '').slice(0, 200), source: 'Yahoo Finance', ticker })
      }
    }
    return items.slice(0, 10)
  } catch {
    return []
  }
}

async function fetchCanadianMarketNews(): Promise<any[]> {
  try {
    // Globe & Mail markets RSS
    const url = 'https://www.theglobeandmail.com/investing/markets/feed/'
    const res = await fetch(url, {
      next: { revalidate: 900 },
      headers: { 'User-Agent': 'Enlisted/1.0' },
    })
    if (!res.ok) return []
    const xml = await res.text()

    const items: any[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1]
      const title   = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ?? item.match(/<title>(.*?)<\/title>/)?.[1] ?? ''
      const link    = item.match(/<link>(.*?)<\/link>/)?.[1] ?? ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? ''
      const desc    = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ?? ''
      if (title && link) {
        items.push({ title, link, pubDate, description: desc.replace(/<[^>]+>/g, '').slice(0, 200), source: 'Globe & Mail', ticker: null })
      }
    }
    return items.slice(0, 8)
  } catch {
    return []
  }
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('executive_profiles')
    .select('company_ticker, sector, company_name')
    .eq('user_id', user.id)
    .single()

  const results = await Promise.allSettled([
    profile?.company_ticker ? fetchYahooNews(profile.company_ticker) : Promise.resolve([]),
    fetchCanadianMarketNews(),
  ])

  const tickerNews   = results[0].status === 'fulfilled' ? results[0].value : []
  const marketNews   = results[1].status === 'fulfilled' ? results[1].value : []

  // Merge, deduplicate by link, sort by date
  const all = [...tickerNews, ...marketNews]
  const seen = new Set<string>()
  const deduped = all.filter(item => {
    if (seen.has(item.link)) return false
    seen.add(item.link)
    return true
  })

  deduped.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0
    return db - da
  })

  return NextResponse.json({
    articles: deduped,
    ticker: profile?.company_ticker ?? null,
    sector: profile?.sector ?? null,
    company: profile?.company_name ?? null,
  })
}
