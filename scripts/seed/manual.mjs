// Seed hand-curated small categories: transfer agents and news wire services.
// These universes are small and well-known — curation beats scraping.
//
// Usage: node scripts/seed/manual.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

function loadEnv() {
  for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const FIRMS = [
  // ── Transfer agents (category: transfer-agents) ─────────────
  { cat: 'transfer-agents', name: 'Computershare Trust Company of Canada', website: 'https://www.computershare.com/ca', city: 'Toronto', region: 'ON',
    desc: 'Computershare is Canada’s largest transfer agent, providing registry, shareholder services, corporate trust, and employee share plan services to issuers on all Canadian exchanges.' },
  { cat: 'transfer-agents', name: 'TSX Trust Company', website: 'https://www.tsxtrust.com', city: 'Toronto', region: 'ON',
    desc: 'TSX Trust, part of TMX Group, provides transfer agency, corporate trust, and shareholder services to Canadian public companies.' },
  { cat: 'transfer-agents', name: 'Odyssey Trust Company', website: 'https://odysseytrust.com', city: 'Calgary', region: 'AB',
    desc: 'Odyssey Trust provides modern transfer agency and corporate trust services to public companies across Canada and the US.' },
  { cat: 'transfer-agents', name: 'Endeavor Trust Corporation', website: 'https://www.endeavortrust.com', city: 'Vancouver', region: 'BC',
    desc: 'Endeavor Trust is a Vancouver-based transfer agent serving Canadian small-cap and venture issuers with registry and corporate trust services.' },
  { cat: 'transfer-agents', name: 'Marrelli Trust Company Limited', website: 'https://marrellitrust.ca', city: 'Toronto', region: 'ON',
    desc: 'Marrelli Trust provides transfer agency and registrar services to Canadian public companies, part of the Marrelli group of regulatory service firms.' },
  { cat: 'transfer-agents', name: 'Capital Transfer Agency ULC', website: 'https://capitaltransferagency.com', city: 'Toronto', region: 'ON',
    desc: 'Capital Transfer Agency provides transfer agency, registrar, and escrow services to Canadian issuers.' },
  { cat: 'transfer-agents', name: 'Olympia Trust Company', website: 'https://www.olympiatrust.com', city: 'Calgary', region: 'AB',
    desc: 'Olympia Trust provides transfer agency, registrar, and corporate trust services to Canadian public companies.' },
  { cat: 'transfer-agents', name: 'Alliance Trust Company', website: 'https://alliancetrust.ca', city: 'Calgary', region: 'AB',
    desc: 'Alliance Trust provides transfer agency and registrar services to Canadian venture and small-cap issuers.' },

  // ── News wire services (category: news-wire) ────────────────
  { cat: 'news-wire', name: 'Newsfile Corp', website: 'https://www.newsfilecorp.com', city: 'Toronto', region: 'ON',
    desc: 'Newsfile, a TMX company, provides news release distribution and SEDAR+/EDGAR regulatory filing services to Canadian public companies.' },
  { cat: 'news-wire', name: 'GlobeNewswire', website: 'https://www.globenewswire.com', city: 'Toronto', region: 'ON',
    desc: 'GlobeNewswire is one of the world’s largest newswire distribution networks, widely used by Canadian public companies for news release distribution and regulatory disclosure.' },
  { cat: 'news-wire', name: 'Business Wire', website: 'https://www.businesswire.com', city: 'Toronto', region: 'ON',
    desc: 'Business Wire, a Berkshire Hathaway company, provides global news release distribution and regulatory disclosure services to public companies.' },
  { cat: 'news-wire', name: 'PR Newswire (Cision)', website: 'https://www.prnewswire.com', city: 'Toronto', region: 'ON',
    desc: 'PR Newswire, part of Cision, provides news release distribution and disclosure services used by public companies worldwide.' },
  { cat: 'news-wire', name: 'ACCESS Newswire', website: 'https://www.accessnewswire.com', city: 'Raleigh', region: 'NC',
    desc: 'ACCESS Newswire provides cost-effective press release distribution and regulatory disclosure services to small- and mid-cap public companies.' },
  { cat: 'news-wire', name: 'TheNewswire', website: 'https://www.thenewswire.com', city: 'Kelowna', region: 'BC',
    desc: 'TheNewswire is a Canadian news release distribution service focused on venture and small-cap issuers on the TSXV and CSE.' },
]

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const slugs = [...new Set(FIRMS.map((f) => f.cat))]
  const { data: cats } = await db.from('service_categories').select('id, slug').in('slug', slugs)
  const catBySlug = new Map((cats ?? []).map((c) => [c.slug, c.id]))
  for (const s of slugs) if (!catBySlug.has(s)) throw new Error(`Category '${s}' not found`)

  let inserted = 0, skipped = 0
  for (const f of FIRMS) {
    const ref = slugify(f.name)
    const { data: existing } = await db.from('provider_profiles')
      .select('id').eq('source', 'manual').eq('source_ref', ref).maybeSingle()
    if (existing) { skipped++; continue }

    const { data: profile, error } = await db.from('provider_profiles').insert({
      user_id: null,
      company_name: f.name,
      slug: `${ref}-mn`,
      description: f.desc,
      website_url: f.website,
      tier: 'free',
      is_active: true,
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: 'seed:manual',
      primary_market_code: 'CA',
      source: 'manual',
      source_ref: ref,
      seed_data: { curated: true, category: f.cat },
    }).select('id').single()
    if (error) { console.warn(`  insert failed for ${f.name}: ${error.message}`); continue }

    await db.from('provider_categories').insert({ provider_id: profile.id, category_id: catBySlug.get(f.cat), is_primary: true })
    await db.from('provider_locations').insert({ provider_id: profile.id, region: f.region, city: f.city })
    inserted++
    console.log(`  + [${f.cat}] ${f.name}`)
  }
  console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
