import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ENABLED } from "../config";
import { getServerClient } from "../supabase/clients";
import type { AuthUser, Role } from "../types";

/** Reads the signed-in user on the server (validated by the Auth server, not just the cookie). */
export async function getServerUser(): Promise<AuthUser | null> {
  if (!AUTH_ENABLED) return null;
  const supabase = getServerClient(await cookies());
  const { data } = await supabase.auth.getUser();
  const u = data.user;
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? "",
    emailVerified: !!u.email_confirmed_at,
    role: u.app_metadata?.role === "admin" ? "admin" : "learner",
  };
}

/** Page-level guard. Middleware is a convenience layer; THIS is the authorization check. */
export async function requireUser(next: string): Promise<AuthUser> {
  const user = await getServerUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireRole(role: Role, next: string): Promise<AuthUser> {
  const user = await requireUser(next);
  if (role === "admin" && user.role !== "admin") redirect("/");
  return user;
}
