# Context for the Waikiki land study

Read `00-KICKOFF.md` before doing anything in this folder. `01-fee-simple.md`,
`02-ground-lease.md` and `03-transactions.md` carry the substance.

## What this project is

Establishing **dollars per square foot of land** in the Waikiki Special District so the
user can price a specific property — worth, or cost to acquire. The target parcel has
not been named.

## Standing decisions — don't re-open these

- Boundary: **Waikiki Special District** (Ala Wai Canal / Kapahulu Ave / the ocean)
- Comps: land value extracted from **all sales including improved property** — Waikiki
  has effectively no vacant land
- Interest: **FEE SIMPLE is the goal.** Leased fee and leasehold are background only
- Format: interactive HTML artifact + print-ready PDF

## Working rules for this project

- **Mark provenance on every figure.** The dataset is news-sourced, not title-searched.
  Do not present it as verified. Confidence ratings are in `03-transactions.md`.
- **Never divide a leasehold price by land area** — it is not a land value.
- **"Fee simple only" is a conversion, not a filter.** Screening to unencumbered fee
  sales leaves zero comps; the leased-fee comps must be adjusted instead, transparently.
- **The Apartment Precinct has no comps.** Do not extrapolate corridor rates onto
  interior/Ala Wai parcels. Say it's unmeasured.
- Prefer **RPAD assessed land values** over inference wherever they can be obtained —
  Honolulu assesses at 100% of market value, as fee simple, with land broken out
  separately. That is the project's shortest path to a real answer.
- This is research, **not an appraisal**, and should say so in any deliverable.

## Environment note

The original build environment's egress allowlist blocked `realproperty.honolulu.gov`,
`qpublic.net`, the Bureau of Conveyances, and the HoLIS/State GIS ArcGIS endpoints —
only web search worked. Re-test before assuming the same limits; if they still hold, ask
the user to paste RPAD records rather than reporting the data as unavailable.

Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` renders the HTML to PDF
(`--headless --print-to-pdf`); `pypdfium2` rasterises pages for visual checking.
