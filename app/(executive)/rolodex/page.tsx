'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Globe, Mail, Phone, Star, Trash2, Search } from 'lucide-react'

export default function RolodexPage() {
  const supabase = createClient()
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [execId, setExecId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', company: '', title: '', email: '', phone: '', website: '',
    category: '', notes: '', rating: 0,
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: exec } = await supabase
        .from('executive_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!exec) return
      setExecId(exec.id)

      const { data } = await supabase
        .from('executive_contacts')
        .select('*')
        .eq('owner_id', exec.id)
        .order('name')
      setContacts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!execId || !form.name) return
    setSaving(true)
    const { data, error } = await supabase
      .from('executive_contacts')
      .insert({ ...form, owner_id: execId, rating: form.rating || null })
      .select()
      .single()
    if (!error && data) {
      setContacts(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setShowForm(false)
      setForm({ name: '', company: '', title: '', email: '', phone: '', website: '', category: '', notes: '', rating: 0 })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('executive_contacts').delete().eq('id', id)
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  const filtered = contacts.filter(c =>
    !search || [c.name, c.company, c.category, c.email].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Rolodex</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>Your personal directory of advisors, service providers, and contacts.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Add contact form */}
      {showForm && (
        <div className="bg-white border-2 rounded-2xl p-6 mb-6" style={{ borderColor: 'var(--color-gold)' }}>
          <h2 className="font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>New Contact</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Name *', key: 'name', placeholder: 'Jane Smith' },
                { label: 'Company', key: 'company', placeholder: 'Acme IR Inc.' },
                { label: 'Title', key: 'title', placeholder: 'Senior IR Advisor' },
                { label: 'Category', key: 'category', placeholder: 'Investor Relations' },
                { label: 'Email', key: 'email', placeholder: 'jane@acme-ir.com' },
                { label: 'Phone', key: 'phone', placeholder: '+1 (416) 555-0100' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>{f.label}</label>
                  <input value={form[f.key as keyof typeof form] as string}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--color-border)' }} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Website</label>
                <input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                  placeholder="https://acme-ir.com"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--color-border)' }} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Working with them on Q3 disclosure…" rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--color-border)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}>
                      <Star className="w-5 h-5" style={{ color: n <= form.rating ? 'var(--color-gold)' : 'var(--color-border)', fill: n <= form.rating ? 'var(--color-gold)' : 'none' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="text-sm font-semibold px-4 py-2.5 rounded-xl border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving || !form.name}
                className="text-sm font-bold px-5 py-2.5 rounded-xl text-white disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                {saving ? 'Saving…' : 'Save Contact'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {contacts.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-gray-light)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company, or category…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--color-border)' }} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 h-32 animate-pulse" style={{ borderColor: 'var(--color-border)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-4xl mb-3">📇</p>
          <p className="font-bold mb-1" style={{ color: 'var(--color-navy)' }}>{contacts.length === 0 ? 'Your rolodex is empty' : 'No contacts match your search'}</p>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>
            {contacts.length === 0 ? 'Add advisors, lawyers, IR firms, and other contacts you work with.' : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((contact: any) => (
            <div key={contact.id} className="bg-white border rounded-2xl p-5 group hover:shadow-md transition-shadow" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold" style={{ color: 'var(--color-navy)' }}>{contact.name}</p>
                  {contact.title && <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{contact.title}</p>}
                  {contact.company && <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--color-blue)' }}>{contact.company}</p>}
                </div>
                <button onClick={() => handleDelete(contact.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>

              {contact.category && (
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: 'var(--color-blue-light)', color: 'var(--color-navy)' }}>
                  {contact.category}
                </span>
              )}

              {contact.rating > 0 && (
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className="w-3 h-3" style={{ color: n <= contact.rating ? 'var(--color-gold)' : 'var(--color-border)', fill: n <= contact.rating ? 'var(--color-gold)' : 'none' }} />
                  ))}
                </div>
              )}

              <div className="space-y-1">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs hover:underline" style={{ color: 'var(--color-blue)' }}>
                    <Mail className="w-3 h-3 shrink-0" />{contact.email}
                  </a>
                )}
                {contact.phone && (
                  <p className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-gray)' }}>
                    <Phone className="w-3 h-3 shrink-0" />{contact.phone}
                  </p>
                )}
                {contact.website && (
                  <a href={contact.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs hover:underline truncate" style={{ color: 'var(--color-blue)' }}>
                    <Globe className="w-3 h-3 shrink-0" />{contact.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {contact.notes && (
                  <p className="text-xs mt-1 italic line-clamp-2" style={{ color: 'var(--color-gray)' }}>{contact.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
