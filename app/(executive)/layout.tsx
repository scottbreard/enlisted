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

  if (!profile) redirect('/register/executive')

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
