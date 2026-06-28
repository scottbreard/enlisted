# Enlisted Inc. — Project Memory

## What Is Enlisted?

Enlisted Inc. is the global marketplace for public company services — an independent, AI-powered platform connecting the executives of publicly listed companies with every professional service provider they need.

**Supply side (free forever):** Public company executives — CEOs, CFOs, COOs, IROs, corporate secretaries of listed companies.
**Demand side (paid advertisers):** Service providers — IR firms, securities lawyers, auditors, market makers, transfer agents, and ~90 other professional service categories.

## Domains & Markets

| Domain | Market | Exchanges | Launch |
|--------|--------|-----------|--------|
| enlisted.ca | Canada | TSX, TSXV, CSE, NEO | Phase 1 — Q3 2026 |
| enlisted.au | Australia | ASX, NSX | Phase 2 — Q4 2026 |
| enlisted.co.uk | UK | LSE Main, AIM | Phase 3 — Q1 2027 |
| enlisted.us | USA | NYSE, Nasdaq, OTC | Phase 4 — Q3 2027 |

## Revenue Model — Provider Tiers (CAD)

| Tier | Annual | Monthly | Key Features |
|------|--------|---------|--------------|
| Free | $0 | $0 | Name, category, city only — no logo, website, or contact shown |
| Good | $1,000/yr | $100/mo | Full contact, logo, 300-word description, exchange badges, RFQ receive |
| Listed | $1,000/yr | $100/mo | Full contact, logo, 300-word description, exchange badges, RFQ receive |
| Featured | $10,000/yr | $1,000/mo | + Top placement, video, 12 email blasts/yr, AI Assistant, homepage feature |

Executives are always FREE.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database + Auth | Supabase (Postgres + RLS) |
| Billing | Stripe (multi-currency: CAD/GBP/AUD/USD) — placeholder |
| Email | Resend + React Email — placeholder |
| AI | Anthropic Claude API (claude-sonnet-4-6) — placeholder |
| Hosting | Vercel (4 deployments, one per market domain) |

## Build Order (current)

- [x] Environment setup
- [x] Next.js + TypeScript + Tailwind scaffolded
- [x] Supabase project connected
- [x] Full v3 database schema created (25+ tables)
- [x] Homepage with brand design
- [x] Auth: login, executive register, provider register pages
- [x] Middleware: route protection
- [x] CSS brand variables: navy, gold, blue, etc.
- [ ] Seed static data (markets, exchanges, 92 categories)
- [ ] Executive dashboard layout + widgets
- [ ] Public directory pages (/directory, /directory/[category], /directory/[category]/[slug])
- [ ] Provider profile editor (multi-step, tier-gated)
- [ ] Compliance calendar
- [ ] Provider vault
- [ ] RFQ system
- [ ] Stock dashboard
- [ ] AI assistant (Claude API)
- [ ] News feed
- [ ] Stripe billing
- [ ] Admin panel
- [ ] Mobile app (Expo) — later phase

## Database Schema (v3 — all tables exist in Supabase)

Core tables: markets, exchanges, service_categories
Executive side: executive_profiles, executive_exchanges, executive_watchlist, executive_vault, executive_contacts, compliance_events, rfq_requests, rfq_responses
Provider side: provider_profiles, provider_markets, provider_exchanges, provider_categories, provider_team, provider_locations, member_discounts, discount_claims, provider_analytics
Other: news_items, referrals, newsletter_subscribers, regulatory_alerts

## Design System

**Brand colors (CSS variables):**
- `--color-navy: #1B3A6B` — primary, headers, CTAs
- `--color-gold: #B8860B` — accent, badges, highlights
- `--color-blue: #2E75B6` — links, interactive
- `--color-blue-light: #D6E4F0` — light backgrounds
- `--color-gold-light: #FDF3DC` — callout backgrounds
- `--color-gray-dark: #222222` — body text
- `--color-gray: #555555` — secondary text
- `--color-gray-light: #888888` — placeholders
- `--color-border: #DDDDDD` — borders

**Typography:** Geist Sans (body) — Inter in later phase.

## Key Conventions
- All timestamps UTC
- Slugs: lowercase, hyphenated, URL-safe
- Default currency: CAD
- RLS on all Supabase tables
- API routes in `app/api/`
- Supabase clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server)
- Forms: react-hook-form + zod
- No Stripe/Resend/Anthropic wired yet — placeholders in .env.local
- `NEXT_PUBLIC_MARKET=CA` controls market context (set per Vercel deployment)

## Service Categories (92 across 15 groups)

Legal & Compliance, Finance & Accounting, Capital Markets & Trading, Corporate Administration, Investor Relations, Communications & Media, Digital & Technology, Executive & Board, Insurance & Risk, Specialized Finance, Printing/Design/Production, Education/Research/Governance, Data & Analytics, Sector-Specific Services, Events & Access
