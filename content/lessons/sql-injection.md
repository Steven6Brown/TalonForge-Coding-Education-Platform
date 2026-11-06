## The bug

**SQL injection** happens when user input becomes part of the SQL *code*. Imagine a login that builds:

```
SELECT id FROM users WHERE username = '<input>' AND password_hash = '<input>'
```

If the username is `' OR '1'='1`, the query becomes:

```
... WHERE username = '' OR '1'='1' AND password_hash = '...'
```

The condition is now always true and the attacker is logged in. Worse variants read whole tables (`UNION SELECT`) or modify data.

## The fix: parameterized queries

Send the SQL text and the values **separately**. The database treats values purely as data, so quotes inside them are harmless.

```js
db.query("SELECT id FROM users WHERE username = ? AND password_hash = ?", [username, hash]);
```

Every mainstream language supports this: prepared statements in Java/C#/PHP, `cursor.execute(sql, params)` in Python, query builders and ORMs (use their parameter features, not raw string concatenation).

## Defense in depth

- Validate input type and length.
- Use a database account with least privilege (no DROP, no file access).
- Don't show raw database errors to users.
- Hash passwords with Argon2/bcrypt. Never compare plaintext in SQL.
- Add a WAF as a speed bump, not a cure.

## Your task

`buildLogin` is vulnerable. Rewrite it to return a parameterized query. Hidden tests try the classic payload.

> Practice attacks only on deliberately vulnerable apps you run locally (DVWA, Juice Shop).

## Walk-through: see the bug happen, then see it stop

**The vulnerable code builds the query by gluing text together:**

```js
const sql = "SELECT id FROM users WHERE username = '" + username + "' AND password_hash = '" + hash + "'";
```

**With a normal user**, `username` is `ana` and the query is:

```
SELECT id FROM users WHERE username = 'ana' AND password_hash = 'x'
```

**With an attacker** who types `' OR '1'='1` as the username, the text pasted in contains its own quote marks. The finished query is:

```
SELECT id FROM users WHERE username = '' OR '1'='1' AND password_hash = 'x'
```

Read it as the database does: `'1'='1'` is always true, so the `OR` makes the filter match rows no matter what the password is. The attacker's text stopped being *data* and became part of the *instructions*. That is injection.

**The fix keeps instructions and data apart:**

```js
return {
  sql: "SELECT id FROM users WHERE username = ? AND password_hash = ?",
  params: [username, passwordHash],
};
```

The `?` marks are placeholders. The database receives the query shape first, and the values separately, so the attacker's quotes are treated as ordinary characters of a very strange username. Nothing can change the meaning of the query.

## What to change in the lab

1. Replace the long concatenated string with the one above (placeholders, **no quotes around `?`**).
2. Move `username` and `passwordHash` into the `params` array, in the same order as the `?` marks.
3. Run: the hidden checks confirm no user-supplied text appears inside the SQL string.

## If something goes wrong

- Test says user text is still in the SQL: you still have a `+` joining variables into the string.
- You wrote `'?'` with quotes: remove them. The placeholder is just `?`.

## Check yourself

Why does adding a "filter" that removes quote characters make a poor fix? (Attackers find other ways around filters. Parameterized queries remove the problem entirely instead of trying to spot bad input.)
