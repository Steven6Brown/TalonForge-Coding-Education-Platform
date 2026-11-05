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
