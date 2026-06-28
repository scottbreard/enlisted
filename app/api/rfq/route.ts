import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: exec } = await supabase
    .from('executive_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!exec) return NextResponse.json({ error: 'Executive profile not found' }, { status: 404 })

  const body = await req.json()
  const { provider_id, category_id, title, description, budget_range, deadline } = body

  if (!provider_id || !title || !description) {
    return NextResponse.json({ error: 'provider_id, title, and description are required' }, { status: 400 })
  }

  // Check provider is connected or featured (can receive RFQs)
  const { data: provider } = await supabase
    .from('provider_profiles')
    .select('tier, company_name')
    .eq('id', provider_id)
    .single()

  if (!provider || provider.tier === 'free') {
    return NextResponse.json({ error: 'This provider cannot receive RFQs' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('rfq_requests')
    .insert({
      executive_id: exec.id,
      provider_id,
      category_id: category_id ?? null,
      title,
      description,
      budget_range: budget_range ?? null,
      deadline: deadline ?? null,
      status: 'open',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rfq: data })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: exec } = await supabase
    .from('executive_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!exec) return NextResponse.json({ rfqs: [] })

  const { data } = await supabase
    .from('rfq_requests')
    .select('*, provider_profiles(company_name, tier, slug)')
    .eq('executive_id', exec.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ rfqs: data ?? [] })
}
