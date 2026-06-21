import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('executive_profiles')
    .select('company_ticker, company_name')
    .eq('user_id', user.id)
    .single()

  const ticker = req.nextUrl.searchParams.get('ticker') ?? profile?.company_ticker
  if (!ticker) return NextResponse.json({ error: 'No ticker' }, { status: 400 })

  try {
    const [quoteRes, chartRes] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 },
      }),
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 },
      }),
    ])

    if (!quoteRes.ok) throw new Error('Yahoo Finance unavailable')
    const quoteData = await quoteRes.json()
    const chartData = await chartRes.json()

    const meta = quoteData?.chart?.result?.[0]?.meta ?? {}
    const chartResult = chartData?.chart?.result?.[0]
    const timestamps = chartResult?.timestamp ?? []
    const closes = chartResult?.indicators?.quote?.[0]?.close ?? []

    const history = timestamps
      .map((ts: number, i: number) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        close: closes[i] ?? null,
      }))
      .filter((p: any) => p.close !== null)

    return NextResponse.json({
      ticker,
      company: profile?.company_name ?? meta.shortName ?? ticker,
      price: meta.regularMarketPrice ?? null,
      previousClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
      open: meta.regularMarketOpen ?? null,
      dayHigh: meta.regularMarketDayHigh ?? null,
      dayLow: meta.regularMarketDayLow ?? null,
      volume: meta.regularMarketVolume ?? null,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
      marketCap: meta.marketCap ?? null,
      currency: meta.currency ?? 'CAD',
      exchange: meta.exchangeName ?? null,
      history,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
