## Name a piece of logic

A **function** wraps code in a name so you can reuse it, test it and understand it. Programs are built from small functions that each do one job.

## Anatomy

```
function splitHeader(line) {   // name + parameter list
  ...                           // body: the work
  return [name, value];         // the answer handed back
}

const result = splitHeader("Host: example.com");   // calling it
```

- **Parameters** are the inputs.
- **`return`** is the output. Without it you get `undefined`.
- Variables created **inside** a function are private to it.

## return versus console.log

`console.log` only **shows** something to a human. `return` **gives a value back** so other code can use it. Hidden tests in labs call your function and check what it **returns**, so printing instead of returning will fail.

## Arrow functions (you'll see them)

`const double = (n) => n * 2;` is a shorter way to write a function. Same idea.

## Your task

Finish `splitHeader` so it returns `[name, value]`.

## Walk-through: try these in the editor

**1. Define and call a function**

```js
function double(n) {
  return n * 2;
}
console.log(double(4));
```

Output: `8`. Defining a function only *describes* it; nothing happens until you **call** it with `double(4)`. The `4` is an **argument** and becomes the parameter `n` inside.

**2. Return versus print**

```js
function a(n) { console.log(n * 2); }
function b(n) { return n * 2; }
const x = a(4);
const y = b(4);
console.log(x, y);
```

Output: `8` (printed by `a`), then `undefined 8`. `a` only shows the value and gives nothing back, so `x` is `undefined`. `b` hands the value back, so `y` is `8`. Hidden lab tests use the **returned** value.

**3. Returning two things**

```js
function splitHeader(line) {
  const i = line.indexOf(":");
  return [line.slice(0, i), line.slice(i + 1).trim()];
}
console.log(splitHeader("Host: example.com"));
```

Output: `[ 'Host', 'example.com' ]`. An array lets one function return several values. (This is exactly your task, with the same two pieces from the string lesson.)

**4. Variables inside a function are private**

```js
function f() { const secret = 1; }
f();
console.log(secret);
```

Output: `ReferenceError: secret is not defined`. Anything made inside the function disappears when it ends.

## If something goes wrong

- Your function "returns" `undefined`: there is no `return`, or it is on a different path.
- Code after `return` never runs: `return` ends the function immediately.
- `x is not a function`: the name is spelled differently from the definition, or you wrote `const f = 5` and then called `f()`.

## Check yourself

What does `function add(a, b) { return a + b; }` give for `add(2, 3)`? (`5`.)
