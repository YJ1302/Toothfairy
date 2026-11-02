/**
 * Tooth Fairy: Google Sheet backend.
 * Paste this into Extensions > Apps Script of the clinic's Google Sheet.
 * Then: Project Settings > Script properties > add KEY = a long random secret.
 * Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone.
 *
 * The website talks to this script only through its own server (/api/sheet),
 * which adds the secret key. Nobody else should know the web app address.
 */

const TABS = {
  Bookings: ["id", "createdAt", "child", "age", "reason", "date", "time", "parent", "phone", "notes", "status"],
  Doses: ["key", "childId", "medId", "day", "slot", "givenAt"],
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const body = JSON.parse(e.postData.contents);
    const key = PropertiesService.getScriptProperties().getProperty("KEY");
    if (!key || body.key !== key) return out({ ok: false, error: "unauthorized" });

    if (body.action === "list") return out({ ok: true, bookings: readBookings(), doses: readDoses() });
    if (body.action === "addBooking") return out(addBooking(body.booking));
    if (body.action === "setDose") return out(setDose(body.key2, body.givenAt));
    return out({ ok: false, error: "unknown action" });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** get a tab, creating it with headers and plain-text columns (so dates and phone numbers stay as typed) */
function tab(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    const headers = TABS[name];
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#E9E1F7");
    sh.getRange(1, 1, sh.getMaxRows(), headers.length).setNumberFormat("@");
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Sheets turns "2026-11-07" and "6:30 pm" into real dates and times; hand them back as the text the site expects */
function txt(v, kind) {
  if (v instanceof Date) {
    const tz = Session.getScriptTimeZone();
    if (kind === "date") return Utilities.formatDate(v, tz, "yyyy-MM-dd");
    if (kind === "time") return Utilities.formatDate(v, tz, "h:mm a").toLowerCase();
    return v.toISOString();
  }
  return String(v);
}

/** write one row as plain text, so Sheets leaves dates, times and phone numbers as typed */
function put(sh, rowIndex, values) {
  const r = sh.getRange(rowIndex, 1, 1, values.length);
  r.setNumberFormat("@");
  r.setValues([values]);
}

function rows(name) {
  const sh = tab(name);
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, TABS[name].length).getValues();
}

function readBookings() {
  return rows("Bookings")
    .filter((r) => r[0])
    .map((r) => ({
      id: String(r[0]),
      createdAt: txt(r[1]),
      child: String(r[2]),
      age: String(r[3]),
      reason: String(r[4]),
      date: txt(r[5], "date"),
      time: txt(r[6], "time"),
      parent: String(r[7]),
      phone: String(r[8]),
      notes: String(r[9]),
    }));
}

function readDoses() {
  const doses = {};
  rows("Doses").forEach((r) => {
    if (r[0] && r[5]) doses[String(r[0])] = txt(r[5]);
  });
  return doses;
}

function addBooking(b) {
  const sh = tab("Bookings");
  put(sh, sh.getLastRow() + 1, [b.id, b.createdAt, b.child, b.age, b.reason, b.date, b.time, b.parent, b.phone, b.notes, "New"]);
  return { ok: true };
}

function setDose(key, givenAt) {
  const sh = tab("Doses");
  const last = sh.getLastRow();
  let at = -1;
  if (last > 1) {
    const keys = sh.getRange(2, 1, last - 1, 1).getValues();
    for (let i = 0; i < keys.length; i++) {
      if (String(keys[i][0]) === key) {
        at = i + 2;
        break;
      }
    }
  }
  if (!givenAt) {
    if (at > 0) sh.deleteRow(at);
    return { ok: true };
  }
  const p = key.split("|"); // childId | medId | day | slot
  const row = [key, p[0], p[1], p[2], p[3], givenAt];
  put(sh, at > 0 ? at : sh.getLastRow() + 1, row);
  return { ok: true };
}

/** run once from the editor to create the tabs and approve permissions */
function setup() {
  tab("Bookings");
  tab("Doses");
}
