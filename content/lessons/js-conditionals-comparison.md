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

## Walk-through: try these in the editor

**1. A basic if / else**

```js
const code = 404;
if (code === 200) {
  console.log("ok");
} else {
  console.log("not ok");
}
```

Output: `not ok`. `===` asks "are these exactly equal?" and gives `true` or `false`. If true, the first block runs; otherwise the `else` block runs. (A single `=` means *assign*, not compare: a very common slip.)

**2. Several checks in a row**

```js
function describe(code) {
  if (code >= 500) return "server error";
  if (code >= 400) return "client error";
  if (code >= 300) return "redirect";
  if (code >= 200) return "success";
  return "other";
}
console.log(describe(503));
console.log(describe(404));
console.log(describe(200));
```

Output: `server error`, `client error`, `success`. The checks run from the top and the first true one returns. Checking the **highest** range first means each later `>=` implicitly means "below the one above", which is why the order matters.

**3. Combining conditions**

```js
const code = 404;
console.log(code >= 400 && code <= 499);
console.log(code === 200 || code === 201);
```

Output: `true` then `false`. `&&` means **and** (both must be true), `||` means **or** (either), `!` means **not**.

## If something goes wrong

- Your function returns `undefined`: no condition matched and there is no final `return`. Add a default at the end.
- All results look the same: the order of your checks is wrong (a broad check comes first and catches everything).
- `200 <= code <= 299` does not work: write `code >= 200 && code <= 299`.

## Check yourself

What does `describe(301)` return with the function above? (`redirect`: it is not >= 400, but it is >= 300.)
