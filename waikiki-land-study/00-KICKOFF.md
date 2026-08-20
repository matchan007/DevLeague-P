# KICKOFF — start a new chat from here

This file exists so a new conversation can pick up the Waikiki land project without
re-reading anything else. Paste the block at the bottom into a fresh chat.

---

## The original goal (unchanged)

Figure out **what Waikiki land is worth per square foot**, in order to price a specific
property — either what it's worth or what acquiring it would cost.

Deliverables asked for at the outset:

1. All land sales in Waikiki over the last 10 years, with square footage
2. Dollars per square foot of land
3. Who sold, who bought, and prior transactions going back ~5 years
4. Street address and position on a Waikiki map
5. Zoning for each
6. A report pulling it together, as a PDF, with the map

## Scope decisions already made — don't re-litigate these

| Decision | Choice |
|---|---|
| Boundary | Waikiki Special District (Ala Wai Canal / Kapahulu Ave / the ocean) |
| What counts as a comp | Land value extracted from all sales, including improved property |
| Format | Interactive HTML report + print-ready PDF |
| **Interest** | **FEE SIMPLE ONLY** — this narrowed during the first session. See `01-fee-simple.md` |

## Where it got to

Built and delivered:

- **Waikiki Land Basis Study** — https://claude.ai/code/artifact/60eebec0-8e6d-4275-b5dc-c64008a6f689
  10 years of transactions, interactive district map, comps table, $/sf analysis,
  zoning, buyer/seller analysis, valuation calculator, verification checklist.
- **The Ground Lease Split** — https://claude.ai/code/artifact/ca54d790-68c1-481a-9232-2e6e1030c7fc
  Companion note: fee simple vs leased fee vs leasehold, and a converter.

Source HTML is in `source/`, PDFs in `pdf/`. Republish by editing the HTML and calling
the Artifact tool with the same file path.

## The one thing that limited the whole study

Everything was compiled from **published transaction reporting**, not primary records.
The sandbox's network egress blocked the Honolulu assessor (RPAD), the Bureau of
Conveyances, and the HoLIS parcel/zoning GIS. So land areas and dates carry the
confidence of a news report, not a title search.

**This is the main thing to fix.** See the next section.

## The highest-value next action

Honolulu RPAD assesses every parcel at **100% of fair market value**, explicitly as the
**fee simple interest**, and publishes **land value separately from building value**.
That means the answer to the original question already exists, free, for every parcel
in Waikiki:

> Assessed Land Value ÷ Land Area = fee simple $/sf

Pull 15–20 Waikiki parcels from https://www.qpublic.net/hi/honolulu/search.html
(TMK, land area, assessed land value, zoning), paste them into the new chat, and the
study can be rebuilt on hard fee-simple data instead of inference.
Full method in `01-fee-simple.md`.

## Open question never answered

**The target property was never named.** A specific address or TMK converts this from a
market survey into a parcel-specific valuation. Volunteer it when ready — or don't, and
use the tiered $/sf table instead.

---

## Paste this into a new chat

```
I'm continuing a Waikiki land valuation project. Context is in
waikiki-land-study/ in this repo — read 00-KICKOFF.md, 01-fee-simple.md,
02-ground-lease.md and 03-transactions.md first.

Goal: dollars per square foot for FEE SIMPLE land in the Waikiki Special
District, so I can price a specific property.

Prior work produced a full report and a ground-lease companion note, both
built from published reporting rather than primary records. The next step
is to replace that with real assessor data.

[Then either:]
- Here are RPAD records for N parcels: <paste TMK / land area / assessed
  land value / zoning>. Build the fee simple $/sf analysis from these.
[or:]
- My target parcel is <address or TMK>. Price it against the comp set.
```
