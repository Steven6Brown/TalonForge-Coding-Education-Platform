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
