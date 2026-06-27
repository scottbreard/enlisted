'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Building2, LayoutDashboard, Search, Calendar,
  Briefcase, TrendingUp, Newspaper, Send,
  Users, User, LogOut, Star, Menu, X
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/directory',    label: 'Directory',  icon: Search },
  { href: '/compliance',   label: 'Compliance', icon: Calendar },
  { href: '/vault',        label: 'My Vault',   icon: Briefcase },
  { href: '/stock',        label: 'Stock',      icon: TrendingUp },
  { href: '/news',         label: 'News',       icon: Newspaper },
  { href: '/rfq',          label: 'RFQs',       icon: Send },
  { href: '/rolodex',      label: 'Rolodex',    icon: Users },
]

export default function DashboardNav({ profile }: { profile: Record<string, any> }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? 'var(--color-blue-light)' : 'transparent',
                color: active ? 'var(--color-navy)' : 'var(--color-gray)',
                fontWeight: active ? 700 : 500,
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 space-y-0.5 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
        <Link href="/profile" onClick={onClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{
            backgroundColor: pathname === '/profile' ? 'var(--color-blue-light)' : 'transparent',
            color: pathname === '/profile' ? 'var(--color-navy)' : 'var(--color-gray)',
            fontWeight: pathname === '/profile' ? 700 : 500,
          }}>
          <User className="w-4 h-4" /> My Profile
        </Link>
        <button
          onClick={() => { onClick?.(); handleSignOut() }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left hover:bg-red-50"
          style={{ color: '#ef4444' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  )

  const ProfileBlock = () => (
    <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: 'var(--color-navy)' }}>
          {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: 'var(--color-navy)' }}>
            {profile.first_name} {profile.last_name}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--color-gray)' }}>
            {profile.title} · {profile.company_name}
          </p>
        </div>
      </div>
      {profile.is_founding_member && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit"
          style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
          <Star className="w-3 h-3 fill-current" />
          Founding Member #{profile.founding_member_number}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-white" style={{ borderColor: 'var(--color-border)', minHeight: '100vh' }}>
        <div className="h-16 flex items-center px-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: 'var(--color-canada)' }} />
            <span className="text-lg font-extrabold" style={{ color: 'var(--color-canada)' }}>
              Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-canada)' }}>ca</span>
            </span>
          </Link>
        </div>
        <ProfileBlock />
        <NavLinks />
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden bg-white border-b sticky top-0 z-50" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: 'var(--color-canada)' }} />
            <span className="text-base font-extrabold" style={{ color: 'var(--color-canada)' }}>
              Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-canada)' }}>ca</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--color-gray)' }}>
              {profile.first_name}
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
