'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, Clock, CheckCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react'

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  open:      { label: 'New',       color: '#1e40af', bg: '#dbeafe' },
  responded: { label: 'Responded', color: '#065f46', bg: '#d1fae5' },
  closed:    { label: 'Closed',    color: '#6b7280', bg: '#f3f4f6' },
}

export default function ProviderRFQPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [rfqs, setRfqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [responding, setResponding] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!p) return
      setProfile(p)
      if (p.tier === 'listed') { setLoading(false); return }

      let query = supabase
        .from('rfq_requests')
        .select('*, executive_profiles(first_name, last_name, company_name, company_ticker)')
        .eq('provider_id', p.id)
        .order('created_at', { ascending: false })

      if (p.tier === 'connected') {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        query = (query as any).lt('created_at', cutoff)
      }

      const { data } = await query
      setRfqs(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleRespond(rfqId: string) {
    if (!responseText.trim()) return
    setResponding(rfqId)
    await supabase.from('rfq_requests').update({ response: responseText, status: 'responded' }).eq('id', rfqId)
    setRfqs(prev => prev.map(r => r.id === rfqId ? { ...r, response: responseText, status: 'responded' } : r))
    setResponseText('')
    setExpandedId(null)
    setResponding(null)
  }

  if (!profile) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-navy)' }} />
    </div>
  )

  if (profile.tier === 'listed') return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>RFQ Inbox</h1>
      <div className="text-center py-16 bg-white border-2 rounded-2xl" style={{ borderColor: 'var(--color-gold)' }}>
        <Lock className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-gold)' }} />
        <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-navy)' }}>RFQs require a paid plan</p>
        <p className="text-sm mb-4" style={{ color: 'var(--color-gray)' }}>Upgrade to Connected ($100/mo) to receive quote requests from executives.</p>
        <a href="/provider/billing" className="text-sm font-bold px-5 py-2.5 rounded-xl text-white inline-block" style={{ backgroundColor: 'var(--color-navy)' }}>
          Upgrade Plan
        </a>
      </div>
    </div>
  )

  const newCount = rfqs.filter(r => r.status === 'open').length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>RFQ Inbox</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
            {profile.tier === 'connected'
              ? 'You see RFQs 24 hours after they arrive. Upgrade to Featured for instant access.'
              : 'Featured Partner — you see all RFQs instantly.'}
          </p>
        </div>
        {newCount > 0 && (
          <span className="text-sm font-bold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: 'var(--color-navy)' }}>
            {newCount} new
          </span>
        )}
      </div>

      {profile.tier === 'connected' && (
        <div className="mb-5 p-4 rounded-2xl text-sm flex items-center gap-3" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          <Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--color-blue)' }} />
          <p style={{ color: 'var(--color-navy)' }}>
            <strong>24-hour delay active.</strong> Featured Partners see RFQs as soon as they arrive.{' '}
            <a href="/provider/billing" className="underline font-semibold">Upgrade to Featured</a> for instant access.
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 h-20 animate-pulse" style={{ borderColor: 'var(--color-border)' }} />
          ))}
        </div>
      ) : rfqs.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold mb-1" style={{ color: 'var(--color-navy)' }}>No RFQs yet</p>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Quote requests from executives will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rfqs.map((rfq: any) => {
            const s = STATUS_STYLE[rfq.status] ?? STATUS_STYLE.open
            const expanded = expandedId === rfq.id
            const exec = rfq.executive_profiles
            return (
              <div key={rfq.id} className="bg-white border rounded-2xl overflow-hidden"
                style={{ borderColor: rfq.status === 'open' ? 'var(--color-blue)' : 'var(--color-border)' }}>
                <button className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : rfq.id)}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <Send className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: 'var(--color-navy)' }}>{rfq.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
                      From: {exec?.first_name} {exec?.last_name}
                      {exec?.company_name && ` · ${exec.company_name}`}
                      {exec?.company_ticker && ` (${exec.company_ticker})`}
                      {' · '}{new Date(rfq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  {expanded
                    ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />
                    : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />}
                </button>

                {expanded && (
                  <div className="px-6 pb-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="pt-4 space-y-3">
                      <p className="text-sm" style={{ color: 'var(--color-gray-dark)' }}>{rfq.description}</p>
                      <div className="flex gap-4 text-xs" style={{ color: 'var(--color-gray)' }}>
                        {rfq.budget_range && <span>💰 Budget: {rfq.budget_range}</span>}
                        {rfq.deadline && <span>📅 Deadline: {new Date(rfq.deadline).toLocaleDateString()}</span>}
                      </div>
                      {rfq.response ? (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#d1fae5' }}>
                          <p className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: '#065f46' }}>
                            <CheckCircle className="w-3 h-3" /> Your Response
                          </p>
                          <p className="text-sm" style={{ color: '#065f46' }}>{rfq.response}</p>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Your Response</label>
                          <textarea value={responseText} onChange={e => setResponseText(e.target.value)}
                            placeholder="Write your response to this quote request…"
                            rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                            style={{ borderColor: 'var(--color-border)' }} />
                          <div className="flex justify-end mt-2">
                            <button onClick={() => handleRespond(rfq.id)}
                              disabled={!responseText.trim() || responding === rfq.id}
                              className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-50"
                              style={{ backgroundColor: 'var(--color-navy)' }}>
                              <Send className="w-3.5 h-3.5" />
                              {responding === rfq.id ? 'Sending…' : 'Send Response'}
                            </button>
                          </div>
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
