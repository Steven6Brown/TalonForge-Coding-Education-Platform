"use client";
import { useState } from "react";
import { HELPDESK } from "@/lib/sim/helpdesk";
import { SOC } from "@/lib/sim/soc";
import { TAG_LABEL, maxScore, type Scenario, type Tag } from "@/lib/sim/types";
import { completeLesson, useProgress } from "@/lib/progress";
import { SiemConsole } from "@/components/SiemConsole";

type Tab = "helpdesk" | "soc" | "siem";

const simXp = (s: Scenario) => (s.difficulty === "beginner" ? 40 : s.difficulty === "intermediate" ? 60 : 80);

export function SimulatorHub() {
  const [tab, setTab] = useState<Tab>("helpdesk");
  const [active, setActive] = useState<Scenario | null>(null);
  const list = tab === "helpdesk" ? HELPDESK : SOC;
  const progress = useProgress();

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Simulators">
        {([["helpdesk", "IT Help Desk"], ["soc", "SOC Analyst"], ["siem", "SIEM sandbox"]] as [Tab, string][]).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={"tab" + (tab === id ? " on" : "")} onClick={() => { setTab(id); setActive(null); }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "siem" ? (
        <section>
          <p className="muted">Practice searching logs the way analysts do in Splunk or Elastic. The data is fictional but includes a brute-force attack, a DNS beacon and data exfiltration. Try to find them.</p>
          <SiemConsole samples={["source=auth action=failure | stats count by src_ip | sort -count", "source=dns | top 5 query", "source=firewall | stats sum(bytes_out) as total by host | sort -total"]} />
        </section>
      ) : active ? (
        <Runner key={active.id} scenario={active} onExit={() => setActive(null)} />
      ) : (
        <section>
          <p className="muted">
            {tab === "helpdesk"
              ? "Handle realistic tickets. You are graded on security procedure, customer service, technical accuracy and documentation, not just on fixing the problem."
              : "Triage realistic SIEM alerts: validate, scope, contain, escalate and document. Use the SIEM sandbox tab to search the same kind of evidence yourself."}
          </p>
          <div className="grid">
            {list.map((s) => {
              const done = progress.completed["sim:" + s.id];
              return (
                <button key={s.id} className="card sim-card" onClick={() => setActive(s)}>
                  <span className="muted small">{s.ticket.id} · {s.priority} · {s.difficulty}</span>
                  <strong>{s.title}</strong>
                  <span>{s.summary}</span>
                  <span className="muted small">{s.skills.join(" · ")}</span>
                  {done && <span className="badge">Completed · +{done.xp} XP</span>}
                </button>
              );
            })}
          </div>
          <p className="muted small">These scenarios are fictional training exercises. Completing them is practice, not a credential.</p>
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
  const step = scenario.steps[stepId];
  const max = maxScore(scenario);
  const score = log.reduce((a, l) => a + l.points, 0);

  function choose(i: number) {
    if (picked || !step.choices) return;
    const ch = step.choices[i];
    setPicked({ choice: ch, next: ch.next });
    setLog((l) => [...l, ch]);
  }
  function advance() {
    if (!picked) return;
    setStepId(picked.next);
    setPicked(null);
  }

  // Final screen: compute per-skill breakdown and award XP proportionally.
  if (step.end) {
    const byTag = new Map<Tag, { got: number; max: number }>();
    log.forEach((l) => {
      const t = byTag.get(l.tag) ?? { got: 0, max: 0 };
      byTag.set(l.tag, { got: t.got + l.points, max: t.max + 3 });
    });
    const pct = max ? Math.round((score / max) * 100) : 0;
    return <Finish scenario={scenario} title={step.end.title} summary={step.end.summary} pct={pct} score={score} max={max} byTag={byTag} onExit={onExit} onRetry={() => { setStepId(scenario.start); setPicked(null); setLog([]); }} />;
  }

  return (
    <section className="sim-run" aria-live="polite">
      <button className="btn small" onClick={onExit}>← All scenarios</button>
      <h2>{scenario.title}</h2>
      <p className="muted small">{scenario.ticket.id} · {scenario.priority} · {scenario.ticket.requester} via {scenario.ticket.channel}</p>
      <div className="card">
        {step.who && <p className="muted small"><strong>{step.who}</strong></p>}
        <p>{step.text}</p>
        {step.evidence && <pre className="out-box">{step.evidence}</pre>}
      </div>
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
          <button className="btn primary" onClick={advance}>Continue →</button>
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
  const xp = Math.round((simXp(scenario) * pct) / 100);
  const passed = pct >= 70;
  return (
    <section className="sim-run">
      <h2>{title}</h2>
      <p>{summary}</p>
      <p><strong>Score: {score}/{max} ({pct}%)</strong> {passed ? "Passed." : "Not yet. Review the takeaways and try again."}</p>
      <table className="tbl">
        <thead><tr><th scope="col">Skill area</th><th scope="col">Score</th></tr></thead>
        <tbody>
          {[...byTag.entries()].map(([t, v]) => <tr key={t}><td>{TAG_LABEL[t]}</td><td>{v.got}/{v.max}</td></tr>)}
        </tbody>
      </table>
      <h3>What strong performers do</h3>
      <ul>{scenario.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="row">
        {passed && !awarded && <button className="btn primary" onClick={() => { completeLesson("sim:" + scenario.id, xp); setAwarded(true); }}>Claim +{xp} XP</button>}
        {awarded && <span className="badge">XP recorded</span>}
        <button className="btn" onClick={onRetry}>Try again</button>
        <button className="btn" onClick={onExit}>All scenarios</button>
      </div>
    </section>
  );
}
