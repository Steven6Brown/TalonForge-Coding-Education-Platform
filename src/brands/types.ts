/** White-label brand contract. A new tenant = one new file implementing this type. */
export type Brand = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Short mark shown in the logo badge (1-2 chars). */
  mark: string;
  parent: { name: string; url: string; motto?: string };
  /** Show "Powered by TalonForge" for white-label tenants. */
  poweredBy: boolean;
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accent2: string;
    ok: string;
    danger: string;
  };
  /** Rank names unlocked at each XP threshold (same length). */
  ranks: { name: string; xp: number }[];
};
