"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Learn", match: (p: string) => p === "/" || p.startsWith("/tracks") || p.startsWith("/learn") },
  { href: "/atlas", label: "Language Atlas", match: (p: string) => p.startsWith("/atlas") },
  { href: "/playground", label: "Playground", match: (p: string) => p.startsWith("/playground") },
  { href: "/resources", label: "Resources", match: (p: string) => p.startsWith("/resources") },
  { href: "/progress", label: "Progress", match: (p: string) => p.startsWith("/progress") },
];

/** Main navigation with the current section marked (aria-current + visual underline). */
export function NavLinks() {
  const path = usePathname() ?? "/";
  return (
    <nav aria-label="Main" className="main-nav">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} aria-current={n.match(path) ? "page" : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
