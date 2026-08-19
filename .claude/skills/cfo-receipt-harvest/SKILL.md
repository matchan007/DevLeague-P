---
name: cfo-receipt-harvest
description: Find receipts, invoices, and payment confirmations in Leo's Gmail and turn them into ledger rows with amounts, vendors, and dates. Use when matching receipts to transactions, compiling an expense report or reimbursement package, assembling the monthly receipt file for the Japan accountant, or hunting for a specific charge's documentation. Also use to catch spending that never hits a US card feed — Japanese purchases, SaaS billed abroad, cash.
---

# Receipt harvest

Gmail is the only source that covers *everything* — the Japanese purchases with no
bank feed, the SaaS billed through Stripe, the reimbursables. It's also the messiest.
The job is extraction with a low false-positive rate, not maximal recall.

## What to search

Read sender patterns from `cfo-agent/config/accounts.yml` plus these generic shapes:

- Payment processors: `invoice+*@stripe.com`, `*@paypal.com`, `*@squareup.com`
- Vendor receipts: subject matching `receipt|invoice|payment|お支払い|領収書|ご利用明細`
- Card alerts carrying an amount (not all do)
- Travel: airlines, hotels, rideshare, rail

Scope every search with a date window. An unbounded receipt search returns
thousands of threads and burns the run for nothing.

## Extract

Per receipt: vendor, date, amount, currency, tax, last-4 if shown, order/invoice ID,
and the Gmail message link.

**Precision over recall.** A marketing email from a vendor is not a receipt. A price-
change notice is not a receipt. A "your statement is available" alert is not a
receipt — it announces a document, it doesn't contain the charge. If you can't find
an unambiguous amount and date, skip it rather than guess; a fabricated row is far
more expensive than a missed one, because it survives into a tax filing.

**Watch for these specifically:**
- *Refunds and credit notes* — negative amounts. Match them to the original charge.
- *Statement alerts* carry a statement balance, not a transaction. Never enter a
  statement balance as an expense. It's a summary of charges already in the ledger,
  and entering it double-counts the entire month.
- *Duplicate sends* — the same receipt delivered twice. Dedupe on
  (vendor, amount, date, invoice ID).
- *Japanese receipts* — amounts as `¥1,234` or `1,234円`, dates as `2026年7月21日`.
  Handle both. Keep JPY as the original currency.

## Match to the ledger

For each extracted receipt, find its transaction: same amount (±2% for tip/FX drift),
within 5 days, plausible account.

- **Matched** → attach `receipt_url` to the existing row. Don't create a new row.
- **Unmatched receipt** → likely spending with no feed (Japan, cash, a foreign card).
  Add it as a ledger row, `source: email`, `confidence: medium`.
- **Unmatched transaction** → a charge with no documentation. List these for the
  monthly close; they're what an auditor asks about.

Attaching a receipt to the wrong transaction is worse than leaving it unattached.
When two candidates match equally well, attach to neither and flag it.

## Output

For a reimbursement or accountant package, match the format already in use rather
than inventing one — a numbered table of date / vendor / purpose / amount, subtotals
by category, grand total at the bottom, and cash items with no receipt listed
explicitly as such rather than omitted.

Use the `xlsx` skill when the deliverable is a spreadsheet file.

Always report coverage honestly: `140 receipts, 132 matched, 8 without a
corresponding transaction`. A package that quietly drops the unmatched items looks
tidier and is worth less.
