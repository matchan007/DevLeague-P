# Getting Japanese transactions automatically

Researched 2026-08-19. The short version: **there is no self-serve path.** Every
automated option requires a signed B2B contract. This document exists so the
question doesn't get re-litigated from scratch every few months.

## Why the obvious approaches fail

**Plaid / Tiller / Yodlee** — do not cover Japanese retail banks. Tiller's feed
handles the US accounts and nothing in Japan. This isn't a configuration gap; the
aggregators have no Japanese bank coverage to sell.

**Bank notification emails** — MUFG's 三菱UFJダイレクト sends 振込受付のお知らせ
("a transfer was accepted") with a reference number and **no amount**. It tells you
something happened, not what. Parsing these produces a timeline of events with no
financial content. They are useful as a *prompt to go look*, and nothing more.

**Screen scraping** — community projects drive MoneyForward with Selenium. Brittle,
breaks on every UI change, and runs against the terms of service. Not a foundation
for books that feed a tax filing.

## The one real option: Moneytree LINK

Moneytree aggregates 2,300+ Japanese financial institutions — MUFG and Rakuten among
them — and does AI transaction categorization at a claimed >90% accuracy. It is the
infrastructure several Japanese megabanks build their own PFM on.

**Access model:** `client_id` and `client_secret` are issued by Moneytree, not
self-serve. You contact their sales/customer-success team, and they register your
OAuth redirect URI. There is no personal or free developer tier.

**The relevant product is `LINK API Private`** — packaged specifically for SMEs that
want to pull their *own* bank data into their *own* systems, for reconciliation and
bookkeeping automation. That is exactly this use case, and サイドスリー株式会社 is
exactly the customer profile. Launched 2021-03-17.

**Pricing:** not public. Requires a conversation.

### Next step, if pursued

Contact Moneytree as the company, not as an individual:

- `marketing@moneytree.jp`, or their "API仕様書の申し込み" (API documentation request) form
- Frame it as: サイドスリー株式会社 wants LINK API Private to pull its own MUFG and
  Rakuten accounts into an internal bookkeeping system
- Ask specifically: pricing for a single-company deployment, MUFG + Rakuten coverage
  confirmation, minimum contract term

This is a Leo action, not an agent action — it needs a company representative.

## Until then

Ranked by value per minute of Leo's time:

1. **Monthly CSV export.** MUFG and Rakuten both export CSV. Drop into the configured
   Drive folder; the agent normalizes into the ledger. ~5 minutes a month for real
   transaction-level Japan detail. This is the pragmatic answer.
2. **Ride on ASC's monthly close.** Kim-san already produces authoritative 売上/経費
   monthly. Ingest those as summary rows. Zero extra effort, but monthly granularity
   and roughly a month behind.
3. **Receipt harvest from Gmail.** Catches Japanese card and cash spending that
   generates an email receipt. Partial coverage, but it's continuous and free, and
   it's the same machinery that kills the manual receipt-compilation chore.

Options 2 and 3 compose well: ASC gives the authoritative totals, receipts give the
detail underneath them, and the difference between the two is a useful audit signal.

## Sources

- [Moneytree LINK API — getting started](https://docs.link.getmoneytree.com/docs/getting-started)
- [LINK API Private](https://getmoneytree.com/jp/link/link-api-private)
- [LINK API Private press release](https://getmoneytree.com/press-release-jp/link-api-private)
- [Institutions supported by Moneytree](https://institutions.moneytree.jp/en)
- [MoneyForward ME — CSV download support](https://support.me.moneyforward.com/hc/ja/articles/900004382483)
