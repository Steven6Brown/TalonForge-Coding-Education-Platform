## Giving values names

Programs juggle values: user names, counts, IP addresses. A **variable** gives a value a name so you can use it again and change it. You'll create variables in almost every program you ever write.

## `const` versus `let`

- `const` for values that never change (preferred).
- `let` for values that will change (like a counter).

Variable names are **case-sensitive** (`user` and `User` are different), can't start with a digit and can't contain spaces. Use camelCase for several words: `failedLogins`.

## Types you'll use constantly

- **Strings** (text): `"student"`
- **Numbers**: `3`, `3.5`
- **Booleans**: `true`, `false`
- Also `undefined` (no value yet) and `null` (deliberately empty).

A common beginner trap: `"3"` (text) and `3` (number) are **different**. `"3" + 1` gives `"31"` (text glued together) while `3 + 1` gives `4`.

## Template literals

Backticks let you put values inside text with `${ }`. This is much easier than gluing strings with `+` and it's how you'd build log messages like `Failed login for ${user} from ${ip}`.

## Your task

Use two existing variables to print `student failed 3 logins`.

## Walk-through: try these in the editor

Type each block, press **Run**, and compare with the output shown. Changing a value and running again is the fastest way to learn.

**1. A variable and a message**

```js
const user = "student";
console.log(user);
```

Output: `student`. `const user = "student"` creates a variable named `user` holding the text `student`. The text is in quotes. `console.log(...)` prints whatever is inside the parentheses.

**2. Text versus numbers**

```js
console.log("3" + 1);
console.log(3 + 1);
```

Output: `31` then `4`. With quotes `"3"` is *text*, so `+` glues text together. Without quotes `3` is a *number*, so `+` adds.

**3. A counter that changes**

```js
let count = 0;
count = count + 1;
count = count + 1;
console.log(count);
```

Output: `2`. Use `let` when the value will change. (If you used `const` here you would get `TypeError: Assignment to constant variable`: JavaScript is protecting a value you said would never change.)

**4. A template literal (note the backticks, not quotes)**

```js
const user = "student";
const n = 3;
console.log(`${user} failed ${n} logins`);
```

Output: `student failed 3 logins`. Inside backticks, `${...}` is replaced by the value of what is inside.

## If something goes wrong

- `ReferenceError: user is not defined`: you used a name that was never created, or you spelled it differently (names are case-sensitive).
- `SyntaxError`: a quote or bracket is missing. Check that every opening quote has a closing one.
- Nothing printed: you forgot `console.log(...)`.

## Check yourself

Without running it, what does `console.log("5" + "5")` print? (Answer: `55`, because both are text.) Then run it to see.
