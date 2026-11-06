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
