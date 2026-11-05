/* Sandboxed Python runner (Pyodide, loaded from the jsDelivr CDN, pinned version).
   Served with a CSP that only allows that CDN for network access. */
const PYODIDE_VERSION = "0.26.4";
const BASE = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/";
const MAX_OUT = 20000;

let pyodidePromise = null;
let out = "";
let truncated = false;

function write(text) {
  if (truncated) return;
  out += text + "\n";
  if (out.length > MAX_OUT) {
    out = out.slice(0, MAX_OUT) + "\n[output truncated]\n";
    truncated = true;
  }
}

function load() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts(BASE + "pyodide.js");
      // eslint-disable-next-line no-undef
      const py = await loadPyodide({ indexURL: BASE });
      py.setStdout({ batched: (s) => write(s) });
      py.setStderr({ batched: (s) => write(s) });
      return py;
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (e) => {
  const code = String((e.data && e.data.code) || "");
  out = "";
  truncated = false;
  try {
    self.postMessage({ status: "loading" });
    const py = await load();
    self.postMessage({ status: "running" });
    const globals = py.globals.get("dict")();
    try {
      await py.runPythonAsync(code, { globals });
      self.postMessage({ ok: true, stdout: out });
    } finally {
      globals.destroy();
    }
  } catch (err) {
    // Python tracebacks are long; keep the last meaningful lines.
    const msg = String((err && err.message) || err).split("\n").filter(Boolean).slice(-4).join("\n");
    self.postMessage({ ok: false, stdout: out, error: msg });
  }
};
