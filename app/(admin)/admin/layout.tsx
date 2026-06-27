import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, LayoutDashboard, Users, DollarSign, Shield, UserCheck } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  if (!ADMIN_EMAILS.includes(user.email ?? '')) redirect('/dashboard')

  // Pending provider count for badge
  const { count: pendingCount } = await supabase
    .from('provider_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('approval_status', 'pending')

  const navItems = [
    { href: '/admin',             label: 'Overview',   icon: LayoutDashboard, badge: null },
    { href: '/admin/providers',   label: 'Providers',  icon: Users,           badge: pendingCount && pendingCount > 0 ? pendingCount : null },
    { href: '/admin/executives',  label: 'Executives', icon: UserCheck,       badge: null },
    { href: '/admin/revenue',     label: 'Revenue',    icon: DollarSign,      badge: null },
  ]

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8f9fc' }}>
      <aside className="w-56 shrink-0 flex flex-col border-r bg-white" style={{ borderColor: 'var(--color-border)', minHeight: '100vh' }}>
        <div className="h-16 flex items-center px-5 border-b gap-2" style={{ borderColor: 'var(--color-border)' }}>
          <Building2 className="w-5 h-5" style={{ color: 'var(--color-canada)' }} />
          <span className="text-lg font-extrabold" style={{ color: 'var(--color-canada)' }}>
            Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-canada)' }}>ca</span>
          </span>
          <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, badge }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ color: 'var(--color-gray)' }}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge != null && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#f59e0b' }}>
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-4 border-t pt-3 space-y-1" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ color: 'var(--color-gray)' }}>
            <Shield className="w-3.5 h-3.5" /> Executive Dashboard
          </Link>
          <p className="text-xs px-3 py-1" style={{ color: 'var(--color-gray-light)' }}>{user.email}</p>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
