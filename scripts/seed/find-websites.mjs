// Discover websites for issuers that don't have one.
// Strategy: generate candidate domains from the company name (.com/.ca),
// fetch each, and accept when the homepage mentions the company name or
// ticker. Free and surprisingly effective for small-caps; the misses can
// be handled later with a search-API pass.
//
// Usage:
//   node scripts/seed/find-websites.mjs --limit 100
//   node scripts/seed/find-websites.mjs --limit 2000 --exchange TSXV
//
// Resumable: issuers already attempted are marked website_search_status.
// Run migration 013b (column added in 013_prospect_tracking follow-up) or
// it is created by 014_website_search.sql.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36' }
const args = process.argv.slice(2)
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : 50
const EXCHANGE = args.includes('--exchange') ? args[args.indexOf('--exchange') + 1] : null

function loadEnv() {
  for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const STOPWORDS = /\b(inc|corp|corporation|ltd|limited|company|co|plc|lp|ulc|holdings?|group|com|cl|a|b)\b\.?/gi

function candidateDomains(name) {
  const cleaned = name.replace(STOPWORDS, ' ').replace(/[^a-z0-9 ]/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
  const words = cleaned.split(' ').filter(Boolean)
  if (!words.length) return []
  const joined = words.join('')
  const dashed = words.join('-')
  const firstTwo = words.slice(0, 2).join('')
  const bases = [...new Set([joined, dashed, firstTwo, words[0]])].filter((b) => b.length >= 4 && b.length <= 30)
  const domains = []
  for (const b of bases) for (const tld of ['.com', '.ca']) domains.push(`${b}${tld}`)
  return domains.slice(0, 8)
}

async function checkDomain(domain, issuer) {
  for (const scheme of ['https://www.', 'https://']) {
    const url = scheme + domain
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 8000)
    try {
      const res = await fetch(url, { headers: UA, signal: ctl.signal, redirect: 'follow' })
      if (!res.ok) continue
      const html = (await res.text()).slice(0, 60000).toLowerCase()
      // Verify: homepage mentions company name fragment or ticker
      const nameFrag = issuer.name.replace(STOPWORDS, ' ').replace(/[^a-z0-9 ]/gi, '').trim().toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 2).join(' ')
      const tickerHit = new RegExp(`\\b(tsxv?|cse|neo)\\s*[:.]?\\s*${issuer.symbol.toLowerCase().replace(/[.^$*+?()[\]{}|]/g, '')}\\b`).test(html)
      const nameHit = nameFrag.length > 4 && html.includes(nameFrag)
      if (tickerHit || nameHit) return res.url.replace(/\/$/, '')
    } catch { /* try next */ } finally { clearTimeout(t) }
  }
  return null
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  let q = db.from('issuers')
    .select('id, name, symbol, exchange_code')
    .is('website', null)
    .is('website_search_status', null)
    .eq('is_live', true).eq('is_etf', false)
    .limit(LIMIT)
  if (EXCHANGE) q = q.eq('exchange_code', EXCHANGE)
  const { data: issuers, error } = await q
  if (error) throw error
  console.log(`Searching websites for ${issuers.length} issuers…`)

  let found = 0
  for (const [i, issuer] of issuers.entries()) {
    let website = null
    for (const domain of candidateDomains(issuer.name)) {
      website = await checkDomain(domain, issuer)
      if (website) break
      await sleep(80)
    }
    await db.from('issuers').update(
      website
        ? { website, website_search_status: 'guessed', enriched_at: new Date().toISOString() }
        : { website_search_status: 'not_found' }
    ).eq('id', issuer.id)
    if (website) { found++; console.log(`  [${i + 1}/${issuers.length}] ${issuer.exchange_code}:${issuer.symbol} ${issuer.name} → ${website}`) }
    await sleep(120)
  }
  console.log(`\nDone. Found ${found}/${issuers.length} websites.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
