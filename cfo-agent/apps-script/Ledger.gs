/**
 * CFO master ledger — write endpoint.
 *
 * Bound to the master ledger Google Sheet. Deploy as a Web App so the CFO agent
 * can append and update rows without a human pasting anything.
 *
 * The point of this file: the ledger is the BOOK OF RECORD, not a cache. Tiller
 * supplies raw US transactions; this sheet remembers every judgment made about
 * them (entity, category, business/personal, receipt links) plus everything Tiller
 * can't see (Japan, cash, manual). Without persistence those judgments get redone
 * from scratch on every run — and redone differently, which is how things go missing.
 *
 * Upserts are keyed on txn_id and are idempotent: re-syncing an overlapping date
 * range updates rows in place rather than duplicating them.
 *
 * SETUP
 *   1. Open the master ledger sheet → Extensions → Apps Script
 *   2. Paste this file
 *   3. Project Settings → Script Properties → add `SHARED_SECRET` = a long random string
 *   4. Run `setupSheets()` once to create the tabs and headers
 *   5. Deploy → New deployment → Web app
 *        Execute as: Me
 *        Who has access: Anyone with the link
 *   6. Give the agent the /exec URL and the secret (store them in
 *      cfo-agent/config/accounts.yml, which is gitignored)
 *
 * The "Anyone with the link" setting is why the shared secret is mandatory: the URL
 * is unguessable but not secret-by-design. Every request is checked against it.
 */

var LEDGER_SHEET = 'Ledger';
var SYNC_SHEET   = 'SyncState';
var AUDIT_SHEET  = 'AuditLog';

var COLUMNS = [
  'txn_id',          // stable key — the whole upsert depends on this
  'date',
  'entity',          // PERSONAL | RBRIDGE | SIDE3 | UNASSIGNED
  'account_id',
  'institution',
  'raw_description', // never overwritten — audit trail
  'merchant',
  'category',
  'amount',          // original currency, signed: negative = money out
  'currency',
  'amount_usd',
  'fx_rate',
  'fx_date',
  'business',        // true | false | unknown
  'deductible',      // likely | unlikely | ask-accountant
  'project',
  'receipt_url',
  'source',          // tiller | email | csv | asc | manual
  'confidence',      // high | medium | low — about the CLASSIFICATION
  'notes',
  'updated_at'
];

/** Columns a human may edit by hand that sync must never clobber. */
var HUMAN_OWNED = ['entity', 'category', 'business', 'project', 'notes'];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!authorized_(body.secret)) return json_({ ok: false, error: 'unauthorized' });

    switch (body.action) {
      case 'upsert':      return json_(upsertRows_(body.rows || [], body.respectHumanEdits !== false));
      case 'read':        return json_(readRows_(body.filter || {}));
      case 'syncState':   return json_(getSyncState_());
      case 'setSyncState':return json_(setSyncState_(body.account_id, body.last_synced));
      case 'reconcile':   return json_(reconcile_(body.expected || []));
      default:            return json_({ ok: false, error: 'unknown action: ' + body.action });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  if (!authorized_(e.parameter.secret)) return json_({ ok: false, error: 'unauthorized' });
  return json_(readRows_({ since: e.parameter.since, entity: e.parameter.entity }));
}

function authorized_(secret) {
  var expected = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
  return Boolean(expected) && secret === expected;
}

/**
 * Insert new rows, update existing ones by txn_id.
 *
 * When respectHumanEdits is true (the default), values a human typed into the
 * human-owned columns win over whatever the agent computed. Someone who corrects
 * an entity assignment in the sheet should not have that correction silently
 * reverted by the next sync — that erodes trust in the ledger faster than any bug.
 */
function upsertRows_(rows, respectHumanEdits) {
  var sheet = sheet_(LEDGER_SHEET);
  var data = sheet.getDataRange().getValues();
  var header = data[0];
  var idCol = header.indexOf('txn_id');

  var indexById = {};
  for (var r = 1; r < data.length; r++) {
    var id = String(data[r][idCol]);
    if (id) indexById[id] = r;
  }

  var inserted = 0, updated = 0, preserved = 0;
  var appends = [];
  var now = new Date().toISOString();

  rows.forEach(function (row) {
    if (!row.txn_id) return;
    row.updated_at = now;
    var existingRow = indexById[String(row.txn_id)];

    if (existingRow === undefined) {
      appends.push(COLUMNS.map(function (c) { return row[c] !== undefined ? row[c] : ''; }));
      inserted++;
      return;
    }

    var current = data[existingRow];
    var merged = COLUMNS.map(function (c, i) {
      var existingVal = current[header.indexOf(c)];
      var incoming = row[c];

      // A human's correction outranks a recomputed guess.
      if (respectHumanEdits && HUMAN_OWNED.indexOf(c) !== -1 && existingVal !== '' && existingVal !== incoming) {
        preserved++;
        return existingVal;
      }
      return incoming !== undefined ? incoming : existingVal;
    });

    sheet.getRange(existingRow + 1, 1, 1, COLUMNS.length).setValues([merged]);
    updated++;
  });

  if (appends.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, appends.length, COLUMNS.length).setValues(appends);
  }

  log_('upsert', 'inserted=' + inserted + ' updated=' + updated + ' preserved=' + preserved);
  return { ok: true, inserted: inserted, updated: updated, humanEditsPreserved: preserved };
}

function readRows_(filter) {
  var data = sheet_(LEDGER_SHEET).getDataRange().getValues();
  var header = data.shift();
  var rows = data.map(function (r) {
    var o = {};
    header.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  }).filter(function (o) { return o.txn_id; });

  if (filter.since)  rows = rows.filter(function (o) { return String(o.date) >= filter.since; });
  if (filter.until)  rows = rows.filter(function (o) { return String(o.date) <= filter.until; });
  if (filter.entity) rows = rows.filter(function (o) { return o.entity === filter.entity; });

  return { ok: true, count: rows.length, rows: rows };
}

/**
 * Sync watermarks, per account. This is what makes incremental pulls possible:
 * the agent asks "what have I already got?" and fetches only what's newer,
 * rather than re-pulling and re-classifying the entire history every run.
 */
function getSyncState_() {
  var data = sheet_(SYNC_SHEET).getDataRange().getValues();
  data.shift();
  var state = {};
  data.forEach(function (r) { if (r[0]) state[r[0]] = r[1]; });
  return { ok: true, state: state };
}

function setSyncState_(accountId, lastSynced) {
  if (!accountId) return { ok: false, error: 'account_id required' };
  var sheet = sheet_(SYNC_SHEET);
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === accountId) {
      sheet.getRange(r + 1, 2, 1, 2).setValues([[lastSynced, new Date().toISOString()]]);
      return { ok: true, account_id: accountId, last_synced: lastSynced };
    }
  }
  sheet.appendRow([accountId, lastSynced, new Date().toISOString()]);
  return { ok: true, account_id: accountId, last_synced: lastSynced, created: true };
}

/**
 * Answer the question "am I missing anything?"
 *
 * Takes the source's own list of {txn_id, amount} and diffs it against the ledger.
 * Reports what the source has that the ledger doesn't (missing), what the ledger
 * has that the source doesn't (orphaned), and where amounts disagree (drifted —
 * usually a pending transaction that settled at a different figure).
 *
 * This only works because the ledger persists. There is nothing to diff against
 * if state lives only inside a single agent run.
 */
function reconcile_(expected) {
  var ledger = readRows_({}).rows;
  var ledgerById = {};
  ledger.forEach(function (r) { ledgerById[String(r.txn_id)] = r; });

  var expectedIds = {};
  var missing = [], drifted = [];

  expected.forEach(function (e) {
    expectedIds[String(e.txn_id)] = true;
    var have = ledgerById[String(e.txn_id)];
    if (!have) { missing.push(e); return; }
    if (Math.abs(Number(have.amount) - Number(e.amount)) > 0.005) {
      drifted.push({ txn_id: e.txn_id, ledger: have.amount, source: e.amount });
    }
  });

  var orphaned = ledger
    .filter(function (r) { return r.source === 'tiller' && !expectedIds[String(r.txn_id)]; })
    .map(function (r) { return { txn_id: r.txn_id, date: r.date, amount: r.amount }; });

  var unassigned = ledger.filter(function (r) { return r.entity === 'UNASSIGNED' || !r.entity; });
  var uncategorized = ledger.filter(function (r) { return r.category === 'Uncategorized' || !r.category; });

  log_('reconcile', 'missing=' + missing.length + ' drifted=' + drifted.length + ' orphaned=' + orphaned.length);

  return {
    ok: true,
    clean: missing.length === 0 && drifted.length === 0 && orphaned.length === 0,
    missing: missing,
    drifted: drifted,
    orphaned: orphaned,
    needsReview: { unassigned: unassigned.length, uncategorized: uncategorized.length }
  };
}

function log_(action, detail) {
  sheet_(AUDIT_SHEET).appendRow([new Date().toISOString(), action, detail]);
}

function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create tabs and headers. */
function setupSheets() {
  var ledger = sheet_(LEDGER_SHEET);
  if (ledger.getLastRow() === 0) {
    ledger.appendRow(COLUMNS);
    ledger.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    ledger.setFrozenRows(1);
  }
  var sync = sheet_(SYNC_SHEET);
  if (sync.getLastRow() === 0) {
    sync.appendRow(['account_id', 'last_synced', 'updated_at']);
    sync.setFrozenRows(1);
  }
  var audit = sheet_(AUDIT_SHEET);
  if (audit.getLastRow() === 0) {
    audit.appendRow(['timestamp', 'action', 'detail']);
    audit.setFrozenRows(1);
  }
  return 'Sheets ready.';
}
