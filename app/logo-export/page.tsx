import EnlistedLogo, { EnlistedBadge } from '@/components/EnlistedLogo'

export default function LogoExport() {
  return (
    <div style={{ padding: 0, margin: 0, background: 'transparent' }}>
      <div id="logo-white" style={{ background: '#ffffff', display: 'inline-flex', padding: '24px 32px' }}>
        <EnlistedLogo size={52} href="#" />
      </div>
      <div style={{ height: 1, background: '#ccc' }} />
      <div id="logo-navy" style={{ background: '#1B3A6B', display: 'inline-flex', padding: '24px 32px' }}>
        <EnlistedLogo size={52} href="#" variant="dark" />
      </div>
      <div style={{ height: 1, background: '#ccc' }} />
      <div id="logo-transparent" style={{ background: 'transparent', display: 'inline-flex', padding: '24px 32px' }}>
        <EnlistedLogo size={52} href="#" />
      </div>
      <div style={{ height: 1, background: '#ccc' }} />
      <div id="wordmark-white" style={{ background: '#ffffff', display: 'inline-flex', padding: '24px 32px' }}>
        <EnlistedLogo size={52} href="#" wordmarkOnly />
      </div>
      <div style={{ height: 1, background: '#ccc' }} />
      <div id="badge-white" style={{ background: '#ffffff', display: 'inline-flex', gap: 24, alignItems: 'center', padding: '24px 32px' }}>
        <EnlistedBadge size={128} />
        <EnlistedBadge size={64} />
        <EnlistedBadge size={32} />
        <EnlistedBadge size={16} />
      </div>
      <div style={{ height: 1, background: '#ccc' }} />
      <div id="badge-navy" style={{ background: '#1B3A6B', display: 'inline-flex', gap: 24, alignItems: 'center', padding: '24px 32px' }}>
        <EnlistedBadge size={128} variant="dark" />
        <EnlistedBadge size={64} variant="dark" />
        <EnlistedBadge size={32} variant="dark" />
        <EnlistedBadge size={16} variant="dark" />
      </div>
      <div style={{ height: 1, background: '#ccc' }} />
      <div id="badge-tile" style={{ background: '#ffffff', display: 'inline-flex', gap: 24, alignItems: 'center', padding: '24px 32px' }}>
        <EnlistedBadge size={128} tile />
        <EnlistedBadge size={64} tile />
        <EnlistedBadge size={32} tile />
        <EnlistedBadge size={16} tile />
      </div>
    </div>
  )
}
