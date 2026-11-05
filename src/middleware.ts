import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_ENABLED } from "@/lib/auth/config";
import { updateSession } from "@/lib/auth/supabase/middleware";

/** With accounts disabled this is a pass-through, so the app has zero auth overhead. */
export async function middleware(request: NextRequest) {
  if (!AUTH_ENABLED) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  // Skip static assets, workers and images; run on pages and auth routes only.
  matcher: ["/((?!_next/static|_next/image|workers/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js)$).*)"],
};
