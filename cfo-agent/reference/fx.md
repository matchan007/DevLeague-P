# Currency handling

Leo's money spans USD and JPY, with occasional third currencies from travel. FX
handled carelessly produces numbers that look like spending changes but are exchange-
rate noise. These rules exist to keep those two things separable.

## Rules

**1. Never overwrite an original amount.** Every row keeps `amount` + `currency` as
transacted. `amount_usd` is an additional column, never a replacement. His accountants
need the original; a converted-in-place ledger cannot be reconciled against a bank
statement.

**2. Record the rate and its date.** `fx_rate` and `fx_date` on every converted row.
Without them the USD column is unreproducible, and a number nobody can reproduce is a
number nobody should rely on.

**3. Use the transaction-date rate for transactions.** Not today's rate. A ¥100,000
expense in January is not the same USD amount as ¥100,000 today, and restating history
at current rates makes past months silently drift every time you re-render a report.

**4. Use a period-end or period-average rate for balances and summaries** — consistently,
and state which. Mixing conventions within one report is how a reconciliation goes
wrong in a way nobody can find.

**5. Card FX is not the market rate.** When a card statement shows both the original
foreign amount and the settled USD amount, use the settled amount — that's the real
cost, inclusive of the issuer's spread. The gap between market rate and settled amount
is a bank fee; categorize it as `BankFees` when it's separately itemized.

**6. Flag material FX movement in reports.** When Japan spending looks up or down in
USD terms, decompose it: how much is actual spending change, how much is the rate?
Reporting a 12% JPY-spend increase that is entirely a rate move is a false alarm.

## Practical notes

- JPY has no minor units. Don't display `¥1,234.00`; display `¥1,234`.
- Japanese receipts write amounts as `¥1,234` or `1,234円`, and dates as
  `2026年7月21日`. Parse both.
- The legacy expense reports used a fixed conversion for trips (e.g. a flat DOP rate
  for the Dominican Republic retreat). That's acceptable for a single trip's
  reimbursement package if the rate is stated on the report. It is not acceptable for
  the ongoing ledger.
- Consolidated net-worth figures must show the rate used. `$X at ¥Y/USD` — otherwise
  the total moves for reasons he can't see.
