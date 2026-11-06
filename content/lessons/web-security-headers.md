## Headers that harden a site

The server can instruct browsers to enable protections by sending response headers.

- **Content-Security-Policy (CSP):** restricts where scripts, styles and other content may load from, limiting the damage of XSS.
- **Strict-Transport-Security (HSTS):** tells browsers to use HTTPS only for the site.
- **X-Content-Type-Options: nosniff:** stops browsers from guessing a file's type (prevents some content-type attacks).
- **X-Frame-Options** (or CSP `frame-ancestors`): prevents the page from being embedded in another site (clickjacking).
- **Referrer-Policy:** controls how much URL information is sent to other sites.
- **Permissions-Policy:** disables browser features the site doesn't need (camera, microphone).

## Cookies

Set session cookies with `Secure`, `HttpOnly` and `SameSite`.

## Checking a site

Browser DevTools → Network → select a request → Response Headers. Online tools and scanners also grade headers. Header names are **case-insensitive**.

## Your task

Write `auditHeaders` to report which recommended headers are missing from a response.
