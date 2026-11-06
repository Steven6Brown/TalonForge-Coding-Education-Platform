"use client";
import { useState } from "react";
import { QueryError, runQuery, type Table } from "@/lib/siem/engine";
import { EVENTS } from "@/lib/siem/data";

const FIELDS = ["_time", "source (auth, dns, firewall, web)", "host", "user", "src_ip", "dest_ip", "dest_port", "action", "status", "url", "query", "bytes_out", "message"];

/** A Splunk-style search box over fictional logs. Everything runs in the browser. */
export function SiemConsole({ samples = [], initial = "source=auth action=failure | stats count by src_ip | sort -count" }: { samples?: string[]; initial?: string }) {
  const [q, setQ] = useState(initial);
  const [table, setTable] = useState<Table | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function run(query = q) {
    try {
      setTable(runQuery(query, EVENTS));
      setErr(null);
    } catch (e) {
      setTable(null);
      setErr(e instanceof QueryError ? e.message : "That search couldn't run. Check the syntax.");
    }
  }

  return (
    <div className="siem">
      <label htmlFor="siem-q" className="editor-label">Search (index of {EVENTS.length.toLocaleString()} fictional events)</label>
      <textarea
        id="siem-q"
        className="editor"
        rows={2}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } }}
        spellCheck={false}
        maxLength={500}
      />
      <div className="row">
        <button className="btn primary" onClick={() => run()}>▶ Search</button>
        {samples.map((s) => (
          <button key={s} className="btn small" onClick={() => { setQ(s); run(s); }} title="Load and run this example">{s.length > 38 ? s.slice(0, 36) + "…" : s}</button>
        ))}
      </div>
      <details>
        <summary>Fields and search syntax</summary>
        <p className="small"><strong>Fields:</strong> {FIELDS.join(" · ")}</p>
        <ul className="small">
          <li><code>field=value</code> filters events (wildcards <code>*</code> allowed, <code>field!=value</code> excludes). Several terms mean AND; use <code>OR</code> and <code>NOT</code>.</li>
          <li>A pipe <code>|</code> passes results to the next command: <code>stats count by field</code>, <code>stats dc(field)</code>, <code>stats sum(field) as total by host</code>, <code>top 5 field</code>, <code>sort -count</code> (minus = high to low), <code>head 5</code>, <code>table field1 field2</code>, <code>dedup field</code>, <code>where count &gt; 10</code>.</li>
          <li>Read it left to right: <em>find events → count them → sort → show the top rows</em>.</li>
        </ul>
      </details>
      {err && <p className="warn" role="alert">{err}</p>}
      {table && (
        <div className="atlas-table" aria-label="Search results">
          <p className="muted small">{table.rows.length} result{table.rows.length === 1 ? "" : "s"}{table.rows.length >= 500 ? " (showing first 500)" : ""}</p>
          <table className="tbl">
            <thead><tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>
              {table.rows.slice(0, 100).map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{String(v)}</td>)}</tr>)}
              {table.rows.length === 0 && <tr><td colSpan={Math.max(1, table.columns.length)} className="muted">No results.</td></tr>}
            </tbody>
          </table>
          {table.rows.length > 100 && <p className="muted small">Showing the first 100 rows. Narrow your search or add <code>| head 20</code>.</p>}
        </div>
      )}
    </div>
  );
}
