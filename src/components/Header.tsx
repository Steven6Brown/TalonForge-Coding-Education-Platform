import Link from "next/link";
import { Logo } from "./Logo";
import { AuthNav } from "./auth/AuthNav";

const NAV = [
  { href: "/", label: "Learn" },
  { href: "/atlas", label: "Language Atlas" },
  { href: "/playground", label: "Playground" },
  { href: "/progress", label: "Progress" },
];

export function Header() {
  return (
    <header className="site-header">
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div className="wrap header-in">
        <Link href="/" aria-label="Home" className="logo-link">
          <Logo />
        </Link>
        <nav aria-label="Main" className="main-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <AuthNav />
      </div>
    </header>
  );
}
