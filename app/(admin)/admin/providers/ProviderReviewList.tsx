'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Globe, Mail, Phone, ChevronDown, ChevronUp, Edit2, ToggleLeft, ToggleRight, Link2, Check } from 'lucide-react'

const TIER_STYLE: Record<string, { color: string; bg: string }> = {
  featured: { color: '#92400e', bg: '#fef3c7' },
  listed:   { color: '#1e40af', bg: '#dbeafe' },
  free:     { color: '#6b7280', bg: '#f3f4f6' },
}

export default function ProviderReviewList({
  providers,
  status,
  allCategories = [],
  allExchanges = [],
}: {
  providers: any[]
  status: string
  allCategories?: any[]
  allExchanges?: any[]
}) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [editTarget, setEditTarget] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Record<string, string>>({})
  const [editCats, setEditCats] = useState<string[]>([])
  const [editPrimary, setEditPrimary] = useState<string>('')
  const [editExch, setEditExch] = useState<string[]>([])
  const [catSearch, setCatSearch] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [linkState, setLinkState] = useState<Record<string, 'loading' | 'copied' | null>>({})

  function startEdit(p: any) {
    setEditTarget(p.id)
    setEditFields({})
    setCatSearch('')
    const cats = (p.provider_categories ?? []).map((c: any) => c.category_id).filter(Boolean)
    setEditCats(cats)
    setEditPrimary((p.provider_categories ?? []).find((c: any) => c.is_primary)?.category_id ?? cats[0] ?? '')
    setEditExch((p.provider_exchanges ?? []).map((e: any) => e.exchange_id).filter(Boolean))
  }

  async function copyPaymentLink(id: string, tier: 'listed' | 'featured') {
    const key = `${id}:${tier}`
    setLinkState(prev => ({ ...prev, [key]: 'loading' }))
    try {
      const res = await fetch(`/api/admin/providers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout_link', tier }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Failed')
      await navigator.clipboard.writeText(data.url)
      setLinkState(prev => ({ ...prev, [key]: 'copied' }))
      setTimeout(() => setLinkState(prev => ({ ...prev, [key]: null })), 3000)
    } catch (e: any) {
      setLinkState(prev => ({ ...prev, [key]: null }))
      alert(`Payment link failed: ${e.message}`)
    }
  }

  async function callApi(id: string, body: object) {
    setLoading(id)
    const res = await fetch(`/api/admin/providers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setLoading(null)
    if (res.ok) router.refresh()
    else alert('Action failed — check console')
  }

  if (providers.length === 0) {
    return (
      <div className="bg-white border rounded-2xl p-16 text-center" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-4xl mb-3">
          {status === 'pending' ? '✅' : status === 'approved' ? '🏢' : '🚫'}
        </p>
        <p className="font-bold" style={{ color: 'var(--color-navy)' }}>
          {status === 'pending' ? 'No providers awaiting review' : `No ${status} providers`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {providers.map(p => {
        const tier = TIER_STYLE[p.tier] ?? TIER_STYLE.free
        const isExpanded = expanded === p.id
        const isEditing = editTarget === p.id
        const isRejecting = rejectTarget === p.id
        const categories = p.provider_categories
          ?.map((pc: any) => pc.service_categories?.name)
          .filter(Boolean)
          .join(', ')

        return (
          <div key={p.id} className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>

            {/* Header row */}
            <div className="px-6 py-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                {p.company_name?.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-extrabold" style={{ color: 'var(--color-navy)' }}>{p.company_name}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                    style={{ backgroundColor: tier.bg, color: tier.color }}>
                    {p.tier}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: p.is_active ? '#d1fae5' : '#fee2e2',
                      color: p.is_active ? '#065f46' : '#991b1b',
                    }}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {p.email && <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{p.email}</p>}
                {categories && <p className="text-xs mt-0.5" style={{ color: 'var(--color-blue)' }}>{categories}</p>}
                {status === 'rejected' && p.rejection_reason && (
                  <p className="text-xs mt-1 italic" style={{ color: '#ef4444' }}>Rejected: {p.rejection_reason}</p>
                )}
                {status === 'approved' && p.approved_at && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray-light)' }}>
                    Approved {new Date(p.approved_at).toLocaleDateString()} · {p.approved_by}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="shrink-0 text-right">
                <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray-light)' }}>
                  {p.primary_market_code ?? 'CA'}
                </p>
              </div>

              {/* Expand toggle */}
              <button
                onClick={() => setExpanded(isExpanded ? null : p.id)}
                className="p-2 rounded-lg hover:bg-gray-100 shrink-0"
                style={{ color: 'var(--color-gray)' }}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="border-t px-6 py-5 space-y-4" style={{ borderColor: 'var(--color-border)', backgroundColor: '#f8f9fc' }}>

                {/* Profile preview */}
                {isEditing ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-gray)' }}>Edit Fields</p>
                    {[
                      { key: 'company_name', label: 'Company Name', value: editFields.company_name ?? p.company_name },
                      { key: 'tagline',      label: 'Tagline',      value: editFields.tagline ?? p.tagline ?? '' },
                      { key: 'email',        label: 'Email',        value: editFields.email ?? p.email ?? '' },
                      { key: 'phone',        label: 'Phone',        value: editFields.phone ?? p.phone ?? '' },
                      { key: 'website_url',  label: 'Website',      value: editFields.website_url ?? p.website_url ?? '' },
                      { key: 'linkedin_url', label: 'LinkedIn URL', value: editFields.linkedin_url ?? p.linkedin_url ?? '' },
                      { key: 'logo_url',     label: 'Logo URL',     value: editFields.logo_url ?? p.logo_url ?? '' },
                      { key: 'city',         label: 'City',         value: editFields.city ?? p.city ?? '' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>{f.label}</label>
                        <input
                          value={editFields[f.key] ?? f.value}
                          onChange={e => setEditFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                          style={{ borderColor: 'var(--color-border)' }}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Description</label>
                      <textarea
                        rows={4}
                        value={editFields.description ?? p.description ?? ''}
                        onChange={e => setEditFields(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                        style={{ borderColor: 'var(--color-border)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Tier</label>
                      <select
                        value={editFields.tier ?? p.tier}
                        onChange={e => setEditFields(prev => ({ ...prev, tier: e.target.value }))}
                        className="px-3 py-2 rounded-xl border text-sm outline-none"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <option value="free">Free</option>
                        <option value="listed">Listed</option>
                        <option value="featured">Featured</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>
                        Service Categories <span className="font-normal" style={{ color: 'var(--color-gray)' }}>({editCats.length} selected)</span>
                      </label>
                      <input
                        value={catSearch}
                        onChange={e => setCatSearch(e.target.value)}
                        placeholder="Search categories…"
                        className="w-full px-3 py-2 mb-2 rounded-xl border text-sm outline-none"
                        style={{ borderColor: 'var(--color-border)' }}
                      />
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto border rounded-xl p-2" style={{ borderColor: 'var(--color-border)' }}>
                        {allCategories
                          .filter(c => !catSearch || c.name.toLowerCase().includes(catSearch.toLowerCase()) || (c.group_name ?? '').toLowerCase().includes(catSearch.toLowerCase()))
                          .map(c => {
                            const selected = editCats.includes(c.id)
                            return (
                              <button key={c.id} type="button"
                                onClick={() => {
                                  setEditCats(prev => selected ? prev.filter(id => id !== c.id) : [...prev, c.id])
                                  if (selected && editPrimary === c.id) setEditPrimary('')
                                  if (!selected && editCats.length === 0) setEditPrimary(c.id)
                                }}
                                className="text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors"
                                style={{
                                  backgroundColor: selected ? 'var(--color-navy)' : 'white',
                                  color: selected ? 'white' : 'var(--color-gray)',
                                  borderColor: selected ? 'var(--color-navy)' : 'var(--color-border)',
                                }}>
                                {c.name}
                              </button>
                            )
                          })}
                      </div>
                      {editCats.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: 'var(--color-gray-dark)' }}>Primary:</span>
                          <select
                            value={editCats.includes(editPrimary) ? editPrimary : editCats[0]}
                            onChange={e => setEditPrimary(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border text-xs outline-none"
                            style={{ borderColor: 'var(--color-border)' }}>
                            {editCats.map(id => (
                              <option key={id} value={id}>{allCategories.find(c => c.id === id)?.name ?? id}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-gray-dark)' }}>Exchanges</label>
                      <div className="flex flex-wrap gap-1.5">
                        {allExchanges.map(ex => {
                          const selected = editExch.includes(ex.id)
                          return (
                            <button key={ex.id} type="button"
                              onClick={() => setEditExch(prev => selected ? prev.filter(id => id !== ex.id) : [...prev, ex.id])}
                              className="text-xs font-bold px-3 py-1.5 rounded-full border transition-colors"
                              style={{
                                backgroundColor: selected ? 'var(--color-gold)' : 'white',
                                color: selected ? 'white' : 'var(--color-gray)',
                                borderColor: selected ? 'var(--color-gold)' : 'var(--color-border)',
                              }}>
                              {ex.code}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={loading === p.id}
                        onClick={async () => {
                          await callApi(p.id, {
                            ...editFields,
                            category_ids: editCats,
                            primary_category_id: editCats.includes(editPrimary) ? editPrimary : editCats[0] ?? null,
                            exchange_ids: editExch,
                          })
                          setEditTarget(null)
                          setEditFields({})
                        }}
                        className="text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-navy)' }}>
                        Save Changes
                      </button>
                      <button onClick={() => { setEditTarget(null); setEditFields({}) }}
                        className="text-sm font-semibold px-4 py-2 rounded-xl border"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {p.tagline && <p className="font-semibold" style={{ color: 'var(--color-navy)' }}>{p.tagline}</p>}
                    {p.description && <p style={{ color: 'var(--color-gray)' }}>{p.description}</p>}
                    <div className="flex flex-wrap gap-4 pt-1">
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--color-blue)' }}>
                          <Globe className="w-3 h-3" /> {p.website_url}
                        </a>
                      )}
                      {p.email && (
                        <a href={`mailto:${p.email}`}
                          className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--color-blue)' }}>
                          <Mail className="w-3 h-3" /> {p.email}
                        </a>
                      )}
                      {p.phone && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-gray)' }}>
                          <Phone className="w-3 h-3" /> {p.phone}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Reject reason input */}
                {isRejecting && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#ef4444' }}>Rejection reason (shown to provider)</label>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="e.g. Profile content violates listing standards — please revise your description."
                      className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                      style={{ borderColor: '#ef4444' }}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        disabled={!rejectReason.trim() || loading === p.id}
                        onClick={async () => {
                          await callApi(p.id, { action: 'reject', reason: rejectReason })
                          setRejectTarget(null)
                          setRejectReason('')
                        }}
                        className="text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-50"
                        style={{ backgroundColor: '#ef4444' }}>
                        Confirm Rejection
                      </button>
                      <button onClick={() => { setRejectTarget(null); setRejectReason('') }}
                        className="text-sm font-semibold px-4 py-2 rounded-xl border"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {!isEditing && !isRejecting && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {status === 'pending' && (
                      <button
                        disabled={loading === p.id}
                        onClick={() => callApi(p.id, { action: 'approve' })}
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-50"
                        style={{ backgroundColor: '#10b981' }}>
                        <CheckCircle className="w-4 h-4" />
                        {loading === p.id ? 'Approving…' : 'Approve'}
                      </button>
                    )}
                    {status === 'rejected' && (
                      <button
                        disabled={loading === p.id}
                        onClick={() => callApi(p.id, { action: 'approve' })}
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-50"
                        style={{ backgroundColor: '#10b981' }}>
                        <CheckCircle className="w-4 h-4" /> Re-Approve
                      </button>
                    )}
                    {status !== 'rejected' && (
                      <button
                        onClick={() => { setRejectTarget(p.id); setRejectReason('') }}
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white"
                        style={{ backgroundColor: '#ef4444' }}>
                        <XCircle className="w-4 h-4" />
                        {status === 'approved' ? 'Revoke' : 'Reject'}
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(p)}
                      className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    {status === 'approved' && p.tier !== 'featured' && (['listed', 'featured'] as const).map(t => {
                      const state = linkState[`${p.id}:${t}`]
                      if (t === 'listed' && p.tier === 'listed') return null
                      return (
                        <button key={t}
                          disabled={state === 'loading'}
                          onClick={() => copyPaymentLink(p.id, t)}
                          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border disabled:opacity-50"
                          style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>
                          {state === 'copied'
                            ? <><Check className="w-4 h-4" /> Copied!</>
                            : <><Link2 className="w-4 h-4" /> {state === 'loading' ? 'Creating…' : `Payment Link — ${t === 'listed' ? 'Listed $1,000/yr' : 'Featured $10,000/yr'}`}</>}
                        </button>
                      )
                    })}
                    <button
                      disabled={loading === p.id}
                      onClick={() => callApi(p.id, { action: 'toggle_active' })}
                      className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}>
                      {p.is_active
                        ? <><ToggleRight className="w-4 h-4 text-green-500" /> Deactivate</>
                        : <><ToggleLeft className="w-4 h-4" /> Reactivate</>
                      }
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
