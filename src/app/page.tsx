import Link from "next/link";
import { brand } from "@/brands";
import { StatsBar, TrackGrid } from "@/components/Dashboard";
import { LESSONS, TRACKS } from "@/lib/content/lessons";

const PILLARS = [
  { h: "Learn by doing", p: "Every lesson ends in a graded lab: a simulated shell, a code editor, or a quiz. No video marathons." },
  { h: "Safe by design", p: "Labs run in isolated browser sandboxes. Nothing you write can touch your computer or a real network." },
  { h: "Built for security careers", p: "Linux, Python, networking, web security, incident response, automation and AI in one structured path." },
];

export default function Home() {
  // Only pass what the grid needs (ids + xp), not lab answers.
  const tracks = TRACKS.map((t) => ({
    ...t,
    lessons: t.lessons.map((id) => ({ id, xp: LESSONS.find((l) => l.id === id)?.xp ?? 0 })),
  }));
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Cybersecurity &amp; software skills platform</p>
          <h1>{brand.tagline}</h1>
          <p className="lead">
            A structured, hands-on academy for coding, scripting, servers, automation, AI and ethical hacking.
            Free to use, with no account required.
          </p>
          <div className="row">
            <Link className="btn primary lg" href="/tracks/linux-shell">Start learning</Link>
            <Link className="btn lg" href="/atlas">Which language fits me?</Link>
          </div>
          <ul className="hero-points" aria-label="Highlights">
            <li>{TRACKS.length} tracks</li>
            <li>{LESSONS.length} lessons with labs</li>
            <li>Progress saved privately in your browser</li>
          </ul>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="term-mock">
            <div className="term-bar"><i /><i /><i /><span>student@forge: ~/ctf</span></div>
            <pre>{`$ cat note1.b64 | base64 -d
FLAG{base64_is_not_encryption}

$ grep -c "Failed password" auth.log
50

$ find /var/www -perm 777
/var/www/html/uploads/backup_old.php`}</pre>
          </div>
        </div>
      </section>

      <section aria-labelledby="pillars-h" className="pillars">
        <h2 id="pillars-h" className="sr-only">Why TalonForge</h2>
        {PILLARS.map((p) => (
          <div key={p.h} className="pillar">
            <h3>{p.h}</h3>
            <p className="muted">{p.p}</p>
          </div>
        ))}
      </section>

      <h2 className="section-h">Your progress</h2>
      <StatsBar />
      <h2 className="section-h">Learning tracks</h2>
      <TrackGrid tracks={tracks} />
    </>
  );
}
