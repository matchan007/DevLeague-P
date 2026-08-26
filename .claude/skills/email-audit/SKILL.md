---
name: email-audit
description: Audit Leo's email review system (Sarah, legacy routines, Gmail labels, Notion HQ). Use when Leo asks to audit, check, or verify his email agent, inbox automation, or "Sarah". Runs read-only checks against known IDs instead of rediscovering the system.
---

# Email system audit runbook

Read `CLAUDE.md` (Agent Operations Map) first — it holds every ID referenced
below. This audit is READ-ONLY: do not modify routines, labels, drafts, or
Notion pages. Report findings; fix only when Leo asks.

## Checks, in order

1. **Sarah alive?** `list_sessions` (mine:true). Healthy = `Sarah sweep`
   sessions on a ~2h grid with the newest ≤3h old (HST daytime), plus a
   `Sarah brief` this morning ~6:40am HST. Flag `computer_unreachable`
   init errors (laptop was asleep — sweeps silently skipped).

2. **Inbox state.** Gmail `search_threads` `in:inbox is:unread`
   (METADATA_ONLY). Healthy = ≤ a handful, and recent arrivals already
   carry a `Sarah/*` label. >5 unread older than ~2h = sweeps failing.

3. **Waiting-on-Leo backlog.** Count: `list_drafts` (unsent drafts and
   their ages), threads under `Sarah/Unsubscribe` (Label_88), unread under
   `Sarah/Needs-Reply` (Label_75) / `Sarah/Read-Me` (Label_76). Old items
   (>5 days) mean the surfacing loop is failing even if triage works.

4. **Notion pipeline.** Query the Queue data source
   (`collection://1b3cbf96-1bb8-4c97-92e3-0688f2e87619`) for rows posted
   in the last 7 days, and the Register
   (`collection://4796c3c7-afed-47ab-9a97-9a9b0c1b9b1a`) for recently
   created/updated obligations. Fetch the HQ page
   (`3bf026ed-8917-8171-a65f-f3437acafc21`) and check the heartbeat
   callout date. As of 2026-08-26 this whole layer is known-broken
   (Queue empty forever) — report whether that has changed.

5. **Deadline leak check.** Scan recent `Sarah/*` threads (last 7d) for
   due dates, payment failures, and school/legal/tax obligations; verify
   each one appears in the Register or has been visibly handled (Leo
   replied, calendar event exists). Anything that exists only as a label
   is a leak — list it with its deadline.

6. **Legacy interference.** `list_triggers`: the skimmer/thinker Routines
   should be gone or disabled. If either has fired recently, that is a
   conflict alert — they use different labels and trash aggressively.

7. **Triage spot-check.** Sample ~10 recent `Sarah/*` threads: Needs-Reply
   vs Read-Me sensible? Drafts only on reply-needed threads, correct
   recipients, none to no-reply senders? Starred mail untouched?

## Reporting

Lead with a one-line verdict (healthy / degraded / down + why). Rank
findings by severity with concrete evidence (thread subjects, dates,
counts). Compare against the previous audit in `email-agent/AUDIT-*.md`,
and write the new audit there (dated), commit, and push. Update
`CLAUDE.md` "Known issues" if the state changed.
