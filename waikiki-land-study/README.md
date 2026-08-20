# Waikiki Land Study

Research project: **what land is worth per square foot in the Waikiki Special District**,
in order to price a specific property.

Not code. Parked in this repo because the session branch
(`claude/waikiki-land-sales-dfcynt`) was set up for it — it has nothing to do with the
JavaScript exercises in the rest of the repo and can be moved out whenever convenient.

## Start here

| File | What's in it |
|---|---|
| **`00-KICKOFF.md`** | **Read first.** Original goal, scope decisions, status, and a paste-ready prompt to resume in a new chat |
| `01-fee-simple.md` | **MEMORY: fee simple.** The working $/sf numbers, and the RPAD method for getting real ones |
| `02-ground-lease.md` | **MEMORY: ground leases.** Leased fee vs leasehold, kept separate from the fee simple work |
| `03-transactions.md` | The full transaction dataset, findings, verification checklist, sources |

## Published artifacts

- **Waikiki Land Basis Study** — https://claude.ai/code/artifact/60eebec0-8e6d-4275-b5dc-c64008a6f689
- **The Ground Lease Split** — https://claude.ai/code/artifact/ca54d790-68c1-481a-9232-2e6e1030c7fc

`source/` holds the HTML behind both; `pdf/` holds print-ready copies. To update an
artifact, edit its HTML and call the Artifact tool with that same file path — the URL
is preserved.

## Status in one line

A complete, well-sourced **desktop study** — built from published reporting, not primary
records, because network egress in the build environment blocked the Honolulu assessor,
the Bureau of Conveyances, and the parcel GIS. The next step that matters is pulling
RPAD assessed land values (method in `01-fee-simple.md`).

Not an appraisal. Not investment, legal, or tax advice.
