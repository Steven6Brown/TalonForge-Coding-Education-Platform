import Link from "next/link";
import { brand } from "@/brands";
import { TRACKS } from "@/lib/content/lessons";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo size={30} />
            <p className="muted small footer-blurb">{brand.description}</p>
          </div>
          <nav aria-label="Learning tracks">
            <h2 className="footer-h">Tracks</h2>
            <ul>
              {TRACKS.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link href={`/tracks/${t.id}`}>{t.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Platform">
            <h2 className="footer-h">Platform</h2>
            <ul>
              <li><Link href="/atlas">Language Atlas</Link></li>
              <li><Link href="/playground">Playground</Link></li>
              <li><Link href="/progress">Your progress</Link></li>
              {TRACKS.slice(5).map((t) => (
                <li key={t.id}><Link href={`/tracks/${t.id}`}>{t.title}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer-base">
          <p>
            © {new Date().getFullYear()} {brand.name}
            {brand.parent && (
              <>
                {" · A product of "}
                <a href={brand.parent.url} target="_blank" rel="noopener noreferrer">
                  {brand.parent.name}
                </a>
                {brand.parent.motto ? <span className="muted"> · {brand.parent.motto}</span> : null}
              </>
            )}
            {brand.poweredBy && <span className="muted"> · Powered by TalonForge</span>}
          </p>
          <p className="muted small">
            For education only. Practice security techniques solely on systems you own or have written permission to test.
          </p>
        </div>
      </div>
    </footer>
  );
}
