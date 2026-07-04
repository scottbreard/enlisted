// Import executive prospects from a Pipedrive-style CSV export
// ("Person - *" / "Organization - *" columns).
//
// Usage: node scripts/seed/pipedrive-import.mjs --file "/path/to/execs.csv" [--dry]

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const FILE = args.includes('--file') ? args[args.indexOf('--file') + 1] : null
if (!FILE) { console.error('Pass --file /path/to/csv'); process.exit(1) }

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
      if (row.some((x) => x.trim() !== '')) rows.push(row)
      row = []
    } else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  const header = rows[0].map((h) => h.trim())
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

const EXCHANGE_MAP = { TSXV: 'TSXV', TSX: 'TSX', CSE: 'CSE', NEO: 'NEO' }

async function main() {
  const rows = parseCsv(FILE)
  console.log(`Parsed ${rows.length} rows`)

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Issuer index by exchange:symbol
  const issuerBySym = new Map()
  for (let fromRow = 0; ; fromRow += 1000) {
    const { data, error } = await db.from('issuers').select('id, symbol, exchange_code, website, phone, address').range(fromRow, fromRow + 999)
    if (error) throw error
    for (const i of data) issuerBySym.set(`${i.exchange_code}:${i.symbol}`, i)
    if (data.length < 1000) break
  }

  const prospects = []
  const issuerPatches = new Map()
  let linked = 0, skipped = 0

  for (const r of rows) {
    const fullName = r['Person - Name'] ?? ''
    const parts = fullName.split(/\s+/).filter(Boolean)
    if (parts.length < 2) { skipped++; continue }
    const first = parts[0]
    const last = parts.slice(1).join(' ')

    const exch = EXCHANGE_MAP[(r['Organization - Stock Exchange'] ?? '').split(',')[0].trim()]
    const sym = (r['Organization - Stock Symbol'] ?? '').split(',')[0].trim()
    const issuer = exch && sym ? issuerBySym.get(`${exch}:${sym}`) : null
    if (issuer) linked++

    const email = (r['Person - Email - Work'] || r['Person - Email - Other'] || r['Person - Email - Home'] || '').replace(/\s+/g, '') || null
    const phone = (r['Person - Phone - Work'] || r['Person - Phone - Mobile'] || r['Person - Phone - Other'] || '').trim() || null

    prospects.push({
      issuer_id: issuer?.id ?? null,
      first_name: first,
      last_name: last,
      title: r['Person - Position'] || null,
      company_name: r['Person - Organization'] || r['Organization - Name'] || 'Unknown',
      email,
      phone,
      linkedin_url: r['Person - LinkedIn'] || null,
      source: 'pipedrive',
    })

    // Backfill issuer contact info where missing
    if (issuer) {
      const patch = {}
      const site = (r['Organization - Website'] ?? '').trim()
      if (!issuer.website && site) patch.website = site.startsWith('http') ? site : `https://${site}`
      if (!issuer.phone && r['Organization - Phone']) patch.phone = r['Organization - Phone']
      if (!issuer.address && r['Organization - Address']) patch.address = r['Organization - Address']
      if (Object.keys(patch).length) issuerPatches.set(issuer.id, { ...(issuerPatches.get(issuer.id) ?? {}), ...patch })
    }
  }

  // Dedupe on the upsert conflict key (CSV contains repeated people)
  const seen = new Map()
  for (const p of prospects) {
    const key = `${p.company_name}|${p.first_name}|${p.last_name}|${p.title}`.toLowerCase()
    const prev = seen.get(key)
    if (!prev || (!prev.email && p.email)) seen.set(key, p)
  }
  const deduped = [...seen.values()]

  console.log(`Prepared ${deduped.length} unique prospects (${prospects.length - deduped.length} in-file dupes, ${linked} linked, ${skipped} skipped) · ${issuerPatches.size} issuer backfills`)
  if (DRY) { console.log('Dry run — no DB writes.'); return }

  const BATCH = 500
  let upserted = 0
  for (let i = 0; i < deduped.length; i += BATCH) {
    const { error } = await db.from('executive_prospects')
      .upsert(deduped.slice(i, i + BATCH), { onConflict: 'company_name,first_name,last_name,title' })
    if (error) throw new Error(`Batch ${i}: ${error.message}`)
    upserted += Math.min(BATCH, deduped.length - i)
    process.stdout.write(`\r  prospects: ${upserted}/${deduped.length}`)
  }

  let patched = 0
  for (const [id, patch] of issuerPatches) {
    const { error } = await db.from('issuers').update({ ...patch, enriched_at: new Date().toISOString() }).eq('id', id)
    if (!error) patched++
  }
  console.log(`\nDone. ${upserted} prospects upserted, ${patched} issuers backfilled.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
