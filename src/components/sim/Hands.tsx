"use client";
import { useRef, useState } from "react";
import type { Hands } from "@/lib/sim/types";
import { SiemConsole } from "@/components/SiemConsole";

type Done = (points: 0 | 1 | 2 | 3, feedback: string) => void;
const clamp = (n: number) => Math.max(0, Math.min(3, Math.round(n))) as 0 | 1 | 2 | 3;

/** Renders the hands-on task for a step. Calls onDone once, with the earned points and a short explanation. */
export function HandsTask({ hands, onDone, disabled }: { hands: Hands; onDone: Done; disabled: boolean }) {
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const finish: Done = (pts, fb) => onDone(clamp(pts - (hintUsed && pts > 0 ? 1 : 0)), fb + (hintUsed ? " (A hint was used, so one point was deducted.)" : ""));

  return (
    <div className="hands card" aria-label="Hands-on task">
      <p><span className="chip hands-chip">Hands-on</span> <strong>{hands.goal}</strong></p>
      <button className="btn small" onClick={() => { setShowHint(!showHint); setHintUsed(true); }} aria-expanded={showHint}>{showHint ? "Hide hint" : "Stuck? Show a hint (-1 point)"}</button>
      {showHint && <p className="explain">{hands.hint}</p>}
      {hands.task.kind === "terminal" && <Terminal task={hands.task} onDone={finish} disabled={disabled} />}
      {hands.task.kind === "console" && <ConsoleTask task={hands.task} onDone={finish} disabled={disabled} />}
      {hands.task.kind === "ticket" && <TicketTask task={hands.task} onDone={finish} disabled={disabled} />}
      {hands.task.kind === "siem" && <SiemTask task={hands.task} onDone={finish} disabled={disabled} />}
    </div>
  );
}

type TerminalTask = Extract<Hands["task"], { kind: "terminal" }>;

function Terminal({ task, onDone, disabled }: { task: TerminalTask; onDone: Done; disabled: boolean }) {
  const [lines, setLines] = useState<{ cmd: string; out: string }[]>([]);
  const [val, setVal] = useState("");
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd || finished || disabled) return;
    const matches = task.commands.filter((c) => new RegExp(c.pattern, "i").test(cmd));
    const hit = [...matches].reverse().find((c) => c.after && seen.has(c.after)) ?? matches.find((c) => !c.after);
    const out = hit
      ? hit.output
      : task.os === "windows"
        ? `'${cmd.split(/\s+/)[0]}' is not recognized as an internal or external command, operable program or batch file.\nTip: use the buttons under "Commands you can try".`
        : `bash: ${cmd.split(/\s+/)[0]}: command not found or not available in this exercise.\nTip: use the buttons under "Commands you can try".`;
    const next = new Set(seen);
    if (hit?.id) next.add(hit.id);
    setSeen(next);
    setLines((l) => [...l, { cmd, out }]);
    setVal("");
    requestAnimationFrame(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; });
    if (task.required.every((id) => next.has(id))) {
      setFinished(true);
      onDone(3, "You ran the right commands and read their output. That is exactly how this problem is diagnosed on the job.");
    }
  }

  return (
    <div>
      <div ref={logRef} className="term-log" role="log" aria-label="Terminal output" tabIndex={0}>
        {lines.length === 0 && <p className="muted small">Type a command, or press one of the buttons below. Press Enter to run.</p>}
        {lines.map((l, i) => (
          <div key={i}><div><span className="term-prompt">{task.prompt}</span> {l.cmd}</div><pre className="term-out">{l.out}</pre></div>
        ))}
      </div>
      <form className="term-line" onSubmit={(e) => { e.preventDefault(); run(val); }}>
        <span className="term-prompt">{task.prompt}</span>
        <input value={val} onChange={(e) => setVal(e.target.value)} disabled={finished || disabled} aria-label="Command" autoComplete="off" spellCheck={false} />
        <button className="btn small primary" disabled={finished || disabled}>Run</button>
      </form>
      <details open>
        <summary>Commands you can try (and what they do)</summary>
        <ul className="cmd-list">
          {task.commands.filter((c, i, arr) => arr.findIndex((x) => x.example === c.example) === i).map((c) => (
            <li key={c.example}><button className="btn small" onClick={() => run(c.example)} disabled={finished || disabled}><code>{c.example}</code></button> <span className="small muted">{c.does}</span></li>
          ))}
        </ul>
      </details>
      <p className="muted small">Progress: {task.required.filter((id) => seen.has(id)).length} of {task.required.length} key steps done.</p>
    </div>
  );
}

type ConsoleT = Extract<Hands["task"], { kind: "console" }>;

function ConsoleTask({ task, onDone, disabled }: { task: ConsoleT; onDone: Done; disabled: boolean }) {
  const [vals, setVals] = useState<Record<string, string | boolean>>({});
  const [result, setResult] = useState<{ id: string; ok: boolean }[] | null>(null);

  function apply() {
    const res = task.fields.map((f) => ({ id: f.id, ok: (vals[f.id] ?? (f.type === "check" ? false : "")) === f.correct }));
    setResult(res);
    const ok = res.filter((r) => r.ok).length;
    const wrong = task.fields.filter((f, i) => !res[i].ok).map((f) => f.why);
    onDone(((ok / task.fields.length) * 3) as 0 | 1 | 2 | 3, ok === task.fields.length ? "Every setting was correct." : "Some settings were off. " + wrong.join(" "));
  }

  return (
    <div className="mock-console">
      <p className="mock-title">{task.title}</p>
      {task.fields.map((f) => {
        const r = result?.find((x) => x.id === f.id);
        return (
          <div key={f.id} className={"mock-row" + (r ? (r.ok ? " ok" : " bad") : "")}>
            {f.type === "check" ? (
              <label className="check"><input type="checkbox" checked={!!vals[f.id]} disabled={!!result || disabled} onChange={(e) => setVals({ ...vals, [f.id]: e.target.checked })} /> <span>{f.label}</span></label>
            ) : (
              <label>
                <span>{f.label}</span>
                <select value={String(vals[f.id] ?? "")} disabled={!!result || disabled} onChange={(e) => setVals({ ...vals, [f.id]: e.target.value })}>
                  <option value="">Choose…</option>
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
            )}
            {r && <p className="small">{r.ok ? "✓ Correct. " : "✗ Not quite. "}{f.why}</p>}
          </div>
        );
      })}
      {!result && <button className="btn primary" onClick={apply} disabled={disabled}>Apply changes</button>}
    </div>
  );
}

type TicketT = Extract<Hands["task"], { kind: "ticket" }>;

function TicketTask({ task, onDone, disabled }: { task: TicketT; onDone: Done; disabled: boolean }) {
  const [vals, setVals] = useState<string[]>(task.fields.map(() => ""));
  const [res, setRes] = useState<{ label: string; ok: boolean }[] | null>(null);

  function check() {
    const text = vals.join(" ").toLowerCase();
    const r = task.must.map((m) => ({ label: m.label, ok: m.keywords.some((k) => text.includes(k.toLowerCase())) }));
    setRes(r);
    const ok = r.filter((x) => x.ok).length;
    onDone(((ok / task.must.length) * 3) as 0 | 1 | 2 | 3, ok === task.must.length ? "Your ticket covered everything the next person needs." : "Missing: " + r.filter((x) => !x.ok).map((x) => x.label).join("; ") + ".");
  }

  return (
    <div>
      {task.fields.map((f, i) => (
        <label key={f} className="mock-row">
          <span>{f}</span>
          <textarea rows={2} value={vals[i]} disabled={!!res || disabled} maxLength={600} onChange={(e) => setVals(vals.map((v, j) => (j === i ? e.target.value : v)))} />
        </label>
      ))}
      {!res && <button className="btn primary" onClick={check} disabled={disabled || vals.every((v) => !v.trim())}>Check my ticket</button>}
      {res && (
        <ul className="small">
          {res.map((r) => <li key={r.label}>{r.ok ? "✓" : "✗"} {r.label}</li>)}
        </ul>
      )}
    </div>
  );
}

type SiemT = Extract<Hands["task"], { kind: "siem" }>;

function SiemTask({ task, onDone, disabled }: { task: SiemT; onDone: Done; disabled: boolean }) {
  const [vals, setVals] = useState<string[]>(task.answers.map(() => ""));
  const [wrong, setWrong] = useState(0);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  function submit() {
    const ok = task.answers.every((a, i) => vals[i].trim().toLowerCase() === a.toLowerCase());
    if (ok) {
      setDone(true);
      onDone(Math.max(1, 3 - wrong) as 1 | 2 | 3, "You found the evidence yourself with real searches.");
    } else {
      setWrong((w) => w + 1);
      setMsg("Not quite. Check your search results and try again.");
    }
  }

  return (
    <div>
      <p>{task.question}</p>
      <SiemConsole samples={task.samples} />
      <div className="row">
        {task.answers.map((_, i) => (
          <label key={i} className="mock-row"><span>Answer {i + 1}</span><input value={vals[i]} disabled={done || disabled} onChange={(e) => setVals(vals.map((v, j) => (j === i ? e.target.value : v)))} autoComplete="off" /></label>
        ))}
        <button className="btn primary" onClick={submit} disabled={done || disabled}>Submit answer</button>
      </div>
      {msg && !done && <p className="warn" role="alert">{msg}</p>}
    </div>
  );
}
