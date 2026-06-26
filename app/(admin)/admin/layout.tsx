import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, LayoutDashboard, Users, DollarSign, Shield } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/providers', label: 'Providers', icon: Users },
  { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin flag — add is_admin column or use a hardcoded email check for now
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  if (!ADMIN_EMAILS.includes(user.email ?? '')) redirect('/dashboard')

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8f9fc' }}>
      <aside className="w-56 shrink-0 flex flex-col border-r bg-white" style={{ borderColor: 'var(--color-border)', minHeight: '100vh' }}>
        <div className="h-16 flex items-center px-5 border-b gap-2" style={{ borderColor: 'var(--color-border)' }}>
          <Building2 className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
          <span className="text-lg font-extrabold" style={{ color: 'var(--color-navy)' }}>
            Enlisted<span style={{ color: 'var(--color-gold)' }}>.</span><span style={{ color: 'var(--color-gold)', fontSize: '0.75em', fontWeight: 800, letterSpacing: '0.05em' }}>.ca</span>
          </span>
          <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ color: 'var(--color-gray)' }}>
              <Icon className="w-4 h-4 shrink-0" />{label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-semibold px-3 py-2" style={{ color: 'var(--color-gray)' }}>
            <Shield className="w-3.5 h-3.5" /> Back to Executive
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
