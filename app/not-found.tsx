import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#f8f9fc' }}>
      <div className="mb-6">
        <span className="text-2xl font-extrabold" style={{ color: 'var(--color-gold)' }}>
          Enlisted<span style={{ color: 'var(--color-gold)' }}>.ca</span>
        </span>
      </div>
      <h1 className="text-8xl font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>404</h1>
      <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-navy)' }}>Page not found</p>
      <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--color-gray)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          Go home
        </Link>
        <Link href="/directory"
          className="px-6 py-3 rounded-xl text-sm font-bold border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
          Browse directory
        </Link>
      </div>
    </div>
  )
}
