import Link from 'next/link'

// Base values from design calibration:
//   building rendered at 90×52px, font 68px, clip 55px, top offset -6px
const BASE_H = 52

function TSXBuilding({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 58 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left setback */}
      <rect x="1" y="4" width="7" height="29.5" fill="currentColor"/>
      {/* Right setback */}
      <rect x="50" y="4" width="7" height="29.5" fill="currentColor"/>
      {/* Inscription band */}
      <rect x="8" y="1" width="42" height="5" fill="currentColor"/>
      {/* Pilasters — window zone y=6→22 */}
      <rect x="8"     y="6" width="1.4" height="16" fill="currentColor"/>
      <rect x="16.12" y="6" width="1.4" height="16" fill="currentColor"/>
      <rect x="24.24" y="6" width="1.4" height="16" fill="currentColor"/>
      <rect x="32.36" y="6" width="1.4" height="16" fill="currentColor"/>
      <rect x="40.48" y="6" width="1.4" height="16" fill="currentColor"/>
      <rect x="48.6"  y="6" width="1.4" height="16" fill="currentColor"/>
      {/* Window mullions */}
      <rect x="12.76" y="6" width="0.4" height="16" fill="currentColor"/>
      <rect x="20.88" y="6" width="0.4" height="16" fill="currentColor"/>
      <rect x="29.0"  y="6" width="0.4" height="16" fill="currentColor"/>
      <rect x="37.12" y="6" width="0.4" height="16" fill="currentColor"/>
      <rect x="45.24" y="6" width="0.4" height="16" fill="currentColor"/>
      {/* Window transoms */}
      <rect x="9.4"   y="11.5" width="6.72" height="0.4" fill="currentColor"/>
      <rect x="9.4"   y="17"   width="6.72" height="0.4" fill="currentColor"/>
      <rect x="17.52" y="11.5" width="6.72" height="0.4" fill="currentColor"/>
      <rect x="17.52" y="17"   width="6.72" height="0.4" fill="currentColor"/>
      <rect x="25.64" y="11.5" width="6.72" height="0.4" fill="currentColor"/>
      <rect x="25.64" y="17"   width="6.72" height="0.4" fill="currentColor"/>
      <rect x="33.76" y="11.5" width="6.72" height="0.4" fill="currentColor"/>
      <rect x="33.76" y="17"   width="6.72" height="0.4" fill="currentColor"/>
      <rect x="41.88" y="11.5" width="6.72" height="0.4" fill="currentColor"/>
      <rect x="41.88" y="17"   width="6.72" height="0.4" fill="currentColor"/>
      {/* Frieze band */}
      <rect x="8" y="22" width="42" height="3.5" fill="currentColor"/>
      {/* Pilasters — door zone y=25.5→33 */}
      <rect x="8"     y="25.5" width="1.4" height="8" fill="currentColor"/>
      <rect x="16.12" y="25.5" width="1.4" height="8" fill="currentColor"/>
      <rect x="24.24" y="25.5" width="1.4" height="8" fill="currentColor"/>
      <rect x="32.36" y="25.5" width="1.4" height="8" fill="currentColor"/>
      <rect x="40.48" y="25.5" width="1.4" height="8" fill="currentColor"/>
      <rect x="48.6"  y="25.5" width="1.4" height="8" fill="currentColor"/>
      {/* Inner 3 bays = solid wall */}
      <rect x="17.52" y="25.5" width="6.72" height="8" fill="currentColor"/>
      <rect x="25.64" y="25.5" width="6.72" height="8" fill="currentColor"/>
      <rect x="33.76" y="25.5" width="6.72" height="8" fill="currentColor"/>
      {/* Outer 2 bays = transparent door openings (no fill) */}
      {/* Base line */}
      <rect x="8" y="33" width="42" height="0.5" fill="currentColor"/>
    </svg>
  )
}

interface EnlistedLogoProps {
  /** Building height in px — everything scales from this. Default 36. */
  size?: number
  href?: string
}

export default function EnlistedLogo({ size = 36, href = '/' }: EnlistedLogoProps) {
  const scale = size / BASE_H
  const bldgW  = Math.round(90 * scale)
  const fontSize = Math.round(68 * scale)
  const clipH  = Math.round(55 * scale)
  const offsetTop = Math.round(-6 * scale * 10) / 10
  const gap = Math.round(12 * scale)

  const inner = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: gap + 'px',
        textDecoration: 'none',
      }}
    >
      <TSXBuilding width={bldgW} height={size} />
      <span style={{ overflow: 'hidden', height: clipH + 'px', display: 'block' }}>
        <span
          style={{
            fontSize: fontSize + 'px',
            color: 'var(--color-gold)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            display: 'block',
            marginTop: offsetTop + 'px',
            whiteSpace: 'nowrap',
          }}
        >
          Enlisted.ca
        </span>
      </span>
    </span>
  )

  return (
    <Link href={href} style={{ display: 'inline-flex', alignItems: 'flex-start', color: 'var(--color-gold)' }}>
      {inner}
    </Link>
  )
}
