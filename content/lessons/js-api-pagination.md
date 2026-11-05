## APIs return pages

Most APIs limit results per request and give you a way to ask for the next page (a `next` link or cursor). Automation must loop until there is no next page.

```js
let n = 1;
while (n) {
  const page = await fetchPage(n);
  // use page.items
  n = page.next;
}
```

`async`/`await` lets you write asynchronous code in order. Also respect rate limits, send tokens in headers (never in URLs), and set timeouts.

## Your task

Implement `collectAll()` against the fake API in the editor.
