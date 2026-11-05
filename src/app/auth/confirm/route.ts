import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_ENABLED } from "@/lib/auth/config";
import { safeNext } from "@/lib/auth/redirect";
import { getServerClient } from "@/lib/auth/supabase/clients";

const TYPES: EmailOtpType[] = ["signup", "recovery", "email", "invite", "magiclink", "email_change"];

/**
 * Landing URL for email links (verify email, reset password). Verifies the one-time token hash,
 * creates the session, then forwards to a validated same-site path.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  if (!AUTH_ENABLED) return NextResponse.redirect(`${origin}/`);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"), "/");

  if (tokenHash && type && TYPES.includes(type)) {
    const supabase = getServerClient(await cookies());
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=link`);
}
