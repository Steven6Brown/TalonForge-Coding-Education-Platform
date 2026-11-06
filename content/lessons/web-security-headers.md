## Start here

**Before this lesson:** the JavaScript Foundations track (arrays, objects, functions) and "Anatomy of an HTTP Request".

## What is an HTTP header?

When your browser loads a page, the server's reply has two parts: the **headers** (small labelled settings about the reply) and the **body** (the page itself). Headers look like this:

```
Content-Type: text/html
Strict-Transport-Security: max-age=31536000
```

Each line is `Name: value`. Some headers just describe the content. **Security headers** instruct the browser to switch on protections, such as "never load this site over plain HTTP". If the server forgets to send them, the protections are off, which is why security scanners check for missing headers.

## See them yourself

In your browser press F12, open the **Network** tab, reload the page, click the first request and look at **Response Headers**.

## How the lab represents headers

A JavaScript **object**, where each key is a header name and each value is its setting:

```js
const headers = { "Content-Type": "text/html", "X-Frame-Options": "DENY" };
```

`Object.keys(headers)` lists the names. Header names are **case-insensitive**, so `X-Frame-Options` and `x-frame-options` mean the same thing; convert to lowercase before comparing.

## Your plan

1. Make a list of the lowercase names that **are** present.
2. From the REQUIRED list, keep the names that are **not** in that list.
3. Return that list. Run to see whether the checks pass.

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
