import { AUTH_ENABLED } from "./config";
import { disabledProvider } from "./disabled-provider";
import { supabaseProvider } from "./supabase/provider";
import type { AuthProvider } from "./types";

/**
 * Single switch point for the auth backend. To use a different provider (Clerk, Auth.js, ...),
 * implement AuthProvider and return it here; no UI code needs to change.
 */
export const auth: AuthProvider = AUTH_ENABLED ? supabaseProvider : disabledProvider;

export { AUTH_ENABLED } from "./config";
export type * from "./types";
