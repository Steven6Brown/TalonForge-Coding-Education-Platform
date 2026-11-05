"use client";
import { useEffect } from "react";
import { syncProgress } from "@/lib/auth/sync";
import { useAuthUser, useIdleSignOut } from "./hooks";

/** Mounted once in the root layout. Renders nothing; runs idle sign-out and progress sync for signed-in users. */
export function AuthEffects() {
  const { user } = useAuthUser();
  useIdleSignOut(!!user);
  useEffect(() => {
    if (user) void syncProgress(user.id).catch(() => undefined); // sync is best-effort; local data stays intact
  }, [user]);
  return null;
}
