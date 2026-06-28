import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Search, Calendar, Briefcase, Send,
  ArrowRight, Star, TrendingUp, CheckCircle, Circle
} from 'lucide-react'

export const metadata = { title: 'Dashboard — Enlisted' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('executive_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const { data: upcomingEvents } = await supabase
    .from('compliance_events')
    .select('*')
    .eq('executive_id', profile.id)
    .eq('is_completed', false)
    .gte('due_date', new Date().toISOString().split('T')[0])
    .order('due_date')
    .limit(3)

  const { data: vaultProviders } = await supabase
    .from('executive_vault')
    .select('*')
    .eq('executive_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: openRfqs } = await supabase
    .from('rfq_requests')
    .select('id')
    .eq('executive_id', profile.id)
    .eq('status', 'open')

  const { data: execExchanges } = await supabase
    .from('executive_exchanges')
    .select('id')
    .eq('executive_id', profile?.id)
    .limit(1)

  const { count: vaultCount } = await supabase
    .from('executive_vault')
    .select('*', { count: 'exact', head: true })
    .eq('executive_id', profile?.id)

  const steps = [
    {
      label: 'Complete your profile',
      description: 'Add your title, company, and sector.',
      done: !!(profile?.title && profile?.sector),
      href: '/profile',
    },
    {
      label: 'Add your ticker & exchange',
      description: 'Unlocks the compliance calendar and stock dashboard.',
      done: !!(profile?.company_ticker && execExchanges && execExchanges.length > 0),
      href: '/profile',
    },
    {
      label: 'Review your compliance calendar',
      description: 'Auto-generated from your exchange and fiscal year end.',
      done: !!(upcomingEvents && upcomingEvents.length > 0),
      href: '/compliance',
    },
    {
      label: 'Browse the provider directory',
      description: 'Find IR firms, lawyers, auditors, and 90+ more categories.',
      done: false,
      href: '/directory',
    },
    {
      label: 'Save a provider to your vault',
      description: 'Track your current service providers and contract renewals.',
      done: !!(vaultCount && vaultCount > 0),
      href: '/vault',
    },
  ]
  const stepsComplete = steps.filter(s => s.done).length
  const onboardingDone = stepsComplete === steps.length

  const { count: providerCount } = await supabase
    .from('provider_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const quickActions = [
    { href: '/directory', label: 'Find a Provider',     icon: Search,    color: 'var(--color-blue)' },
    { href: '/compliance',label: 'Compliance Calendar', icon: Calendar,  color: '#059669' },
    { href: '/vault',     label: 'My Provider Vault',   icon: Briefcase, color: '#7c3aed' },
    { href: '/rfq',       label: 'Send an RFQ',         icon: Send,      color: 'var(--color-gold)' },
  ]

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-gray)' }}>{greeting}</p>
            <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
              {profile.title} · {profile.company_name}
              {profile.company_ticker && ` · ${profile.company_ticker}`}
            </p>
          </div>
          {profile.is_founding_member && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
              <Star className="w-4 h-4 fill-current" />
              Founding Executive #{profile.founding_member_number}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Service Providers', value: providerCount ?? 0, icon: TrendingUp, href: '/directory' },
          { label: 'Vault Providers',   value: vaultProviders?.length ?? 0, icon: Briefcase, href: '/vault' },
          { label: 'Open RFQs',         value: openRfqs?.length ?? 0, icon: Send, href: '/rfq' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white border rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ borderColor: 'var(--color-border)' }}>
            <stat.icon className="w-5 h-5 mb-3" style={{ color: 'var(--color-navy)' }} />
            <p className="text-2xl font-extrabold" style={{ color: 'var(--color-navy)' }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {quickActions.map(action => (
          <Link key={action.href} href={action.href}
            className="bg-white border rounded-2xl p-4 hover:shadow-md transition-all group flex flex-col gap-3"
            style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${action.color}15`, color: action.color }}>
              <action.icon className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-gray-dark)' }}>{action.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Compliance deadlines */}
        <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>Upcoming Deadlines</h2>
            <Link href="/compliance" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-blue)' }}>
              View all →
            </Link>
          </div>
          {!upcomingEvents || upcomingEvents.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-gray-light)' }} />
              <p className="text-sm mb-3" style={{ color: 'var(--color-gray)' }}>No deadlines yet</p>
              <Link href="/compliance" className="text-xs font-bold px-4 py-2 rounded-lg text-white inline-block"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                Set Up Calendar
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcomingEvents.map((event: any) => {
                const dueDate = new Date(event.due_date)
                const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / 86400000)
                const color = daysLeft <= 7 ? '#ef4444' : daysLeft <= 30 ? '#f59e0b' : '#10b981'
                return (
                  <li key={event.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-gray-dark)' }}>{event.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>
                        {dueDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color }}>
                      {daysLeft}d
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Provider vault preview */}
        <div className="bg-white border rounded-2xl p-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold" style={{ color: 'var(--color-navy)' }}>My Provider Vault</h2>
            <Link href="/vault" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-blue)' }}>
              View all →
            </Link>
          </div>
          {!vaultProviders || vaultProviders.length === 0 ? (
            <div className="text-center py-6">
              <Briefcase className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-gray-light)' }} />
              <p className="text-sm mb-3" style={{ color: 'var(--color-gray)' }}>Track your service providers here</p>
              <Link href="/vault" className="text-xs font-bold px-4 py-2 rounded-lg text-white inline-block"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                Add a Provider
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {vaultProviders.map((entry: any) => (
                <li key={entry.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: 'var(--color-navy)' }}>
                    {entry.provider_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-gray-dark)' }}>{entry.provider_name}</p>
                    {entry.mandate && <p className="text-xs truncate" style={{ color: 'var(--color-gray-light)' }}>{entry.mandate}</p>}
                  </div>
                  {entry.rating && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(entry.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" style={{ color: 'var(--color-gold)' }} />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Onboarding checklist — hidden once all steps complete */}
      {!onboardingDone && (
        <div className="mt-6 bg-white border-2 rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-gold)' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--color-gold-light)' }}>
            <div>
              <p className="font-extrabold text-sm" style={{ color: 'var(--color-navy)' }}>
                Getting started — {stepsComplete} of {steps.length} complete
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>
                Complete these steps to get the most out of Enlisted.
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-32 hidden sm:block">
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(stepsComplete / steps.length) * 100}%`, backgroundColor: 'var(--color-gold)' }}
                />
              </div>
              <p className="text-xs text-right mt-1 font-semibold" style={{ color: 'var(--color-gold)' }}>
                {Math.round((stepsComplete / steps.length) * 100)}%
              </p>
            </div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {steps.map((step, i) => (
              <li key={i}>
                <Link
                  href={step.done ? '#' : step.href}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                  style={{ pointerEvents: step.done ? 'none' : 'auto' }}
                >
                  {step.done
                    ? <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#10b981' }} />
                    : <Circle className="w-5 h-5 shrink-0" style={{ color: 'var(--color-border)' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: step.done ? 'var(--color-gray-light)' : 'var(--color-navy)', textDecoration: step.done ? 'line-through' : 'none' }}>
                      {step.label}
                    </p>
                    {!step.done && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{step.description}</p>
                    )}
                  </div>
                  {!step.done && <ArrowRight className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gray-light)' }} />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
