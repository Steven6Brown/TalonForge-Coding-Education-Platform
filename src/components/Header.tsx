import Link from "next/link";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { AuthNav } from "./auth/AuthNav";

export function Header() {
  return (
    <header className="site-header">
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div className="wrap header-in">
        <Link href="/" aria-label="TalonForge home" className="logo-link">
          <Logo />
        </Link>
        <NavLinks />
        <AuthNav />
      </div>
    </header>
  );
}
