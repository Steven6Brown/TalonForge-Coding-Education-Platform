/* Sandboxed JavaScript runner. Served with CSP connect-src 'none' (see next.config.mjs),
   so learner code cannot make network requests. The host terminates this worker on timeout. */
const MAX_OUT = 20000;
let out = "";
let truncated = false;

function fmt(v) {
  if (typeof v === "string") return v;
  try {
    if (v instanceof Error) return v.name + ": " + v.message;
    return typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
  } catch {
    return String(v);
  }
}
function write(line) {
  if (truncated) return;
  out += line + "\n";
  if (out.length > MAX_OUT) {
    out = out.slice(0, MAX_OUT) + "\n[output truncated]\n";
    truncated = true;
  }
}
const c = {
  log: (...a) => write(a.map(fmt).join(" ")),
  info: (...a) => write(a.map(fmt).join(" ")),
  warn: (...a) => write("warn: " + a.map(fmt).join(" ")),
  error: (...a) => write("error: " + a.map(fmt).join(" ")),
};
Object.assign(console, c);

self.onmessage = async (e) => {
  const code = String(e.data && e.data.code ? e.data.code : "");
  out = "";
  truncated = false;
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    await new AsyncFunction(code)();
    self.postMessage({ ok: true, stdout: out });
  } catch (err) {
    self.postMessage({ ok: false, stdout: out, error: fmt(err) });
  }
};
