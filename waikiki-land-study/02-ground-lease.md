# MEMORY — Ground leases: leased fee and leasehold

**Kept deliberately separate from the fee simple work.** The project's goal is fee
simple land value (`01-fee-simple.md`). This file is background — needed because almost
every Waikiki land transaction is a ground-lease transaction, so the comps cannot be
read correctly without it.

Companion artifact: **The Ground Lease Split** —
https://claude.ai/code/artifact/ca54d790-68c1-481a-9232-2e6e1030c7fc
(source: `source/ground-lease-split.html`, PDF: `pdf/Ground-Lease-Split.pdf`)

---

## The three words

A ground lease does not transfer land. It **splits** ownership into two separately-owned,
separately-traded assets:

| Interest | Who holds it | What they own |
|---|---|---|
| **Fee simple** (unencumbered) | one owner | everything, forever, free and clear |
| **Leased fee** | the landowner | ground rent for the remaining term + the reversion (getting the land back). An income asset — cannot build or occupy |
| **Leasehold** | the tenant | right to occupy and build for a finite term; usually owns the building; pays the ground rent; owns nothing at term end |

**leased fee + leasehold ≈ the unencumbered fee simple**

Clearest illustration in the dataset — ʻAlohilani Resort, 2490 Kalakaua Ave:
- Commerz Real bought a **majority of the leasehold** for ~$515M, around 2017
- Safehold bought the **leased fee** for $195M, Sept 2019

Same resort, two buyers, two years apart. Land was ~27% of the combined capital stack.

## The bridge between rent and land value

In Hawaii ground-rent renegotiation arbitrations, appraisers have for more than two
decades applied the same annual return to derive fair market ground rent:

```
market ground rent  =  land value × 8%
land value          =  market ground rent ÷ 8%
```

A convention of practice, not law, and contested — but it is what has been used.

**HRS §519-1 catch:** where a lease provides for renegotiation at fair market value,
that value is computed on **the use the lease restricts the land to**, not its highest
and best use. A lease limiting a site to apartment use caps the rent even where hotel
use would be worth far more.

**Resets are violent.** Waikiki ground leases typically renegotiate every 10–15 years.
One Waikiki hotel ground rent went from ~$187,000/yr to over $3.5M in a single
arbitration.

## Why leased fee ≠ fee simple

One measurable reason: the gap between the rent the lease actually pays and the rent the
land could command — and **only until the next reset**, because after that the landowner
is made whole.

```
leased fee  =  fee simple − PV(market rent − contract rent), until the next reset

fee simple  =  leased-fee price ÷ (1 − discount)
```

Three consequences:

- **Contract rent at market** → leased fee ≈ fee simple. The leased-fee price is a fair
  read on land value.
- **Contract rent below market** → leased fee is worth less, and *how long until the
  reset* matters far more than the size of the gap.
- **Short remaining term** → leased fee can *exceed* today's land value, because the
  landowner gets the land back soon and usually the building with it.

The companion artifact has a working converter: pick a comp, set the rent gap and years
to reset, read the fee simple equivalent. It **opens at 0% below market** (returning the
price unchanged) because that is the honest position before reading the lease.

## What interest each comp actually conveyed

| Comp | Interest | Note |
|---|---|---|
| BOH Waikiki Center, $2,000/sf | **Leased fee → merged to FEE SIMPLE** | lessee bought its own fee; lease extinguished. Closest thing to a fee simple comp |
| Hilton Waikiki Beach, $1,410/sf | Leased fee | third-party sale; lease terms not published. Usable once the lease is read |
| Royal Hawaiian, $1,137/sf | Leased fee | under Kyo-ya's continuing long-term ground lease. Size discount dominates this number |
| ʻAlohilani, $1,791/sf | Leased fee | **least useful.** See below |
| Hyatt Regency, Aston Waikiki Beach, Polynesian Plaza, Queen Kapiolani | Leasehold | **no land conveyed.** Dividing these prices by land area produces a meaningless number |

### Why ʻAlohilani is the least useful comp

Safehold did not simply buy the ground — it **replaced the lease at closing** with its
own standard 99-year form: contractual base rent escalating on a schedule, 8–9 CPI
lookbacks over the term, adjustments capped around **3.0–3.5% compounded**, and
**no fair-market resets**.

That makes $1,791/sf the price of a **bond-like income stream underwritten to a
ground-lease REIT's yield target**, not a developer's view of Waikiki dirt.

## The structural picture

**Sell side:** Hawaiian trusts monetising legacy ground positions. Kamehameha Schools
(Royal Hawaiian ground, $510M, Nov 2025) and Queen Liliʻuokalani Trust (ʻAlohilani $195M
and Hilton Waikiki Beach $78M, both 2019) account for $783M of the $850M in primary
comps. Liliʻuokalani Trust has said its remaining Waikiki position — 4+ acres under the
Waikiki Beach Marriott — is not for sale.

**Buy side:** cross-Pacific institutional capital and ground-lease specialists. Daisho
(Tokyo), Shoei (Japan), Safehold/iStar, Mirae Asset (Seoul), Commerz Real (Germany),
Financial Products Group (Japan).

**Negotiating read:** any seller here is a trust with a fiduciary mandate or a family
partnership holding a legacy position. Neither is distressed. More leased-fee product is
likely to come to market.
