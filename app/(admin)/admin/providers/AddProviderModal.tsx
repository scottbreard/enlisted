'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus } from 'lucide-react'

const EXCHANGE_GROUPS = [
  { market: 'Canada',         exchanges: ['TSX', 'TSXV', 'CSE', 'NEO'] },
  { market: 'United States',  exchanges: ['NYSE', 'Nasdaq', 'OTC'] },
  { market: 'United Kingdom', exchanges: ['LSE', 'AIM'] },
  { market: 'Australia',      exchanges: ['ASX', 'NSX'] },
]

const TIERS = ['free', 'listed', 'featured']

export default function AddProviderModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exchanges, setExchanges] = useState<string[]>([])
  const [form, setForm] = useState({
    company_name: '',
    email: '',
    website_url: '',
    tier: 'free',
  })

  function toggle(ex: string) {
    setExchanges(prev => prev.includes(ex) ? prev.filter(e => e !== ex) : [...prev, ex])
  }

  function reset() {
    setForm({ company_name: '', email: '', website_url: '', tier: 'free' })
    setExchanges([])
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (exchanges.length === 0) { setError('Select at least one exchange.'); return }

    setLoading(true)
    const res = await fetch('/api/admin/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, exchanges }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }

    setOpen(false)
    reset()
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
        style={{ backgroundColor: 'var(--color-navy)' }}
      >
        <Plus className="w-4 h-4" /> Add Provider
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg font-extrabold" style={{ color: 'var(--color-navy)' }}>Add Provider</h2>
              <button onClick={() => { setOpen(false); reset() }} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" style={{ color: 'var(--color-gray)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Company Name *</label>
                <input
                  required
                  value={form.company_name}
                  onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                  placeholder="XYZ IR Group Inc."
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Email Address *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="contact@theirfirm.com"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--color-gray-light)' }}>
                  They'll receive an invite email to set their password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Website</label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))}
                  placeholder="https://theirfirm.com"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Starting Tier</label>
                <select
                  value={form.tier}
                  onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {TIERS.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Exchange selection */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-gray-dark)' }}>
                  Exchanges Serviced *
                </label>
                <div className="space-y-3">
                  {EXCHANGE_GROUPS.map(({ market, exchanges: exList }) => (
                    <div key={market}>
                      <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--color-gray-light)' }}>{market}</p>
                      <div className="flex flex-wrap gap-2">
                        {exList.map(ex => {
                          const active = exchanges.includes(ex)
                          return (
                            <button
                              key={ex}
                              type="button"
                              onClick={() => toggle(ex)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                              style={{
                                backgroundColor: active ? 'var(--color-navy)' : 'white',
                                color: active ? 'white' : 'var(--color-gray)',
                                borderColor: active ? 'var(--color-navy)' : 'var(--color-border)',
                              }}
                            >
                              {ex}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setOpen(false); reset() }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-navy)' }}
                >
                  {loading ? 'Adding…' : 'Add Provider'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}
