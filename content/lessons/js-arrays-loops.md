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
