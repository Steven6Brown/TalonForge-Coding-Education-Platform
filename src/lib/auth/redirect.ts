/**
 * Open-redirect protection. Only same-site relative paths are allowed as post-login destinations.
 * Rejects: absolute URLs, protocol-relative (//evil.com), backslash tricks, control characters.
 */
export function safeNext(next: string | null | undefined, fallback = "/"): string {
  if (!next || typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(next)) return fallback;
  try {
    const u = new URL(next, "http://placeholder.invalid");
    if (u.origin !== "http://placeholder.invalid") return fallback;
    return u.pathname + u.search + u.hash;
  } catch {
    return fallback;
  }
}
