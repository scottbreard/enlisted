// Discover IR/communications firms from Newsfile press-release contact blocks.
// Canadian issuers routinely list their external IR firm in the "For further
// information" footer — an email domain that differs from the issuer's is the
// signal. Claude classifies each candidate block.
//
// Usage:
//   node scripts/seed/ir-firms.mjs --releases 400        # scrape + classify → data/ir-firms.json
//   node scripts/seed/ir-firms.mjs --load                # insert aggregated firms (>=2 clients) into Supabase
//   node scripts/seed/ir-firms.mjs --releases 50 --dry   # scrape only, skip Claude + DB
//
// Requires ANTHROPIC_API_KEY (classify) and Supabase keys (--load) in .env.local.

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const DATA = join(ROOT, 'scripts', 'seed', 'data')
const OUT = join(DATA, 'ir-firms.json')
const CATEGORY_SLUG = 'ir-firms'
const UA = { 'User-Agent': 'Mozilla/5.0 (EnlistedBot; contact@enlisted.ca)' }

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => (args.includes(n) ? parseInt(args[args.indexOf(n) + 1], 10) : d)
const N_RELEASES = opt('--releases', 400)
const DRY = flag('--dry')
const LOAD = flag('--load')

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

function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&amp;/g, '&').replace(/&#38;/g, '&').replace(/&#39;|&apos;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*/g, '\n')
    .trim()
}

// ── 1. Collect release IDs from the Newsfile business feed ──
async function latestReleaseId() {
  const res = await fetch('https://www.newsfilecorp.com/news/business', { headers: UA })
  const ids = [...(await res.text()).matchAll(/href="\/release\/(\d+)/g)].map((m) => parseInt(m[1], 10))
  if (!ids.length) throw new Error('No release IDs found on /news/business')
  return Math.max(...ids)
}

// ── 2. Parse one release ─────────────────────────────────────
function parseRelease(html) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/\s*\|.*$/, '').trim() ?? null
  const text = htmlToText(html)

  // Contact block: from the contact heading to the boilerplate that follows it
  const startRe = /(For further information|For more information|For additional information|Contact Information|Investor Relations Contact|Media Contact|On behalf of the (Board|Company))[^\n]*/i
  const start = text.search(startRe)
  if (start < 0) return { title, contact: null }
  const tail = text.slice(start, start + 2500)
  const endRe = /(Caution(ary)? (Regarding|Statement)|Forward[- ]Looking|Neither the TSX|About Newsfile|To view the source|NOT FOR DISTRIBUTION|SOURCE:)/i
  const end = tail.search(endRe)
  const contact = (end > 0 ? tail.slice(0, end) : tail).trim()
  return { title, contact: contact.length > 40 ? contact : null }
}

// Cheap pre-filter: only send blocks to Claude when >1 email domain or IR-ish keywords
function looksExternal(contact) {
  const domains = new Set([...contact.matchAll(/@([a-z0-9.-]+\.[a-z]{2,})/gi)].map((m) => m[1].toLowerCase()))
  if (domains.size > 1) return true
  return /(investor relations|capital markets advis|communications inc|communications corp|IR firm|Consulting|Consultants|Strategies|Advisors|Partners)/i.test(contact)
}

// ── 3. Claude classification ─────────────────────────────────
async function classify(title, contact) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      system: 'You extract external service firms from press-release contact blocks. The issuer company itself is NOT an external firm. An external firm is a separately named investor relations, communications, or capital markets advisory company (its email domain usually differs from the issuer\'s). Respond with JSON only, no prose: {"firms":[{"name":"...","type":"ir|pr|other","email":"...","domain":"..."}]}. Empty array if none.',
      messages: [{ role: 'user', content: `Press release title: ${title}\n\nContact block:\n${contact}` }],
    }),
  })
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  const raw = data.content?.[0]?.text ?? '{}'
  try { return JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '{}').firms ?? [] } catch { return [] }
}

// ── 4. Scrape + classify ─────────────────────────────────────
async function scrape() {
  console.log(`Finding latest release ID…`)
  const latest = await latestReleaseId()
  console.log(`Latest ID ~${latest}; walking back ${N_RELEASES} releases`)

  const found = [] // { firm, type, email, domain, issuer, release_id }
  let fetched = 0, withContact = 0, sentToClaude = 0

  for (let id = latest; id > latest - N_RELEASES; id--) {
    let html
    try {
      const res = await fetch(`https://www.newsfilecorp.com/release/${id}/`, { headers: UA })
      if (!res.ok) continue
      html = await res.text()
    } catch { continue }
    fetched++
    const { title, contact } = parseRelease(html)
    if (!contact) continue
    withContact++
    if (!looksExternal(contact)) continue

    try {
      sentToClaude++
      const firms = await classify(title, contact)
      for (const f of firms) {
        if (!f.name) continue
        found.push({ firm: f.name.trim(), type: f.type, email: f.email ?? null, domain: f.domain ?? null, issuer: title, release_id: id })
        console.log(`  [${id}] ${f.name} (${f.type}) ← ${title?.slice(0, 60)}`)
      }
    } catch (e) { console.warn(`  [${id}] classify failed: ${e.message}`) }
    await sleep(250)
  }

  // Aggregate by normalized firm name
  const agg = {}
  for (const f of found) {
    const key = f.firm.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    agg[key] ??= { name: f.firm, types: {}, domains: new Set(), emails: new Set(), issuers: new Set(), release_ids: [] }
    agg[key].types[f.type] = (agg[key].types[f.type] ?? 0) + 1
    if (f.domain) agg[key].domains.add(f.domain.toLowerCase())
    if (f.email) agg[key].emails.add(f.email.toLowerCase())
    if (f.issuer) agg[key].issuers.add(f.issuer)
    agg[key].release_ids.push(f.release_id)
  }
  const firms = Object.values(agg)
    .map((a) => ({ ...a, domains: [...a.domains], emails: [...a.emails], issuers: [...a.issuers], client_count: a.issuers.size }))
    .sort((a, b) => b.client_count - a.client_count)

  mkdirSync(DATA, { recursive: true })
  writeFileSync(OUT, JSON.stringify(firms, null, 2))
  console.log(`\nScanned ${fetched} releases · ${withContact} contact blocks · ${sentToClaude} sent to Claude`)
  console.log(`Found ${firms.length} distinct firms → ${OUT}`)
  console.log(`Top firms:`)
  for (const f of firms.slice(0, 15)) console.log(`  ${f.client_count}× ${f.name} (${f.domains[0] ?? 'no domain'})`)
}

// ── 5. Load into Supabase ────────────────────────────────────
async function load() {
  if (!existsSync(OUT)) throw new Error(`Run scrape first — ${OUT} missing`)
  const firms = JSON.parse(readFileSync(OUT, 'utf8')).filter((f) => f.client_count >= 2 && (f.types.ir || f.types.pr))

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: cat } = await db.from('service_categories').select('id').eq('slug', CATEGORY_SLUG).single()
  if (!cat) throw new Error(`Category '${CATEGORY_SLUG}' not found`)

  const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  let inserted = 0, skipped = 0
  for (const f of firms) {
    const ref = f.domains[0] ?? slugify(f.name)
    const { data: existing } = await db.from('provider_profiles')
      .select('id').eq('source', 'newsfile').eq('source_ref', ref).maybeSingle()
    if (existing) { skipped++; continue }

    const { data: profile, error } = await db.from('provider_profiles').insert({
      user_id: null,
      company_name: f.name,
      slug: `${slugify(f.name)}-nf`,
      description: `${f.name} provides investor relations and communications services to Canadian public companies.`,
      website_url: f.domains[0] ? `https://${f.domains[0]}` : null,
      tier: 'free',
      is_active: true,
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: 'seed:newsfile',
      primary_market_code: 'CA',
      source: 'newsfile',
      source_ref: ref,
      seed_data: { client_count: f.client_count, issuers: f.issuers, emails: f.emails, types: f.types },
    }).select('id').single()
    if (error) { console.warn(`  insert failed for ${f.name}: ${error.message}`); continue }
    await db.from('provider_categories').insert({ provider_id: profile.id, category_id: cat.id, is_primary: true })
    inserted++
    console.log(`  + ${f.name} (${f.client_count} clients)`)
  }
  console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`)
}

;(LOAD ? load() : DRY ? (async () => { const l = await latestReleaseId(); console.log('latest id', l, '— dry, no classify') })() : scrape())
  .catch((e) => { console.error(e); process.exit(1) })
