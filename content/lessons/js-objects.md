## A lookup table

Sometimes a list isn't enough; you want to ask "what's the value for `role`?". An **object** stores values under names called **keys**.

```
const user = { name: "Ana", role: "admin" };
user.role            // "admin"
user["role"]         // same thing
user.team = "blue";  // add a new key
```

## When to use bracket notation

If the key name comes from a variable, use brackets: `settings[key] = value`. Dot notation always means the literal name you typed.

## Objects in the real world

- **HTTP headers** become an object: `{ host: "example.com", cookie: "session=abc" }`.
- **JSON** (the format most APIs use) is just objects and arrays written as text. `JSON.stringify(obj)` turns an object into JSON text; `JSON.parse(text)` turns text back into an object.
- **Counting things** (failed logins per IP) is an object where each key is an IP and each value is a count.

## A safety note

If keys come from untrusted input (like a request), be careful: special keys such as `__proto__` can cause security bugs called **prototype pollution**. Validate keys against an allowlist when it matters.

## Your task

Turn `"key=value"` texts into an object.
