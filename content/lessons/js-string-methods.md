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

## Walk-through: try these in the editor

**1. Length and position**

```js
const line = "Host: example.com";
console.log(line.length);
console.log(line.indexOf(":"));
```

Output: `17` then `4`. The text has 17 characters. Counting from **0**, the colon is at position 4 (H=0, o=1, s=2, t=3, :=4).

**2. Cutting out a piece**

```js
console.log(line.slice(0, 4));
console.log(line.slice(6));
```

Output: `Host` then `example.com`. `slice(0, 4)` means "from position 0 up to, but not including, position 4". `slice(6)` with one number means "from position 6 to the end".

**3. Cutting around the first colon**

```js
const colon = line.indexOf(":");
const name = line.slice(0, colon);
const value = line.slice(colon + 1).trim();
console.log(name);
console.log(value);
```

Output: `Host` then `example.com`. `slice(colon + 1)` starts *after* the colon, but that leaves a space at the front (`" example.com"`). `.trim()` removes it. This is the pattern the lab needs.

**4. Split and join**

```js
const parts = "a,b,c".split(",");
console.log(parts);
console.log(parts.join(" - "));
```

Output: `[ 'a', 'b', 'c' ]` then `a - b - c`.

## If something goes wrong

- `indexOf` returned `-1`: the text you searched for is not there (check spelling and capitals).
- Extra space in your answer: add `.trim()`. The lab compares exactly, so `" example.com"` is not `"example.com"`.
- `TypeError: line.slice is not a function`: `line` is not text (maybe a number or undefined).

## Check yourself

What does `"abcdef".slice(2, 4)` give? (`cd`: positions 2 and 3.)
