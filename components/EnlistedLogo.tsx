import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'
import { getMarket } from '@/lib/market'

const playfair = Playfair_Display({ subsets: ['latin'], weight: '700', display: 'swap' })

// Gold needs a brighter shade on navy to keep contrast
const GOLD_ON_NAVY = '#D9A421'

export type LogoVariant = 'light' | 'dark'

interface EnlistedBadgeProps {
  /** Badge height/width in px. Default 26. */
  size?: number
  /** 'light' = for white backgrounds, 'dark' = for navy backgrounds. */
  variant?: LogoVariant
  /**
   * Fill the seal on a navy rounded square (app-icon style).
   * Default false = open circular seal for inline lockups.
   */
  tile?: boolean
}

/** Circular seal monogram — hallmark "E" inside a double gold ring. */
export function EnlistedBadge({ size = 26, variant = 'light', tile = false }: EnlistedBadgeProps) {
  const onLight = variant === 'light'
  const ring = onLight && !tile ? 'var(--color-gold)' : GOLD_ON_NAVY
  const letter = tile ? GOLD_ON_NAVY : onLight ? 'var(--color-navy)' : '#ffffff'

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {tile && <rect width="40" height="40" rx="9" fill="var(--color-navy)" />}
      <circle cx="20" cy="20" r={tile ? 13.5 : 18.5} stroke={ring} strokeWidth={tile ? 2 : 1.8} />
      <circle cx="20" cy="20" r={tile ? 10.8 : 14.8} stroke={ring} strokeWidth="0.7" opacity="0.75" />
      <text
        x="20"
        y={tile ? 26.5 : 27.5}
        textAnchor="middle"
        className={playfair.className}
        fontSize={tile ? 17 : 21}
        fontWeight={700}
        fill={letter}
      >
        E
      </text>
    </svg>
  )
}

interface EnlistedLogoProps {
  /**
   * Legacy scale unit kept from the building-era logo — the wordmark's
   * optical height tracks it, so existing call sites keep their size.
   */
  size?: number
  href?: string
  /** 'light' = navy/gold for white backgrounds, 'dark' = white/gold for navy backgrounds. */
  variant?: LogoVariant
  /** Hide the seal and render the wordmark alone. */
  wordmarkOnly?: boolean
}

export default function EnlistedLogo({
  size = 26,
  href = '/',
  variant = 'light',
  wordmarkOnly = false,
}: EnlistedLogoProps) {
  const market = getMarket()
  const domain = market.seo.titleSuffix.replace(/^Enlisted/, '').toUpperCase() // '.CA', '.AU', …

  const fontSize = Math.round(size * 1.15)
  const sealSize = Math.round(fontSize * 1.55)
  const gap = Math.round(fontSize * 0.45)
  const onLight = variant === 'light'
  const base = onLight ? 'var(--color-navy)' : '#ffffff'
  const accent = onLight ? 'var(--color-gold)' : GOLD_ON_NAVY

  return (
    <Link
      href={href}
      className={playfair.className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: gap + 'px', textDecoration: 'none' }}
    >
      {!wordmarkOnly && <EnlistedBadge size={sealSize} variant={variant} />}
      <span
        style={{
          fontSize: fontSize + 'px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          color: base,
        }}
      >
        ENLISTED<span style={{ color: accent }}>{domain}</span>
      </span>
    </Link>
  )
}
