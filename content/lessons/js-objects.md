## A lookup table

Sometimes a list isn't enough; you want to ask "what's the value for `role`?". An **object** stores values under names called **keys**.

```
const user = { name: "Ana", role: "admin" };
user.role            // "admin"
user["role"]         // same thing
user.team = "blue";  // add a new key
```

## When to use bracket notation

If the key name comes from a variable, use brackets: `settings[key] = value`. Dot notation always means the literal name you typed.

## Objects in the real world

- **HTTP headers** become an object: `{ host: "example.com", cookie: "session=abc" }`.
- **JSON** (the format most APIs use) is just objects and arrays written as text. `JSON.stringify(obj)` turns an object into JSON text; `JSON.parse(text)` turns text back into an object.
- **Counting things** (failed logins per IP) is an object where each key is an IP and each value is a count.

## A safety note

If keys come from untrusted input (like a request), be careful: special keys such as `__proto__` can cause security bugs called **prototype pollution**. Validate keys against an allowlist when it matters.

## Your task

Turn `"key=value"` texts into an object.

## Walk-through: try these in the editor

**1. Create and read an object**

```js
const user = { name: "Ana", role: "admin" };
console.log(user.name);
console.log(user["role"]);
```

Output: `Ana` then `admin`. The braces hold `key: value` pairs separated by commas. Dot and bracket reads are two ways to say the same thing.

**2. Add and change values**

```js
user.team = "blue";
user.role = "analyst";
console.log(user);
```

Output: `{ name: 'Ana', role: 'analyst', team: 'blue' }`. Assigning to a key that exists changes it; assigning to a new key adds it.

**3. Use a variable as the key (brackets needed)**

```js
const key = "role";
console.log(user.key);
console.log(user[key]);
```

Output: `undefined` then `analyst`. `user.key` looks for a key literally named "key". `user[key]` uses the **value** of the variable `key`, which is `"role"`.

**4. Turn `key=value` text into an object**

```js
const obj = {};
const pair = "host=example.com";
const eq = pair.indexOf("=");
obj[pair.slice(0, eq)] = pair.slice(eq + 1);
console.log(obj);
```

Output: `{ host: 'example.com' }`. Find the `=`, take what is before it as the key and after it as the value. Do this for every pair in a loop and you have the lab.

## If something goes wrong

- `undefined` when you read a key: it does not exist (check spelling and capitals) or you used dot notation with a variable name.
- `TypeError: Cannot read properties of undefined`: you tried `a.b` when `a` itself is undefined.

## Check yourself

With `const o = { a: 1 }`, what does `o.b` give? (`undefined`, because there is no such key.)
