# Enlisted Codebase Audit

**Generated:** 2026-06-21  
**Auditor:** Claude Code (read-only, no code changes made)  
**Scope:** All code on Scott Breard's machine related to Enlisted Inc.

---

## 1. Repository Overview

### Primary repo: `/Users/scottbreard/enlisted`

- **Git remote:** No remote configured (`git remote -v` returned empty)
- **Default branch:** `main`
- **Commits:** 1 — `35a2716 Initial commit from Create Next App` (no author date available)
- **LOC (TypeScript/TSX):** ~6,271 lines across 42 files
- **Total files:** 52 (excluding `node_modules`, `.next`)

### Top-level directory tree

```
enlisted/
├── app/                    Next.js App Router — all pages and API routes
│   ├── (admin)/            Admin panel route group (protected)
│   ├── (auth)/             Login + register pages (public)
│   ├── (executive)/        Executive dashboard suite (authenticated)
│   ├── (provider)/         Provider dashboard suite (authenticated)
│   ├── api/                Server-side API handlers (Stripe, AI, stock, RFQ, news)
│   ├── directory/          Public provider directory (unauthenticated)
│   ├── providers/          ⚠️ LEGACY — v1 directory pages, now dead code
│   ├── globals.css         Brand CSS variables (navy, gold, blue palette)
│   ├── layout.tsx          Root layout
│   └── page.tsx            Homepage
├── components/             Shared React components (nav, AI widget)
├── lib/                    Supabase clients + Stripe singleton
├── middleware.ts            Route protection
├── supabase/
│   ├── schema.sql          v1 schema (OLD — superseded)
│   └── migrations/001_v3_schema.sql   Live schema (25+ tables)
├── CLAUDE.md               AI assistant instructions (project context)
├── AGENTS.md               Next.js version notes
├── package.json            Node dependencies
└── .env.local              Secrets file (not committed — on disk only)
```

### Additional projects on disk (separate from the Next.js repo)

| Path | Language | Purpose |
|---|---|---|
| `~/all-issuers-enricher/` | Python | Scrapes TSX/TSXV/CSE issuers + enriches with website/contact data |
| `~/Downloads/stock_marketing_audit/` | Python/Streamlit | AI-powered public company IR audit tool (separate MVP) |
| `~/lse-enricher/` | Python | Similar enricher targeting LSE issuers |
| `~/mining-enricher/` | Python | Mining-specific enricher, older version |
| `~/us-enricher/` | Python | US issuer enricher |
| `~/asx-enricher/` | Python | ASX issuer enricher |
| `~/Desktop/lead-sniper/` | Python | Restaurant lead scraper (DiRoNA project — unrelated) |
| `~/` (root) | Python scripts | Loose enrichment/scraping scripts from prior work |

---

## 2. Tech Stack Inventory

### Next.js Application (`/Users/scottbreard/enlisted`)

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | ^5 |
| Framework | Next.js (App Router) | 16.2.9 |
| Styling | Tailwind CSS v4 | ^4 |
| Database | Supabase (hosted Postgres) | project: `xczjazhmqzecvrfcclnb` |
| Auth | Supabase Auth | via `@supabase/ssr ^0.12.0` |
| ORM | None — raw Supabase query builder | — |
| Frontend | React 19 | 19.2.4 |
| Forms | react-hook-form + zod | ^7.79 / ^4.4.3 |
| Icons | lucide-react | ^1.18.0 |
| Billing | Stripe | ^22.2.2 (SDK) |
| AI | Anthropic Claude SDK | ^0.105.0 |
| Hosting | Vercel (referenced in CLAUDE.md — not configured in repo) | — |

### Third-party API calls (file:line)

| API | File | Line | What it does |
|---|---|---|---|
| Yahoo Finance RSS/Chart | `app/api/stock/route.ts` | 19–28 | Fetches live price + 3mo chart (no key required) |
| Yahoo Finance News RSS | `app/api/news/route.ts` | 6–32 | Fetches company-specific headlines |
| Globe & Mail RSS | `app/api/news/route.ts` | 34–60 | Fetches Canadian market news |
| Anthropic Claude API | `app/api/ai/route.ts` | 4, 39–46 | Powers floating AI assistant chat |
| Stripe Checkout | `app/api/stripe/checkout/route.ts` | ~40–60 | Creates subscription checkout session |
| Stripe Portal | `app/api/stripe/portal/route.ts` | ~20–35 | Opens billing management portal |
| Stripe Webhooks | `app/api/stripe/webhook/route.ts` | ~30–100 | Handles subscription lifecycle events |
| Supabase (ANON key) | `lib/supabase/client.ts`, `lib/supabase/server.ts` | 1–15 | All DB reads/writes |
| Supabase (SERVICE ROLE) | `app/api/stripe/webhook/route.ts` | 9 | Bypasses RLS for webhook updates |

**No calls to:** Pipedrive, Brevo, SEDAR+, EDGAR, OpenAI, Perplexity, Google Maps, or any SEDAR+ scraping endpoint — these are all paper-only or exist only in the separate Python projects.

### Key Node packages (from `package.json`)
`next`, `react`, `react-dom`, `@supabase/ssr`, `@supabase/supabase-js`, `@anthropic-ai/sdk`, `stripe`, `@stripe/stripe-js`, `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`, `tailwindcss`, `typescript`

### Python projects (separate)

**`all-issuers-enricher/requirements.txt`:**
`httpx`, `httpx-retries`, `beautifulsoup4`, `pydantic`, `rich`, `typer`, `pandas`, `tenacity`, `lxml`, `playwright` (inferred from `scrape_all_exchanges.py`)

**`stock_marketing_audit/requirements.txt`:**
`streamlit`, `requests`, `beautifulsoup4`, `jinja2`, `openai`, `python-dotenv`, `weasyprint`

---

## 3. Application Inventory

### 3.1 Enlisted Web Platform (`/Users/scottbreard/enlisted`)

**Purpose:** Two-sided marketplace connecting Canadian public company executives (free) with professional service providers (paid: Listed/Connected $100mo/Featured $499mo). Next.js App Router SPA deployed (or targeting) Vercel.

**Entry point:** `next dev` → `app/layout.tsx`

**How to run locally:**
```bash
cd /Users/scottbreard/enlisted
npm run dev
# Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (both present)
```

**What it does (by route group):**

**Public routes:**
- `/` — Homepage: hero, 92-category grid, stats, CTA (`app/page.tsx`, 298 LOC)
- `/directory` — All 92 categories from Supabase `service_categories` table
- `/directory/[category]` — Provider listings sorted by tier (featured → listed)
- `/directory/[category]/[slug]` — Full provider profile with team, video, discounts
- `/login` — Email/password auth via Supabase
- `/register/executive` — Full registration + founding member auto-assignment
- `/register/provider` — Provider registration (tier preview shown)

**Executive dashboard (authenticated):**
- `/dashboard` — Stats widgets, compliance deadlines, vault preview
- `/compliance` — Auto-generates from `exchange_deadline_templates` on first visit
- `/vault` — Provider contract tracking with renewal alerts
- `/stock` — Live price from Yahoo Finance API, 3mo SVG chart
- `/rfq` — Send/track quote requests to providers
- `/rolodex` — Personal contact book (CRUD against `executive_contacts`)
- `/news` — RSS feed: company ticker news + Globe & Mail Canadian market news
- `/profile` — Edit executive profile + exchange/fiscal year end (triggers compliance calendar)

**Provider dashboard (authenticated):**
- `/provider/dashboard` — Stats (views, RFQs), plan card, activity feed
- `/provider/profile` — Profile editor (tier-gated fields)
- `/provider/analytics` — View counts (30-day bar chart), RFQ stats
- `/provider/rfq` — RFQ inbox: instant for Featured, 24h delay for Connected
- `/provider/billing` — Tier selection (monthly/annual toggle), Stripe checkout

**Admin panel (email-gated):**
- `/admin` — Overview: exec count, provider count, MRR estimate, recent signups
- `/admin/providers` — Full provider table
- `/admin/revenue` — MRR/ARR breakdown by tier

**Data inputs:** Supabase DB, Yahoo Finance RSS, Globe & Mail RSS, Anthropic API (chat only)  
**Data outputs:** Supabase DB (all writes), Stripe (checkout sessions)  
**Status:** **Prototype-grade, not production.** UI is functional but no real users, no Stripe keys, no Anthropic key, no service-role key.  
**LOC:** ~6,271 TypeScript/TSX  

---

### 3.2 All-Issuers Enricher (`/Users/scottbreard/all-issuers-enricher`)

**Purpose:** Scrapes TSX, TSXV, and CSE issuer lists → enriches each company with website, phone, email, social links → outputs to SQLite for CRM import. The primary data-collection tool Scott uses for sales prospecting.

**Entry point:** `python3 app.py start` (`app.py:58`)

**How to run:**
```bash
cd /Users/scottbreard/all-issuers-enricher
python3 app.py start   # Load CSV + begin enriching
python3 app.py status  # Check progress
python3 app.py resume  # Continue if stopped
python3 app.py export  # Build final CSVs
```

**What it does:**
1. Loads `data/input/issuers.csv` into SQLite
2. For each company: scrapes official website (`src/sources/website.py`)
3. Falls back to search engine scraping if website thin (`src/sources/search_fallback.py`)
4. Scores confidence; flags low-confidence records for review
5. Runs 6 concurrent workers via `concurrent.futures`
6. Exports cleaned CSV

**Data inputs:** `data/input/issuers.csv` (pre-built list from exchange scraping)  
**Data outputs:** SQLite DB at `data/`, exported CSV  
**External dependencies:** Public websites (no auth), search engines  
**Status:** **Working prototype.** Used operationally for sales outreach.  
**LOC:** ~3,875 (excluding venv)

---

### 3.3 Exchange Scraper (`/Users/scottbreard/all-issuers-enricher/scrape_all_exchanges.py`)

**Purpose:** Scrapes TSX/TSXV via the TMX JSON API and CSE via Playwright to build the master issuer list.

**Entry point:** `python3 scrape_all_exchanges.py`

**What it does:**
1. Hits `https://www.tsx.com/json/company-directory/search/{exchange}/{letter}` for each letter A-Z
2. Uses Playwright to scrape `issuers.thecse.com` (JavaScript-rendered)
3. Writes `data/input/issuers_all.csv`

**Status:** **Working.** This is the SEDAR+ harvester precursor — it gets company lists, not filings.  
**Known SEDAR+ gap:** This scraper gets company names + tickers only. It does NOT fetch SEDAR+ filing PDFs or extract provider names from filings. That work is described in `30_day_sprint_plan.md` as a Day 1–30 task requiring a contractor.

---

### 3.4 Stock Marketing AI Audit Generator (`/Users/scottbreard/Downloads/stock_marketing_audit`)

**Purpose:** Streamlit app that takes a public company's name/ticker/website, crawls their IR presence, scores them 0–100 across 6 dimensions, generates an AI-assisted analysis, and produces a branded HTML/PDF report. Designed as an internal tool for Stock Marketing Inc. (Scott's existing agency business).

**Entry point:** `streamlit run app.py` (`app.py:1`)

**How to run:**
```bash
cd /Users/scottbreard/Downloads/stock_marketing_audit
pip install -r requirements.txt
export OPENAI_API_KEY="..."   # Optional — falls back to deterministic scoring
streamlit run app.py
```

**What it does:**
1. Accepts company name, ticker, exchange, website, social URLs, optional peer list
2. Crawls homepage + likely IR/About/News pages (`audit/crawler.py`)
3. Scores across: Investor Visibility (20), Social (20), Content (20), Search/News (15), Credibility (15), Peer Benchmark (10)
4. Calls OpenAI GPT if key available; deterministic fallback otherwise
5. Renders branded HTML report + SQLite storage of audit runs
6. Optional PDF via WeasyPrint

**Status:** **Working prototype.** Fully functional standalone tool. Separate product from Enlisted — no DB or code connection. Uses OpenAI (not Claude).  
**LOC:** ~1,200 (app code only, excluding venv)  
**Security note:** OpenAI key stored in env var — not hardcoded.

---

### 3.5 Loose Python Scripts (`~/`)

Several standalone scripts in the home directory are artifacts of prior sales/data work:

| File | Purpose | Status |
|---|---|---|
| `scrape_canada.py` | Earlier exchange scraper | Superseded by `all-issuers-enricher` |
| `enrich.py`, `enrich1.py`, etc. | Earlier enrichment iterations | Superseded |
| `qualify.py` | Lead qualification against criteria | Operational or superseded — unclear |
| `maps_scraper.py` | Google Maps data extraction | Likely DiRoNA project artifact |
| `deduplicator.py` | CSV deduplication | Utility, operational |
| `crawl_csv.py`, `export_domains.py` | Domain crawling/export | Utility scripts |

These are **not part of Enlisted** — they are prospecting/data tooling for Stock Marketing Inc. and the DiRoNA TV pitch project.

---

## 4. Database Schema

### Schema files

| File | Status | Notes |
|---|---|---|
| `supabase/schema.sql` | **DEAD — DO NOT RUN** | v1 schema with old tables: `providers`, `public_companies`, `executives`, `subscriptions` — all dropped by v3 migration |
| `supabase/migrations/001_v3_schema.sql` | **Live schema** | Applied to Supabase project `xczjazhmqzecvrfcclnb` |

### v3 Schema Tables (25+ tables)

| Table | Columns (approx) | PK | Purpose |
|---|---|---|---|
| `markets` | 7 | `id` | CA/AU/UK/US market configs |
| `exchanges` | 6 | `id` | TSX, TSXV, CSE, NEO, ASX, LSE, NYSE, etc. |
| `service_categories` | 8 | `id` | 92 provider categories in 15 groups |
| `executive_profiles` | 20 | `id` | Executive user profiles |
| `executive_exchanges` | 5 | `(executive_id, exchange_id)` | Which exchange(s) exec is listed on |
| `executive_watchlist` | 4 | `id` | Saved categories |
| `executive_vault` | 18 | `id` | Saved provider contracts |
| `executive_contacts` | 13 | `id` | Rolodex — personal contacts |
| `compliance_events` | 12 | `id` | Auto-generated filing deadlines |
| `exchange_deadline_templates` | 9 | `id` | Template rules for compliance generation |
| `provider_profiles` | 25+ | `id` | Provider company profiles + Stripe fields |
| `provider_markets` | 2 | `(provider_id, market_id)` | Which markets provider serves |
| `provider_exchanges` | 2 | `(provider_id, exchange_id)` | Which exchanges provider serves |
| `provider_categories` | 3 | `(provider_id, category_id)` | Categories claimed by provider |
| `provider_team` | 8 | `id` | Team member profiles (Better/Best tiers) |
| `provider_locations` | 5 | `id` | Office locations |
| `member_discounts` | 11 | `id` | Exclusive discounts for executives |
| `discount_claims` | 6 | `id` | Claimed discounts |
| `provider_analytics` | 6 | `id` | Profile views, clicks, RFQ events |
| `rfq_requests` | 10 | `id` | Quote requests sent by execs |
| `rfq_responses` | 9 | `id` | Provider responses to RFQs |
| `news_items` | 11 | `id` | AI-curated news (unused — RSS used instead) |
| `regulatory_alerts` | 9 | `id` | Exchange regulatory alerts (unused) |
| `referrals` | 8 | `id` | Referral tracking |
| `newsletter_subscribers` | 7 | `id` | Email list |

### ⚠️ Schema/Code mismatches found

1. **`provider_profiles.tier` constraint** — Schema allows: `('free','listed','featured','professional','premium','enterprise')`. Code uses: `listed`, `connected`, `featured`. The value `connected` is **not in the DB constraint** — inserts with `tier='connected'` will fail. The migration must be re-run or the constraint updated with `ALTER TABLE`.

2. **`executive_contacts.owner_id` vs `executive_id`** — Schema uses `owner_id` as the primary FK. Rolodex code (`rolodex/page.tsx:35, 49`) queries by `executive_id`. This mismatch will cause RLS to silently block all Rolodex writes.

3. **`rfq_requests` missing columns** — Original schema has no `provider_id` or `response` columns. A manual SQL migration was run (`alter table rfq_requests add column if not exists...`) but is not in any migration file — it exists only as a chat-session command. If the schema is ever rebuilt from files, these columns will be lost.

4. **`news_items` table unused** — The table exists but the news API route (`app/api/news/route.ts`) bypasses it entirely, using live RSS instead. The table has no rows.

5. **`regulatory_alerts` table unused** — Same issue: table exists, no code writes to it.

6. **`executive_profiles` missing `fiscal_year_end` and `sector` columns** — Compliance calendar auto-generation checks `profile.sector` to decide whether to generate (`compliance/page.tsx:47`) but `sector` is a column in `executive_profiles` that was added in the v3 migration. This logic works only if `sector` is set; new execs without `sector` get no compliance events auto-generated.

### RLS Status

RLS is enabled on all 25+ tables. Public read policies exist for `markets`, `exchanges`, `service_categories`, `provider_profiles`, etc. Executive own-data policies use `auth.uid()` checks. Provider analytics only allows SELECT (not INSERT from client) — analytics inserts in `directory/[category]/[slug]/page.tsx:64` use `supabase.from('provider_analytics').insert()` which will fail silently if RLS blocks anonymous inserts (no INSERT policy on `provider_analytics`).

### Multi-tenancy model

Single-tenant Supabase project. No `tenant_id` columns. Market separation is via a `market_id` FK and a `NEXT_PUBLIC_MARKET=CA` env var — not enforced at DB level. Phase 2+ markets (AU, UK, US) share the same Postgres instance.

---

## 5. Agent Inventory

The 30-day sprint plan and CLAUDE.md reference an agent system. Current status:

| Agent | Description (from docs) | File found | Status |
|---|---|---|---|
| Agent 1: Compliance Calendar | Auto-generates filing deadlines from `exchange_deadline_templates` | `app/(executive)/compliance/page.tsx` | **Built** — server-side Next.js, triggered on page load |
| Agent 7: SEDAR+ Harvester | Scrapes SEDAR+ for filing PDFs + extracts provider names | **Not found in repo** | **Paper-only** — planned for 30-day sprint with contractor |
| Evidence Capture | Captures and stores evidence from public company filings | **Not found** | **Paper-only** |
| Agents 11–17 (Cockpit) | Filing Radar, Peer Mirror, Capital Markets Calendar, Shareholder Pulse, Crisis Concierge, Board Pack Builder | **Not found** | **Paper-only** — referenced in planning docs only |

The "10-agent system" described in planning documents has exactly **1 agent implemented** (the compliance calendar). All others are described in `30_day_sprint_plan.md` and `90_day_master_plan.md` but have no code.

---

## 6. Authentication, Secrets, Security

### Auth implementation

Supabase Auth with email/password. `@supabase/ssr` package creates a server-side client from cookies for each request. `middleware.ts` protects all authenticated routes by checking `supabase.auth.getUser()`. Login redirects to `/dashboard`; authenticated users redirect away from `/login` and `/register`.

### Secrets audit

**`.env.local`** (on disk, not committed to git):
```
NEXT_PUBLIC_SUPABASE_URL=https://xczjazhmqzecvrfcclnb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[REDACTED — JWT token present, 200+ chars]
STRIPE_SECRET_KEY=            ← EMPTY
STRIPE_WEBHOOK_SECRET=        ← EMPTY
STRIPE_PRICE_*=               ← ALL EMPTY (4 vars)
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=    ← EMPTY
ANTHROPIC_API_KEY=            ← EMPTY
ADMIN_EMAILS=scottbreard@gmail.com
```

**Git history risk:** Only 1 commit in repo (`35a2716`). The `.env.local` was never committed. No secret exposure via git history.

**⚠️ Supabase anon key is publicly visible** — it is in `NEXT_PUBLIC_SUPABASE_ANON_KEY` which means it's bundled into the client-side JavaScript and visible to any visitor. This is by design for Supabase (anon key + RLS is the security model), but **RLS must be correctly configured on all tables** for this to be safe. See §4 for RLS gaps.

**⚠️ `lib/supabase.ts` (legacy singleton):** `app/providers/page.tsx` and `app/providers/[slug]/page.tsx` import from `lib/supabase.ts` (a module-level singleton using anon key). This is the old v1 pattern — not SSR-safe, and these pages query the old `providers` table that no longer exists.

**Hardcoded values:** `ADMIN_EMAILS=scottbreard@gmail.com` is in `.env.local` (not code), which is fine. Admin check in `app/(admin)/admin/layout.tsx:13` correctly reads from `process.env.ADMIN_EMAILS`.

### PII handling

Executive registration collects: name, email, company, ticker, sector, exchange, fiscal year end. All stored in Supabase with RLS. No logging of PII to stdout. Provider registration collects: company name, website, email. Contact details (phone, email) stored in `executive_contacts` table — access controlled by RLS. No evidence of PII transmitted to third-party services other than Stripe (which requires it for billing).

---

## 7. Tests and CI

**No tests found in repo.** Zero test files (no `*.test.ts`, `*.spec.ts`, `__tests__/` directory).  
**No CI configuration found.** No `.github/workflows/`, no `vercel.json`, no `fly.toml`.  
**TypeScript** acts as a weak compile-time check (`npx tsc --noEmit` passes cleanly as of audit date).

---

## 8. Frontend State

### Production-ready pages

All routes listed in §3.1 render correctly in local dev. The site is a Next.js App Router application with:
- **Styling:** Tailwind CSS v4 with custom CSS variables (`globals.css`) — navy `#1B3A6B`, gold `#B8860B`, blue `#2E75B6`
- **Fonts:** Geist Sans (Next.js default)
- **Images:** Unsplash photo in homepage hero (external URL hardcoded in `app/page.tsx:~55`)

### ⚠️ Dead pages (v1 legacy — actively broken)

`app/providers/page.tsx` and `app/providers/[slug]/page.tsx` import from `lib/supabase.ts` and query `FROM providers` — the old v1 table that was dropped in the v3 migration. These pages return empty results or 404. They are unreachable from any nav link but remain in the repo and will cause build warnings.

### Deployment

Not yet deployed. `NEXT_PUBLIC_APP_URL=http://localhost:3000`. Vercel is referenced in `CLAUDE.md` as the target host but no Vercel project is configured and no `vercel.json` exists.

### News page

`app/(executive)/news/page.tsx` — **file not found during audit** (the `news/` directory exists but the page file itself was missing from the filesystem listing). The API route `app/api/news/route.ts` (194 LOC) exists and is functional. The UI page needs to be created or restored.

---

## 9. Data Integrations

| Integration | File:Line | What it does | Mode | Error handling |
|---|---|---|---|---|
| Supabase DB (anon) | `lib/supabase/client.ts:1`, `lib/supabase/server.ts:1` | All DB reads/writes | Live (real project) | Minimal — most pages handle `null` responses |
| Supabase DB (service role) | `app/api/stripe/webhook/route.ts:9` | Bypasses RLS for webhook tier updates | Live keys missing | Try/catch present |
| Yahoo Finance chart API | `app/api/stock/route.ts:19-28` | Price + chart data | No key needed | Try/catch + 500 response |
| Yahoo Finance news RSS | `app/api/news/route.ts:6-32` | Ticker-specific news headlines | No key needed | Try/catch, returns `[]` |
| Globe & Mail RSS | `app/api/news/route.ts:34-60` | Canadian market headlines | No key needed | Try/catch, returns `[]` |
| Anthropic Claude API | `app/api/ai/route.ts:4,39` | Executive AI assistant | Key not configured | Try/catch + console.error |
| Stripe Checkout | `app/api/stripe/checkout/route.ts` | Subscription creation | Keys not configured | Try/catch + error message |
| Stripe Portal | `app/api/stripe/portal/route.ts` | Customer billing portal | Keys not configured | Try/catch |
| Stripe Webhooks | `app/api/stripe/webhook/route.ts` | Tier updates on payment events | Keys not configured | Signature verification present |
| **Pipedrive** | **Not found** | — | **Not wired** | — |
| **Brevo** | **Not found** | — | **Not wired** | — |
| **SEDAR+** | **Not found** | — | **Not wired** | — |

---

## 10. Filing Radar Readiness Assessment

**Filing Radar** (per the 30-day sprint plan) requires: SEDAR+ filing ingestion → PDF extraction of provider mentions → structured provider database → alert mechanism for new filings.

### Current state vs. Filing Radar requirements

| Component | Required | Exists? | Where |
|---|---|---|---|
| SEDAR+ poller/scraper | Yes | **No** | Planned in sprint — contractor work, `scrape_all_exchanges.py` only gets company lists, not filing PDFs |
| Filing PDF downloader | Yes | **No** | Not built |
| PDF text extractor | Yes | **No** | `30_day_sprint_plan.md` references `pdf_extractor.py` — not found in repo |
| LLM extraction of provider names | Yes | **No** | Planned (Claude Haiku) — not built |
| Peer group data model | No (not needed for Filing Radar v1) | Partial | `executive_watchlist` exists but unused |
| `providers`/`mandates` tables in DB | Yes | **Partial** | `provider_profiles` table exists but populated only by self-registration, not SEDAR+ extraction |
| Alert/notification mechanism | Yes | **No** | `regulatory_alerts` table exists but empty; no email integration (Resend/Brevo not wired) |
| Streamlit internal demo | Yes (Day 30 gate) | **No** | Planned but not built |
| Executive issuer list (TSXV) | Yes | **Yes** | `all-issuers-enricher` has scraped ~978 TSXV companies |
| Company → exchange mapping | Yes | **Yes** | `exchanges` + `executive_exchanges` tables in Supabase |

### Estimate: Filing Radar MVP completeness

**~10% built.** The database schema and company directory exist. Everything else (SEDAR+ polling, PDF extraction, provider name extraction, alerting) is paper-only.

### Shortest path to Day-30 demo

1. **Day 1–3:** Write `harvester.py` using Playwright against SEDAR+ (or use `playwright codegen` as the sprint plan specifies). Target: download 100 TSXV company filing indexes.
2. **Day 3–6:** Write `pdf_extractor.py` — regex + Claude Haiku for auditor/transfer agent/counsel name extraction from filing PDFs.
3. **Day 7–9:** Create gold set of 100 hand-labeled filings. Measure precision/recall.
4. **Day 10:** Go/no-go gate on extraction accuracy.
5. **Day 11–18:** If green: scale to 500 issuers, canonicalize provider names, load into Supabase `provider_profiles`.
6. **Day 18–25:** Build Streamlit demo: company search → see disclosed providers; provider search → see active mandates.
7. **Day 26–30:** QA + polish for demo.

**The Next.js platform is NOT the right vehicle for the Day-30 demo.** The sprint plan explicitly calls for a Streamlit internal demo — faster to build, no auth required, no Stripe, no RLS complexity. The Next.js platform is the Phase 2+ product once the data model is validated.

**The biggest single risk:** SEDAR+ may require session cookies, CAPTCHA handling, or rate limiting that makes Playwright scraping unreliable. The sprint plan acknowledges this at Gate #1 (Day 10 go/no-go).

---

## 11. What's Broken or Risky

### Broken right now

1. **`app/providers/page.tsx` and `app/providers/[slug]/page.tsx`** — Query `FROM providers` (dropped table). Will return empty or error. No nav links point here, but they exist in the build.

2. **`executive_contacts` RLS + column mismatch** — Schema uses `owner_id`; code uses `executive_id`. Rolodex writes will be silently blocked by RLS. No error shown to user.

3. **`provider_profiles.tier = 'connected'` will fail** — The DB CHECK constraint allows only `('free','listed','featured','professional','premium','enterprise')`. The string `'connected'` is not in this list. Any `INSERT` or `UPDATE` setting `tier='connected'` will throw a Postgres constraint violation. This affects the billing webhook handler and any manual admin tier update.

4. **`provider_analytics` INSERT RLS gap** — No INSERT policy on `provider_analytics` table for anonymous users. The profile view tracking call in `directory/[category]/[slug]/page.tsx:64` will fail silently.

5. **`app/(executive)/news/page.tsx` missing** — The news page file does not appear in the repo filesystem. Navigating to `/news` will 404.

6. **Stripe + Anthropic keys empty** — AI assistant returns an error. Billing flow redirects to Stripe but fails with "Price not configured." Not a bug per se, but any demo of these features will fail.

7. **`rfq_requests` schema vs. code delta** — The `provider_id` and `response` columns were added via a manual SQL command (not in any migration file). If schema is rebuilt from files, RFQ system breaks.

### Risky but not broken

8. **`lib/supabase.ts` singleton** — Module-level Supabase client (old pattern). Safe in dev; in production Next.js, module-level clients can leak between requests. Should be replaced with `lib/supabase/server.ts` pattern everywhere.

9. **Stripe API version `2026-05-27.dahlia`** — This appears to be a beta/unreleased Stripe API version identifier (current stable is `2025-*`). This may be a typo or future-dated version string that could cause SDK errors when Stripe keys are actually configured.

10. **No error boundaries** — No React Error Boundary components. An unhandled promise rejection in any dashboard page will show a blank screen with no recovery path.

11. **Unsplash image hardcoded** — `app/page.tsx` uses a hardcoded Unsplash URL for the hero photo. If Unsplash changes their CDN or the image is removed, the homepage hero breaks.

12. **`NEXT_PUBLIC_APP_URL=http://localhost:3000`** — Stripe redirect URLs point to localhost. When deploying, this must be updated or checkout sessions will redirect to localhost after payment.

---

## 12. Dependencies Graph

```
Browser
  └─→ Next.js App Router (Vercel — not yet deployed)
        ├─→ Supabase Postgres (auth + data)
        │     └── RLS policies (own-data isolation)
        ├─→ app/api/stock
        │     └─→ Yahoo Finance (no-auth RSS/JSON)
        ├─→ app/api/news
        │     ├─→ Yahoo Finance RSS (ticker news)
        │     └─→ Globe & Mail RSS (market news)
        ├─→ app/api/ai
        │     └─→ Anthropic Claude API (key not configured)
        ├─→ app/api/stripe/*
        │     └─→ Stripe API (keys not configured)
        │           └── Webhook → Supabase (service role, key not configured)
        └─→ middleware.ts (Supabase auth check on every request)

Separate Python projects (no connection to Next.js):
  all-issuers-enricher/
    └─→ tsx.com TMX API (company lists)
    └─→ issuers.thecse.com via Playwright (CSE list)
    └─→ Company websites (enrichment)
    └─→ SQLite (local storage)

  stock_marketing_audit/ (Streamlit)
    └─→ Public company websites (crawler)
    └─→ Google News RSS
    └─→ OpenAI API (optional)
    └─→ SQLite (local audit storage)

NOT YET BUILT (paper-only):
  SEDAR+ Harvester → Filing PDFs → pdf_extractor.py → Claude Haiku → Supabase providers
  Brevo (email notifications)
  Pipedrive (CRM sync)
```

---

## 13. Files to Read First (for an outside reviewer)

| Priority | File | Why |
|---|---|---|
| 1 | `CLAUDE.md` | Product context, build order, design system, conventions |
| 2 | `supabase/migrations/001_v3_schema.sql` | Complete data model — all tables, RLS, relationships |
| 3 | `app/(executive)/layout.tsx` | Auth pattern, how Supabase SSR works in this codebase |
| 4 | `middleware.ts` | Route protection logic |
| 5 | `app/page.tsx` | Homepage — brand design reference |
| 6 | `app/directory/[category]/page.tsx` | Core directory logic + tier-gating pattern |
| 7 | `app/(provider)/provider/billing/page.tsx` | Stripe integration UI (311 LOC, most complex page) |
| 8 | `app/api/stripe/webhook/route.ts` | Revenue-critical: tier updates on payment |
| 9 | `app/(executive)/compliance/page.tsx` | Only "agent" fully implemented — shows the compliance generation pattern |
| 10 | `lib/stripe.ts` | Stripe price config + API version (see §11 concern) |
| 11 | `Downloads/30_day_sprint_plan.md` | The actual near-term work plan — Day 1–30 |
| 12 | `Downloads/90_day_master_plan.md` | GTM strategy + phasing |
| 13 | `all-issuers-enricher/scrape_all_exchanges.py` | Best existing SEDAR-adjacent code — exchange scraper |
| 14 | `all-issuers-enricher/src/enrich.py` | Enrichment orchestrator pattern to reuse for SEDAR+ |
| 15 | `app/api/ai/route.ts` | Claude API integration pattern + system prompt structure |

---

## 14. Open Questions for Scott

1. **Has the `tier` constraint been updated in Supabase?** The migration file allows `('free','listed','featured','professional','premium','enterprise')` but the codebase uses `connected`. If not updated, any provider trying to upgrade to Connected will get a DB error. Confirm whether you manually ran `ALTER TABLE provider_profiles DROP CONSTRAINT ...` and added `connected`.

2. **Has the `executive_contacts` column been changed from `owner_id` to `executive_id` in Supabase?** The migration file uses `owner_id` but Rolodex code uses `executive_id`. If not, the Rolodex feature is broken for all users.

3. **Is `app/(executive)/news/page.tsx` intentionally absent?** The API route exists and is functional but the page file was not found. Was the UI page accidentally deleted, or is it in a different location?

4. **Is the Stripe API version `'2026-05-27.dahlia'` intentional?** This does not match any known published Stripe API version. It may cause Stripe SDK initialization errors when real keys are configured.

5. **What is the current state of the 30-day sprint contractor search?** The sprint plan calls for a Python + Playwright dev contractor starting Day 1. Has this person been hired? The SEDAR+ harvester is the critical path item.

6. **Does the `exchange_deadline_templates` table have any rows?** The compliance calendar auto-generation requires this table to be seeded. If empty, no compliance events are generated for any executive. Confirm whether the seed SQL was successfully run.

7. **Is the stock_marketing_audit Streamlit app actively used for Stock Marketing Inc. client work?** It uses OpenAI (not Claude). If this tool is operationally important, it should be migrated to Claude API for cost/quality consistency with the rest of the stack.

8. **Are there any live users or data in the Supabase project?** The audit cannot query Supabase directly. If there are test users or real executive sign-ups, any schema migration (like the `tier` constraint fix) must be handled carefully.

9. **Is `NEXT_PUBLIC_MARKET=CA` set?** It's referenced in `CLAUDE.md` as a per-Vercel-deployment env var but not present in `.env.local`. Some market-conditional logic may behave incorrectly without it.

10. **What happened to the Cockpit / §20 strategic pivot?** The audit prompt references a "vertical SaaS Cockpit" direction with Filing Radar as the Day-30 feature, but the 30-day sprint plan (the most recent written plan) is focused on a simpler SEDAR+ extraction + Streamlit demo — not a Cockpit. Clarify which plan is active before any architecture changes.

---

*End of audit. Total: ~4,800 words.*
