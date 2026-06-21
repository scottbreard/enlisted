'use client'

import { useState, useEffect } from 'react'
import { Send, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import Link from 'next/link'

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  open:      { label: 'Open',      color: '#1e40af', bg: '#dbeafe', icon: Clock },
  responded: { label: 'Responded', color: '#065f46', bg: '#d1fae5', icon: CheckCircle },
  closed:    { label: 'Closed',    color: '#6b7280', bg: '#f3f4f6', icon: XCircle },
}

const BUDGET_OPTIONS = [
  'Under $1,000', '$1,000–$5,000', '$5,000–$15,000', '$15,000–$50,000', '$50,000+', 'To be discussed'
]

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [providers, setProviders] = useState<any[]>([])
  const [form, setForm] = useState({
    provider_id: '', title: '', description: '', budget_range: '', deadline: ''
  })

  useEffect(() => {
    async function load() {
      const [rfqRes, provRes] = await Promise.all([
        fetch('/api/rfq'),
        fetch('/api/providers-list'),
      ])
      const rfqData = await rfqRes.json()
      setRfqs(rfqData.rfqs ?? [])
      if (provRes.ok) {
        const provData = await provRes.json()
        setProviders(provData.providers ?? [])
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.provider_id || !form.title || !form.description) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.rfq) {
        setRfqs(prev => [data.rfq, ...prev])
        setShowForm(false)
        setForm({ provider_id: '', title: '', description: '', budget_range: '', deadline: '' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>My RFQs</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>Request quotes from service providers in the directory.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          <Plus className="w-4 h-4" />
          New RFQ
        </button>
      </div>

      {/* New RFQ form */}
      {showForm && (
        <div className="bg-white border-2 rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-gold)' }}>
          <h2 className="font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>Send a Quote Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Provider *</label>
              <div className="flex items-center gap-2">
                <select value={form.provider_id} onChange={e => setForm(p => ({ ...p, provider_id: e.target.value }))}
                  className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
                  <option value="">Select a provider…</option>
                  {providers.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.company_name} ({p.tier})</option>
                  ))}
                </select>
                <Link href="/directory" className="text-xs font-semibold px-3 py-2.5 rounded-xl border whitespace-nowrap"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-blue)' }}>
                  Browse Directory
                </Link>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Subject *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. IR retainer proposal for Q4 2026"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--color-border)' }} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe what you need, your timeline, and any specific requirements…"
                rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--color-border)' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Budget Range</label>
                <select value={form.budget_range} onChange={e => setForm(p => ({ ...p, budget_range: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
                  <option value="">Select…</option>
                  {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Response Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--color-border)' }} />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="text-sm font-semibold px-4 py-2.5 rounded-xl border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting || !form.provider_id || !form.title || !form.description}
                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                <Send className="w-4 h-4" />
                {submitting ? 'Sending…' : 'Send RFQ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RFQ list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 h-20 animate-pulse" style={{ borderColor: 'var(--color-border)' }} />
          ))}
        </div>
      ) : rfqs.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-4xl mb-3">📬</p>
          <p className="font-bold mb-1" style={{ color: 'var(--color-navy)' }}>No RFQs yet</p>
          <p className="text-sm mb-4" style={{ color: 'var(--color-gray)' }}>Find a provider in the directory and send your first quote request.</p>
          <Link href="/directory" className="text-sm font-bold px-4 py-2 rounded-xl text-white inline-block" style={{ backgroundColor: 'var(--color-navy)' }}>
            Browse Directory
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rfqs.map((rfq: any) => {
            const s = STATUS_STYLE[rfq.status] ?? STATUS_STYLE.open
            const Icon = s.icon
            const expanded = expandedId === rfq.id
            return (
              <div key={rfq.id} className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                <button className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : rfq.id)}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <Send className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: 'var(--color-navy)' }}>{rfq.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
                      To: {rfq.provider_profiles?.company_name ?? 'Unknown'} · {new Date(rfq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0"
                    style={{ backgroundColor: s.bg, color: s.color }}>
                    <Icon className="w-3 h-3" />{s.label}
                  </span>
                  {expanded ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />
                            : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />}
                </button>
                {expanded && (
                  <div className="px-6 pb-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="pt-4 space-y-3">
                      <p className="text-sm" style={{ color: 'var(--color-gray-dark)' }}>{rfq.description}</p>
                      <div className="flex gap-4 text-xs" style={{ color: 'var(--color-gray)' }}>
                        {rfq.budget_range && <span>💰 {rfq.budget_range}</span>}
                        {rfq.deadline && <span>📅 Deadline: {new Date(rfq.deadline).toLocaleDateString()}</span>}
                      </div>
                      {rfq.response && (
                        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#d1fae5' }}>
                          <p className="text-xs font-bold mb-1" style={{ color: '#065f46' }}>Provider Response</p>
                          <p className="text-sm" style={{ color: '#065f46' }}>{rfq.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
