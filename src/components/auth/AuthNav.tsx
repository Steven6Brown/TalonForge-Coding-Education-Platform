"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { useAuthUser } from "./hooks";

/** Header account controls. Renders nothing while accounts are disabled. */
export function AuthNav() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  if (!auth.enabled) return null;
  if (loading) return <div className="auth-nav" aria-hidden="true" />;

  if (!user) {
    return (
      <div className="auth-nav">
        <Link className="btn small" href="/login">Log in</Link>
        <Link className="btn small primary" href="/signup">Sign up</Link>
      </div>
    );
  }
  return (
    <div className="auth-nav">
      {user.role === "admin" && <Link href="/admin">Admin</Link>}
      <Link href="/account">Account</Link>
      <button
        className="btn small"
        onClick={async () => {
          await auth.signOut("local");
          router.push("/");
          router.refresh();
        }}
      >
        Log out
      </button>
    </div>
  );
}
