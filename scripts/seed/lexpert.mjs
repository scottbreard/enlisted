// Seed securities-law providers from Lexpert's corporate finance & securities
// law-firm rankings (peer-surveyed, public page).
//
// Usage:
//   node scripts/seed/lexpert.mjs --dry     # scrape + print, no DB writes
//   node scripts/seed/lexpert.mjs           # full run

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const RANKING_URL = 'https://www.lexpert.ca/rankings/best-law-firm/dir/corporate-finance-securities'
const CATEGORY_SLUG = 'securities-law'
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36' }
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&#xE9;|&eacute;/gi, 'é').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).trim()
const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const PROV_ABBR = {
  Ontario: 'ON', Alberta: 'AB', 'British Columbia': 'BC', Quebec: 'QC', Québec: 'QC',
  Saskatchewan: 'SK', Manitoba: 'MB', 'Nova Scotia': 'NS', 'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL', 'Prince Edward Island': 'PE',
}

async function fetchText(url) {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

function parseRanking(html) {
  const firms = []
  const cardRe = /<a href="(https:\/\/www\.lexpert\.ca\/law-firms\/([^"]+))">(?:<img[^>]*alt="([^"]+)")?[\s\S]{0,600}?badge-recommended">([^<]+)</g
  for (const m of html.matchAll(cardRe)) {
    firms.push({ url: m[1], ref: m[2], name: decode(m[3] ?? ''), badge: decode(m[4]) })
  }
  // Cards without a badge (listed but unranked) — pick up any missed profile links
  for (const m of html.matchAll(/<a href="(https:\/\/www\.lexpert\.ca\/law-firms\/([^"]+))"><img[^>]*alt="([^"]+)"/g)) {
    if (!firms.some((f) => f.ref === m[2])) firms.push({ url: m[1], ref: m[2], name: decode(m[3]), badge: null })
  }
  return firms.filter((f) => f.name)
}

function parseProfile(html) {
  const text = html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, '\n')
  // Website: first external link that isn't lexpert/cdn/social/tooling
  const website = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)]
    .map((m) => m[1])
    .find((u) => !/lexpert|keymedia|cdn|bootstrap|fontawesome|googleapis|gstatic|facebook|twitter|linkedin|instagram|stripe|digital\./i.test(u)) ?? null

  // Primary city: most frequent "City, Province" mention
  const counts = {}
  for (const m of text.matchAll(/([A-Z][A-Za-zé.\- ]+), (Ontario|Alberta|British Columbia|Quebec|Québec|Saskatchewan|Manitoba|Nova Scotia|New Brunswick)\n/g)) {
    const key = `${m[1].trim()}|${m[2]}`
    counts[key] = (counts[key] ?? 0) + 1
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  const [city, province] = top ? top[0].split('|') : [null, null]
  return { website, city, province: province ? PROV_ABBR[province] ?? province : null }
}

async function main() {
  console.log('Fetching Lexpert rankings…')
  const firms = parseRanking(await fetchText(RANKING_URL))
  console.log(`Found ${firms.length} ranked firms`)

  for (const [i, f] of firms.entries()) {
    try {
      Object.assign(f, parseProfile(await fetchText(f.url)))
      console.log(`  [${i + 1}/${firms.length}] ${f.name} — ${f.city ?? '?'}, ${f.province ?? '?'} · ${f.badge ?? 'listed'} · ${f.website ?? 'no site'}`)
    } catch (e) { console.warn(`  [${i + 1}/${firms.length}] ${f.name} — profile failed: ${e.message}`) }
    await sleep(500)
  }

  const outDir = join(ROOT, 'scripts', 'seed', 'data')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'lexpert.json'), JSON.stringify(firms, null, 2))
  if (DRY) { console.log('Dry run — no DB writes.'); return }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: cat } = await db.from('service_categories').select('id').eq('slug', CATEGORY_SLUG).single()
  if (!cat) throw new Error(`Category '${CATEGORY_SLUG}' not found`)

  let inserted = 0, skipped = 0
  for (const f of firms) {
    const { data: existing } = await db.from('provider_profiles')
      .select('id').eq('source', 'lexpert').eq('source_ref', f.ref).maybeSingle()
    if (existing) { skipped++; continue }

    const { data: profile, error } = await db.from('provider_profiles').insert({
      user_id: null,
      company_name: f.name,
      slug: `${slugify(f.name)}-lx`,
      description: `${f.name} is a Lexpert-ranked Canadian law firm in corporate finance and securities law.`,
      website_url: f.website,
      tier: 'free',
      is_active: true,
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: 'seed:lexpert',
      primary_market_code: 'CA',
      source: 'lexpert',
      source_ref: f.ref,
      seed_data: { badge: f.badge, ranking_page: RANKING_URL, profile_url: f.url },
    }).select('id').single()
    if (error) { console.warn(`  insert failed for ${f.name}: ${error.message}`); continue }

    await db.from('provider_categories').insert({ provider_id: profile.id, category_id: cat.id, is_primary: true })
    if (f.city) await db.from('provider_locations').insert({ provider_id: profile.id, region: f.province, city: f.city })
    inserted++
  }
  console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
