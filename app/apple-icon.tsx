import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const NAVY = '#1B3A6B'
const GOLD = '#D9A421'

export default function AppleIcon() {
  return new ImageResponse(
    (
      // Apple applies its own corner mask, so the tile is a full-bleed square
      <div style={{ display: 'flex', width: '100%', height: '100%', background: NAVY, alignItems: 'center', justifyContent: 'center' }}>
        <svg width="132" height="132" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12.5l3 3 5-5.5" stroke={GOLD} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="20" y="10.5" width="12" height="3.6" rx="1.8" fill={GOLD} />
          <rect x="8" y="20.5" width="7" height="3.6" rx="1.8" fill={GOLD} opacity="0.55" />
          <rect x="20" y="20.5" width="12" height="3.6" rx="1.8" fill={GOLD} opacity="0.55" />
          <rect x="8" y="30.5" width="7" height="3.6" rx="1.8" fill={GOLD} opacity="0.55" />
          <rect x="20" y="30.5" width="12" height="3.6" rx="1.8" fill={GOLD} opacity="0.55" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
