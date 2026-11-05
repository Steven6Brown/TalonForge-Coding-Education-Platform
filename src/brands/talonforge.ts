import type { Brand } from "./types";

export const talonforge: Brand = {
  id: "talonforge",
  name: "TalonForge",
  tagline: "Forge your skills. Sharpen your talons.",
  description:
    "A free, hands-on academy for coding, scripting, servers and ethical hacking. Learn by doing in browser sandboxes. Built by Aquila Digital.",
  mark: "TF",
  parent: { name: "Aquila Digital", url: "https://www.aquiladigital.net/", motto: "Per Aspera Ad Astra" },
  poweredBy: false,
  colors: {
    bg: "#0a0e14",
    surface: "#111823",
    surface2: "#17212f",
    border: "#26344a",
    text: "#e6edf5",
    muted: "#9db0c7",
    accent: "#ff8a3d", // forge ember
    accent2: "#3dd6f5", // steel cyan
    ok: "#4ade80",
    danger: "#ff6b6b",
  },
  ranks: [
    { name: "Hatchling", xp: 0 },
    { name: "Fledgling", xp: 100 },
    { name: "Talon", xp: 250 },
    { name: "Raptor", xp: 500 },
    { name: "Apex", xp: 900 },
  ],
};
