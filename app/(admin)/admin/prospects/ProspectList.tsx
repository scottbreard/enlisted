'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Phone, Mail, Globe, CheckCircle, Download } from 'lucide-react'

const EXCHANGES = ['TSX', 'TSXV', 'CSE', 'NEO']
const TITLES = ['CEO', 'CFO', 'IR', 'Director']

export default function ProspectList({
  rows, filters, pageNum, totalPages, qsBase,
}: {
  rows: any[]
  filters: Record<string, string>
  pageNum: number
  totalPages: number
  qsBase: string
}) {
  const router = useRouter()
  const [search, setSearch] = useState(filters.q)
  const [busy, setBusy] = useState<string | null>(null)

  function nav(over: Record<string, string>) {
    const params = new URLSearchParams({ ...filters, ...over, page: over.page ?? '1' })
    for (const [k, v] of [...params.entries()]) if (!v) params.delete(k)
    router.push(`/admin/prospects?${params.toString()}`)
  }

  async function toggleContacted(p: any) {
    setBusy(p.id)
    await fetch(`/api/admin/prospects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacted: !p.contacted_at }),
    })
    setBusy(null)
    router.refresh()
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white border rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
        <form onSubmit={e => { e.preventDefault(); nav({ q: search }) }} className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-48" style={{ borderColor: 'var(--color-border)' }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or company…" className="flex-1 text-sm outline-none" />
        </form>

        <select value={filters.exchange} onChange={e => nav({ exchange: e.target.value })} className="px-3 py-2 rounded-xl border text-sm bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <option value="">All exchanges</option>
          {EXCHANGES.map(x => <option key={x} value={x}>{x}</option>)}
        </select>

        <select value={filters.title} onChange={e => nav({ title: e.target.value })} className="px-3 py-2 rounded-xl border text-sm bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <option value="">All titles</option>
          {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={filters.has} onChange={e => nav({ has: e.target.value })} className="px-3 py-2 rounded-xl border text-sm bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <option value="">Any contact info</option>
          <option value="email">Has email</option>
          <option value="phone">Has phone</option>
        </select>

        <select value={filters.contacted} onChange={e => nav({ contacted: e.target.value })} className="px-3 py-2 rounded-xl border text-sm bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <option value="">Contacted + not</option>
          <option value="no">Not contacted</option>
          <option value="yes">Contacted</option>
        </select>

        <a
          href={`/api/admin/prospects/export?${new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)))}`}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left" style={{ borderColor: 'var(--color-border)' }}>
              {['Name', 'Title', 'Company', 'Contact', 'Source', ''].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-gray-light)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center" style={{ color: 'var(--color-gray-light)' }}>No prospects match these filters.</td></tr>
            )}
            {rows.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-[#f8f9fc]" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'var(--color-navy)' }}>
                  {p.first_name} {p.last_name}
                  {p.contacted_at && <CheckCircle className="w-3.5 h-3.5 inline ml-1.5 text-green-500" />}
                </td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--color-gray)' }}>{p.title ?? '—'}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-gray-dark)' }}>
                  {p.company_name}
                  {p.issuers && (
                    <span className="ml-2 text-xs font-bold" style={{ color: 'var(--color-gray-light)' }}>
                      {p.issuers.exchange_code}:{p.issuers.symbol}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-2.5">
                    {p.email && <a href={`mailto:${p.email}`} title={p.email}><Mail className="w-4 h-4" style={{ color: 'var(--color-blue)' }} /></a>}
                    {p.phone && <a href={`tel:${p.phone}`} title={p.phone}><Phone className="w-4 h-4" style={{ color: 'var(--color-blue)' }} /></a>}
                    {(p.issuers?.ir_email || p.issuers?.general_email) && (
                      <a href={`mailto:${p.issuers.ir_email ?? p.issuers.general_email}`} title={`Corporate: ${p.issuers.ir_email ?? p.issuers.general_email}`}>
                        <Mail className="w-4 h-4" style={{ color: 'var(--color-gray-light)' }} />
                      </a>
                    )}
                    {p.issuers?.website && <a href={p.issuers.website} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4" style={{ color: 'var(--color-gray-light)' }} /></a>}
                    {!p.email && !p.phone && !p.issuers?.website && !p.issuers?.ir_email && !p.issuers?.general_email && <span style={{ color: 'var(--color-gray-light)' }}>—</span>}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--color-gray-light)' }}>{p.source}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    disabled={busy === p.id}
                    onClick={() => toggleContacted(p)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-50"
                    style={p.contacted_at
                      ? { borderColor: '#10b981', color: '#065f46', backgroundColor: '#d1fae5' }
                      : { borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}>
                    {p.contacted_at ? 'Contacted ✓' : 'Mark contacted'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          <button disabled={pageNum <= 1} onClick={() => nav({ page: String(pageNum - 1) })}
            className="px-4 py-2 rounded-xl border disabled:opacity-40" style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
            ← Prev
          </button>
          <span style={{ color: 'var(--color-gray)' }}>Page {pageNum} of {totalPages}</span>
          <button disabled={pageNum >= totalPages} onClick={() => nav({ page: String(pageNum + 1) })}
            className="px-4 py-2 rounded-xl border disabled:opacity-40" style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
            Next →
          </button>
        </div>
      )}
    </>
  )
}
