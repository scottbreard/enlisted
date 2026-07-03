// Seed provider_profiles from CPAB's participating audit firms register.
// Every firm on this list is authorized to audit Canadian reporting issuers.
//
// Usage:
//   node scripts/seed/cpab.mjs --dry            # scrape + print, no DB writes
//   node scripts/seed/cpab.mjs --limit 5        # only process first 5 firms
//   node scripts/seed/cpab.mjs                  # full run
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
// Run migration 008_provider_seeding.sql first.

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const BASE = 'https://cpab-ccrc.ca'
const LIST_URL = `${BASE}/registration/participating-audit-firms`
const CATEGORY_SLUG = 'audit-firms'
const DELAY_MS = 400

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity

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
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
   .replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
   .trim()
const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (EnlistedBot; contact@enlisted.ca)' } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

// ── 1. Parse the list page ───────────────────────────────────
function parseList(html) {
  const firms = []
  const rowRe = /href="(\/registration\/participating-audit-firms\/audit-firm\?FirmNumber=(\d+))"[^>]*>([^<]+)<\/a><\/td>\s*<td class="text-center">(\d+)<\/td>\s*<td class="text-center">(\d+)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>/g
  for (const m of html.matchAll(rowRe)) {
    firms.push({
      url: BASE + m[1],
      firm_number: m[2],
      name: decode(m[3]),
      ri_count: parseInt(m[4], 10),
      office_count: parseInt(m[5], 10),
      country: decode(m[6]),
      registered: m[7].trim(),
    })
  }
  return firms
}

// ── 2. Parse a firm detail page ──────────────────────────────
function parseDetail(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .split('\n').map((l) => decode(l)).filter(Boolean)

  const out = { city: null, province: null, contact_name: null, contact_email: null, clients: [] }

  const ho = text.indexOf('HEAD OFFICE')
  if (ho >= 0) {
    // lines after HEAD OFFICE until CONTACT: address lines; city line looks like "Surrey, BC"
    for (let i = ho + 1; i < Math.min(ho + 8, text.length); i++) {
      const m = text[i].match(/^([A-Za-zÀ-ÿ' .-]+),\s*([A-Z]{2})$/)
      if (m) { out.city = m[1].trim(); out.province = m[2]; break }
    }
  }

  const c = text.indexOf('CONTACT')
  if (c >= 0) {
    const emailIdx = text.findIndex((l, i) => i > c && l.includes('@'))
    if (emailIdx > c) {
      out.contact_email = text[emailIdx].match(/\S+@\S+/)?.[0] ?? null
      if (emailIdx - 1 > c) out.contact_name = text[emailIdx - 1]
    }
  }

  const eng = text.findIndex((l) => /Reporting Issuer Audit Engagements/.test(l))
  if (eng >= 0) {
    for (let i = eng + 1; i < text.length; i++) {
      if (/^DISCLAIMER/i.test(text[i])) break
      out.clients.push(text[i])
    }
  }
  return out
}

// ── 3. Load into Supabase ────────────────────────────────────
async function main() {
  console.log('Fetching CPAB firm list…')
  const firms = parseList(await fetchText(LIST_URL)).slice(0, LIMIT)
  console.log(`Found ${firms.length} firms`)

  const enriched = []
  for (const [i, firm] of firms.entries()) {
    try {
      const detail = parseDetail(await fetchText(firm.url))
      enriched.push({ ...firm, ...detail })
      console.log(`  [${i + 1}/${firms.length}] ${firm.name} — ${detail.city ?? '?'}, ${detail.province ?? '?'} · ${firm.ri_count} RIs`)
    } catch (e) {
      console.warn(`  [${i + 1}/${firms.length}] ${firm.name} — detail fetch failed: ${e.message}`)
      enriched.push(firm)
    }
    await sleep(DELAY_MS)
  }

  const outDir = join(ROOT, 'scripts', 'seed', 'data')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'cpab.json'), JSON.stringify(enriched, null, 2))
  console.log(`Raw data saved to scripts/seed/data/cpab.json`)

  if (DRY) { console.log('Dry run — no DB writes.'); return }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  const db = createClient(url, key)

  const { data: cat, error: catErr } = await db.from('service_categories').select('id').eq('slug', CATEGORY_SLUG).single()
  if (catErr || !cat) throw new Error(`Category '${CATEGORY_SLUG}' not found: ${catErr?.message}`)

  let inserted = 0, skipped = 0
  for (const f of enriched) {
    const { data: existing } = await db.from('provider_profiles')
      .select('id').eq('source', 'cpab').eq('source_ref', f.firm_number).maybeSingle()
    if (existing) { skipped++; continue }

    const description = f.ri_count > 0
      ? `${f.name} is a CPAB-registered audit firm currently serving ${f.ri_count} Canadian reporting issuer${f.ri_count === 1 ? '' : 's'}.`
      : `${f.name} is a CPAB-registered audit firm authorized to audit Canadian reporting issuers.`

    const { data: profile, error } = await db.from('provider_profiles').insert({
      user_id: null,
      company_name: f.name,
      slug: `${slugify(f.name)}-${f.firm_number}`,
      description,
      tier: 'free',
      is_active: true,
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: 'seed:cpab',
      primary_market_code: 'CA',
      source: 'cpab',
      source_ref: f.firm_number,
      seed_data: {
        ri_count: f.ri_count, office_count: f.office_count, country: f.country,
        registered: f.registered, city: f.city, province: f.province,
        contact_name: f.contact_name, contact_email: f.contact_email,
        clients: f.clients, source_url: f.url,
      },
    }).select('id').single()

    if (error) { console.warn(`  insert failed for ${f.name}: ${error.message}`); continue }

    await db.from('provider_categories').insert({ provider_id: profile.id, category_id: cat.id, is_primary: true })
    if (f.city) await db.from('provider_locations').insert({ provider_id: profile.id, region: f.province, city: f.city })
    inserted++
  }
  console.log(`Done. Inserted ${inserted}, skipped ${skipped} already-seeded.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
