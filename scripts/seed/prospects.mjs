// Import issuer enrichment + executive prospects from the
// all-issuers-enricher CSV exports.
//
// Usage:
//   node scripts/seed/prospects.mjs --dir /path/to/data/output [--dry]
//
// - final_enriched.csv → contact columns on issuers (matched on exchange+symbol)
// - persons.csv        → executive_prospects (matched to issuers by company name)

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const DIR = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : null
if (!DIR) { console.error('Pass --dir /path/to/csvs'); process.exit(1) }

function loadEnv() {
  for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

function parseCsv(path) {
  const text = readFileSync(path, 'utf8')
  const rows = []
  let cell = '', row = [], inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') inQ = false
      else cell += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell); cell = ''
      if (row.some((x) => x !== '')) rows.push(row)
      row = []
    } else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  const header = rows[0]
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])))
}

const normName = (s) => s.toLowerCase()
  .replace(/\b(inc|corp|corporation|ltd|limited|company|co|plc|lp|ulc|trust|fund|holdings?|group|international|intl|resources?|technologies|technology|tech)\b\.?/g, '')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()

const looksJunk = (p) =>
  p['First Name'].length < 2 ||
  /view|more|latest|unknown|n\/a|click|read/i.test(`${p['First Name']} ${p['Last Name']}`) ||
  !p['Organization']

async function main() {
  const enriched = parseCsv(join(DIR, 'final_enriched.csv'))
  const persons = parseCsv(join(DIR, 'persons.csv')).filter((p) => !looksJunk(p))
  console.log(`Parsed ${enriched.length} enriched issuers, ${persons.length} clean persons`)
  if (DRY) { console.log('Dry run — no DB writes.'); return }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Load issuer index: (exchange:symbol) and normalized-name → id
  const issuerBySym = new Map()
  const issuerByName = new Map()
  for (let fromRow = 0; ; fromRow += 1000) {
    const { data, error } = await db.from('issuers').select('id, name, symbol, exchange_code').range(fromRow, fromRow + 999)
    if (error) throw error
    for (const i of data) {
      issuerBySym.set(`${i.exchange_code}:${i.symbol}`, i.id)
      issuerByName.set(normName(i.name), i.id)
    }
    if (data.length < 1000) break
  }
  console.log(`Issuer index: ${issuerBySym.size} symbols`)

  // ── 1. Enrich issuers ──────────────────────────────────────
  let enrichedCount = 0, unmatched = 0
  for (const r of enriched) {
    const id = issuerBySym.get(`${r.exchange}:${r.symbol}`) ?? issuerByName.get(normName(r.issuer_name))
    if (!id) { unmatched++; continue }
    const patch = {
      website: r.website || null,
      ir_url: r.ir_url || null,
      newsroom_url: r.newsroom_url || null,
      phone: r.phone || null,
      address: r.address || null,
      general_email: r.general_email || null,
      ir_email: r.ir_email || null,
      province: r.province || null,
      enriched_at: new Date().toISOString(),
    }
    if (Object.values(patch).every((v) => v === null || v === patch.enriched_at)) continue
    const { error } = await db.from('issuers').update(patch).eq('id', id)
    if (!error) enrichedCount++
    if (enrichedCount % 250 === 0) process.stdout.write(`\r  issuers enriched: ${enrichedCount}`)
  }
  console.log(`\nIssuers enriched: ${enrichedCount} (${unmatched} unmatched)`)

  // ── 2. Executive prospects ─────────────────────────────────
  const prospects = persons.map((p) => ({
    issuer_id: issuerByName.get(normName(p.Organization)) ?? null,
    first_name: p['First Name'],
    last_name: p['Last Name'],
    title: p['Job Title'] || null,
    company_name: p.Organization,
    email: p.Email || null,
    phone: p.Phone || null,
    source: 'all-issuers-enricher',
  }))
  const linked = prospects.filter((p) => p.issuer_id).length

  const BATCH = 500
  let upserted = 0
  for (let i = 0; i < prospects.length; i += BATCH) {
    const { error } = await db.from('executive_prospects')
      .upsert(prospects.slice(i, i + BATCH), { onConflict: 'company_name,first_name,last_name,title', ignoreDuplicates: false })
    if (error) throw new Error(`Prospect batch ${i}: ${error.message}`)
    upserted += Math.min(BATCH, prospects.length - i)
    process.stdout.write(`\r  prospects upserted: ${upserted}/${prospects.length}`)
  }
  console.log(`\nDone. ${upserted} prospects (${linked} linked to issuers).`)
}

main().catch((e) => { console.error(e); process.exit(1) })
