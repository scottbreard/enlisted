import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const NAVY = '#1B3A6B'
const GOLD = '#B8860B'
const GOLD_ON_NAVY = '#D9A421'

// Seal monogram as inline SVG rings — the "E" is layered on top with satori text
function SealRings({ size, color }: { size: number; color: string }) {
  return (
    // @ts-ignore — satori accepts svg elements
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* @ts-ignore */}
      <circle cx="20" cy="20" r="18.5" stroke={color} strokeWidth="1.8" fill="none" />
      {/* @ts-ignore */}
      <circle cx="20" cy="20" r="14.8" stroke={color} strokeWidth="0.7" opacity="0.75" fill="none" />
    </svg>
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const variant = searchParams.get('v') ?? 'white' // white | navy | transparent

  const fontData = readFileSync(path.join(process.cwd(), 'assets/fonts/PlayfairDisplay-Bold.ttf'))

  const onNavy = variant === 'navy'
  const bg = onNavy ? NAVY : variant === 'transparent' ? 'transparent' : '#ffffff'
  const base = onNavy ? '#ffffff' : NAVY
  const accent = onNavy ? GOLD_ON_NAVY : GOLD
  const sealSize = 96

  return new ImageResponse(
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: bg,
      padding: '28px 36px',
      gap: 28,
      fontFamily: 'Playfair',
    }}>
      <div style={{ display: 'flex', width: sealSize, height: sealSize, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0 }}>
          <SealRings size={sealSize} color={accent} />
        </div>
        <div style={{ display: 'flex', fontSize: 50, color: base, marginTop: -4 }}>E</div>
      </div>
      <div style={{ display: 'flex', fontSize: 62, letterSpacing: '9px', lineHeight: 1 }}>
        <span style={{ color: base }}>ENLISTED</span>
        <span style={{ color: accent }}>.CA</span>
      </div>
    </div>,
    {
      width: 860,
      height: 152,
      fonts: [{ name: 'Playfair', data: fontData, weight: 700 }],
    }
  )
}
