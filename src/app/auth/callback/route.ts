import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_ENABLED } from "@/lib/auth/config";
import { safeNext } from "@/lib/auth/redirect";
import { getServerClient } from "@/lib/auth/supabase/clients";

/** OAuth (Google/GitHub) return URL: exchanges the one-time code for a session cookie. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  if (!AUTH_ENABLED) return NextResponse.redirect(`${origin}/`);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), "/"); // prevents open redirects

  if (code) {
    const supabase = getServerClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
