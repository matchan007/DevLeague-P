# Setup — what only Leo can do

The agent can't authenticate as you. These are the steps that need you, in the
order that unblocks the most.

## 0. Move this to a private repo — do this first

`matchan007/DevLeague-P` is **public**. Right now nothing sensitive is committed —
`config/accounts.yml` is gitignored and only the placeholder template is checked in.
But a CFO agent belongs in a private repo, because the temptation to paste a real
balance into it will eventually win.

Create a private repo (e.g. `leo-cfo`), move `cfo-agent/` and `.claude/skills/cfo*`
into it, and delete them from here.

## 1. Connect the Tiller MCP connector — highest leverage

You already pay for Tiller and it's already linked to your US accounts. The connector
lets the agent read those transactions **directly from Tiller's servers**, which means
it no longer matters whether the Google Sheet has been refreshed.

This is the fix for the actual problem. Tiller has emailed you "your spreadsheet might
be missing transactions" on Feb 16, Apr 2, May 17, Jul 1, and Aug 15 — the feed works,
but it required you to open a sheet and click Fill, and that's the step that didn't
survive contact with a busy year.

- claude.ai → Settings → Connectors → add **Tiller**
- Authorize with the same Google account that owns the Tiller sheets
- Then in this chat, enable the Tiller connector

Also worth doing while you're in there: check whether Tiller's automatic daily refresh
is enabled on the sheet, and confirm every account you care about is still linked —
bank connections silently expire and re-auth is manual.

Note: Tiller's price moves to $99/yr effective Aug 1, 2026. Still cheap for what it does.

## 2. Fill in the account map

```
cp cfo-agent/config/accounts.example.yml cfo-agent/config/accounts.yml
```

Fill in real values. Last-4 only, never full account numbers. It's gitignored.

The agent can draft this for you from your email — it already identified the
institutions. But you need to confirm which entity each account belongs to, because
that's the classification that matters most and the one email can't reliably tell us.

The specific thing to get right: which cards are **R Bridge** and which are personal.
Business cards used for personal spending (and vice versa) are the main source of
cleanup work at tax time.

## 3. Decide what Merrill / BofA Private Bank participate in

Merrill Edge and the BofA Private Bank trust send statement-available alerts with no
figures. Options: link them to Tiller if supported, drop statement PDFs into a Drive
folder monthly, or exclude them from the ledger and track them as investment balances
only. Reasonable to exclude — they're not spending accounts.

## 4. Deploy the Apps Script write endpoint — not optional

This is what makes the ledger reconcile. The Drive connector can create files but
cannot append rows to an existing Sheet, so without this endpoint the agent can read
and categorize but has to hand you a CSV to paste — and a paste step is the same
failure mode that killed the Tiller sheet.

`cfo-agent/apps-script/Ledger.gs` gives you:

- **Idempotent upserts** keyed on `txn_id` — re-syncing an overlapping window updates
  rows instead of duplicating them
- **Sync watermarks** per account, so each run pulls only what's new (the first run
  backfills; after that it's about a week of transactions at a time)
- **A `reconcile` action** that diffs the ledger against the source and reports what's
  missing, what drifted, and what's orphaned — the direct answer to "am I missing
  anything"
- **Protection for your hand edits** — if you fix an entity or category in the sheet,
  the next sync won't revert it

Setup instructions are in the file header. About 30 minutes, once:
create the master ledger sheet → Extensions → Apps Script → paste → set a
`SHARED_SECRET` script property → run `setupSheets()` → deploy as a Web App → put the
`/exec` URL and secret into `config/accounts.yml` (gitignored).

## 5. Japan — the Moneytree conversation

See `reference/japan-feed-options.md`. Contacting Moneytree about **LINK API Private**
as サイドスリー株式会社 is the only route to an automatic Japanese feed. Sales-gated,
pricing not public. Until then: monthly CSV export is the pragmatic fallback.

## 6. Cadence

Decide before any recurring job is created:
- Daily *needs-a-decision* alerts (usually empty — that's the point)
- Weekly spend summary
- Monthly close package

Don't turn on a daily notification you'll mute. A muted brief is a dead system.
