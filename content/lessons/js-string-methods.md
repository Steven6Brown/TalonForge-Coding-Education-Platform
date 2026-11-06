## Text is the raw material of security

Logs, HTTP headers, URLs, usernames, emails and passwords are all text. Most of security scripting is **cutting up text and looking at the pieces**.

## The toolbox

| Tool | What it does | Example |
| --- | --- | --- |
| `text.length` | how many characters | `"abc".length` is 3 |
| `text.indexOf("x")` | position of the first `x` (or -1) | `"a:b".indexOf(":")` is 1 |
| `text.slice(a, b)` | the piece from index a up to (not including) b | `"hello".slice(1, 3)` is `"el"` |
| `text.trim()` | removes spaces at both ends | `"  hi ".trim()` is `"hi"` |
| `text.toLowerCase()` | all lowercase | |
| `text.includes("x")` | true/false: does it contain x? | |
| `text.split(",")` | cut into an array at each comma | |
| `array.join("-")` | glue an array back into text | |

## The pattern you'll reuse everywhere

To split `Name: value` at the **first** colon:

```
const colon = line.indexOf(":");
const name = line.slice(0, colon);
const value = line.slice(colon + 1);
```

Why `colon + 1`? Because `slice(colon)` would **include** the colon itself; adding 1 starts after it.

Splitting on the first colon only matters because values can contain colons too (`Host: example.com:8080`), so `split(":")` would break them apart.

## Your task

Print the value of `Host: example.com` (without the space).
