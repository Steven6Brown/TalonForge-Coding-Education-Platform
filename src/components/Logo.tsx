import { brand } from "@/brands";

/** Brand mark: angular talon-slash inside a hex badge. Decorative; the name is real text. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="var(--surface2)" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M9 11h14M16 11v11M12 24l4-2 4 2" stroke="var(--accent2)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-name">{brand.name}</span>
    </span>
  );
}
