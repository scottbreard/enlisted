'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#f8f9fc' }}>
      <div className="mb-6">
        <span className="text-2xl font-extrabold" style={{ color: 'var(--color-gold)' }}>
          Enlisted<span style={{ color: 'var(--color-gold)' }}>.ca</span>
        </span>
      </div>
      <h1 className="text-5xl font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Something went wrong</h1>
      <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--color-gray)' }}>
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-3">
        <button onClick={reset}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          Try again
        </button>
        <a href="/"
          className="px-6 py-3 rounded-xl text-sm font-bold border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
          Go home
        </a>
      </div>
    </div>
  )
}
