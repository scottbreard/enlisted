import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const NAVY = '#1B3A6B'
const GOLD = '#B8860B'
const GOLD_ON_NAVY = '#D9A421'

// Checklist badge as inline SVG — satori supports basic SVG
function BadgeSVG({ size, onNavy }: { size: number; onNavy: boolean }) {
  const bg = onNavy ? '#ffffff' : NAVY
  const accent = onNavy ? GOLD : GOLD_ON_NAVY
  const dim = onNavy ? NAVY : GOLD_ON_NAVY
  const dimOpacity = onNavy ? 0.45 : 0.55
  return (
    // @ts-ignore — satori accepts svg elements
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* @ts-ignore */}
      <rect width="40" height="40" rx="9" fill={bg} />
      {/* @ts-ignore */}
      <path d="M8 12.5l3 3 5-5.5" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* @ts-ignore */}
      <rect x="20" y="10.5" width="12" height="3.4" rx="1.7" fill={accent} />
      {/* @ts-ignore */}
      <rect x="8" y="20.5" width="7" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
      {/* @ts-ignore */}
      <rect x="20" y="20.5" width="12" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
      {/* @ts-ignore */}
      <rect x="8" y="30.5" width="7" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
      {/* @ts-ignore */}
      <rect x="20" y="30.5" width="12" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
    </svg>
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const variant = searchParams.get('v') ?? 'white' // white | navy | transparent

  const fontPath = path.join('/System/Library/Fonts/Supplemental', 'Arial Black.ttf')
  const fontData = readFileSync(fontPath)

  const onNavy = variant === 'navy'
  const bg = onNavy ? NAVY : variant === 'transparent' ? 'transparent' : '#ffffff'
  const base = onNavy ? '#ffffff' : NAVY
  const listed = onNavy ? GOLD_ON_NAVY : GOLD

  return new ImageResponse(
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: bg,
      padding: '24px 32px',
      gap: 24,
    }}>
      <BadgeSVG size={68} onNavy={onNavy} />
      <div style={{
        display: 'flex',
        fontSize: 68,
        fontFamily: 'ArialBlack',
        letterSpacing: '-1.5px',
        lineHeight: 1,
      }}>
        <span style={{ color: base }}>En</span>
        <span style={{ color: listed }}>listed</span>
        <span style={{ color: base, opacity: 0.45 }}>.ca</span>
      </div>
    </div>,
    {
      width: 620,
      height: 116,
      fonts: [{ name: 'ArialBlack', data: fontData, weight: 900 }],
    }
  )
}
