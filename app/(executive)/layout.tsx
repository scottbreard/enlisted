import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/DashboardNav'
import AIAssistant from '@/components/AIAssistant'

export default async function ExecutiveLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('executive_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // No executive profile: send providers and admins to their own portals
  // instead of bouncing through /register/executive (the proxy redirects
  // logged-in users off /register/*, which used to create an infinite loop)
  if (!profile) {
    const { data: providerProfile } = await supabase
      .from('provider_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (providerProfile) redirect('/provider/dashboard')
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
    if (adminEmails.includes(user.email ?? '')) redirect('/admin')
    redirect('/register/executive')
  }
  if (profile.is_active === false) redirect('/suspended')

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#f8f9fc' }}>
      <DashboardNav profile={profile} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
      <AIAssistant />
    </div>
  )
}
