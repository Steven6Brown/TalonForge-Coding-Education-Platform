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
