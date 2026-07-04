// Fill empty service categories using Claude with web search.
// For each category with no providers, Claude searches for Canadian firms
// serving public companies, returns candidates, and we verify each website
// actually loads before inserting as a free-tier listing.
//
// Usage:
//   node scripts/seed/category-search.mjs --limit 3          # 3 categories (test)
//   node scripts/seed/category-search.mjs --limit 100        # all empty categories
//
// Requires ANTHROPIC_API_KEY + Supabase service key in .env.local.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36' }
const args = process.argv.slice(2)
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : 3
const MAX_FIRMS = 10

function loadEnv() {
  for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function searchFirms(categoryName, groupName) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }],
      system: `You research Canadian professional service firms. Find real, currently-operating firms that provide "${categoryName}" (${groupName}) services to Canadian publicly listed companies (TSX/TSXV/CSE/NEO issuers). Prefer firms that explicitly serve public companies or capital markets. After searching, respond with ONLY a JSON object, no prose: {"firms":[{"name":"...","website":"https://...","city":"...","province":"ON","one_line":"what they do"}]}. Up to ${MAX_FIRMS} firms. Only include firms you found real websites for. Skip generic directories, US-only firms, and firms you are unsure exist.`,
      messages: [{ role: 'user', content: `Find Canadian firms offering ${categoryName} services to public companies.` }],
    }),
  })
  if (!res.ok) throw new Error(`Claude ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  const text = (data.content ?? []).filter((b) => b.type === 'text').map((b) => b.text).join('\n')
  try { return JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}').firms ?? [] } catch { return [] }
}

async function verifyWebsite(url) {
  try {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 8000)
    const res = await fetch(url, { headers: UA, signal: ctl.signal, redirect: 'follow' })
    clearTimeout(t)
    return res.ok ? res.url.replace(/\/$/, '') : null
  } catch { return null }
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Find empty categories
  const { data: cats } = await db.from('service_categories').select('id, slug, name, group_name').order('sort_order')
  const { data: pcs } = await db.from('provider_categories').select('category_id')
  const filled = new Set((pcs ?? []).map((p) => p.category_id))
  const empty = (cats ?? []).filter((c) => !filled.has(c.id)).slice(0, LIMIT)
  console.log(`${empty.length} empty categories to fill (of ${cats.length} total)`)

  let totalInserted = 0
  for (const cat of empty) {
    console.log(`\n── ${cat.name} (${cat.group_name})`)
    let firms = []
    try { firms = await searchFirms(cat.name, cat.group_name) }
    catch (e) { console.warn(`  search failed: ${e.message}`); continue }
    console.log(`  Claude proposed ${firms.length} firms`)

    let inserted = 0
    for (const f of firms) {
      if (!f.name || !f.website) continue
      const website = await verifyWebsite(f.website)
      if (!website) { console.log(`  ✗ ${f.name} — website unreachable (${f.website})`); continue }

      const domain = new URL(website).hostname.replace(/^www\./, '')
      // Dedupe across ALL sources: same domain or same company name
      const { data: existing } = await db.from('provider_profiles')
        .select('id')
        .or(`and(source.eq.websearch,source_ref.eq.${domain}),website_url.ilike.%${domain}%,company_name.ilike.${f.name.replace(/[%,]/g, '')}`)
        .limit(1)
        .maybeSingle()
      if (existing) {
        await db.from('provider_categories').upsert({ provider_id: existing.id, category_id: cat.id, is_primary: false })
        console.log(`  ~ ${f.name} — already in directory, linked to category`)
        continue
      }

      const { data: profile, error } = await db.from('provider_profiles').insert({
        user_id: null,
        company_name: f.name,
        slug: `${slugify(f.name)}-ws`,
        description: f.one_line || `${f.name} provides ${cat.name.toLowerCase()} services to Canadian public companies.`,
        website_url: website,
        tier: 'free',
        is_active: true,
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: 'seed:websearch',
        primary_market_code: 'CA',
        source: 'websearch',
        source_ref: domain,
        seed_data: { category: cat.slug, proposed_city: f.city, proposed_province: f.province },
      }).select('id').single()
      if (error) { console.warn(`  ✗ ${f.name}: ${error.message}`); continue }

      await db.from('provider_categories').insert({ provider_id: profile.id, category_id: cat.id, is_primary: true })
      if (f.city) await db.from('provider_locations').insert({ provider_id: profile.id, region: f.province ?? null, city: f.city })
      inserted++
      console.log(`  + ${f.name} — ${f.city ?? '?'} (${domain})`)
    }
    totalInserted += inserted
    console.log(`  ${cat.name}: ${inserted} inserted`)
    await sleep(500)
  }
  console.log(`\nDone. ${totalInserted} providers inserted across ${empty.length} categories.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
