import { brand } from "@/brands";

/**
 * TalonForge mark: a shield (security) containing a "T" whose crossbar is a talon blade
 * and whose stem is a forged blade tip, with an ember at the heart. Gradient follows the brand colors.
 * The SVG is decorative (aria-hidden); the wordmark is real text.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tf-edge" x1="6" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent2)" />
        </linearGradient>
        <linearGradient id="tf-fill" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--surface2)" />
          <stop offset="1" stopColor="var(--bg)" />
        </linearGradient>
      </defs>
      <path
        d="M20 2.5 34.5 8.5v12.2c0 8.3-5.9 13.9-14.5 17-8.6-3.1-14.5-8.7-14.5-17V8.5L20 2.5Z"
        fill="url(#tf-fill)"
        stroke="url(#tf-edge)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* talon crossbar */}
      <path d="M10.5 12.5h19.2l-3.9 5.6H10.5v-5.6Z" fill="url(#tf-edge)" />
      {/* blade stem */}
      <path d="M16.6 18.1h6.8v10.6L20 33l-3.4-4.3V18.1Z" fill="url(#tf-edge)" />
      {/* ember */}
      <path d="M20 21.6l1.5 2.3-1.5 2.3-1.5-2.3 1.5-2.3Z" fill="var(--bg)" />
    </svg>
  );
}

export function Logo({ size = 36 }: { size?: number }) {
  // Split "TalonForge" into two weights for the wordmark.
  const m = /^(Talon)(Forge)$/.exec(brand.name);
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-name">
        {m ? (
          <>
            <span className="logo-a">{m[1]}</span>
            <span className="logo-b">{m[2]}</span>
          </>
        ) : (
          brand.name
        )}
      </span>
    </span>
  );
}
