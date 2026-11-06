"use client";
import { useState } from "react";
import { brand } from "@/brands";
import { rankFor, totalXp, useProgress } from "@/lib/progress";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Share achievements. Everything is user-initiated: nothing is sent anywhere until the user clicks.
 * Only aggregate, non-sensitive numbers (rank, XP, labs completed) go into the share text.
 * LinkedIn's share URL accepts only a link (no prefilled text), so the text is copied for pasting.
 * GitHub has no share endpoint, so we offer a README snippet.
 */
export function ShareCard() {
  const p = useProgress();
  const xp = totalXp(p);
  const labs = Object.keys(p.completed).length;
  const { rank } = rankFor(xp);
  const [msg, setMsg] = useState<string | null>(null);

  const text = `I'm leveling up my cybersecurity and coding skills on ${brand.name}: rank ${rank.name}, ${xp} XP, ${labs} hands-on labs completed. #cybersecurity #learning`;
  const readme = `[![${brand.name} rank: ${rank.name}](https://img.shields.io/badge/${encodeURIComponent(brand.name)}-${encodeURIComponent(rank.name)}%20%C2%B7%20${xp}%20XP-ff8a3d)](${SITE})`;

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMsg(`${label} copied to your clipboard.`);
    } catch {
      setMsg("Couldn't access the clipboard. Select the text and copy it manually.");
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: brand.name, text, url: SITE });
    } catch {
      /* user cancelled the share sheet */
    }
  }

  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE)}`;
  const canNative = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <section className="card" aria-labelledby="share-h">
      <h2 id="share-h" style={{ marginTop: 0 }}>Share your progress</h2>
      <p className="muted small">
        You choose what to share. Only your rank, XP and lab count are included, never your answers or any personal data.
        {SITE.startsWith("http://localhost") && " (Links point to localhost until the site is deployed.)"}
      </p>
      <p className="share-preview" aria-label="Preview of the share text">{text}</p>
      <div className="row">
        <a className="btn" href={linkedin} target="_blank" rel="noopener noreferrer" onClick={() => void copy(text, "Post text")}>
          Share on LinkedIn
        </a>
        <button className="btn" onClick={() => copy(text, "Post text")}>Copy post text</button>
        <button className="btn" onClick={() => copy(readme, "README badge")}>Copy GitHub README badge</button>
        {canNative && <button className="btn" onClick={nativeShare}>Share…</button>}
      </div>
      <p className="muted small">
        The README badge loads an image from shields.io when it is displayed on GitHub. LinkedIn opens in a new tab; paste the copied text into your post.
      </p>
      {msg && <p role="status" className="pass">{msg}</p>}
    </section>
  );
}
