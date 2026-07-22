import Link from 'next/link'
import EnlistedLogo from '@/components/EnlistedLogo'

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: '#0e2347' }} className="text-white/80 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div>
            <span className="block mb-1"><EnlistedLogo variant="dark" size={20} /></span>
            <span className="text-xs">🇨🇦 Proudly Canadian — built for TSX, TSXV, CSE &amp; Cboe Canada issuers</span>
          </div>
          <span className="flex flex-wrap gap-4">
            <Link href="/directory" className="hover:text-white transition-colors">Directory</Link>
            <Link href="/methodology" className="hover:text-white transition-colors">How Listings Work</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/terms/providers" className="hover:text-white transition-colors">Provider Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </span>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 text-xs flex flex-col md:flex-row justify-between gap-2">
          <span>© 2026 Enlisted.ca, a division of Stock Marketing Inc. · Toronto, Ontario, Canada</span>
          <span>All prices in Canadian dollars (CAD)</span>
        </div>
      </div>
    </footer>
  )
}
