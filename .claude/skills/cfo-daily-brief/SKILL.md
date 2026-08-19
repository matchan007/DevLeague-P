---
name: cfo-daily-brief
description: Leo's money dashboard — cash position, recent spend, what's due, and what needs a decision, rendered as a styled artifact. Use when he asks for his financial dashboard, money brief, "where do I stand", a spending summary for a period, or to set up a recurring CFO check-in. Distinct from the `morning` skill, which covers calendar and mail rather than money.
---

# CFO brief

A dashboard he'll actually read. That means: answers at the top, detail below,
and nothing padded to fill space.

## Before rendering

Check ledger freshness. If the last sync is >24h old, run `cfo-ledger-sync`
first — a dashboard of stale numbers is actively harmful, because it looks current.

If a feed is broken (Tiller not connected, Japan has no data this month), the
dashboard says so **on its face**. Never render a clean-looking dashboard over a
broken feed; he'll trust it and he shouldn't.

## What goes in it

**1. Needs a decision** — top, and omitted entirely when empty.
Payments due in the next 7 days. Unassigned transactions above a threshold.
Balance discrepancies. A card approaching its limit. Feed breakage.
When there's nothing: one line, "Nothing needs you today." Then move on.

**2. Cash position**
Per account and total, with as-of dates. Separate USD and JPY totals *and* show
a consolidated USD figure with the rate used. Do not blend currencies into one
number without showing the rate — it hides FX movement as if it were spending.

Where a balance is unavailable (brokerage, trust, JP accounts), show it as
unavailable with the reason. An account silently missing from a net-worth total
is a lie of omission.

**3. Spend**
Current month to date vs the same point last month. By entity, then by category.
Transfers excluded — state that they are.

Call out what actually moved: "Dining is up $340 on last month, driven by one
$1,215 dinner at Orchids" beats a category table he has to read differences out of.

**4. Upcoming**
Known recurring charges and statement due dates in the next 30 days, from the
statement-day fields in `accounts.yml` and from recurring-merchant detection.

**5. Japan**
Its own section, because its data is a different shape. Latest ASC monthly figures
with their as-of date, and an explicit note on how stale the underlying data is.
Never present a monthly-granularity Japan figure adjacent to daily US figures
without labeling the difference.

## Rendering

Publish as an artifact. Load `artifact-design` first, and `dataviz` before writing
any chart code — the palette and chart-form rules there apply.

Design notes specific to this brief:
- Money is a scanning task. Big numbers, generous whitespace, one accent color for
  "needs attention" and nothing else competing for that role.
- Never use red/green alone to carry meaning — label the direction in text too.
- Currency always with its symbol and, where ambiguous, its code: `¥1,940,000 (JPY)`.
- Round for display, never for computation. Show `$4,231` not `$4,231.47`, but
  compute on the cents.
- Keep the same title and favicon across redeploys so it stays one evolving page,
  not a new tab every day.

## Cadence

He floated "maybe daily." Recommend a split rather than one frequency for everything:

- **Daily** is right for *needs-a-decision* items only, and most days that's empty.
  A daily brief that's usually empty trains him to trust it when it isn't.
- **Weekly** is the right rhythm for spend trends. Daily spend noise is not signal.
- **Monthly** for the close and the accountant packages.

Set up with the `loop` skill or a scheduled routine. Ask which he wants before
creating a recurring job — a daily notification he didn't agree to is a daily
annoyance he'll mute, and then the whole system is dead.
