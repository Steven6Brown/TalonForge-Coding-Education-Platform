/**
 * A small Splunk-style search engine (SPL-lite) that runs entirely in the browser over fictional log events.
 * Supported: search terms (field=value, field!=value, wildcards, quoted text, NOT, OR) then pipes:
 *   stats <count|dc(f)|sum(f)|avg(f)|min(f)|max(f)> [as alias][, ...] [by f1,f2]
 *   top [N] field | sort [-]field | head N | tail N | table f1 f2 | dedup field | where field<op>value
 */

export type LogEvent = Record<string, string | number>;
export type Table = { columns: string[]; rows: (string | number)[][] };

const DEFAULT_COLS = ["_time", "source", "host", "user", "src_ip", "action", "message"];
const MAX_ROWS = 500;

export class QueryError extends Error {}

/** Splits on | outside of quotes. */
function splitPipes(q: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quote = false;
  for (const ch of q) {
    if (ch === '"') quote = !quote;
    if (ch === "|" && !quote) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out.filter((s, i) => s || i === 0);
}

function tokenize(s: string): string[] {
  const toks: string[] = [];
  const re = /(?:[^\s"=!]+(?:!?=)"[^"]*")|"[^"]*"|\S+/g;
  for (const m of s.matchAll(re)) toks.push(m[0]);
  return toks;
}

const unquote = (v: string) => (v.startsWith('"') && v.endsWith('"') ? v.slice(1, -1) : v);

function wildcardMatch(value: string, pattern: string): boolean {
  const re = new RegExp("^" + pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$", "i");
  return re.test(value);
}

function termMatcher(tok: string): (e: LogEvent) => boolean {
  const m = /^([A-Za-z_][\w.]*)(!?=)(.*)$/.exec(tok);
  if (m) {
    const [, field, op, raw] = m;
    const val = unquote(raw);
    return (e) => {
      const has = e[field] !== undefined;
      const hit = has && (val.includes("*") ? wildcardMatch(String(e[field]), val) : String(e[field]).toLowerCase() === val.toLowerCase());
      return op === "=" ? hit : !hit;
    };
  }
  const needle = unquote(tok).toLowerCase();
  const wild = needle.includes("*");
  return (e) => {
    const hay = Object.values(e).join(" ").toLowerCase();
    return wild ? wildcardMatch(hay, "*" + needle + "*") : hay.includes(needle);
  };
}

function buildSearch(expr: string): (e: LogEvent) => boolean {
  // Drop an optional leading "search" keyword and "index=..." which is accepted but ignored.
  let toks = tokenize(expr).filter((t) => !/^index=/i.test(t));
  if (toks[0]?.toLowerCase() === "search") toks = toks.slice(1);
  // Build AND of OR-groups, with NOT negating the next term.
  const groups: ((e: LogEvent) => boolean)[][] = [];
  let negate = false;
  let orNext = false;
  for (const t of toks) {
    const u = t.toUpperCase();
    if (u === "AND") continue;
    if (u === "OR") { orNext = true; continue; }
    if (u === "NOT") { negate = true; continue; }
    let f = termMatcher(t);
    if (negate) { const inner = f; f = (e) => !inner(e); negate = false; }
    if (orNext && groups.length) groups[groups.length - 1].push(f);
    else groups.push([f]);
    orNext = false;
  }
  return (e) => groups.every((g) => g.some((f) => f(e)));
}

const num = (v: unknown) => (typeof v === "number" ? v : Number(v));
const isNum = (v: unknown) => v !== "" && v !== undefined && !Number.isNaN(num(v));

function cmp(a: string | number, b: string | number): number {
  if (isNum(a) && isNum(b)) return num(a) - num(b);
  return String(a).localeCompare(String(b));
}

function applyStats(events: LogEvent[], arg: string): Table {
  const byIdx = arg.toLowerCase().lastIndexOf(" by ");
  const funcPart = byIdx >= 0 ? arg.slice(0, byIdx) : arg;
  const byFields = byIdx >= 0 ? arg.slice(byIdx + 4).split(/[,\s]+/).filter(Boolean) : [];
  const funcs = funcPart.split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
    const m = /^(count|dc|sum|avg|min|max)(?:\(([\w.]*)\))?(?:\s+as\s+(\w+))?$/i.exec(f);
    if (!m) throw new QueryError(`stats: don't understand "${f}". Try: stats count by field, or stats dc(field), sum(field)`);
    const fn = m[1].toLowerCase();
    const field = m[2] ?? "";
    if (fn !== "count" && !field) throw new QueryError(`stats: ${fn}() needs a field name`);
    return { fn, field, name: m[3] ?? (fn === "count" && !field ? "count" : `${fn}(${field})`) };
  });
  if (!funcs.length) throw new QueryError("stats: give a function, for example: stats count by src_ip");

  const groups = new Map<string, LogEvent[]>();
  for (const e of events) {
    const key = JSON.stringify(byFields.map((f) => e[f] ?? ""));
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(e);
  }
  if (byFields.length === 0 && groups.size === 0) groups.set("[]", []);
  const columns = [...byFields, ...funcs.map((f) => f.name)];
  const rows: (string | number)[][] = [];
  for (const [key, evs] of groups) {
    const keyVals = JSON.parse(key) as (string | number)[];
    const vals = funcs.map((f) => {
      const nums = evs.map((e) => num(e[f.field])).filter((n) => !Number.isNaN(n));
      switch (f.fn) {
        case "count": return evs.length;
        case "dc": return new Set(evs.map((e) => String(e[f.field] ?? ""))).size;
        case "sum": return nums.reduce((a, b) => a + b, 0);
        case "avg": return nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100 : 0;
        case "min": return nums.length ? Math.min(...nums) : 0;
        default: return nums.length ? Math.max(...nums) : 0;
      }
    });
    rows.push([...keyVals, ...vals]);
  }
  return { columns, rows };
}

function toTable(events: LogEvent[]): Table {
  const cols = DEFAULT_COLS.filter((c) => events.some((e) => e[c] !== undefined));
  return { columns: cols, rows: events.map((e) => cols.map((c) => e[c] ?? "")) };
}

function colIndex(t: Table, f: string): number {
  const i = t.columns.indexOf(f);
  if (i < 0) throw new QueryError(`Unknown field "${f}". Available fields: ${t.columns.join(", ")}`);
  return i;
}

export function runQuery(query: string, events: LogEvent[]): Table {
  const stages = splitPipes(query.trim());
  if (!stages[0] && stages.length === 1) throw new QueryError("Type a search, for example: action=failure");
  const evs: LogEvent[] = events.filter(buildSearch(stages[0] ?? ""));
  // Stages that need event fields work on events until the first transforming command.
  let table: Table | null = null;
  const getTable = () => (table ??= toTable(evs));

  for (const raw of stages.slice(1)) {
    const [cmdRaw, ...restParts] = raw.trim().split(/\s+/);
    const cmd = cmdRaw.toLowerCase();
    const rest = restParts.join(" ");
    if (cmd === "stats") {
      if (table) throw new QueryError("stats must come before table/top in this mini-SIEM");
      table = applyStats(evs, rest);
    } else if (cmd === "top") {
      const m = /^(\d+\s+)?(\w+)$/.exec(rest);
      if (!m) throw new QueryError("top: try top 5 src_ip");
      const limit = m[1] ? Number(m[1]) : 10;
      const t = applyStats(evs, `count by ${m[2]}`);
      t.rows.sort((a, b) => Number(b[1]) - Number(a[1]));
      table = { columns: t.columns, rows: t.rows.slice(0, limit) };
    } else if (cmd === "sort") {
      const t = getTable();
      const desc = rest.startsWith("-");
      const idx = colIndex(t, rest.replace(/^[-+]/, "").trim());
      t.rows.sort((a, b) => (desc ? -1 : 1) * cmp(a[idx], b[idx]));
    } else if (cmd === "head" || cmd === "tail") {
      const t = getTable();
      const n = rest ? Number(rest) : 10;
      if (!Number.isInteger(n) || n < 0) throw new QueryError(`${cmd}: give a whole number, for example ${cmd} 5`);
      t.rows = cmd === "head" ? t.rows.slice(0, n) : t.rows.slice(-n);
    } else if (cmd === "table") {
      const t = getTable();
      const fields = rest.split(/[,\s]+/).filter(Boolean);
      if (!fields.length) throw new QueryError("table: list the fields to show, for example: table _time src_ip user");
      const idxs = fields.map((f) => {
        if (table && evs && t.columns.includes(f)) return t.columns.indexOf(f);
        return -1;
      });
      if (idxs.some((i) => i < 0)) {
        // allow selecting fields that weren't in the default columns when still on raw events
        if (!t.columns.length || t === table) {
          const fresh = { columns: fields, rows: evs.map((e) => fields.map((f) => e[f] ?? "")) };
          table = fresh;
        } else throw new QueryError(`table: unknown field in "${rest}". Available: ${t.columns.join(", ")}`);
      } else table = { columns: fields, rows: t.rows.map((r) => idxs.map((i) => r[i])) };
    } else if (cmd === "dedup") {
      const t = getTable();
      const idx = colIndex(t, rest.trim());
      const seen = new Set<string>();
      t.rows = t.rows.filter((r) => (seen.has(String(r[idx])) ? false : (seen.add(String(r[idx])), true)));
    } else if (cmd === "where") {
      const t = getTable();
      const m = /^([\w.]+)\s*(==|=|!=|>=|<=|>|<)\s*"?([^"]*)"?$/.exec(rest);
      if (!m) throw new QueryError('where: try where count > 5  or  where user="admin"');
      const idx = colIndex(t, m[1]);
      const op = m[2] === "=" ? "==" : m[2];
      t.rows = t.rows.filter((r) => {
        const d = isNum(r[idx]) && isNum(m[3]) ? num(r[idx]) - num(m[3]) : String(r[idx]).localeCompare(m[3]);
        return op === "==" ? d === 0 : op === "!=" ? d !== 0 : op === ">" ? d > 0 : op === ">=" ? d >= 0 : op === "<" ? d < 0 : d <= 0;
      });
    } else {
      throw new QueryError(`Unknown command "${cmdRaw}". Supported: stats, top, sort, head, tail, table, dedup, where`);
    }
  }
  const out = table ?? toTable(evs);
  return { columns: out.columns, rows: out.rows.slice(0, MAX_ROWS) };
}

/** Last-cell helper: the first value of the first row, as text (used by labs to check answers). */
export const firstCell = (t: Table) => (t.rows[0] ? String(t.rows[0][t.rows[0].length - 1]) : "");
