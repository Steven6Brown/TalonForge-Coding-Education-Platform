## Start here

If JavaScript is new to you, do the **JavaScript Foundations** track first (it starts with "Your First Program"). This lesson assumes you have met variables, arrays, objects and functions. The scaffolding in the lab below explains `filter`, `map`, `sort` and `join` step by step.

## What the task looks like

The data is a list of scan results. A **port scan** checks which network doors ("ports") on a computer are open. Each result says one port and whether it is `open` or `closed`:

```js
const scan = [{ port: 22, state: "open" }, { port: 23, state: "closed" }];
```

Your job is a small pipeline: **keep** the open ones, **extract** just the port numbers, **sort** them smallest to largest, and **join** them into one comma-separated line. Reading the example chain aloud as a sentence helps: "from the scan, keep the open results, then take each port, then sort, then join".

## Why the sort is tricky

JavaScript's plain `.sort()` compares values as **text**, so `10` comes before `9` (the same way "10" comes before "9" in a dictionary). Numbers need a **comparison function**: `.sort((a, b) => a - b)`. The lab's hidden checks include a case that catches the mistake.

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
