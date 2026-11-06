## How logins persist

HTTP is stateless, so after you log in the server gives your browser a **session cookie**: a random ID that identifies your session. The browser sends it with every request, which is also why stealing it is as good as stealing the login.

## Protect the cookie

- `HttpOnly`: scripts can't read it (limits XSS theft).
- `Secure`: only sent over HTTPS.
- `SameSite=Lax` or `Strict`: not sent on most cross-site requests (limits CSRF).
- Use long, random IDs; expire them; **regenerate** the ID at login (prevents session fixation) and destroy it at logout.

## CSRF: cross-site request forgery

Browsers attach cookies automatically. A malicious page can make your browser send a request to a site where you're logged in (for example, "change email"). The site can't tell it from a real one unless it adds defenses:

- **Anti-CSRF tokens:** an unguessable per-session value required on state-changing requests
- **SameSite cookies**
- Checking `Origin`/`Referer` headers
- Requiring re-authentication for sensitive actions

## XSS vs CSRF

XSS runs the attacker's script *in* the site; CSRF makes the victim's browser send a request *to* the site. Defend against both.

## Check yourself

Take the quiz below.

## Worked example: a CSRF attack and how each defense stops it

**Setup.** You are logged in to `bank.example`. Your browser holds a session cookie for it.

**The attack.** You visit a malicious page that contains a hidden form pointing at `bank.example/transfer` with the attacker's account filled in, and the page submits it automatically. Your browser sends the request **and attaches your bank cookie** (browsers do this automatically). The bank sees a valid session and a valid request, and the money moves.

**What stops it:**

| Defense | How it works |
| --- | --- |
| **Anti-CSRF token** | The real transfer form contains a random, per-session token. The attacker's page cannot read it, so its forged request is missing the token and is rejected. |
| **SameSite=Lax/Strict** | The browser does not send the cookie on most cross-site requests, so the forged request arrives without a session. |
| **Checking Origin/Referer** | The server rejects requests that come from another site. |
| **Re-authentication** | A sensitive action asks for the password or a code again. |

**Cookie flags in one line each:** `HttpOnly` (scripts cannot read it, limiting XSS theft), `Secure` (HTTPS only), `SameSite` (limits CSRF).

**Session fixation** is when an attacker gives you a session ID they already know. Fix: generate a **new** ID at login.

## Self-check

1. XSS or CSRF: the attacker's script runs inside the site? (XSS.)
2. XSS or CSRF: the victim's browser is tricked into sending a request? (CSRF.)
3. Which cookie flag limits theft by JavaScript? (`HttpOnly`.)
