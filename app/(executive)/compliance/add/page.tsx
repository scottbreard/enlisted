'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Calendar, ArrowLeft } from 'lucide-react'

const CATEGORIES = [
  { value: 'filing',      label: '📄 Filing' },
  { value: 'agm',         label: '🏛️ AGM / Meeting' },
  { value: 'disclosure',  label: '📣 Disclosure' },
  { value: 'renewal',     label: '💳 Renewal' },
  { value: 'custom',      label: '📌 Other' },
]

export default function AddComplianceEventPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    category: 'custom',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.due_date) {
      setError('Title and due date are required.')
      return
    }
    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('executive_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!profile) { setError('Profile not found.'); setSaving(false); return }

    const { error: insertError } = await supabase
      .from('compliance_events')
      .insert({
        executive_id: profile.id,
        title: form.title,
        description: form.description || null,
        due_date: form.due_date,
        category: form.category,
        is_custom: true,
        is_completed: false,
      })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/compliance')
    router.refresh()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/compliance" className="flex items-center gap-2 text-sm font-semibold mb-6 hover:underline" style={{ color: 'var(--color-blue)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Calendar
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          <Calendar className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Add Custom Event</h1>
          <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Add a deadline or reminder to your compliance calendar.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8 space-y-5" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-gray-dark)' }}>
            Event Title <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Annual financial statements filing"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-gray-dark)' }}>
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => set('category', cat.value)}
                className="px-3 py-2 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  backgroundColor: form.category === cat.value ? 'var(--color-navy)' : 'white',
                  color: form.category === cat.value ? 'white' : 'var(--color-gray)',
                  borderColor: form.category === cat.value ? 'var(--color-navy)' : 'var(--color-border)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-gray-dark)' }}>
            Due Date <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="date"
            value={form.due_date}
            onChange={e => set('due_date', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-gray-dark)' }}>
            Notes <span className="font-normal normal-case" style={{ color: 'var(--color-gray-light)' }}>(optional)</span>
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Any additional context or reminders…"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>

        {error && (
          <p className="text-sm font-medium px-4 py-3 rounded-xl" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-navy)' }}
          >
            {saving ? 'Saving…' : 'Add to Calendar'}
          </button>
          <Link
            href="/compliance"
            className="px-6 py-3 rounded-xl font-semibold text-sm border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
