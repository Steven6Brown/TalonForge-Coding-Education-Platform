const isDev = process.env.NODE_ENV !== "production";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

// Page CSP. Next.js needs inline scripts for hydration (no nonce pipeline in the MVP),
// so 'unsafe-inline' is documented as a known limitation in SECURITY.md.
const pageCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  // Supabase host is only allowed when accounts are configured.
  `connect-src 'self'${supabaseUrl ? ` ${supabaseUrl}` : ""}${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// The JavaScript sandbox worker runs learner code. It gets its OWN policy (workers use the
// CSP of their script response): eval is allowed, but ALL network access is blocked.
const jsWorkerCsp =
  "default-src 'none'; script-src 'self' 'unsafe-eval'; connect-src 'none'";

// The Python (Pyodide) worker needs the Pyodide CDN + WebAssembly. Network is limited to that CDN.
const pyWorkerCsp =
  "default-src 'none'; script-src 'self' https://cdn.jsdelivr.net 'unsafe-eval' 'wasm-unsafe-eval'; connect-src https://cdn.jsdelivr.net";

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
const hsts = { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/((?!workers/).*)",
        headers: [
          ...baseHeaders,
          ...(isDev ? [] : [hsts]),
          { key: "Content-Security-Policy", value: pageCsp },
        ],
      },
      {
        source: "/workers/js-runner.js",
        headers: [...baseHeaders, { key: "Content-Security-Policy", value: jsWorkerCsp }],
      },
      {
        source: "/workers/py-runner.js",
        headers: [...baseHeaders, { key: "Content-Security-Policy", value: pyWorkerCsp }],
      },
    ];
  },
};

export default nextConfig;
