---
name: cfo-ledger-sync
description: Pull new transactions into Leo's CFO ledger from Tiller, normalize them, assign entity and category, and write the result back. Use when asked to sync, refresh, update, or catch up the ledger, when the ledger is stale before answering a money question, or as the first step of a monthly close. Do NOT use to answer a single quick question that one email lookup covers.
---

# Ledger sync

Pull → normalize → classify → reconcile → write. Each stage has a failure mode
that silently corrupts the ledger. The checks below exist because of that; don't
skip them to save a step.

## 1. Pull

**US (primary).** Read from the Tiller MCP connector (`query_transactions`), not
from the Google Sheet. This matters: Tiller's servers hold transactions whether or
not the sheet has been refreshed, and Leo's sheet has historically gone months
without a refresh. Reading the sheet reads a snapshot of neglect; reading the API
reads the truth.

If the Tiller connector isn't available, say so and stop — don't fall back to
scraping the stale sheet and present it as current. See `cfo-agent/SETUP.md`.

**Pull incrementally.** Ask the ledger for its watermarks first (`syncState`), then
fetch only what's newer, with **3 days of overlap**. Pending transactions change their
amount and date when they post; the overlap catches that revision, and the upsert
dedupes it.

This is the whole reason the ledger persists. A first run backfills history and is
genuinely large; every run after it handles roughly a week of transactions. Without
stored state every run is a full re-pull and a full re-classification — expensive,
slow, and inconsistent, because the same ambiguous transaction won't get classified
the same way twice.

**Japan.** No automatic feed. Take whatever's available:
- A CSV dropped in the configured Drive folder → parse it.
- ASC's monthly figures → record as monthly summary rows, entity `SIDE3`,
  clearly marked `granularity: monthly`.
- Nothing available → report the gap. Do not interpolate.

## 2. Normalize

Every row, regardless of source, becomes:

| Field | Notes |
|---|---|
| `txn_id` | Stable source ID. Synthesize as `sha1(date|amount|account|raw_desc)` if absent. |
| `date` | ISO. Posted date, not authorized date. |
| `entity` | `PERSONAL` / `RBRIDGE` / `SIDE3` / `UNASSIGNED` |
| `account_id` | From `config/accounts.yml` |
| `raw_description` | Untouched. Never overwrite — it's the audit trail. |
| `merchant` | Cleaned. `SQ *TIKIS GRILL 8080` → `Tiki's Grill & Bar` |
| `category` | From `config/categories.yml` |
| `amount` | Original currency, signed: negative = money out |
| `currency` | ISO 4217 |
| `amount_usd` | Converted |
| `fx_rate`, `fx_date` | The rate used and its date |
| `business` | true / false / unknown |
| `deductible` | `likely` / `unlikely` / `ask-accountant` |
| `project` | e.g. a cohort, event, or client engagement |
| `receipt_url` | Set by `cfo-receipt-harvest` |
| `source` | `tiller` / `email` / `csv` / `asc` / `manual` |
| `confidence` | `high` / `medium` / `low` — on the *classification*, not the amount |

Keep the original amount intact. Add USD alongside; never in place.

## 3. Classify

**Entity first, category second.** Entity is the expensive thing to get wrong.

Assign entity by, in order of authority:
1. The account it hit (a business card → that business), from `accounts.yml`.
2. An explicit project/event tag.
3. A learned merchant rule.

If none apply → `UNASSIGNED`. Do not infer entity from the category; "this looks
like a business meal" is not evidence about which entity paid.

Then category, from `config/categories.yml`. Mark `confidence: low` on anything
you pattern-matched loosely, and surface low-confidence rows for review rather
than burying them.

**Transfers.** Detect and mark before anything else totals:
- A debit and credit of equal magnitude within ±3 days across two known accounts.
- Card payments (payment to an account in `accounts.yml`).
- Wise / cross-border movements between his own accounts.

Mark both legs `Transfer`. Untagged transfers double-count and inflate every spend
number downstream — this is the most common way a finance dashboard lies.

## 4. Reconcile before writing

Do not write until these pass:

- **Dedupe.** Same `txn_id` → skip. No ID → match on
  (date ±3d, exact amount, same account). A re-pulled pending-then-posted
  transaction must update the existing row, not append a second one.
- **Balance check.** Where the source gives an account balance, confirm
  `prior_balance + sum(transactions) == current_balance`. A mismatch means missing
  transactions. Report the delta; don't quietly absorb it.
- **Sign sanity.** Expenses negative, income positive. A positive "expense" is
  usually a refund — categorize it as such, don't flip the sign.
- **Date sanity.** Nothing in the future, nothing before the account opened.

Report what failed. A sync that silently swallowed a $3,000 discrepancy is worse
than one that stopped and said so.

## 5. Write

**The ledger sheet is the book of record. Tiller is only the feed.**

Keep these straight, because conflating them is what makes a ledger lose data:

- **Tiller** supplies raw US transactions. It knows nothing about entities, Japan,
  cash, receipts, or which meal was business.
- **The master ledger sheet** persists every judgment made about those transactions.
  That judgment work — entity assignment, categorization, transfer detection, receipt
  matching — is the expensive part, and it is the part that must survive between runs.

Write via the Apps Script endpoint (`cfo-agent/apps-script/Ledger.gs`), using
`action: "upsert"`. Upserts are keyed on `txn_id` and idempotent, so re-syncing an
overlapping window updates rows in place instead of duplicating them.

**Human edits win.** If Leo corrected an entity or category directly in the sheet,
the endpoint preserves his value over a recomputed one (`respectHumanEdits`, on by
default). A sync that silently reverts his corrections destroys his trust in the
ledger faster than any bug, and he will stop using it.

Then record the watermark: `setSyncState` per account. That watermark is what makes
the next run cheap.

If the endpoint isn't deployed yet, say so and emit a dated CSV to the Drive folder
instead — and state plainly that the paste step is manual. Never report a write that
didn't happen.

## 6. Report

Short. What came in, what needs him:

```
Synced 47 transactions (Aug 12–19).
  PERSONAL 31 · RBRIDGE 14 · UNASSIGNED 2

Needs you:
  · 2 unassigned — $1,840 Enterprise, $312 Costco (business or personal?)
  · BOH checking balance off by $47.20 — likely a missing transaction

Japan: no new data since Jul 31 (ASC monthly). Feed still manual.
```
