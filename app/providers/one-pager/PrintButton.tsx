'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm font-bold px-4 py-2 rounded-xl text-white btn-glow"
      style={{ backgroundColor: 'var(--color-navy)' }}
    >
      Print / Save as PDF
    </button>
  )
}
