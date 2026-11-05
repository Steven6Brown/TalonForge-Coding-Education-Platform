"use client";
import { useState } from "react";
import { GOALS, rankLanguages, type Goal } from "@/lib/content/atlas";

/** Pick a goal, get languages ranked by fit, with plain-English "use it for / avoid it for" guidance. */
export function AtlasExplorer() {
  const [goal, setGoal] = useState<Goal | "all">("all");
  const list = rankLanguages(goal);
  return (
    <>
      <div className="chips" role="group" aria-label="Filter by goal">
        <button className="chip" aria-pressed={goal === "all"} onClick={() => setGoal("all")}>All languages</button>
        {GOALS.map((g) => (
          <button key={g.id} className="chip" aria-pressed={goal === g.id} onClick={() => setGoal(g.id)}>
            {g.label}
          </button>
        ))}
      </div>
      <p className="muted" role="status">
        {goal === "all" ? "Showing all languages." : `Best fits for “${GOALS.find((g) => g.id === goal)?.label}”, strongest first.`}
      </p>
      <div className="grid">
        {list.map((l, i) => (
          <article key={l.id} className="card lang-card">
            <h3>
              {goal !== "all" && <span className="muted">#{i + 1} </span>}
              {l.name}
            </h3>
            <p className="muted small">{l.kind}</p>
            <p className="small">
              Difficulty: <span className="diff" aria-label={`${l.difficulty} out of 5`}>{"●".repeat(l.difficulty)}{"○".repeat(5 - l.difficulty)}</span>
            </p>
            <p><strong>Use it for:</strong> {l.useFor}</p>
            <p><strong>Skip it when:</strong> {l.avoidFor}</p>
            <p><strong>Security angle:</strong> {l.security}</p>
            <p className="muted small"><strong>First project:</strong> {l.firstProject}</p>
          </article>
        ))}
      </div>
    </>
  );
}
