// Seed provider prospects curated from mining-conference exhibitor
// directories (PDAC 2026, Mining Indaba 2026) — see data/conferences.json.
// Rows with category: null (exchange partners, trade media) and rows whose
// note marks them ALREADY SEEDED from another source are skipped.
//
// Usage:
//   node scripts/seed/conferences.mjs --dry   # print what would be inserted
//   node scripts/seed/conferences.mjs         # full run

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const DATA = join(ROOT, 'scripts', 'seed', 'data', 'conferences.json')
const DRY = process.argv.includes('--dry')

function loadEnv() {
  try {
    for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}
loadEnv()

const EVENT_LABELS = { 'pdac-2026': 'PDAC 2026', 'mining-indaba-2026': 'Mining Indaba 2026' }

const CATEGORY_PHRASE = {
  'geological-consultants': 'a geological and mining consulting firm serving publicly listed resource companies',
  'royalty-streaming':      'a royalty and streaming company providing non-dilutive financing to public resource companies',
  'market-makers':          'a market making and trading firm serving Canadian listed issuers',
  'broker-dealers':         'a brokerage and corporate advisory firm serving listed companies',
  'securities-law':         'a law firm advising public companies on securities and corporate matters',
  'corporate-insurance':    'an insurance brokerage serving public companies',
  'market-intelligence':    'a market intelligence and data provider serving capital markets participants',
  'investment-banks':       'a natural-resources capital markets boutique',
  'pr-corporate-comms':     'a communications firm serving public mining companies',
}

// primary_market_code from the curation note; default CA (sourced via PDAC)
function marketCode(note) {
  if (/AU phase/i.test(note ?? '')) return 'AU'
  if (/UK phase/i.test(note ?? '')) return 'UK'
  return 'CA'
}

function describe(f) {
  const events = f.events.map((e) => EVENT_LABELS[e.event] ?? e.event).join(' and ')
  return `${f.name} is ${CATEGORY_PHRASE[f.category]} (exhibitor, ${events}).`
}

async function main() {
  const firms = JSON.parse(readFileSync(DATA, 'utf8'))
    .filter((f) => f.category && !/^ALREADY SEEDED/.test(f.note ?? ''))

  console.log(`${firms.length} seedable firms in ${DATA}`)
  const db = DRY ? null : createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const slugs = [...new Set(firms.map((f) => f.category))]
  let catBySlug = new Map()
  if (db) {
    const { data: cats } = await db.from('service_categories').select('id, slug').in('slug', slugs)
    catBySlug = new Map((cats ?? []).map((c) => [c.slug, c.id]))
    for (const s of slugs) if (!catBySlug.has(s)) throw new Error(`Category '${s}' not found`)
  }

  let inserted = 0, skipped = 0
  for (const f of firms) {
    if (DRY) { console.log(`  [${f.category}/${marketCode(f.note)}] ${f.name} — ${describe(f)}`); continue }

    const { data: existing } = await db.from('provider_profiles')
      .select('id').eq('source', 'conference').eq('source_ref', f.ref).maybeSingle()
    if (existing) { skipped++; continue }

    const { data: profile, error } = await db.from('provider_profiles').insert({
      user_id: null,
      company_name: f.name,
      slug: `${f.ref}-cf`,
      description: describe(f),
      website_url: f.website,
      tier: 'free',
      is_active: true,
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: 'seed:conference',
      primary_market_code: marketCode(f.note),
      source: 'conference',
      source_ref: f.ref,
      seed_data: { country: f.country, note: f.note, events: f.events },
    }).select('id').single()
    if (error) { console.warn(`  insert failed for ${f.name}: ${error.message}`); continue }

    await db.from('provider_categories').insert({ provider_id: profile.id, category_id: catBySlug.get(f.category), is_primary: true })
    inserted++
    console.log(`  + [${f.category}] ${f.name}`)
  }
  if (!DRY) console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
