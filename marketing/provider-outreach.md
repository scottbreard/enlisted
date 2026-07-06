# Provider Outreach Playbook — one voice, two campaigns

Canonical source for all provider email. Supersedes `provider-outreach-emails.md`
and `scripts/outreach/sequence.md` (removed).

**Campaign A — Warm soft launch (July 20):** hand-picked known firms, sent
personally in small batches. Longer, argument-driven emails.
**Campaign B — Cold claim campaign (~July 27):** the ~248 scraped contacts with
direct emails, sent via Instantly. Short, personalized, claim-focused.

Same voice, same facts, same offer — different lengths for different trust levels.

---

## Fact sheet (verify against DB before every send)

| Claim | Value | Source |
|---|---|---|
| Firms in directory | **700+** | `provider_profiles` (733 as of Jul 6) |
| Exec/director outreach database | **13,000+** | `executive_prospects` (12,675+) |
| Direct exec emails held | **~5,000** | prospects with email (4,912) |
| Categories | **90+** | `service_categories` (94) |
| Featured cap | **5 per category** | enforced in checkout |
| RFQs | **Featured-only** | enforced in API |
| Listed | **$1,200/yr** (≈$100/mo framing OK) | annual-only |
| Featured | **$6,000/yr** | annual-only |
| Executive launch / billing anchor | **September 1, 2026** | all annual terms anchor Sept 1 |

## Voice rules (both campaigns)

- **Answer the exec-count question before it's asked.** "Executives onboard Sept 1
  by design + we're inviting a known audience of 13,000+" is strategy, not evasion.
- **Sell the retention loop, not traffic** — compliance calendar, contract-renewal
  vault, stock dashboard, RFQs. Recurring reasons to log in.
- **Offer the real number, always** — "reply and we'll tell you exactly how
  registration is tracking."
- **Never invent or inflate figures.** Only the fact-sheet claims.
- **Scarcity only where real:** 5 Featured spots per category; the Sept 1 date.
- Signed **Scott Breard, Founder** on every email. No exclamation marks.

## Merge fields (both campaigns — match `scripts/outreach/generate-campaign.mjs`)

`{{first_name}}` · `{{company_name}}` · `{{category}}` · `{{claim_url}}` ·
`{{opener}}` (Claude-drafted, Campaign B) · `{{spots_left}}` (Featured spots open)

---

# Campaign A — Warm soft launch (July 20, known firms)

Send personally (small batches from getenlisted.ca inboxes), 3 touches.

## A1 — The invitation (July 20)

**Subject:** {{company_name}} is already in the Enlisted directory

Hi {{first_name}},

Enlisted.ca is the new marketplace where the executives of Canadian public
companies — TSX, TSXV, CSE, and NEO — find every professional service they need.
Think of it as the directory the public markets never had.

We've pre-built listings for the firms we believe belong at launch, and
**{{company_name}} is one of them** — listed under {{category}}.

Your listing is live in basic form (name, category, city). Claiming it takes two
minutes and is free:

**→ Claim your listing: {{claim_url}}**

Two things worth knowing before executives start arriving on **September 1**:

- **The audience is verified.** Only officers and directors of listed companies can
  register — every registration is checked against exchange records.
- **The audience is known.** Our launch outreach covers 13,000+ executives and
  directors across all four exchanges — we're not hoping an audience shows up;
  we're inviting a list we already have.

Providers who complete their profile before September 1 are in the directory the
day the first executive logs in.

Scott Breard
Founder, Enlisted — enlisted.ca
Toronto, ON

## A2 — The honest answer (~5 days later, non-claimers)

**Subject:** Honest answer: how many executives are on Enlisted?

Hi {{first_name}},

When we invite firms to Enlisted, the first question is always the same: *"How
many executives are actually registered?"* Fair question — here's the honest answer.

**Executives onboard starting September 1 — and that's deliberate.** A marketplace
dies when the buyer shows up before the sellers. The first CFO who logs in needs to
find every service she'll ever need already there. So we're filling the directory
first: 700+ firms are already listed, and yours can be one of them.

**The audience isn't hypothetical.** Our launch database covers 13,000+ executives
and directors across every TSX, TSXV, CSE, and NEO issuer, and we contact them
directly — starting with the ~5,000 we hold direct email addresses for. Membership
is free for them, forever.

**And they don't visit once.** Enlisted gives executives a working dashboard they
return to: a compliance calendar auto-built from their exchange's filing deadlines,
a live stock dashboard and news feed for their own ticker, a contract vault with
renewal reminders — and when a renewal comes up, they're shopping in your category.

We'll share real registration numbers with any provider who asks, any time. Just
reply to this email.

**→ Claim your free listing: {{claim_url}}**

Scott

## A3 — Founding urgency (mid-August, non-payers)

**Subject:** The directory executives see on Sept 1 is being locked in now

Hi {{first_name}},

Two weeks until executives start arriving on Enlisted. What they'll see on day one
is being decided now:

- **Free listings** show a name, category, and city — executives can see you exist,
  but they can't reach you.
- **Listed firms** ($1,200/yr) show everything: logo, website, full contact details,
  description, and exchange badges — about the cost of one conference lunch a month.
- **Featured firms** ($6,000/yr) own the top of their category, appear in the
  monthly newsletter sent to every verified executive, and are the only firms that
  receive RFQs. **Featured is capped at five firms per category** — {{category}}
  has {{spots_left}} of 5 still open, and when it fills, it's closed.

The firms that upgrade before September 1 are the ones executives see first, on the
day the audience arrives — and every day after.

**→ Upgrade your listing: https://enlisted.ca/pricing**

On the fence? Reply and ask how executive registration is tracking — we'll tell you
the real number.

Scott

---

# Campaign B — Cold claim campaign (~July 27, Instantly, scraped contacts)

3 touches, short. `{{opener}}` is the Claude-drafted per-firm first line from
`generate-campaign.mjs`.

## B1 — The claim (day 0)

**Subject:** {{company_name}} is listed on Enlisted

{{opener}}

I'm building Enlisted — the directory where the executives of Canada's public
companies find their service providers. {{company_name}} is already listed under
{{category}}, alongside 700+ firms across TSX, TSXV, CSE, and NEO.

Your listing is live but unclaimed — right now it shows your name and city only.
Claiming it is free and takes two minutes:

{{claim_url}}

We open to a verified audience of executives on September 1 — our launch outreach
covers 13,000+ officers and directors. The firms that claim early are the ones
they'll find first.

Scott Breard
Founder, Enlisted — enlisted.ca
Toronto, ON

## B2 — The scarcity (day 4, no reply/claim)

**Subject:** Re: {{company_name}} is listed on Enlisted

Quick follow-up — one thing I didn't mention.

Each category on Enlisted has exactly five Featured spots: top placement, your
logo in the monthly newsletter sent to every verified executive, and exclusive
access to RFQs. {{category}} has {{spots_left}} of 5 still open.

No pressure to go paid — the free claim alone gets {{company_name}} properly
represented before executives arrive September 1:

{{claim_url}}

And if you're wondering how executive registration is tracking, just reply — we
share the real number with any firm that asks.

Scott

## B3 — The close (day 10, no reply/claim)

**Subject:** closing the loop

Last note from me — I know inboxes are busy.

If being in front of public-company executives isn't a priority for
{{company_name}} right now, no problem; your free listing stays either way.

If it is: {{claim_url}} takes two minutes, and I'm happy to walk you through the
Featured options on a quick call.

Either way, thanks for reading.

Scott
enlisted.ca

## Instantly settings (Campaign B)

- Senders rotate hello@ / join@ / partners@getenlisted.ca
- Schedule: Tue–Thu, 9:00–16:00 ET
- Daily cap: start 20/inbox, raise to 40 once health stays >95%
- Stop on reply: ON · Stop on click: OFF · Track opens: OFF
- CASL: sender identified, business address in signature, unsubscribe link on,
  recipients are published business contacts addressed about their business role
