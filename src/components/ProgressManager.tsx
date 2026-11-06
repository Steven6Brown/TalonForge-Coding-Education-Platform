"use client";
import { useRef, useState } from "react";
import { exportProgress, importProgress, resetProgress, useProgress } from "@/lib/progress";
import { LESSONS } from "@/lib/content/lessons";
import { StatsBar } from "./Dashboard";
import { ShareCard } from "./ShareCard";

/** Progress overview + backup (export/import) + reset. All data stays in this browser unless accounts are enabled. */
export function ProgressManager() {
  const p = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function download() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "talonforge-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 200_000) return setMsg("File is too large.");
    const err = importProgress(await f.text());
    setMsg(err ?? "Progress imported.");
  }

  return (
    <>
      <StatsBar />
      <ShareCard />
      <h2>Completed labs</h2>
      <ul>
        {LESSONS.filter((l) => p.completed[l.id]).map((l) => (
          <li key={l.id}>{l.title} <span className="muted small">(+{p.completed[l.id].xp} XP, {new Date(p.completed[l.id].at).toLocaleDateString()})</span></li>
        ))}
        {Object.keys(p.completed).length === 0 && <li className="muted">Nothing yet. Pick a track and finish your first lab!</li>}
      </ul>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Your data</h2>
        <p className="muted small">
          Progress is stored only in this browser (lesson ids, XP and activity dates). No personal data, no tracking.
          Export a backup to move devices.
        </p>
        <div className="row">
          <button className="btn" onClick={download}>Export backup</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Import backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImport} className="sr-only" aria-label="Import progress file" tabIndex={-1} />
          {!confirmReset ? (
            <button className="btn danger" onClick={() => setConfirmReset(true)}>Reset progress</button>
          ) : (
            <>
              <button className="btn danger" onClick={() => { resetProgress(); setConfirmReset(false); setMsg("Progress reset."); }}>Yes, delete everything</button>
              <button className="btn" onClick={() => setConfirmReset(false)}>Cancel</button>
            </>
          )}
        </div>
        {msg && <p role="status">{msg}</p>}
      </section>
    </>
  );
}
