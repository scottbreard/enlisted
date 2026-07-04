import Link from 'next/link'
import { getMarket } from '@/lib/market'

// Gold needs a brighter shade on navy to keep contrast
const GOLD_ON_NAVY = '#D9A421'

export type LogoVariant = 'light' | 'dark'

interface EnlistedBadgeProps {
  /** Badge height/width in px. Default 26. */
  size?: number
  /** 'light' = navy badge for white backgrounds, 'dark' = white badge for navy backgrounds. */
  variant?: LogoVariant
}

/** Square checklist mark — favicon, app icons, avatars, tight spaces. */
export function EnlistedBadge({ size = 26, variant = 'light' }: EnlistedBadgeProps) {
  const onLight = variant === 'light'
  const bg = onLight ? 'var(--color-navy)' : '#ffffff'
  const accent = onLight ? GOLD_ON_NAVY : 'var(--color-gold)'
  const dim = onLight ? GOLD_ON_NAVY : 'var(--color-navy)'
  const dimOpacity = onLight ? 0.55 : 0.45

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="9" fill={bg} />
      {/* Top row: checked entry */}
      <path d="M8 12.5l3 3 5-5.5" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="10.5" width="12" height="3.4" rx="1.7" fill={accent} />
      {/* Remaining list entries */}
      <rect x="8" y="20.5" width="7" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
      <rect x="20" y="20.5" width="12" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
      <rect x="8" y="30.5" width="7" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
      <rect x="20" y="30.5" width="12" height="3.4" rx="1.7" fill={dim} opacity={dimOpacity} />
    </svg>
  )
}

interface EnlistedLogoProps {
  /**
   * Legacy scale unit kept from the building-era logo: rendered wordmark
   * font size is size × 1.3, so existing call sites keep their visual size.
   */
  size?: number
  href?: string
  /** 'light' = navy/gold for white backgrounds, 'dark' = white/gold for navy backgrounds. */
  variant?: LogoVariant
  /** Hide the checklist badge and render the wordmark alone. */
  wordmarkOnly?: boolean
}

export default function EnlistedLogo({
  size = 26,
  href = '/',
  variant = 'light',
  wordmarkOnly = false,
}: EnlistedLogoProps) {
  const market = getMarket()
  const domain = market.seo.titleSuffix.replace(/^Enlisted/, '') // '.ca', '.au', …

  const fontSize = Math.round(size * 1.3)
  const gap = Math.round(fontSize * 0.34)
  const onLight = variant === 'light'
  const base = onLight ? 'var(--color-navy)' : '#ffffff'
  const listed = onLight ? 'var(--color-gold)' : GOLD_ON_NAVY

  return (
    <Link
      href={href}
      style={{ display: 'inline-flex', alignItems: 'center', gap: gap + 'px', textDecoration: 'none' }}
    >
      {!wordmarkOnly && <EnlistedBadge size={fontSize} variant={variant} />}
      <span
        style={{
          fontSize: fontSize + 'px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          color: base,
        }}
      >
        En<span style={{ color: listed }}>listed</span>
        <span style={{ opacity: 0.45 }}>{domain}</span>
      </span>
    </Link>
  )
}
