import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Practice Resources",
  description: "Well-known free platforms for hands-on cybersecurity practice, to use alongside TalonForge.",
  alternates: { canonical: "/resources" },
};

const SECTIONS: { h: string; items: { name: string; url: string; note: string }[] }[] = [
  {
    h: "Command line & wargames",
    items: [
      { name: "OverTheWire (Bandit)", url: "https://overthewire.org/wargames/bandit/", note: "A long ladder of Linux shell puzzles on real servers. Pairs with our shell track." },
      { name: "Exploit Education", url: "https://exploit.education/", note: "Downloadable VMs for learning memory-corruption concepts offline." },
    ],
  },
  {
    h: "Capture the flag & guided rooms",
    items: [
      { name: "picoCTF", url: "https://picoctf.org/", note: "Beginner-friendly CTF with a permanent practice archive." },
      { name: "TryHackMe", url: "https://tryhackme.com/", note: "Guided rooms in the browser; check the site for what is currently free." },
      { name: "Hack The Box / Academy", url: "https://www.hackthebox.com/", note: "Labs and modules; check the site for current free options." },
      { name: "CyberDefenders", url: "https://cyberdefenders.org/", note: "Blue-team challenges: forensics, log analysis, threat hunting." },
    ],
  },
  {
    h: "Web application security",
    items: [
      { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", note: "Free, in-depth web vulnerability labs from the makers of Burp Suite." },
      { name: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/", note: "A deliberately vulnerable web app to run locally." },
      { name: "OWASP WebGoat", url: "https://owasp.org/www-project-webgoat/", note: "Guided lessons on common web flaws." },
    ],
  },
  {
    h: "Build your own range",
    items: [
      { name: "VulnHub", url: "https://www.vulnhub.com/", note: "Downloadable vulnerable VMs to attack inside your isolated lab." },
      { name: "Kali Linux", url: "https://www.kali.org/", note: "Official downloads, including ready-made VM images." },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      <h1>Free practice resources</h1>
      <p className="muted lead">
        TalonForge lessons are original. These independent platforms are great places to keep practicing. We are not affiliated
        with them; offerings and pricing change, so check each site. Only practice on systems you own or are explicitly allowed to test.
      </p>
      {SECTIONS.map((s) => (
        <section key={s.h} aria-labelledby={`r-${s.h}`}>
          <h2 id={`r-${s.h}`}>{s.h}</h2>
          <ul className="lesson-list">
            {s.items.map((i) => (
              <li key={i.url}>
                <a className="card" href={i.url} target="_blank" rel="noopener noreferrer">
                  <span>
                    <strong>{i.name}</strong>
                    <br />
                    <span className="muted small">{i.note}</span>
                  </span>
                  <span className="badge">Opens in new tab ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
