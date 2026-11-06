## Errors are information, not failure

Every programmer sees errors constantly. They tell you **what** went wrong and usually **where**. Learning to read them is the fastest way to improve.

## The most common JavaScript errors

| Message | Usual cause | Fix |
| --- | --- | --- |
| `SyntaxError: Unexpected identifier` | text that isn't JavaScript, or a missing comma/quote just before | remove stray text; check the line above |
| `SyntaxError: Unexpected token` | a bracket, comma or quote in the wrong place | check brackets and commas |
| `SyntaxError: Unexpected end of input` | an unclosed `{`, `(` or `[` | count your brackets |
| `ReferenceError: x is not defined` | misspelled name, or used before creating it | check spelling and capitals; declare with const/let |
| `TypeError: x is not a function` | calling something that isn't a function | check the name and type |
| `TypeError: Cannot read properties of undefined` | using a value that doesn't exist | print it first; check indexes and keys |
| `TypeError: Assignment to constant variable` | changing a `const` | use `let` |

## A debugging routine

1. Read the message and the line it points to.
2. Add `console.log(variable)` to see what values really are.
3. Change **one** thing at a time and run again.
4. Explain the problem out loud (or to the app's helper): often you spot it mid-sentence.

## Where code goes (and doesn't)

The editor accepts only JavaScript. Terminal commands like `curl -i https://example.com` or `ls -la` are not JavaScript; if you paste them into the editor you'll get a SyntaxError. Run commands in a terminal on your own computer, or in the simulated terminals in this app.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Extra output lines are fine.** A lab passes when the **last non-empty line** of your output equals the expected answer. That means you can leave `console.log` debug lines earlier in your output while you work. Just make sure the final line printed is the answer.

## Worked examples: read the message, find the line, fix it

Every error message has the same shape: **the kind of error**, **what went wrong**, and often **where**.

**1. SyntaxError: the code is not valid JavaScript.**

```js
console.log("hello);
```

Error: `SyntaxError: Invalid or unexpected token`. A quote was opened and never closed. Fix: `console.log("hello");`. Typical causes: missing quote, bracket or parenthesis, or pasting text that is not JavaScript at all (like a terminal command).

**2. ReferenceError: you used a name that does not exist.**

```js
console.log(usr);
```

Error: `ReferenceError: usr is not defined`. You meant `user`, or you never created the variable. Check spelling and capitals.

**3. TypeError: you used a value the wrong way.**

```js
const n = 5;
n.toUpperCase();
```

Error: `TypeError: n.toUpperCase is not a function`. Numbers have no `toUpperCase`. Check what type you really have: `console.log(typeof n)`.

**4. Your answer is right but the lab says it failed.** The lab compares the **last non-empty line** of output. Extra debug lines before it are fine, but anything printed *after* the answer breaks the match. Remove stray prints at the end.

## A repeatable debugging habit

1. Read the message out loud.
2. Look at the line number and the line before it.
3. Print the values you are unsure about with `console.log`.
4. Change one thing, run again.

## Self-check

1. What kind of error is a missing closing quote? (SyntaxError.)
2. If extra lines print before the correct answer, does the lab still pass? (Yes: only the last non-empty line is checked.)
