## What is XSS?

**Cross-Site Scripting** happens when an app puts untrusted text into a web page *as code*. If a comment box accepts `<script>steal(document.cookie)</script>` and the site prints it back unescaped, every visitor's browser runs the attacker's script.

Impact: session theft, account takeover, defacement, malicious redirects.

## Three flavors

- **Reflected:** payload in a URL/parameter is echoed immediately.
- **Stored:** payload is saved (comment, profile) and served to others.
- **DOM-based:** client-side JavaScript writes untrusted data into the page (`innerHTML`).

## Defense in depth

1. **Output encoding** - escape `& < > " '` for the context where data lands. Frameworks like React do this by default; bypasses like `dangerouslySetInnerHTML` bring the bug back.
2. Use `textContent` instead of `innerHTML`.
3. **Content-Security-Policy** header to block inline scripts.
4. `HttpOnly` cookies so scripts can't read sessions.
5. Sanitize rich HTML with a vetted library (e.g. DOMPurify), never hand-rolled regexes.

## Order matters

When escaping, replace `&` **first**. Otherwise `<` becomes `&lt;` and then the `&` gets escaped into `&amp;lt;`.

## Your task

Write `escapeHtml(s)`. Hidden tests try classic payloads. Passing proves the fix; the real lesson is *where* to apply it: at output, for the right context.

> Practice attacking only on training apps you run locally (OWASP Juice Shop, DVWA).
