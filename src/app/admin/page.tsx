import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthCard } from "@/components/auth/AuthCard";
import { AUTH_ENABLED } from "@/lib/auth/config";
import { requireRole } from "@/lib/auth/server/session";
import { getServerClient } from "@/lib/auth/supabase/clients";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Admin console: recent security events. Authorization is enforced HERE (role) and again by RLS in the database. */
export default async function AdminPage() {
  if (!AUTH_ENABLED) return <AuthCard title="Admin"><></></AuthCard>;
  await requireRole("admin", "/admin");
  const supabase = getServerClient(await cookies());
  const { data: events } = await supabase
    .from("audit_log")
    .select("id, user_id, event, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return (
    <>
      <h1>Admin</h1>
      <h2>Recent security events</h2>
      <div className="card atlas-table">
        <table>
          <thead>
            <tr><th scope="col">When (UTC)</th><th scope="col">Event</th><th scope="col">User</th></tr>
          </thead>
          <tbody>
            {(events ?? []).map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.created_at).toISOString().replace("T", " ").slice(0, 19)}</td>
                <td>{e.event}</td>
                <td className="muted small">{String(e.user_id ?? "").slice(0, 8)}</td>
              </tr>
            ))}
            {(events ?? []).length === 0 && <tr><td colSpan={3} className="muted">No events yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
