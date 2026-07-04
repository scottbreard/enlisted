import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

const NAVY = '#1B3A6B'
const GOLD = '#D9A421'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="9" fill={NAVY} />
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
