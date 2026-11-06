## HTTP in one picture

Every page load is a text conversation. Your browser sends a **request**; the server returns a **response**.

```
GET /login HTTP/1.1
Host: example.com
User-Agent: curl/8.4.0
Cookie: session=abc123

```

- **Request line:** method (`GET`, `POST`, `PUT`, `DELETE`), path, version.
- **Headers:** `Name: value` lines. `Host` picks the site, `Cookie` carries your session, `User-Agent` names the client.
- A **blank line** ends the headers; a body (for POST) follows.

Responses start with a status line, e.g. `200 OK`, `301 Moved`, `403 Forbidden`, `404 Not Found`, `500 Server Error`, followed by headers (`Set-Cookie`, `Content-Type`, `Content-Security-Policy`...) and a body.

## Why attackers and defenders care

- **Cookies** prove who you are. Stolen session cookie = stolen login. Good cookies are `HttpOnly`, `Secure` and `SameSite`.
- **Security headers** (CSP, HSTS, X-Content-Type-Options) tell browsers to refuse risky behavior.
- **Never trust request data.** Every header, path and body field is attacker-controlled.

## Try it for real

On your own machine, open a **terminal** (not the code editor below) and run `curl -i https://example.com` to print a real response with headers. Your browser's DevTools → Network tab shows the same thing. Important: that `curl` line is a **terminal command**; pasting it into the JavaScript editor causes a `SyntaxError`, because it isn't JavaScript.

## New to JavaScript?

This lab uses ideas from the **JavaScript Foundations** track: strings (`split`, `indexOf`, `slice`, `trim`), loops with `break`, objects, and functions that `return`. The lab below explains each one step by step and has a plan and a runnable example. If anything is unfamiliar, do the foundations lessons first (they take about two hours in total).

## Your task

Implement `parseHeaders(raw)` so it returns an object of lowercase names to values. Hidden tests check it.
