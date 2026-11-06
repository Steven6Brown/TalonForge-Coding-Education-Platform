"use client";
import { useMemo, useState } from "react";
import { PORTS, PORT_CATEGORIES, PORT_RANGES, type PortCategory, type PortInfo } from "@/lib/content/ports";

/** Searchable port reference plus a flashcard quiz. */
export function PortsReference() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<PortCategory | "All">("All");
  const [onlyInsecure, setOnlyInsecure] = useState(false);
  const [mode, setMode] = useState<"reference" | "quiz">("reference");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PORTS.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!onlyInsecure || p.insecure) &&
        (!needle || String(p.port).includes(needle) || p.service.toLowerCase().includes(needle) || p.what.toLowerCase().includes(needle)),
    );
  }, [q, cat, onlyInsecure]);

  return (
    <div>
      <div className="chips" role="tablist" aria-label="Ports mode">
        <button role="tab" className="chip" aria-selected={mode === "reference"} onClick={() => setMode("reference")}>Reference</button>
        <button role="tab" className="chip" aria-selected={mode === "quiz"} onClick={() => setMode("quiz")}>Flashcard quiz</button>
      </div>
      {mode === "quiz" ? <PortQuiz /> : (
        <>
          <section className="card" aria-labelledby="ranges-h">
            <h3 id="ranges-h" style={{ marginTop: 0 }}>The three port ranges</h3>
            <ul>
              {PORT_RANGES.map((r) => (
                <li key={r.range}><strong>{r.range}</strong>: {r.name}. <span className="muted">{r.note}</span></li>
              ))}
            </ul>
            <p className="muted small">A port is a numbered door on a computer. The IP address finds the machine; the port picks the service. TCP is connection-oriented (reliable); UDP is connectionless (fast, no delivery guarantee).</p>
          </section>
          <div className="field">
            <label htmlFor="port-q">Search by port, service or purpose</label>
            <input id="port-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. 443, ssh, database" />
          </div>
          <div className="chips" role="group" aria-label="Filter by category">
            <button className="chip" aria-pressed={cat === "All"} onClick={() => setCat("All")}>All</button>
            {PORT_CATEGORIES.map((c) => (
              <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
            <button className="chip" aria-pressed={onlyInsecure} onClick={() => setOnlyInsecure(!onlyInsecure)}>⚠ Clear-text / risky by default</button>
          </div>
          <div className="atlas-table">
            <table className="tbl">
              <thead>
                <tr><th scope="col">Port</th><th scope="col">Protocol</th><th scope="col">Service</th><th scope="col">What it does</th><th scope="col">Security note</th></tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.port}>
                    <th scope="row">{p.port}</th>
                    <td>{p.proto}</td>
                    <td>{p.service}{p.insecure && <span className="badge" title="Unencrypted or risky by default"> ⚠</span>}</td>
                    <td>{p.what}</td>
                    <td className="muted">{p.note}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={5} className="muted">No matches.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Q = { prompt: string; options: string[]; answer: string; why: string };

function makeQuestions(n = 10): Q[] {
  return shuffle(PORTS).slice(0, n).map((p: PortInfo, i) => {
    const wrong = shuffle(PORTS.filter((x) => x.port !== p.port)).slice(0, 3);
    const forward = i % 2 === 0;
    if (forward) {
      return {
        prompt: `What service normally uses port ${p.port}?`,
        options: shuffle([p.service, ...wrong.map((w) => w.service)]),
        answer: p.service,
        why: `${p.port}/${p.proto} is ${p.service}: ${p.what} ${p.note}`,
      };
    }
    return {
      prompt: `Which port is the default for ${p.service}?`,
      options: shuffle([String(p.port), ...wrong.map((w) => String(w.port))]),
      answer: String(p.port),
      why: `${p.service} uses ${p.port}/${p.proto}. ${p.what} ${p.note}`,
    };
  });
}

function PortQuiz() {
  const [qs, setQs] = useState<Q[]>(() => makeQuestions());
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = idx >= qs.length;

  if (done) {
    return (
      <section className="card">
        <h3 style={{ marginTop: 0 }}>Score: {score} / {qs.length}</h3>
        <button className="btn primary" onClick={() => { setQs(makeQuestions()); setIdx(0); setScore(0); setPicked(null); }}>New round</button>
      </section>
    );
  }
  const q = qs[idx];
  return (
    <section className="card" aria-live="polite">
      <p className="muted small">Question {idx + 1} of {qs.length}</p>
      <h3 style={{ marginTop: 0 }}>{q.prompt}</h3>
      <div className="stack">
        {q.options.map((o) => (
          <button
            key={o}
            className="btn"
            disabled={picked !== null}
            onClick={() => { setPicked(o); if (o === q.answer) setScore(score + 1); }}
            aria-pressed={picked === o}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className={picked === q.answer ? "pass" : "warn"} role="status">{picked === q.answer ? "Correct. " : `Not quite: ${q.answer}. `}{q.why}</p>
          <button className="btn primary" onClick={() => { setIdx(idx + 1); setPicked(null); }}>Next</button>
        </>
      )}
    </section>
  );
}
