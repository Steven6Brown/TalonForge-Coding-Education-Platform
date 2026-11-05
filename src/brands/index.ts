import type { Brand } from "./types";
import { talonforge } from "./talonforge";

/**
 * Brand registry. To white-label for a company:
 *  1. Copy talonforge.ts to e.g. acme.ts and change colors/name/ranks.
 *  2. Register it below.
 *  3. Build with NEXT_PUBLIC_BRAND=acme (one deployment per tenant).
 */
const BRANDS: Record<string, Brand> = { talonforge };

export function getBrand(): Brand {
  return BRANDS[process.env.NEXT_PUBLIC_BRAND ?? "talonforge"] ?? talonforge;
}

export const brand = getBrand();
export type { Brand };
