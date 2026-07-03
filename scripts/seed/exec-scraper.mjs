// Scrape executive names/titles from issuer websites (management/team pages)
// into executive_prospects. Resumable: skips issuers already scraped
// (tracked via issuers.seed-style marker in exec_scrape_status).
//
// Usage:
//   node scripts/seed/exec-scraper.mjs --limit 25            # small batch
//   node scripts/seed/exec-scraper.mjs --limit 500           # big batch
//   node scripts/seed/exec-scraper.mjs --exchange CSE --limit 100
//
// Requires ANTHROPIC_API_KEY + Supabase service key in .env.local.
// Run migration 012 first (adds issuers.exec_scrape_status).

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36' }
const args = process.argv.slice(2)
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : 25
const EXCHANGE = args.includes('--exchange') ? args[args.indexOf('--exchange') + 1] : null

const TEAM_PATHS = [
  '/team', '/our-team', '/management', '/leadership', '/about/team',
  '/about/management', '/about/leadership', '/corporate/management',
  '/about-us/management', '/about-us/team', '/about', '/about-us',
  '/corporate/directors-management', '/management-team', '/people',
]
const EXEC_TITLES = /chief|ceo|cfo|coo|president|chair|director|secretary|vp|vice.?president|investor relations|founder/i

function loadEnv() {
  for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchPage(url, timeoutMs = 12000) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { headers: UA, signal: ctl.signal, redirect: 'follow' })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('html')) return null
    return await res.text()
  } catch { return null } finally { clearTimeout(t) }
}

function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&amp;/g, '&').replace(/&#39;|&apos;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ').replace(/\n\s*/g, '\n').trim()
}

// Find the best management page for a site
async function findTeamPage(website) {
  const base = website.replace(/\/+$/, '')
  const home = await fetchPage(base)
  if (home === null) return null

  // Prefer links on the homepage that look like team/management pages
  const links = [...home.matchAll(/href="([^"#?]+)"/g)].map((m) => m[1])
  const candidates = links
    .filter((l) => /team|management|leadership|people|about|directors/i.test(l))
    .map((l) => (l.startsWith('http') ? l : base + (l.startsWith('/') ? l : '/' + l)))
    .filter((l) => l.startsWith(base))
  const ordered = [...new Set([...candidates, ...TEAM_PATHS.map((p) => base + p)])]

  for (const url of ordered.slice(0, 8)) {
    const html = await fetchPage(url)
    if (!html) continue
    const text = htmlToText(html)
    if (EXEC_TITLES.test(text) && text.length > 400) return { url, text: text.slice(0, 12000) }
    await sleep(150)
  }
  // Fall back to homepage itself
  const homeText = htmlToText(home)
  if (EXEC_TITLES.test(homeText)) return { url: base, text: homeText.slice(0, 12000) }
  return null
}

async function extractExecs(companyName, pageText) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 800,
      system: 'You extract company executives and directors from website text. Only real named people currently at the company. Titles normalized (CEO, CFO, COO, President, Executive Chairman, Director, VP Investor Relations, Corporate Secretary, etc.). Respond with JSON only: {"people":[{"first_name":"...","last_name":"...","title":"..."}]}. Empty array if none found.',
      messages: [{ role: 'user', content: `Company: ${companyName}\n\nWebsite text:\n${pageText}` }],
    }),
  })
  if (!res.ok) throw new Error(`Claude ${res.status}`)
  const data = await res.json()
  try { return JSON.parse((data.content?.[0]?.text ?? '{}').match(/\{[\s\S]*\}/)?.[0] ?? '{}').people ?? [] } catch { return [] }
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  let q = db.from('issuers')
    .select('id, name, symbol, exchange_code, website')
    .not('website', 'is', null)
    .is('exec_scrape_status', null)
    .eq('is_live', true).eq('is_etf', false)
    .limit(LIMIT)
  if (EXCHANGE) q = q.eq('exchange_code', EXCHANGE)
  const { data: issuers, error } = await q
  if (error) throw error
  console.log(`Scraping ${issuers.length} issuer websites…`)

  let people = 0, found = 0, failed = 0
  for (const [i, issuer] of issuers.entries()) {
    let status = 'no_team_page'
    try {
      const page = await findTeamPage(issuer.website)
      if (page) {
        const execs = (await extractExecs(issuer.name, page.text))
          .filter((p) => p.first_name && p.last_name && p.first_name.length > 1)
        if (execs.length) {
          const rows = execs.map((p) => ({
            issuer_id: issuer.id,
            first_name: p.first_name.trim(),
            last_name: p.last_name.trim(),
            title: p.title?.trim() || null,
            company_name: issuer.name,
            source: 'website-scrape',
          }))
          const { error: upErr } = await db.from('executive_prospects')
            .upsert(rows, { onConflict: 'company_name,first_name,last_name,title' })
          if (upErr) throw upErr
          people += execs.length
          found++
          status = 'ok'
          console.log(`  [${i + 1}/${issuers.length}] ${issuer.exchange_code}:${issuer.symbol} ${issuer.name} — ${execs.length} people (${page.url})`)
        }
      }
    } catch (e) {
      status = 'error'
      failed++
      console.warn(`  [${i + 1}/${issuers.length}] ${issuer.name} — ${e.message}`)
    }
    await db.from('issuers').update({ exec_scrape_status: status }).eq('id', issuer.id)
    await sleep(300)
  }
  console.log(`\nDone. ${found}/${issuers.length} sites yielded ${people} people (${failed} errors).`)
}

main().catch((e) => { console.error(e); process.exit(1) })
