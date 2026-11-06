"use client";
import Link from "next/link";
import { ROLES } from "@/lib/sim/roles";
import { useProgress } from "@/lib/progress";

/** Card per job role with progress. Roles with no scenarios yet are labelled "planned". */
export function CareersLanding() {
  const progress = useProgress();
  return (
    <div className="grid">
      {ROLES.map((r) => {
        const done = r.scenarios.filter((s) => progress.completed["sim:" + s.id]).length;
        const body = (
          <>
            <strong>{r.title}</strong>
            <span>{r.blurb}</span>
            {r.planned ? (
              <span className="badge">Planned</span>
            ) : (
              <>
                <span className="muted small">{r.scenarios.length} scenarios · beginner to advanced</span>
                <span className="meter" aria-hidden="true"><span style={{ width: `${(done / Math.max(1, r.scenarios.length)) * 100}%` }} /></span>
                <span className="muted small">{done} of {r.scenarios.length} completed</span>
              </>
            )}
          </>
        );
        return r.planned ? (
          <div key={r.id} className="card sim-card" aria-disabled="true">{body}</div>
        ) : (
          <Link key={r.id} href={`/careers/${r.id}`} className="card sim-card">{body}</Link>
        );
      })}
    </div>
  );
}
