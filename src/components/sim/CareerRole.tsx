"use client";
import { useState } from "react";
import { guideFor } from "@/lib/sim/guides";
import { TAG_LABEL, maxScore, type Scenario, type Tag } from "@/lib/sim/types";
import type { Role } from "@/lib/sim/roles";
import { completeLesson, useProgress } from "@/lib/progress";
import { SiemConsole } from "@/components/SiemConsole";

type Level = Scenario["difficulty"];
const LEVELS: { id: Level; label: string; help: string }[] = [
  { id: "beginner", label: "Beginner", help: "Never done this before. Key terms are explained up front and every decision has a hint." },
  { id: "intermediate", label: "Intermediate", help: "You know the basics. Terms are tucked away and hints are still available." },
  { id: "advanced", label: "Advanced", help: "Real-world pressure. No hints: you decide from experience." },
];
export const simXp = (s: Scenario) => (s.difficulty === "beginner" ? 40 : s.difficulty === "intermediate" ? 60 : 80);

/** A role page: explains the job, lists scenarios by level, and runs the chosen scenario. */
export function CareerRole({ role }: { role: Role }) {
  const [active, setActive] = useState<Scenario | null>(null);
  const [filter, setFilter] = useState<Level | "all">("all");
  const progress = useProgress();
  const shown = role.scenarios.filter((s) => filter === "all" || s.difficulty === filter);
  const done = role.scenarios.filter((s) => progress.completed["sim:" + s.id]).length;

  if (active) return <Runner key={active.id} scenario={active} onExit={() => setActive(null)} />;

  return (
    <>
      <section className="card">
        <h2>What does this job involve?</h2>
        <p>{role.about}</p>
        <p className="muted small">{done} of {role.scenarios.length} scenarios completed. These are fictional training exercises: practice, not a credential.</p>
      </section>

      <section aria-label="Difficulty levels">
        <h2>Pick your level</h2>
        <div className="grid">
          {LEVELS.map((l) => (
            <div key={l.id} className="card">
              <strong>{l.label}</strong>
              <p className="muted small">{l.help}</p>
            </div>
          ))}
        </div>
        <div className="tabs" role="group" aria-label="Filter by level">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((f) => (
            <button key={f} className={"tab" + (filter === f ? " on" : "")} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All levels" : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="grid">
          {shown.map((s) => {
            const d = progress.completed["sim:" + s.id];
            return (
              <button key={s.id} className="card sim-card" onClick={() => setActive(s)}>
                <span className="chips"><span className={"chip lvl-" + s.difficulty}>{s.difficulty}</span><span className="chip prio">{s.priority}</span><span className="chip xp">+{simXp(s)} XP</span></span>
                <strong>{s.title}</strong>
                <span>{s.summary}</span>
                <span className="muted small">Skills: {s.skills.join(", ")}</span>
                {d && <span className="badge ok">Completed · +{d.xp} XP</span>}
              </button>
            );
          })}
          {shown.length === 0 && <p className="muted">No scenarios at this level yet.</p>}
        </div>
      </section>

      {role.id === "soc-analyst" && (
        <section>
          <h2>SIEM sandbox</h2>
          <p className="muted">Practice searching logs the way analysts do in Splunk or Elastic. The data is fictional and includes a brute-force attack, a DNS beacon and data exfiltration. Try to find them. New to this? Start with the SIEM &amp; SOC Analyst track on the Learn page.</p>
          <SiemConsole samples={["source=auth action=failure | stats count by src_ip | sort -count", "source=dns | top 5 query", "source=firewall | stats sum(bytes_out) as total by host | sort -total"]} />
        </section>
      )}
    </>
  );
}

type Picked = { label: string; feedback: string; points: number; tag: Tag };

function Runner({ scenario, onExit }: { scenario: Scenario; onExit: () => void }) {
  const [stepId, setStepId] = useState(scenario.start);
  const [picked, setPicked] = useState<{ choice: Picked; next: string } | null>(null);
  const [log, setLog] = useState<Picked[]>([]);
  const [hintFor, setHintFor] = useState<string | null>(null);
  const step = scenario.steps[stepId];
  const guide = guideFor(scenario.id);
  const max = maxScore(scenario);
  const score = log.reduce((a, l) => a + l.points, 0);
  const hintsAllowed = scenario.difficulty !== "advanced";
  const hint = guide?.coach?.[stepId];

  function choose(i: number) {
    if (picked || !step.choices) return;
    const ch = step.choices[i];
    setPicked({ choice: ch, next: ch.next });
    setLog((l) => [...l, ch]);
  }

  if (step.end) {
    const byTag = new Map<Tag, { got: number; max: number }>();
    log.forEach((l) => {
      const t = byTag.get(l.tag) ?? { got: 0, max: 0 };
      byTag.set(l.tag, { got: t.got + l.points, max: t.max + 3 });
    });
    const pct = max ? Math.round((score / max) * 100) : 0;
    return <Finish scenario={scenario} title={step.end.title} summary={step.end.summary} pct={pct} score={score} max={max} byTag={byTag} onExit={onExit} onRetry={() => { setStepId(scenario.start); setPicked(null); setLog([]); setHintFor(null); }} />;
  }

  return (
    <section className="sim-run" aria-live="polite">
      <button className="back-link" onClick={onExit}><span aria-hidden="true">←</span> All scenarios</button>
      <h2>{scenario.title}</h2>
      <div className="chips"><span className={"chip lvl-" + scenario.difficulty}>{scenario.difficulty}</span><span className="chip prio">{scenario.priority}</span><span className="chip xp">+{simXp(scenario)} XP</span></div><p className="muted small">{scenario.ticket.id} · {scenario.ticket.requester} via {scenario.ticket.channel}</p>

      {guide && (
        <details className="scaffold" open={scenario.difficulty === "beginner" && stepId === scenario.start}>
          <summary>Before you start: what you are practicing and key terms</summary>
          <p><strong>Goal:</strong> {guide.objective}</p>
          <p className="muted small">You will make a series of decisions. Each choice gets feedback explaining why it was strong or risky, and your score is shown at the end. There is no penalty for retrying.</p>
          <dl>
            {guide.primer.map((p) => (<div key={p.term}><dt><strong>{p.term}</strong></dt><dd>{p.def}</dd></div>))}
          </dl>
        </details>
      )}

      <div className="card">
        {step.who && <p className="muted small"><strong>{step.who}</strong></p>}
        <p>{step.text}</p>
        {step.evidence && <pre className="out-box">{step.evidence}</pre>}
      </div>

      {hintsAllowed && hint && !picked && (
        <div>
          <button className="btn small" onClick={() => setHintFor(hintFor === stepId ? null : stepId)} aria-expanded={hintFor === stepId}>
            {hintFor === stepId ? "Hide hint" : "Need a hint?"}
          </button>
          {hintFor === stepId && <p className="explain">{hint}</p>}
        </div>
      )}

      {step.choices && (
        <div className="choices" role="group" aria-label="Your options">
          {step.choices.map((ch, i) => (
            <button key={i} className="btn choice" disabled={!!picked} onClick={() => choose(i)}>{ch.label}</button>
          ))}
        </div>
      )}
      {picked && (
        <div className={"card " + (picked.choice.points >= 2 ? "pass" : "warn")} role="status">
          <strong>{picked.choice.points === 3 ? "Strong choice" : picked.choice.points === 2 ? "Acceptable" : picked.choice.points === 1 ? "Weak" : "Risky"} ({TAG_LABEL[picked.choice.tag]})</strong>
          <p>{picked.choice.feedback}</p>
          <button className="btn primary" onClick={() => { setStepId(picked.next); setPicked(null); }}>Continue →</button>
        </div>
      )}
    </section>
  );
}

function Finish({ scenario, title, summary, pct, score, max, byTag, onExit, onRetry }: {
  scenario: Scenario; title: string; summary: string; pct: number; score: number; max: number;
  byTag: Map<Tag, { got: number; max: number }>; onExit: () => void; onRetry: () => void;
}) {
  const [awarded, setAwarded] = useState(false);
  const progress = useProgress();
  const already = !!progress.completed["sim:" + scenario.id];
  const xp = Math.round((simXp(scenario) * pct) / 100);
  const passed = pct >= 70;
  return (
    <section className="sim-run">
      <h2>{title}</h2>
      <p>{summary}</p>
      <p><strong>Score: {score}/{max} ({pct}%)</strong> {passed ? "Passed." : "Not yet. Read the takeaways below and try again."}</p>
      <table className="tbl">
        <thead><tr><th scope="col">Skill area</th><th scope="col">Score</th></tr></thead>
        <tbody>{[...byTag.entries()].map(([t, v]) => <tr key={t}><td>{TAG_LABEL[t]}</td><td>{v.got}/{v.max}</td></tr>)}</tbody>
      </table>
      <h3>What strong performers do</h3>
      <ul>{scenario.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="row">
        {passed && !awarded && !already && <button className="btn primary" onClick={() => { completeLesson("sim:" + scenario.id, xp); setAwarded(true); }}>Claim +{xp} XP</button>}
        {(awarded || already) && <span className="badge ok">Completed</span>}
        <button className="btn" onClick={onRetry}>Try again</button>
        <button className="btn" onClick={onExit}>All scenarios</button>
      </div>
    </section>
  );
}
