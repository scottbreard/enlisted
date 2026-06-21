'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Building2, Save, CheckCircle } from 'lucide-react'

const exchanges = ['TSX', 'TSXV', 'CSE', 'NEO']
const sectors = [
  'Mining & Metals', 'Oil & Gas', 'Biotech & Pharma', 'Technology',
  'Cannabis', 'Clean Energy', 'Real Estate', 'Financial Services',
  'Agriculture', 'Consumer', 'Industrials', 'Other',
]
const fiscalYearEnds = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']
const titles = ['CEO','CFO','COO','IRO','Corporate Secretary','President','Executive Chairman','Other']
const marketCaps = [
  { value: 'micro', label: 'Micro Cap (under $50M)' },
  { value: 'small', label: 'Small Cap ($50M–$300M)' },
  { value: 'mid',   label: 'Mid Cap ($300M–$2B)' },
  { value: 'large', label: 'Large Cap (over $2B)' },
]

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [execExchange, setExecExchange] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    first_name: '', last_name: '', title: '', company_name: '',
    company_ticker: '', sector: '', market_cap_range: '', bio: '', linkedin_url: '',
  })
  const [exchangeForm, setExchangeForm] = useState({
    exchange_code: '', fiscal_year_end: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase
        .from('executive_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (p) {
        setProfile(p)
        setForm({
          first_name: p.first_name ?? '',
          last_name: p.last_name ?? '',
          title: p.title ?? '',
          company_name: p.company_name ?? '',
          company_ticker: p.company_ticker ?? '',
          sector: p.sector ?? '',
          market_cap_range: p.market_cap_range ?? '',
          bio: p.bio ?? '',
          linkedin_url: p.linkedin_url ?? '',
        })

        // Load exchange
        const { data: ee } = await supabase
          .from('executive_exchanges')
          .select('*, exchanges(code)')
          .eq('executive_id', p.id)
          .eq('primary', true)
          .single()

        if (ee) {
          setExecExchange(ee)
          setExchangeForm({
            exchange_code: (ee as any).exchanges?.code ?? '',
            fiscal_year_end: ee.fiscal_year_end ?? '',
          })
        }
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !profile) return

    // Update profile
    await supabase.from('executive_profiles').update({
      ...form,
      updated_at: new Date().toISOString(),
    }).eq('id', profile.id)

    // Update exchange if set
    if (exchangeForm.exchange_code && exchangeForm.fiscal_year_end) {
      const { data: exchangeRow } = await supabase
        .from('exchanges')
        .select('id')
        .eq('code', exchangeForm.exchange_code)
        .single()

      if (exchangeRow) {
        if (execExchange) {
          await supabase.from('executive_exchanges').update({
            exchange_id: exchangeRow.id,
            fiscal_year_end: exchangeForm.fiscal_year_end,
          }).eq('executive_id', profile.id).eq('primary', true)
        } else {
          await supabase.from('executive_exchanges').insert({
            executive_id: profile.id,
            exchange_id: exchangeRow.id,
            fiscal_year_end: exchangeForm.fiscal_year_end,
            primary: true,
          })
        }
      }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!profile) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-navy)' }} />
    </div>
  )

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>My Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
            Keep your profile up to date to unlock compliance calendar and peer insights.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white disabled:opacity-60 transition-all"
          style={{ backgroundColor: saved ? '#10b981' : 'var(--color-navy)' }}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}</>}
        </button>
      </div>

      {/* Personal info */}
      <div className="bg-white border rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Personal Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'First Name', key: 'first_name', placeholder: 'Jane' },
            { label: 'Last Name',  key: 'last_name',  placeholder: 'Smith' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>{f.label}</label>
              <input
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Title</label>
            <select value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
              <option value="">Select title</option>
              {titles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>LinkedIn URL</label>
            <input value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))}
              placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="Brief professional background…" rows={3}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>
        </div>
      </div>

      {/* Company info */}
      <div className="bg-white border rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Company Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Company Name</label>
            <input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
              placeholder="Acme Mining Corp." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Ticker Symbol</label>
            <input value={form.company_ticker} onChange={e => setForm(p => ({ ...p, company_ticker: e.target.value.toUpperCase() }))}
              placeholder="ACM" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Sector</label>
            <select value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
              <option value="">Select sector</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Market Cap Range</label>
            <select value={form.market_cap_range} onChange={e => setForm(p => ({ ...p, market_cap_range: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
              <option value="">Select range</option>
              {marketCaps.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Exchange & compliance */}
      <div className="bg-white border-2 rounded-2xl p-6" style={{ borderColor: 'var(--color-gold)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📅</span>
          <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Exchange & Compliance Setup</h2>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--color-gray)' }}>
          Required to auto-generate your compliance calendar and stock dashboard.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Primary Exchange</label>
            <select value={exchangeForm.exchange_code} onChange={e => setExchangeForm(p => ({ ...p, exchange_code: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
              <option value="">Select exchange</option>
              {exchanges.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Fiscal Year End</label>
            <select value={exchangeForm.fiscal_year_end} onChange={e => setExchangeForm(p => ({ ...p, fiscal_year_end: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
              <option value="">Select month</option>
              {fiscalYearEnds.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        {exchangeForm.exchange_code && exchangeForm.fiscal_year_end && (
          <p className="text-xs mt-3 font-medium" style={{ color: '#10b981' }}>
            ✓ Your compliance calendar will auto-generate when you save.
          </p>
        )}
      </div>
    </div>
  )
}
