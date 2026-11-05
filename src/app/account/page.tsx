import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { SecurityPanel } from "@/components/auth/SecurityPanel";
import { AUTH_ENABLED } from "@/lib/auth/config";
import { requireUser } from "@/lib/auth/server/session";

export const metadata: Metadata = { title: "Account", robots: { index: false } };
export const dynamic = "force-dynamic"; // per-user page: never cache or share between users

export default async function AccountPage() {
  if (!AUTH_ENABLED) return <AuthCard title="Account"><></></AuthCard>;
  const user = await requireUser("/account");
  return (
    <>
      <h1>Account & security</h1>
      <SecurityPanel user={user} />
    </>
  );
}
