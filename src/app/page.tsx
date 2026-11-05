import Link from "next/link";
import { brand } from "@/brands";
import { StatsBar, TrackGrid } from "@/components/Dashboard";
import { LESSONS, TRACKS } from "@/lib/content/lessons";

export default function Home() {
  // Only pass what the grid needs (ids + xp), not lab answers.
  const tracks = TRACKS.map((t) => ({
    ...t,
    lessons: t.lessons.map((id) => ({ id, xp: LESSONS.find((l) => l.id === id)?.xp ?? 0 })),
  }));
  return (
    <>
      <section className="hero">
        <h1>{brand.tagline}</h1>
        <p className="lead">
          Learn to code, script, hack ethically and run servers by doing. Every lesson ends in a hands-on lab that
          runs safely in your browser. No paywall, no signup needed.
        </p>
        <div className="row">
          <Link className="btn primary" href="/tracks/linux-shell">Start with the shell</Link>
          <Link className="btn" href="/atlas">Which language should I learn?</Link>
        </div>
      </section>
      <StatsBar />
      <h2>Learning tracks</h2>
      <TrackGrid tracks={tracks} />
    </>
  );
}
