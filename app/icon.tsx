import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

const NAVY = '#1B3A6B'
const GOLD = '#D9A421'

export default function Icon() {
  const fontData = readFileSync(path.join(process.cwd(), 'assets/fonts/PlayfairDisplay-Bold.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: NAVY,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="20" cy="20" r="13.5" stroke={GOLD} strokeWidth="2" fill="none" />
          <circle cx="20" cy="20" r="10.8" stroke={GOLD} strokeWidth="0.7" opacity="0.75" fill="none" />
        </svg>
        <div style={{ display: 'flex', fontFamily: 'Playfair', fontSize: 27, color: GOLD, marginTop: -2 }}>E</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Playfair', data: fontData, weight: 700 }],
    }
  )
}
