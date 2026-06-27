import { ImageResponse } from 'next/og'
import { getMarket } from '@/lib/market'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const market = getMarket()

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1B3A6B 0%, #0e2347 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 90px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#D52B1E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 900 }}>
            E
          </div>
          <span style={{ color: '#D52B1E', fontSize: 38, fontWeight: 900 }}>
            {market.seo.titleSuffix}
          </span>
        </div>

        {/* Headline */}
        <div style={{ color: 'white', fontSize: 60, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, maxWidth: 820 }}>
          {market.copy.heroHeadlinePre}{' '}
          <span style={{ color: '#B8860B' }}>{market.copy.heroHeadlineGold}</span>{' '}
          {market.copy.heroHeadlinePost}
        </div>

        {/* Subtext */}
        <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: 26, maxWidth: 700, lineHeight: 1.5, marginBottom: 48 }}>
          {market.seo.ogDescription}
        </div>

        {/* Exchange pills */}
        <div style={{ display: 'flex', gap: 14 }}>
          {market.exchanges.map(ex => (
            <div key={ex} style={{ border: '1.5px solid #B8860B', color: '#B8860B', padding: '8px 22px', borderRadius: 999, fontSize: 18, fontWeight: 700, background: 'rgba(184,134,11,0.1)' }}>
              {ex}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
