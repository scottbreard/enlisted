import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProviderNav from '@/components/ProviderNav'

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/register/provider')

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#f8f9fc' }}>
      <ProviderNav profile={profile} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
