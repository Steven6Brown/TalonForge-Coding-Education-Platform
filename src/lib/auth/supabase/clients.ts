import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabasePublicEnv } from "../config";

/** Browser client (singleton). Uses only the public anon key; Row Level Security protects data. */
let browser: SupabaseClient | null = null;
export function getBrowserClient(): SupabaseClient {
  if (!browser) {
    const { url, anonKey } = supabasePublicEnv();
    browser = createBrowserClient(url, anonKey);
  }
  return browser;
}

type CookieStore = {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options?: Record<string, unknown>): void;
};

/** Server client bound to the request's cookies (server components, route handlers, server actions). */
export function getServerClient(cookies: CookieStore): SupabaseClient {
  const { url, anonKey } = supabasePublicEnv();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) => cookies.set(name, value, options));
        } catch {
          // Called from a Server Component where cookies are read-only: middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Service-role client: BYPASSES Row Level Security. Server-only, never import from client code.
 * Used for narrowly scoped admin operations (MFA recovery codes, removing a lost factor).
 */
export function getServiceClient(): SupabaseClient {
  const { url } = supabasePublicEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
