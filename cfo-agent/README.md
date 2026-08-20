# CFO agent

A personal CFO for money spread across three sets of books, two countries, and two
currencies. It answers how much there is, where it went, what's due, and what needs
a decision — without requiring anyone to log into a bank website and export a CSV.

## Design premise

Leo already owned the infrastructure. **Tiller** (paid, connected to the US accounts)
and **QuickBooks** (paid, R Bridge) were both live; the Japanese books are closed
monthly by a real accountant. None of it was failing technically. It was failing
because every path to the data ran through a human remembering to open a spreadsheet
and click a button.

So this agent reads the rails that already exist, keeps them current without a human
in the loop, and consolidates three books into one view.

**Feed vs. book of record.** Tiller is the *feed* — it supplies raw US transactions and
knows nothing about entities, Japan, cash, or receipts. The master ledger sheet is the
*book of record* — it persists every judgment made about those transactions. That
judgment work is the expensive part, it must survive between runs, and it is what
makes reconciliation possible at all: you cannot answer "am I missing anything?"
without a prior state to diff against.

## Architecture

```
  Tiller API ──────┐                    ┌──> daily/weekly brief (artifact)
  (US txns, daily) │                    │
                   ├──> normalize ──────┤
  Gmail ───────────┤    entity tag      ├──> Tiller Sheet (master ledger)
  (receipts, JP,   │    categorize      │
   SaaS, cash)     │    FX convert      ├──> ASC package (Japan monthly)
                   │    dedupe          │
  Drive CSV ───────┤    reconcile       └──> QuickBooks reconciliation (R Bridge)
  (JP manual)      │
                   │
  ASC monthly ─────┘
  (JP authoritative)
```

Entity (`PERSONAL` / `RBRIDGE` / `SIDE3`) is a dimension on every row, not a separate
ledger — so "everything, one view" and "just the Japan company" are both a filter away.

## Skills

| Skill | Does |
|---|---|
| `cfo` | Persona, doctrine, entity model, routing. The entry point. |
| `cfo-ledger-sync` | Pull → normalize → classify → reconcile → write |
| `cfo-daily-brief` | The dashboard |
| `cfo-receipt-harvest` | Gmail → receipts → matched ledger rows |

## Apps Script

`apps-script/Ledger.gs` is the ledger's write endpoint: idempotent upserts keyed on
`txn_id`, per-account sync watermarks for incremental pulls, a `reconcile` action that
diffs the ledger against a source to surface missing / drifted / orphaned rows, and
preservation of any correction Leo makes by hand.

## Config

| File | Committed? | Contents |
|---|---|---|
| `config/categories.yml` | yes | Category taxonomy, mapped to QuickBooks + 勘定科目 |
| `config/accounts.example.yml` | yes | Placeholder template |
| `config/accounts.yml` | **no — gitignored** | Real accounts, entities, accountants |

**This repo is public.** Nothing real goes in it. See `SETUP.md` step 0.

## Honest limits

- **Japan has no automatic feed.** Not a missing integration — no aggregator sells
  Japanese bank coverage on self-serve terms. Moneytree LINK API Private is the only
  real path and requires a sales contract. `reference/japan-feed-options.md`.
- **MUFG notification emails contain no amounts.** They announce that a transfer
  happened. They are a prompt to look, not data.
- **The Drive connector cannot append rows to an existing Google Sheet.** This is why
  `apps-script/Ledger.gs` exists — it's the write path, not an optional extra. Without
  it deployed, the agent can read and categorize but hands you a CSV to paste.
- **Merrill and BofA Private Bank are statement-alert only.** No transaction feed
  without linking them to an aggregator.
- **Deductibility is suggested, never ruled.** That's the CPA's and Kim-san's call.

## Status

Scaffolding and write endpoint complete. Not yet live — blocked on `SETUP.md`
steps 1, 2, and 4 (connect the Tiller connector, fill in the account map, deploy the
Apps Script).

Verified 2026-08-20: Tiller connector is **not** connected. Six connectors are live
(Canva, Docusign, Gmail, Calendar, Drive, Notion); Tiller is not among them.
