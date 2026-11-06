## Password complexity policies

A **password complexity policy** is meant to deter brute-force guessing by increasing the number of possible passwords. A classic rule set (similar to older Windows domain policies):

- the password must **not contain the user's account name**,
- it must be **at least eight characters** long, and
- it must include characters from **several categories**: uppercase letters, lowercase letters, digits and non-alphanumeric symbols (`! $ # %`). (Windows' built-in rule requires three of the four categories.)

Policies should also force changing **default** administrator and device credentials.

## Why complexity alone isn't enough

Rules such as "one capital, one digit, one symbol" produce predictable passwords like `Password1!`. Current guidance (for example NIST SP 800-63B) prefers:

- **length** (long passphrases, with a sensible minimum of 8-15 and allowing 64 or more),
- **blocklists** of known-bad and breached passwords,
- **no forced periodic changes** unless a compromise is suspected,
- **MFA** wherever possible, and **rate limiting or lockout** for guessing.

A good policy mixes both: reject weak choices and make strong ones easy (allow paste, support password managers).

## Implementing a checker

Return **every** rule that fails so users can fix them all at once. Test categories with regular expressions: `/[A-Z]/`, `/[a-z]/`, `/\d/`, `/[^A-Za-z0-9]/`. Compare usernames case-insensitively. Remember that client-side checks are only user experience: **enforce the policy on the server**.

## Your task

Implement `passwordProblems` for the classic rules above.

## Walk-through: checking a password against rules

Try the password `Ana123` for the user `ana`. Go through the three rules in order and record each failure:

1. **At least 8 characters?** `Ana123` has 6. Fails: add `"too short"`.
2. **Does it contain the username (ignoring case)?** Lowercase both: `ana123` contains `ana`. Fails: add `"contains username"`.
3. **At least 3 of 4 character types** (uppercase, lowercase, digits, symbols)? It has uppercase `A`, lowercase `na`, digits `123`: that is 3 types. Passes.

Result: `["too short", "contains username"]`.

## How to test the character types

Four tiny patterns, each tested against the password:

```js
[/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length
```

`filter` keeps the patterns that matched; `.length` counts them.

## The limits of complexity rules

`Password1!` passes every typical rule yet is one of the most guessed passwords. Rules push people toward predictable tricks (capital first letter, `1` or `!` at the end). Modern guidance (NIST) prefers **length**, checking against **breached-password lists**, no forced periodic changes, and **MFA**. Complexity rules are a floor, not a goal.

## If something goes wrong

- Problems appear in the wrong order: check the rules in the order the task lists them.
- The username rule fires when no username was given: only test it when `username` is set.

## Check yourself

Is a 20-character phrase of four common words stronger or weaker than `P@ssw0rd`? (Stronger: length and unpredictability beat clever substitutions.)
