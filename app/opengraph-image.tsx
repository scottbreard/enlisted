import { ImageResponse } from 'next/og'
import { getMarket } from '@/lib/market'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const market = getMarket()

  // Satori (next/og) lays out flex items, not inline text, so the headline is
  // split into words to let it wrap while the middle phrase stays gold.
  const headlineWords = [
    ...market.copy.heroHeadlinePre.split(' ').map(word => ({ word, gold: false })),
    ...market.copy.heroHeadlineGold.split(' ').map(word => ({ word, gold: true })),
    ...market.copy.heroHeadlinePost.split(' ').map(word => ({ word, gold: false })),
  ]

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 40 }}>
          <div style={{ display: 'flex', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="56" height="56" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
              <circle cx="20" cy="20" r="18.5" stroke="#D9A421" strokeWidth="1.8" fill="none" />
              <circle cx="20" cy="20" r="14.8" stroke="#D9A421" strokeWidth="0.7" opacity="0.75" fill="none" />
            </svg>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#ffffff' }}>E</div>
          </div>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, letterSpacing: 5 }}>
            <span style={{ color: '#ffffff' }}>ENLISTED</span>
            <span style={{ color: '#D9A421' }}>{market.seo.titleSuffix.replace('Enlisted', '').toUpperCase()}</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 58, fontWeight: 900, lineHeight: 1.25, marginBottom: 24, maxWidth: 1000 }}>
          {headlineWords.map(({ word, gold }, i) => (
            <span key={i} style={{ color: gold ? '#B8860B' : 'white', marginRight: 15 }}>
              {word}
            </span>
          ))}
        </div>

        {/* Subtext */}
        <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: 26, maxWidth: 800, lineHeight: 1.5, marginBottom: 48 }}>
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
