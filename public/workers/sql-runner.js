/* Sandboxed SQL runner: SQLite compiled to WebAssembly (sql.js, pinned version from jsDelivr).
   Each run uses a brand-new in-memory database, so learners can't affect each other or persist anything.
   Served with a CSP that only allows that CDN for network access. */
const VERSION = "1.8.0";
const BASE = "https://cdn.jsdelivr.net/npm/sql.js@" + VERSION + "/dist/";
const MAX_ROWS = 200;

let sqlPromise = null;
function load() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      importScripts(BASE + "sql-wasm.js");
      // eslint-disable-next-line no-undef
      return await initSqlJs({ locateFile: (f) => BASE + f });
    })();
  }
  return sqlPromise;
}

const cell = (v) => (v === null || v === undefined ? "NULL" : String(v));

self.onmessage = async (e) => {
  const setup = String((e.data && e.data.setup) || "");
  const code = String((e.data && e.data.code) || "");
  try {
    self.postMessage({ status: "loading" });
    const SQL = await load();
    self.postMessage({ status: "running" });
    const db = new SQL.Database();
    try {
      if (setup) db.exec(setup);
      const results = db.exec(code);
      if (!results.length) {
        self.postMessage({ ok: true, stdout: "(statement ran; no result set. End with a SELECT to see rows.)\n" });
        return;
      }
      const last = results[results.length - 1];
      const rows = last.values.slice(0, MAX_ROWS);
      const header = last.columns.join(" | ");
      let out = header + "\n" + "-".repeat(Math.max(header.length, 3)) + "\n";
      out += rows.map((r) => r.map(cell).join(" | ")).join("\n") + "\n";
      out += "(" + last.values.length + " row" + (last.values.length === 1 ? "" : "s") + ")\n";
      // Machine-checkable final line used by labs: rows joined with ; and cells with |
      out += "-- result: " + rows.map((r) => r.map(cell).join("|")).join(";") + "\n";
      self.postMessage({ ok: true, stdout: out });
    } finally {
      db.close();
    }
  } catch (err) {
    self.postMessage({ ok: false, stdout: "", error: String((err && err.message) || err) });
  }
};
