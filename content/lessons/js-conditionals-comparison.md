## Programs make choices

An `if` statement runs code only when a condition is true. Security tools are full of decisions: *is this IP blocked? is this status code an error? is this password long enough?*

## HTTP status codes by range

The first digit tells you the category:

- **2xx success** (200 OK)
- **3xx redirect** (301 Moved, 302 Found)
- **4xx client error** (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
- **5xx server error** (500 Internal Server Error, 503 Unavailable)

A burst of 404s from one client can mean directory probing; many 401s can mean password guessing; 5xx spikes can mean an attack or an outage.

## Order matters

Conditions are checked from the top, and the first true one wins. Put specific checks before general ones.

## Common beginner mistakes

- Using `=` (assign) instead of `===` (compare).
- Writing `200 <= code <= 299` (JavaScript doesn't chain comparisons like math). Use `code >= 200 && code <= 299`.
- Forgetting a final `return` for the case nothing matched.

## Your task

Implement `statusClass(code)` for the four HTTP ranges.
