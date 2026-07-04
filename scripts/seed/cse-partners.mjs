// Seed provider prospects curated from the CSE Partner Services directory
// (thecse.com/listing/partner-services) — see data/cse-partners.json.
// Only firms not already seeded from other sources were curated in; the
// CSE page shows no websites, so nulls are filled by find-websites.mjs.
//
// Usage:
//   node scripts/seed/cse-partners.mjs --dry   # print what would be inserted
//   node scripts/seed/cse-partners.mjs         # full run

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const DATA = join(ROOT, 'scripts', 'seed', 'data', 'cse-partners.json')
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

const CATEGORY_PHRASE = {
  'geological-consultants': 'a mining engineering consultancy providing NI 43-101 resource estimates and technical studies',
  'equity-research':        'an equity research firm covering small- and mid-cap public companies',
  'transfer-agents':        'a transfer agency serving Canadian public companies',
  'news-wire':              'a news release distribution and regulatory disclosure service',
  'corporate-secretaries':  'an outsourced corporate secretarial services firm',
  'regulatory-compliance':  'a regulatory and listing compliance services firm',
  'corporate-insurance':    'an insurance brokerage serving public companies',
  'boutique-ir':            'a boutique investor relations consultancy',
  'ir-website':             'a provider of IR website and market data solutions',
  'digital-marketing':      'a digital marketing agency serving public companies',
  'financial-pr':           'a financial news and communications provider',
  'crypto-blockchain':      'a digital asset custody and infrastructure provider',
  'cybersecurity':          'an IT and cybersecurity services provider',
  'mgmt-consulting':        'a management consulting firm',
  'accounting-non-audit':   'a business and accounting services firm',
  'retail-ir':              'a retail investor capital-raising platform',
}

const describe = (f) =>
  `${f.name} is ${CATEGORY_PHRASE[f.category]} (CSE Partner Services directory).`

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
    if (DRY) { console.log(`  [${f.category}] ${f.name} — ${describe(f)}`); continue }

    const { data: existing } = await db.from('provider_profiles')
      .select('id').eq('source', 'cse-partner').eq('source_ref', f.ref).maybeSingle()
    if (existing) { skipped++; continue }

    const { data: profile, error } = await db.from('provider_profiles').insert({
      user_id: null,
      company_name: f.name,
      slug: `${f.ref}-cp`,
      description: describe(f),
      website_url: f.website,
      tier: 'free',
      is_active: true,
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: 'seed:cse-partner',
      primary_market_code: 'CA',
      source: 'cse-partner',
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
