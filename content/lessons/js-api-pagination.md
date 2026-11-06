## Start here

When you ask a web service for a list ("all my invoices"), it almost never sends everything at once. It sends a **page** (say 50 items) plus a pointer to the next page. Automation has to keep asking until there are no more pages. That is **pagination**, and you will meet it in nearly every API.

**What you need first:** the JavaScript Foundations track: variables, arrays, objects, loops and functions.

## What an API is

An **API** (application programming interface) is a way for programs to talk to each other. Your script sends a **request** ("give me page 2") and gets a **response** (the data). In this lab the API is fake: `fetchPage(n)` is a function that returns a page right away, so you can focus on the logic. Real APIs work the same way over the internet.

Each page looks like this:

```js
{ items: ["a", "b", "c"], next: 2 }
```

`items` is the data. `next` is the number of the next page, or `null` on the last page.

## Idea: async and await

Real requests take time, so they return a **Promise** ("the answer will arrive later"). `await` pauses your function until the answer is ready. A function that uses `await` must be written `async function`:

```js
async function collectAll() {
  const page = await fetchPage(1);
}
```

Forget `await` and you get a Promise object instead of your data. That is the most common beginner mistake here.

## Idea: loop until there is no next page

```js
let n = 1;
while (n) {              // keeps going while n is not null (or 0)
  const page = await fetchPage(n);
  all.push(...page.items);   // add every item to the list
  n = page.next;             // move on; becomes null on the last page
}
```

`all.push(...page.items)` uses the **spread** `...` to add each item separately (without it you would add the whole array as one item).

## Your plan

1. Set `let n = 1` and write the `while (n)` loop.
2. Inside, `await fetchPage(n)`, push the items into `all`, then set `n = page.next`.
3. After the loop, `return all`.
4. Run. You should get `a,b,c,d,e,f` in order.

## Good habits with real APIs

- Respect **rate limits** (do not hammer the server). Add a short pause between requests.
- Send tokens in a request **header**, never in the URL (URLs end up in logs).
- Set a **timeout** and stop after a maximum number of pages so a bug cannot loop forever.
