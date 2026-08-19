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

So this agent is not another ledger. It's the layer that reads the rails that already
exist, keeps them current without a human in the loop, and consolidates three books
into one view.

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
- **The Drive connector cannot append rows to an existing Google Sheet.** Categorizing
  existing Tiller rows works today via the Tiller connector; adding non-Tiller rows
  needs the optional Apps Script endpoint, or a paste step.
- **Merrill and BofA Private Bank are statement-alert only.** No transaction feed
  without linking them to an aggregator.
- **Deductibility is suggested, never ruled.** That's the CPA's and Kim-san's call.

## Status

Scaffolding complete. Not yet live — blocked on `SETUP.md` steps 1 and 2 (connect the
Tiller connector, fill in the account map).
