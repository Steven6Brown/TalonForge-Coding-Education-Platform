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
