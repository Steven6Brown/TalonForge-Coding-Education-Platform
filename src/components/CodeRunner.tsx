"use client";
import { useState } from "react";
import { runCode, type RunResult, type RunStatus } from "@/lib/runner";
import { explainError } from "@/lib/explain-error";

type Props = {
  language: "javascript" | "python" | "sql";
  starter: string;
  /** Hidden code appended after the learner's code (used for tests). */
  harness?: string;
  /** Hidden setup (SQL schema/data) passed to the runner. */
  setup?: string;
  /** A small runnable example the learner can load into the editor to experiment with. */
  example?: string;
  /** Sends the current code and last output to the helper (optional). */
  onAsk?: (code: string, output: string) => void;
  onResult?: (res: RunResult) => void;
  label?: string;
};

/** Code editor + Run button + output panel. Execution happens in an isolated Web Worker. */
export function CodeRunner({ language, starter, harness, setup, example, onAsk, onResult, label }: Props) {
  const [code, setCode] = useState(starter);
  const [stash, setStash] = useState<string | null>(null); // the learner's own code while an example is loaded
  const [out, setOut] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<RunStatus | "idle">("idle");

  async function run() {
    setStatus("running");
    setOut(null);
    const res = await runCode(language, harness && stash === null ? `${code}\n${harness}` : code, (s) => setStatus(s), setup);
    setOut(res);
    setStatus("idle");
    if (stash === null) onResult?.(res); // examples never count toward passing the lab
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Tab inserts spaces (editor behavior). Press Esc first to move focus away with Tab instead.
    if (e.key === "Tab" && !e.shiftKey && !e.altKey && !e.ctrlKey) {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart: s, selectionEnd: en } = el;
      const next = code.slice(0, s) + "    " + code.slice(en);
      setCode(next);
      requestAnimationFrame(() => el.setSelectionRange(s + 4, s + 4));
    } else if (e.key === "Escape") {
      e.currentTarget.blur();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void run();
    }
  }

  const busy = status !== "idle";
  const explanation = out?.error ? explainError(language, out.error) : null;
  const id = `ed-${label ?? language}`;
  return (
    <div className="runner">
      <label className="editor-label" htmlFor={id}>
        {language === "python" ? "Python" : language === "sql" ? "SQL" : "JavaScript"} editor
        {stash !== null && <span className="badge"> example loaded: your code is saved</span>}
      </label>
      <textarea
        id={id}
        className="editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={Math.min(22, Math.max(8, code.split("\n").length + 1))}
        maxLength={20000}
        aria-describedby="editor-help"
      />
      <p id="editor-help" className="muted small">
        This box only accepts {language === "python" ? "Python" : language === "sql" ? "SQL" : "JavaScript"} code (lines starting with {language === "python" ? "#" : language === "sql" ? "--" : "//"} are notes). Commands like <code>curl</code> belong in a terminal, not here. Tab indents · Esc then Tab leaves the editor · Ctrl/Cmd+Enter runs
      </p>
      <div className="row">
        <button className="btn primary" onClick={run} disabled={busy}>
          {status === "loading" ? "Loading engine…" : status === "running" ? "Running…" : "▶ Run"}
        </button>
        <button className="btn" onClick={() => { setCode(stash ?? starter); setStash(null); }} disabled={busy}>
          {stash !== null ? "Back to my code" : "Reset code"}
        </button>
        {example && stash === null && (
          <button className="btn" onClick={() => { setStash(code); setCode(example); setOut(null); }} disabled={busy}>
            Load the example
          </button>
        )}
        {onAsk && (
          <button className="btn" onClick={() => onAsk(code, out ? out.stdout + (out.error ?? "") : "")} disabled={busy}>
            Ask the helper about this
          </button>
        )}
      </div>
      {language !== "javascript" && status === "idle" && !out && (
        <p className="muted small">The first run downloads the engine once (Python is ~10 MB, SQL is ~1 MB), then it is cached.</p>
      )}
      <div className="output" role="status" aria-live="polite" aria-label="Program output">
        {out ? (
          <pre>
            {out.stdout}
            {out.error ? <span className="err">{out.error}</span> : null}
            {!out.stdout && !out.error ? <span className="muted">(no output)</span> : null}
          </pre>
        ) : (
          <pre className="muted">Output appears here.</pre>
        )}
      </div>
      {explanation && (
        <p className="explain" role="note">
          <strong>What this error means:</strong> {explanation}
        </p>
      )}
    </div>
  );
}
