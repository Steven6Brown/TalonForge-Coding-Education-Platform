## Doing something for every item

A log file has thousands of lines. You can't write code for each one, so you **loop**: write the instructions once and let the computer repeat them.

## Arrays

An array is an ordered list: `["a", "b", "c"]`. Items have positions starting at **0**. `array.length` is the number of items, so the last item is at `length - 1`. A very common bug is an **off-by-one**: using `<=` instead of `<` in a loop condition, which goes one step past the end.

## Two kinds of loop

```
for (let i = 0; i < items.length; i++) { ... items[i] ... }   // when you need the position
for (const item of items) { ... item ... }                      // when you just need each value
```

## Stopping or skipping

- `break` leaves the loop completely.
- `continue` skips to the next item.

## Why this matters for HTTP and logs

HTTP requests are lines of text. The first line is the request line, then header lines, then an **empty line**, then the body. To read headers you loop over lines, **skip the first**, and **stop at the first empty line**: exactly the lab you're about to do.

## Your task

Collect the header lines and print them joined with ` | `.

## Walk-through: try these in the editor

**1. An array and its positions**

```js
const ports = [22, 80, 443];
console.log(ports[0]);
console.log(ports.length);
```

Output: `22` then `3`. Positions start at 0, so `ports[0]` is the first item. `length` is 3, and the last item is `ports[2]` (`length - 1`).

**2. Loop with a counter**

```js
for (let i = 0; i < ports.length; i++) {
  console.log(i, ports[i]);
}
```

Output: `0 22`, `1 80`, `2 443`. Read the loop header in three parts: start (`let i = 0`), keep going while true (`i < ports.length`), after each round do this (`i++`, add one).

**3. Loop over each value**

```js
for (const p of ports) {
  console.log("port", p);
}
```

Same idea, simpler when you do not need the position.

**4. Building a new list with push and stopping with break**

```js
const lines = ["GET / HTTP/1.1", "Host: a.com", "Cookie: x=1", "", "body text"];
const headers = [];
for (const line of lines.slice(1)) {
  if (line === "") break;
  headers.push(line);
}
console.log(headers.join(" | "));
```

Output: `Host: a.com | Cookie: x=1`. `lines.slice(1)` skips the first line (the request line). `break` stops at the first empty line, where the headers end. `push` adds an item to the end of an array. `join(" | ")` glues the items into text. This is the shape of the next lab.

## If something goes wrong

- Extra `undefined` printed or one item too many: an **off-by-one**. Use `i < length`, not `i <= length`.
- Your list is empty: you forgot `push`, or you broke out of the loop before adding anything.
- The loop never ends: nothing changes the counter, or the condition can never become false.

## Check yourself

If `const a = [10, 20, 30]`, what is `a[a.length - 1]`? (`30`: the last item.)
