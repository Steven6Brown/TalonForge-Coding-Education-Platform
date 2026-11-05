import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { brand } from "@/brands";
import { AuthEffects } from "@/components/auth/AuthEffects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AUTH_ENABLED } from "@/lib/auth/config";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${brand.name} - ${brand.tagline}`, template: `%s · ${brand.name}` },
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: { title: brand.name, description: brand.description, siteName: brand.name, type: "website" },
  robots: { index: true, follow: true },
};

// Never set maximumScale / userScalable: users must be able to zoom.
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: brand.colors.bg };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = brand.colors;
  // Brand colors become CSS variables, so a white-label build re-skins the whole app from one config file.
  const vars = {
    "--bg": c.bg, "--surface": c.surface, "--surface2": c.surface2, "--border": c.border, "--text": c.text,
    "--muted": c.muted, "--accent": c.accent, "--accent2": c.accent2, "--ok": c.ok, "--danger": c.danger,
  } as CSSProperties;
  return (
    <html lang="en" style={vars}>
      <body>
        <Header />
        <main id="main" className="wrap">{children}</main>
        <Footer />
        {AUTH_ENABLED && <AuthEffects />}
      </body>
    </html>
  );
}
