import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendProviderWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { to, companyName, tier } = await req.json()

  try {
    await sendProviderWelcomeEmail({ to, companyName, tier })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Welcome email failed:', e)
    return NextResponse.json({ ok: false })
  }
}
