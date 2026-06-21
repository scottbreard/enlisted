import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages } = await req.json()

  const { data: profile } = await supabase
    .from('executive_profiles')
    .select('first_name, company_name, company_ticker, sector, title')
    .eq('user_id', user.id)
    .single()

  const systemPrompt = `You are the Enlisted AI Assistant — a knowledgeable guide for public company executives on the Enlisted platform.

Enlisted is a marketplace connecting Canadian public company executives (on TSX, TSXV, CSE, NEO) with professional service providers including IR firms, securities lawyers, auditors, market makers, transfer agents, and 88 other categories.

The executive you're speaking with:
- Name: ${profile?.first_name ?? 'Executive'}
- Title: ${profile?.title ?? 'Executive'}
- Company: ${profile?.company_name ?? 'Public company'}
- Ticker: ${profile?.company_ticker ?? 'Not set'}
- Sector: ${profile?.sector ?? 'Not set'}

You help with:
1. Finding the right service provider category for their needs
2. Explaining what types of firms to look for (IR firms, transfer agents, auditors, etc.)
3. Canadian public company compliance questions (TSX/TSXV/CSE/NEO regulations, continuous disclosure, NI 43-101, NI 51-102, etc.)
4. How to use the Enlisted platform (RFQs, vault, compliance calendar, directory)
5. General capital markets questions for Canadian listed companies

Be concise, direct, and practical. You are not a lawyer or financial advisor — always recommend they consult qualified professionals for specific legal or financial decisions. Keep responses under 200 words unless a detailed answer is clearly needed.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message: text })
  } catch (err: any) {
    console.error('AI error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
