"use client";
import Link from "next/link";
import { computeStreak, rankFor, totalXp, useProgress } from "@/lib/progress";

type TrackSummary = { id: string; title: string; tagline: string; icon: string; description: string; lessons: { id: string; xp: number }[] };

export function StatsBar() {
  const p = useProgress();
  const xp = totalXp(p);
  const { rank, next, toNext } = rankFor(xp);
  return (
    <div className="stats" aria-label="Your stats">
      <div className="card stat"><b>{xp}</b>XP earned</div>
      <div className="card stat"><b>{rank.name}</b>{next ? `${toNext} XP to ${next.name}` : "Top rank"}</div>
      <div className="card stat"><b>{Object.keys(p.completed).length}</b>Labs completed</div>
      <div className="card stat"><b>{computeStreak(p.activeDays)}</b>Day streak</div>
    </div>
  );
}

export function TrackGrid({ tracks }: { tracks: TrackSummary[] }) {
  const p = useProgress();
  return (
    <div className="grid">
      {tracks.map((t) => {
        const done = t.lessons.filter((l) => p.completed[l.id]).length;
        const pct = Math.round((done / t.lessons.length) * 100);
        return (
          <Link key={t.id} href={`/tracks/${t.id}`} className="card track-card">
            <span className="track-icon" aria-hidden="true">{t.icon}</span>
            <h3 style={{ margin: 0 }}>{t.title}</h3>
            <p className="muted" style={{ margin: 0 }}>{t.tagline}</p>
            <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${t.title} progress`}>
              <span style={{ width: `${pct}%` }} />
            </div>
            <span className="small muted">{done}/{t.lessons.length} complete</span>
          </Link>
        );
      })}
    </div>
  );
}

export function LessonList({ trackId, lessons }: { trackId: string; lessons: { id: string; title: string; summary: string; minutes: number; xp: number; level: string }[] }) {
  const p = useProgress();
  return (
    <ol className="lesson-list">
      {lessons.map((l, i) => (
        <li key={l.id}>
          <Link className="card" href={`/learn/${trackId}/${l.id}`}>
            <span>
              <strong>{i + 1}. {l.title}</strong>
              <br />
              <span className="muted small">{l.summary} · {l.level} · ~{l.minutes} min · +{l.xp} XP</span>
            </span>
            {p.completed[l.id] ? <span className="badge ok">Done</span> : <span className="badge">Start</span>}
          </Link>
        </li>
      ))}
    </ol>
  );
}
