// Sync the issuers table from Cboe Canada's daily symbol listings CSV.
// Covers all four Canadian exchanges: TSX (XTSE), TSXV (XTSX), CSE (XCNQ), NEO (NEOE).
// Idempotent — upserts on (exchange_code, symbol); safe to re-run (weekly cron recommended).
//
// Usage: node scripts/seed/issuers.mjs [--dry]

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const CSV_URL = 'https://cdn.cboe.com/ca/equities/mnow/symbol_listings.csv'
const MIC_TO_EXCHANGE = { XTSE: 'TSX', XTSX: 'TSXV', XCNQ: 'CSE', NEOE: 'NEO' }
const DRY = process.argv.includes('--dry')

function loadEnv() {
  for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

// Minimal CSV parse — this file has no quoted fields containing commas,
// but guard for quotes anyway.
function parseCsv(text) {
  const lines = text.split('\n').filter(Boolean)
  const header = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const cells = line.match(/("([^"]*)"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '')) ?? line.split(',')
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? '']))
  })
}

// Title-case the ALL-CAPS Cboe company names, preserving tickers/initialisms
function titleCase(name) {
  const KEEP = new Set(['INC', 'CORP', 'LTD', 'LP', 'ULC', 'REIT', 'ETF', 'SPC', 'PLC', 'II', 'III', 'IV', 'A', 'B', 'US', 'USA', 'AI', 'ESG', 'TSX', 'CSE'])
  return name.split(' ').map((w) => {
    const clean = w.replace(/[.,]/g, '')
    if (KEEP.has(clean)) return w.charAt(0) + w.slice(1).toLowerCase().replace(/^(inc|corp|ltd|lp|ulc|reit|plc)\b/i, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase())
    if (/^[A-Z0-9&.-]{1,3}$/.test(clean)) return w // short tokens: leave as-is
    return w.charAt(0) + w.slice(1).toLowerCase()
  }).join(' ')
}

async function main() {
  console.log('Downloading Cboe Canada symbol listings…')
  const res = await fetch(CSV_URL)
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`)
  const text = (await res.text()).split('\n').slice(1).join('\n') // drop comment line
  const rows = parseCsv(text)

  const issuers = []
  const seen = new Set()
  for (const r of rows) {
    const exchange = MIC_TO_EXCHANGE[r.mic]
    if (!exchange || !r.symbol || !r.company_name || r.test === 't') continue
    const key = `${exchange}:${r.symbol}`
    if (seen.has(key)) continue
    seen.add(key)
    issuers.push({
      name: titleCase(r.company_name.trim()),
      symbol: r.symbol.trim(),
      exchange_code: exchange,
      market_code: 'CA',
      cusip: r.cusip || null,
      currency: r.currency || 'CAD',
      is_etf: r.asset_class === 'ETF',
      is_live: r.live === 't',
      source: 'cboe',
      updated_at: new Date().toISOString(),
    })
  }

  const byExchange = {}
  for (const i of issuers) byExchange[i.exchange_code] = (byExchange[i.exchange_code] ?? 0) + 1
  console.log(`Parsed ${issuers.length} issuers:`, byExchange)

  if (DRY) { console.log('Dry run — no DB writes.'); return }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const BATCH = 500
  let upserted = 0
  for (let i = 0; i < issuers.length; i += BATCH) {
    const { error } = await db.from('issuers').upsert(issuers.slice(i, i + BATCH), { onConflict: 'exchange_code,symbol' })
    if (error) throw new Error(`Upsert batch ${i}: ${error.message}`)
    upserted += Math.min(BATCH, issuers.length - i)
    process.stdout.write(`\r  upserted ${upserted}/${issuers.length}`)
  }
  console.log('\nDone.')
}

main().catch((e) => { console.error(e); process.exit(1) })
