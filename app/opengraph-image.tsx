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
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="9" fill="#ffffff" />
            <path d="M8 12.5l3 3 5-5.5" stroke="#B8860B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="20" y="10.5" width="12" height="3.4" rx="1.7" fill="#B8860B" />
            <rect x="8" y="20.5" width="7" height="3.4" rx="1.7" fill="#1B3A6B" opacity="0.45" />
            <rect x="20" y="20.5" width="12" height="3.4" rx="1.7" fill="#1B3A6B" opacity="0.45" />
            <rect x="8" y="30.5" width="7" height="3.4" rx="1.7" fill="#1B3A6B" opacity="0.45" />
            <rect x="20" y="30.5" width="12" height="3.4" rx="1.7" fill="#1B3A6B" opacity="0.45" />
          </svg>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 900 }}>
            <span style={{ color: '#ffffff' }}>En</span>
            <span style={{ color: '#D9A421' }}>listed</span>
            <span style={{ color: '#ffffff', opacity: 0.5 }}>{market.seo.titleSuffix.replace('Enlisted', '')}</span>
          </div>
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
