import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, CheckCircle, AlertCircle, Clock, Plus, ExternalLink } from 'lucide-react'

export const metadata = { title: 'Compliance Calendar — Enlisted' }

const MONTHS: Record<string, number> = {
  January:1,February:2,March:3,April:4,May:5,June:6,
  July:7,August:8,September:9,October:10,November:11,December:12
}

function computeDueDate(fiscalYearEndMonth: number, monthsAfter: number, daysOffset: number): Date {
  const now = new Date()
  const fyeYear = now.getMonth() + 1 > fiscalYearEndMonth ? now.getFullYear() : now.getFullYear() - 1
  const fye = new Date(fyeYear, fiscalYearEndMonth - 1 + monthsAfter, 1)
  fye.setDate(fye.getDate() + daysOffset)
  // If already passed, use next year
  if (fye < now) {
    const nextFye = new Date(fyeYear + 1, fiscalYearEndMonth - 1 + monthsAfter, 1)
    nextFye.setDate(nextFye.getDate() + daysOffset)
    return nextFye
  }
  return fye
}

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('executive_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  // Get or auto-generate compliance events
  const { data: existingEvents } = await supabase
    .from('compliance_events')
    .select('*')
    .eq('executive_id', profile.id)
    .order('due_date')

  let events = existingEvents ?? []

  // Auto-generate if empty and we have exchange info
  if (events.length === 0 && profile.sector) {
    const { data: execExchanges } = await supabase
      .from('executive_exchanges')
      .select('exchange_id, fiscal_year_end, exchanges(code)')
      .eq('executive_id', profile.id)

    if (execExchanges && execExchanges.length > 0) {
      for (const ee of execExchanges) {
        const exchangeCode = (ee as any).exchanges?.code
        const fyeMonth = MONTHS[ee.fiscal_year_end ?? 'December'] ?? 12

        const { data: templates } = await supabase
          .from('exchange_deadline_templates')
          .select('*')
          .eq('exchange_code', exchangeCode)

        if (!templates) continue

        const toInsert = templates.map(t => ({
          executive_id: profile.id,
          exchange_id: ee.exchange_id,
          title: t.event_name,
          description: t.description,
          due_date: computeDueDate(fyeMonth, t.months_after_fiscal_year_end, t.days_offset ?? 0)
            .toISOString().split('T')[0],
          category: t.event_category,
          is_custom: false,
          is_completed: false,
        }))

        const { data: inserted } = await supabase
          .from('compliance_events')
          .insert(toInsert)
          .select()

        events = [...events, ...(inserted ?? [])]
      }
      events.sort((a, b) => a.due_date.localeCompare(b.due_date))
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = events.filter(e => !e.is_completed && e.due_date >= today)
  const completed = events.filter(e => e.is_completed)
  const overdue = events.filter(e => !e.is_completed && e.due_date < today)

  function urgencyColor(dueDate: string) {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000)
    if (days <= 7) return '#ef4444'
    if (days <= 30) return '#f59e0b'
    return '#10b981'
  }

  function urgencyBg(dueDate: string) {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000)
    if (days <= 7) return '#fef2f2'
    if (days <= 30) return '#fffbeb'
    return '#f0fdf4'
  }

  function daysLabel(dueDate: string) {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `${days} days`
  }

  const categoryIcons: Record<string, string> = {
    filing: '📄', agm: '🏛️', disclosure: '📣', renewal: '💳', custom: '📌'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>Compliance Calendar</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
            Your regulatory filing deadlines, auto-generated for your exchange.
          </p>
        </div>
        <Link href="/compliance/add"
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          <Plus className="w-4 h-4" /> Add Event
        </Link>
      </div>

      {/* No exchange set up yet */}
      {events.length === 0 && (
        <div className="bg-white border-2 rounded-2xl p-12 text-center" style={{ borderColor: 'var(--color-border)', borderStyle: 'dashed' }}>
          <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-gray-light)' }} />
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--color-navy)' }}>
            Set up your compliance calendar
          </h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: 'var(--color-gray)' }}>
            Add your exchange listing to your profile and we'll auto-generate all your filing deadlines — annual financials, AGM, interim reports, and more.
          </p>
          <Link href="/profile"
            className="font-bold px-6 py-3 rounded-xl text-white inline-block"
            style={{ backgroundColor: 'var(--color-navy)' }}>
            Complete Your Profile →
          </Link>
        </div>
      )}

      {/* Overdue */}
      {overdue.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
            <AlertCircle className="w-4 h-4" /> Overdue ({overdue.length})
          </h2>
          <div className="space-y-3">
            {overdue.map(event => (
              <EventCard key={event.id} event={event} color="#ef4444" bg="#fef2f2" label="Overdue" icon={categoryIcons[event.category] ?? '📄'} supabase={supabase} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--color-navy)' }}>
            <Clock className="w-4 h-4" /> Upcoming ({upcoming.length})
          </h2>
          <div className="space-y-3">
            {upcoming.map(event => (
              <div key={event.id}
                className="bg-white border rounded-2xl p-5 hover:shadow-sm transition-shadow"
                style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: urgencyBg(event.due_date) }}>
                    {categoryIcons[event.category] ?? '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold" style={{ color: 'var(--color-navy)' }}>{event.title}</p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: urgencyBg(event.due_date), color: urgencyColor(event.due_date) }}>
                        {daysLabel(event.due_date)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm mb-1" style={{ color: 'var(--color-gray)' }}>{event.description}</p>
                    )}
                    <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>
                      Due: {new Date(event.due_date).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/directory`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-blue)' }}>
                      Find Provider <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#10b981' }}>
            <CheckCircle className="w-4 h-4" /> Completed ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map(event => (
              <div key={event.id}
                className="bg-white border rounded-xl px-5 py-3 flex items-center gap-3 opacity-60"
                style={{ borderColor: 'var(--color-border)' }}>
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#10b981' }} />
                <p className="text-sm font-medium line-through flex-1" style={{ color: 'var(--color-gray)' }}>{event.title}</p>
                <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>
                  {new Date(event.due_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, color, bg, label, icon }: any) {
  return (
    <div className="border rounded-2xl p-5" style={{ borderColor: color, backgroundColor: bg }}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold" style={{ color: 'var(--color-navy)' }}>{event.title}</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color, color: 'white' }}>
              {label}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
            Was due: {new Date(event.due_date).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
