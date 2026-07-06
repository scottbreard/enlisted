# Provider Claim Campaign — 3-Touch Sequence (Instantly)

Variables: `{{first_name}}`, `{{company_name}}`, `{{category}}`, `{{opener}}`, `{{spots_left}}`, `{{claim_url}}`

Senders rotate across hello@ / join@ / partners@getenlisted.ca, signed Scott Breard.
CASL: identifies sender, business address in signature, unsubscribe link (Instantly's), sent to published business contacts about their business role.

---

## Email 1 — the claim (day 0)

**Subject:** {{company_name}} is listed on Enlisted

{{opener}}

I'm building Enlisted — the directory where the executives of Canada's public
companies find their service providers. {{company_name}} is already listed
under {{category}}, alongside 700+ firms across TSX, TSXV, CSE, and NEO.

Your listing is live but unclaimed — right now it shows your name and city only.
Claiming it is free and takes two minutes:

{{claim_url}}

We open to executives September 1. The firms that claim early are the ones
they'll find first.

Scott Breard
Founder, Enlisted — enlisted.ca
Toronto, ON

---

## Email 2 — the scarcity (day 4, if no reply/claim)

**Subject:** Re: {{company_name}} is listed on Enlisted

Quick follow-up — one thing I didn't mention.

Each category on Enlisted has exactly five Featured spots: top placement,
your logo in our monthly executive newsletter, and exclusive access to RFQs
from verified executives. {{category}} has {{spots_left}} of 5 still open.

No pressure to go paid — the free claim alone gets your firm properly
represented before we open to executives September 1:

{{claim_url}}

Scott

---

## Email 3 — the close (day 10, if no reply/claim)

**Subject:** closing the loop

Last note from me — I know inboxes are busy.

If being in front of public-company executives isn't a priority for
{{company_name}} right now, no problem at all; your free listing stays either way.

If it is: {{claim_url}} takes two minutes, and I'm happy to walk you through
the Featured options on a quick call.

Either way, thanks for reading.

Scott
enlisted.ca

---

## Instantly settings
- Schedule: Tue–Thu, 9:00–16:00 ET, recipient-timezone off (all Canada)
- Daily cap: start 20/inbox, raise to 40 once health stays >95%
- Stop on reply: ON · Stop on click: OFF (claim click ≠ done — they may not finish)
- Track opens: OFF (improves deliverability, opens are noise anyway)
