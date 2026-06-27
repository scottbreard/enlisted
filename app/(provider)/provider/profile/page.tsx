'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, CheckCircle, Globe, Mail, Phone, Building2, Tag, Layers } from 'lucide-react'

const exchanges = ['TSX', 'TSXV', 'CSE', 'NEO']

export default function ProviderProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    company_name: '', tagline: '', description: '', website_url: '',
    email: '', phone: '', founded_year: '', team_size: '',
    linkedin_url: '', city: '',
  })
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([])
  const [allExchanges, setAllExchanges] = useState<any[]>([])
  const [allCategories, setAllCategories] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

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
      setForm({
        company_name: p.company_name ?? '',
        tagline: p.tagline ?? '',
        description: p.description ?? '',
        website_url: p.website_url ?? '',
        email: p.email ?? '',
        phone: p.phone ?? '',
        founded_year: p.founded_year?.toString() ?? '',
        team_size: p.team_size ?? '',
        linkedin_url: p.linkedin_url ?? '',
        city: p.city ?? '',
      })

      // Load exchanges
      const { data: exRows } = await supabase.from('exchanges').select('id, code').order('code')
      setAllExchanges(exRows ?? [])

      // Load provider exchanges
      const { data: pe } = await supabase
        .from('provider_exchanges')
        .select('exchange_id, exchanges(code)')
        .eq('provider_id', p.id)
      const codes = pe?.map((r: any) => r.exchanges?.code).filter(Boolean) ?? []
      setSelectedExchanges(codes)

      // Load all categories
      const { data: cats } = await supabase
        .from('service_categories')
        .select('id, slug, name, group_name')
        .order('sort_order')
      setAllCategories(cats ?? [])

      // Load provider categories
      const { data: pc } = await supabase
        .from('provider_categories')
        .select('category_id')
        .eq('provider_id', p.id)
      setSelectedCategories(pc?.map((r: any) => r.category_id) ?? [])
    }
    load()
  }, [])

  function toggleExchange(code: string) {
    setSelectedExchanges(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  function toggleCategory(id: string) {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  async function handleSave() {
    setSaving(true)
    if (!profile) return

    await supabase.from('provider_profiles').update({
      ...form,
      founded_year: form.founded_year ? parseInt(form.founded_year) : null,
      updated_at: new Date().toISOString(),
    }).eq('id', profile.id)

    // Sync exchanges
    if (allExchanges.length > 0) {
      await supabase.from('provider_exchanges').delete().eq('provider_id', profile.id)
      const toInsert = allExchanges
        .filter(ex => selectedExchanges.includes(ex.code))
        .map(ex => ({ provider_id: profile.id, exchange_id: ex.id }))
      if (toInsert.length > 0) await supabase.from('provider_exchanges').insert(toInsert)
    }

    // Sync categories
    await supabase.from('provider_categories').delete().eq('provider_id', profile.id)
    if (selectedCategories.length > 0) {
      await supabase.from('provider_categories').insert(
        selectedCategories.map(category_id => ({ provider_id: profile.id, category_id }))
      )
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

  const isFree = profile.tier === 'listed'

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Edit Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
            {isFree
              ? 'Only your company name is shown on the free plan. Upgrade to display full details.'
              : 'This is what executives see in the directory.'}
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white disabled:opacity-60 transition-all"
          style={{ backgroundColor: saved ? '#10b981' : 'var(--color-navy)' }}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}</>}
        </button>
      </div>

      {isFree && (
        <div className="mb-6 p-4 rounded-2xl border-2 text-sm" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)', color: 'var(--color-navy)' }}>
          <strong>Free plan:</strong> Only your company name appears in search results. Upgrade to Good ($100/mo) to show your full profile, logo, contact details, and description.
        </div>
      )}

      {/* Company basics */}
      <div className="bg-white border rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Company Basics</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Company Name *</label>
            <input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
              placeholder="Acme Investor Relations Inc." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Tagline {isFree && <span style={{ color: 'var(--color-gray-light)' }}>(Good+ plan)</span>}
            </label>
            <input value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))}
              disabled={isFree}
              placeholder="Canada's leading IR firm for micro-cap mining companies (Connected+)"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none disabled:opacity-40"
              style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Description {isFree && <span style={{ color: 'var(--color-gray-light)' }}>(Good+ plan — up to 300 words)</span>}
            </label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              disabled={isFree}
              placeholder="Tell executives what you do and who you serve…"
              rows={5} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none disabled:opacity-40"
              style={{ borderColor: 'var(--color-border)' }} />
            {!isFree && (
              <p className="text-xs mt-1" style={{ color: 'var(--color-gray-light)' }}>
                {form.description.trim().split(/\s+/).filter(Boolean).length} / {profile.tier === 'good' ? 300 : 750} words
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>City</label>
              <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                placeholder="Toronto, ON" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Founded Year</label>
              <input value={form.founded_year} onChange={e => setForm(p => ({ ...p, founded_year: e.target.value }))}
                placeholder="2010" type="number" min="1900" max="2030"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Team Size</label>
              <select value={form.team_size} onChange={e => setForm(p => ({ ...p, team_size: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: 'var(--color-border)' }}>
                <option value="">Select</option>
                {['1–5','6–15','16–50','51–200','200+'].map(s => <option key={s} value={s}>{s} employees</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white border rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Contact Information</h2>
          {isFree && <span className="text-xs ml-auto" style={{ color: 'var(--color-gray-light)' }}>Shown on Good+ plan</span>}
        </div>
        <div className="space-y-4">
          {[
            { label: 'Website URL', key: 'website_url', placeholder: 'https://acme-ir.com', icon: Globe },
            { label: 'Business Email', key: 'email', placeholder: 'contact@acme-ir.com', icon: Mail },
            { label: 'Phone', key: 'phone', placeholder: '+1 (416) 555-0100', icon: Phone },
            { label: 'LinkedIn URL', key: 'linkedin_url', placeholder: 'https://linkedin.com/company/acme-ir', icon: Globe },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>{f.label}</label>
              <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                disabled={isFree} placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none disabled:opacity-40"
                style={{ borderColor: 'var(--color-border)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-white border rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Service Categories</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--color-gray)' }}>
          Select every category that applies. Executives filter the directory by category.
          {isFree && <span style={{ color: 'var(--color-gray-light)' }}> Connected plan: up to 3 · Featured: unlimited.</span>}
        </p>
        {Object.entries(
          allCategories.reduce((groups: Record<string, any[]>, cat) => {
            if (!groups[cat.group_name]) groups[cat.group_name] = []
            groups[cat.group_name].push(cat)
            return groups
          }, {})
        ).map(([group, cats]) => (
          <div key={group} className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-gray)' }}>{group}</p>
            <div className="flex flex-wrap gap-2">
              {cats.map((cat: any) => {
                const selected = selectedCategories.includes(cat.id)
                return (
                  <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={{
                      borderColor: selected ? 'var(--color-navy)' : 'var(--color-border)',
                      backgroundColor: selected ? 'var(--color-navy)' : 'white',
                      color: selected ? 'white' : 'var(--color-gray-dark)',
                    }}>
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {selectedCategories.length > 0 && (
          <p className="text-xs mt-2" style={{ color: 'var(--color-blue)' }}>
            {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
          </p>
        )}
      </div>

      {/* Exchanges served */}
      <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Exchanges You Serve</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--color-gray)' }}>
          Exchange badges appear on your profile and help executives filter by their listing.
        </p>
        <div className="flex gap-3 flex-wrap">
          {exchanges.map(code => (
            <button key={code} onClick={() => toggleExchange(code)}
              className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
              style={{
                borderColor: selectedExchanges.includes(code) ? 'var(--color-navy)' : 'var(--color-border)',
                backgroundColor: selectedExchanges.includes(code) ? 'var(--color-navy)' : 'white',
                color: selectedExchanges.includes(code) ? 'white' : 'var(--color-gray)',
              }}>
              {code}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
