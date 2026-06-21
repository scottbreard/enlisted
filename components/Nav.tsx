import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
          Enlisted<span className="text-blue-600">.</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/providers" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Find Providers
          </Link>
          <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            For Providers
          </Link>
          <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Get Listed
          </Link>
        </div>
      </div>
    </nav>
  )
}
