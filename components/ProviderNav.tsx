'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, User, BarChart2,
  FileText, LogOut, Settings, Menu, X
} from 'lucide-react'
import EnlistedLogo from '@/components/EnlistedLogo'

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  featured:  { label: 'Featured',  color: '#92400e', bg: '#fef3c7' },
  connected: { label: 'Connected', color: '#1e40af', bg: '#dbeafe' },
  listed:    { label: 'Listed',    color: '#6b7280', bg: '#f3f4f6' },
}

const navItems = [
  { href: '/provider/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/provider/profile',   label: 'My Profile',  icon: User },
  { href: '/provider/analytics', label: 'Analytics',   icon: BarChart2 },
  { href: '/provider/rfq',       label: 'RFQ Inbox',   icon: FileText },
  { href: '/provider/billing',   label: 'Billing',     icon: Settings },
]

export default function ProviderNav({ profile }: { profile: Record<string, any> }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const tier = TIER_LABELS[profile.tier] ?? TIER_LABELS.listed

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/provider/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} onClick={onClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
              style={{
                backgroundColor: active ? 'var(--color-blue-light)' : 'transparent',
                color: active ? 'var(--color-navy)' : 'var(--color-gray)',
                fontWeight: active ? 700 : 500,
              }}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
        <button onClick={() => { onClick?.(); handleSignOut() }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left hover:bg-red-50"
          style={{ color: '#ef4444' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  )

  const ProfileBlock = () => (
    <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          {profile.company_name?.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: 'var(--color-navy)' }}>
            {profile.company_name}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--color-gray)' }}>Service Provider</p>
        </div>
      </div>
      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: tier.bg, color: tier.color }}>
        {tier.label} Plan
      </span>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-white" style={{ borderColor: 'var(--color-border)', minHeight: '100vh' }}>
        <div className="h-16 flex items-center px-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <EnlistedLogo size={26} />
        </div>
        <ProfileBlock />
        <NavLinks />
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-14 px-4 flex items-center justify-between">
          <EnlistedLogo size={24} />
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: tier.bg, color: tier.color }}>
              {tier.label}
            </span>
            <button onClick={() => setOpen(o => !o)} className="p-2 rounded-lg" aria-label="Toggle menu">
              {open
                ? <X className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
                : <Menu className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
              }
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="border-t bg-white flex flex-col pb-2" style={{ borderColor: 'var(--color-border)' }}>
            <ProfileBlock />
            <NavLinks onClick={() => setOpen(false)} />
          </div>
        )}
      </header>
    </>
  )
}
