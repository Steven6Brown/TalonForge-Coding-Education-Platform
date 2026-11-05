## Why JavaScript?

JavaScript is the language of the browser, and increasingly of servers (Node.js). To understand web security you must read it fluently: every XSS bug, every client-side check, every API call is JavaScript.

Your code runs in an isolated **Web Worker** with network access blocked, so experiment freely.

## Core ideas

```js
const scan = [{ port: 22, state: "open" }, { port: 23, state: "closed" }];

const open = scan
  .filter(r => r.state === "open")   // keep matches
  .map(r => r.port);                 // transform

console.log(open.join(","));         // "22"
```

- `const` / `let` declare variables. Prefer `const`.
- Arrow functions: `x => x * 2`.
- Array methods `filter`, `map`, `sort`, `join` replace most loops.
- `===` compares without type coercion. Always use it over `==`.

## A famous gotcha

`[10, 9, 1].sort()` gives `[1, 10, 9]` because the default sort is **alphabetical**. For numbers pass a comparator: `.sort((a, b) => a - b)`.

## Your task

From the scan results, print the open ports ascending, comma-separated. Use `console.log` to show output.
