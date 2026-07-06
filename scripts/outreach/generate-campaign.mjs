// Generate an Instantly-ready cold-outreach CSV from seeded providers.
// Each row carries per-firm personalization variables; Claude writes a
// one-line opener per firm from its seed_data (client counts, badges).
//
// Usage:
//   node scripts/outreach/generate-campaign.mjs --limit 5          # sample
//   node scripts/outreach/generate-campaign.mjs                    # full run
//   → scripts/outreach/output/campaign-YYYY-MM-DD.csv
//
// Columns map to Instantly custom variables:
//   email, first_name, company_name, category, opener, spots_left, claim_url

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT_DIR = join(ROOT, 'scripts', 'outreach', 'output')
const SITE = 'https://enlisted.ca'
const args = process.argv.slice(2)
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity

function loadEnv() {
  for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function draftOpener(firm) {
  const facts = []
  if (firm.ri_count) facts.push(`CPAB-registered audit firm currently auditing ${firm.ri_count} Canadian reporting issuers`)
  if (firm.clients?.length) facts.push(`works with public-company clients including ${firm.clients.slice(0, 3).join(', ')}`)
  if (firm.badge) facts.push(`Lexpert-ranked: ${firm.badge}`)
  if (firm.city) facts.push(`based in ${firm.city}`)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 120,
      system: 'You write ONE natural opening line for a B2B email to a Canadian professional services firm. Reference a specific true fact about them (provided). Warm, factual, no flattery words like "impressive"; no greeting; no exclamation marks; under 25 words. Output the line only.',
      messages: [{ role: 'user', content: `Firm: ${firm.company_name} (${firm.category})\nFacts: ${facts.join('; ') || 'none — write a category-specific line instead'}` }],
    }),
  })
  if (!res.ok) throw new Error(`Claude ${res.status}`)
  const data = await res.json()
  return (data.content?.[0]?.text ?? '').trim().replace(/^"|"$/g, '')
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Unclaimed providers with a contact email
  const { data: providers } = await db
    .from('provider_profiles')
    .select('id, company_name, slug, source, seed_data, provider_categories(is_primary, service_categories(id, name))')
    .eq('is_active', true)
    .is('user_id', null)

  // Featured-spot counts per category (paginated)
  const featuredByCat = new Map()
  const { data: featured } = await db.from('provider_profiles').select('id').eq('tier', 'featured').eq('is_active', true)
  const featuredIds = new Set((featured ?? []).map((f) => f.id))
  for (let from = 0; ; from += 1000) {
    const { data: pcs } = await db.from('provider_categories').select('provider_id, category_id').range(from, from + 999)
    for (const pc of pcs ?? []) {
      if (featuredIds.has(pc.provider_id)) featuredByCat.set(pc.category_id, (featuredByCat.get(pc.category_id) ?? 0) + 1)
    }
    if (!pcs || pcs.length < 1000) break
  }

  const rows = []
  let processed = 0
  for (const p of providers ?? []) {
    const sd = p.seed_data ?? {}
    const email = (sd.contact_email ?? (sd.emails ?? [])[0] ?? '').trim().toLowerCase()
    if (!email || !email.includes('@')) continue
    if (rows.length >= LIMIT) break

    const primary = (p.provider_categories ?? []).find((c) => c.is_primary) ?? (p.provider_categories ?? [])[0]
    const catName = primary?.service_categories?.name ?? 'your category'
    const catId = primary?.service_categories?.id
    const spotsTaken = catId ? featuredByCat.get(catId) ?? 0 : 0

    const firstName = (sd.contact_name ?? '').split(' ')[0] || ''
    const firm = {
      company_name: p.company_name,
      category: catName,
      ri_count: sd.ri_count,
      clients: sd.clients,
      badge: sd.badge,
      city: sd.city ?? sd.proposed_city,
    }

    let opener = ''
    try { opener = await draftOpener(firm) } catch (e) { console.warn(`  opener failed for ${p.company_name}: ${e.message}`) }

    rows.push({
      email,
      first_name: firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : '',
      company_name: p.company_name,
      category: catName,
      opener,
      spots_left: String(Math.max(0, 5 - spotsTaken)),
      claim_url: `${SITE}/claim/${p.slug}`,
    })
    processed++
    if (processed % 25 === 0) console.log(`  ${processed} drafted…`)
    await sleep(150)
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
  const header = 'email,first_name,company_name,category,opener,spots_left,claim_url'
  const csv = [header, ...rows.map((r) => [r.email, r.first_name, r.company_name, r.category, r.opener, r.spots_left, r.claim_url].map(esc).join(','))].join('\n')
  const file = join(OUT_DIR, `campaign-${new Date().toISOString().slice(0, 10)}.csv`)
  writeFileSync(file, csv)
  console.log(`\n${rows.length} rows → ${file}`)
  console.log('\nSample row:', JSON.stringify(rows[0], null, 2))
}

main().catch((e) => { console.error(e); process.exit(1) })
