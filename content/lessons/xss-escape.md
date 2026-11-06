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

## Walk-through: why escaping works

**The bug in one picture.** Suppose a page builds its HTML like this:

```js
const html = "<p>Comment: " + comment + "</p>";
```

If `comment` is `Nice post`, the browser shows `Comment: Nice post`. If `comment` is `<script>alert(1)</script>`, the browser sees a real `<script>` tag and **runs it**. The page treated the user's text as code.

**The fix in one picture.** Before putting text into HTML, replace the characters that have special meaning with harmless **entities**:

```
&  becomes  &amp;
<  becomes  &lt;
>  becomes  &gt;
"  becomes  &quot;
'  becomes  &#39;
```

Now `<script>` is sent as `&lt;script&gt;`. The browser **displays** the characters `<script>` as text instead of running them.

## How to write the function

Chain `replace` calls. Because `replace("<", "&lt;")` only changes the first match, use a regular expression with the `g` flag, or `replaceAll`:

```js
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")   // FIRST
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
```

**Why `&` must be first:** if you escaped `<` first you would get `&lt;`, and a later `&` replacement would turn it into `&amp;lt;`, which shows up on the page as the wrong characters. Do `&` first, then the others.

## Try it

```js
console.log(escapeHtml("<b>hi</b>"));
```

Output: `&lt;b&gt;hi&lt;/b&gt;`. The tests in the lab also try quotes and tricky payloads, so remember `"` and `'` too.

## If something goes wrong

- Only the first `<` was escaped: you used a plain string in `replace`, not a regex with `/g`.
- You see `&amp;lt;`: you escaped `&` after the others.

## Check yourself

Where should escaping happen: when saving input or when displaying output? (At **output**, for the place the text lands: HTML, an attribute, a URL, JavaScript. Each context needs its own escaping.)
