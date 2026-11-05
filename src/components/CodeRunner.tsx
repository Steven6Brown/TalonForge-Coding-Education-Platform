"use client";
import { useState } from "react";
import { runCode, type RunResult, type RunStatus } from "@/lib/runner";

type Props = {
  language: "javascript" | "python";
  starter: string;
  /** Hidden code appended after the learner's code (used for tests). */
  harness?: string;
  onResult?: (res: RunResult) => void;
  label?: string;
};

/** Code editor + Run button + output panel. Execution happens in an isolated Web Worker. */
export function CodeRunner({ language, starter, harness, onResult, label }: Props) {
  const [code, setCode] = useState(starter);
  const [out, setOut] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<RunStatus | "idle">("idle");

  async function run() {
    setStatus("running");
    setOut(null);
    const res = await runCode(language, harness ? `${code}\n${harness}` : code, (s) => setStatus(s));
    setOut(res);
    setStatus("idle");
    onResult?.(res);
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
  return (
    <div className="runner">
      <label className="editor-label" htmlFor={`ed-${label ?? language}`}>
        {language === "python" ? "Python" : "JavaScript"} editor
      </label>
      <textarea
        id={`ed-${label ?? language}`}
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
        Tab indents · Esc then Tab leaves the editor · Ctrl/Cmd+Enter runs
      </p>
      <div className="row">
        <button className="btn primary" onClick={run} disabled={busy}>
          {status === "loading" ? "Loading Python engine…" : status === "running" ? "Running…" : "▶ Run"}
        </button>
        <button className="btn" onClick={() => setCode(starter)} disabled={busy}>
          Reset code
        </button>
      </div>
      {language === "python" && status === "idle" && !out && (
        <p className="muted small">The first Python run downloads the engine (~10 MB) once, then it is cached.</p>
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
    </div>
  );
}
