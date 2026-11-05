import { z } from "zod";

/**
 * Password policy following NIST SP 800-63B guidance: favor LENGTH, block known-bad passwords,
 * don't force arbitrary composition rules. (Server-side enforcement lives in Supabase settings;
 * this client check is for fast feedback only - never the sole control.)
 */
export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

// Tiny offline blocklist for immediate feedback. Enable Supabase "leaked password protection" for the full HIBP check.
const COMMON = new Set([
  "password", "password1", "password123", "123456789012", "qwertyuiop12", "letmein12345",
  "iloveyou1234", "admin1234567", "welcome12345", "changeme1234", "1234567890ab", "passw0rd1234",
]);

export function passwordIssues(password: string, email?: string): string[] {
  const issues: string[] = [];
  if (password.length < PASSWORD_MIN) issues.push(`Use at least ${PASSWORD_MIN} characters.`);
  if (password.length > PASSWORD_MAX) issues.push(`Use at most ${PASSWORD_MAX} characters.`);
  if (COMMON.has(password.toLowerCase())) issues.push("That password is too common.");
  if (/^(.)\1+$/.test(password)) issues.push("Don't repeat a single character.");
  const local = email?.split("@")[0]?.toLowerCase();
  if (local && local.length >= 4 && password.toLowerCase().includes(local)) {
    issues.push("Don't include your email name in your password.");
  }
  return issues;
}

/** 0-4 rough strength for the meter (length-weighted with variety bonus). */
export function passwordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= PASSWORD_MIN) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
}

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const totpCodeSchema = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code.");
export const recoveryCodeSchema = z.string().trim().toLowerCase().regex(/^[a-z2-9]{5}-[a-z2-9]{5}$/, "Invalid recovery code format.");
