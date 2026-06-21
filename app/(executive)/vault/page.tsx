import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Briefcase, Plus, Star, AlertTriangle, ExternalLink } from 'lucide-react'

export const metadata = { title: 'My Provider Vault — Enlisted' }

export default async function VaultPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('executive_profiles')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  const { data: vault } = await supabase
    .from('executive_vault')
    .select('*')
    .eq('executive_id', profile!.id)
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]
  const renewingSoon = vault?.filter(v => {
    if (!v.contract_end) return false
    const days = Math.ceil((new Date(v.contract_end).getTime() - Date.now()) / 86400000)
    return days <= (v.renewal_reminder_days ?? 60) && days > 0
  }) ?? []

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-navy)' }}>My Provider Vault</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray)' }}>
            Track your service provider relationships, contracts, and renewals.
          </p>
        </div>
        <Link href="/vault/add"
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          <Plus className="w-4 h-4" /> Add Provider
        </Link>
      </div>

      {/* Renewal alerts */}
      {renewingSoon.length > 0 && (
        <div className="mb-6 border rounded-2xl p-5 flex items-start gap-3"
          style={{ borderColor: '#f59e0b', backgroundColor: '#fffbeb' }}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--color-navy)' }}>
              {renewingSoon.length} provider contract{renewingSoon.length > 1 ? 's' : ''} renewing soon
            </p>
            <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
              {renewingSoon.map(v => v.provider_name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!vault || vault.length === 0) && (
        <div className="bg-white border-2 rounded-2xl p-16 text-center" style={{ borderColor: 'var(--color-border)', borderStyle: 'dashed' }}>
          <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-gray-light)' }} />
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--color-navy)' }}>Your vault is empty</h2>
          <p className="mb-6" style={{ color: 'var(--color-gray)' }}>
            Add your current service providers to track contracts, renewals, and rates.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/vault/add"
              className="font-bold px-6 py-3 rounded-xl text-white inline-block"
              style={{ backgroundColor: 'var(--color-navy)' }}>
              Add Manually
            </Link>
            <Link href="/directory"
              className="font-semibold px-6 py-3 rounded-xl border inline-block"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray-dark)' }}>
              Browse Directory
            </Link>
          </div>
        </div>
      )}

      {/* Vault table */}
      {vault && vault.length > 0 && (
        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray-light)' }}>
                  <th className="text-left px-6 py-4">Provider</th>
                  <th className="text-left px-6 py-4">Mandate</th>
                  <th className="text-left px-6 py-4">Contact</th>
                  <th className="text-left px-6 py-4">Contract End</th>
                  <th className="text-left px-6 py-4">Rating</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {vault.map(entry => {
                  const daysToRenew = entry.contract_end
                    ? Math.ceil((new Date(entry.contract_end).getTime() - Date.now()) / 86400000)
                    : null
                  const isRenewing = daysToRenew !== null && daysToRenew <= (entry.renewal_reminder_days ?? 60) && daysToRenew > 0

                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ backgroundColor: 'var(--color-navy)' }}>
                            {entry.provider_name.charAt(0)}
                          </div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--color-navy)' }}>{entry.provider_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-blue-light)', color: 'var(--color-navy)' }}>
                          {entry.mandate ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-gray)' }}>
                        <div>{entry.contact_name ?? '—'}</div>
                        {entry.contact_email && (
                          <a href={`mailto:${entry.contact_email}`} className="text-xs hover:underline" style={{ color: 'var(--color-blue)' }}>
                            {entry.contact_email}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {entry.contract_end ? (
                          <div>
                            <p className="text-sm" style={{ color: isRenewing ? '#f59e0b' : 'var(--color-gray-dark)' }}>
                              {new Date(entry.contract_end).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            {isRenewing && (
                              <p className="text-xs font-bold" style={{ color: '#f59e0b' }}>Renewing in {daysToRenew}d</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--color-gray-light)' }}>—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {entry.rating ? (
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i <= entry.rating ? 'fill-current' : ''}`}
                                style={{ color: i <= entry.rating ? 'var(--color-gold)' : 'var(--color-border)' }} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--color-gray-light)' }}>Not rated</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/directory`}
                          className="text-xs font-semibold flex items-center gap-1 hover:underline"
                          style={{ color: 'var(--color-blue)' }}>
                          Find Alternative <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
