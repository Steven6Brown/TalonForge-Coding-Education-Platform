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
