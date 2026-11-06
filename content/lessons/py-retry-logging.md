## Start here

Networks fail all the time: a server is busy, Wi-Fi drops for a second. A good script does not give up at the first hiccup. A **retry** tries again a few times. In this lab you write a small retry helper in Python.

**What you need first:** Python functions (Python Foundations track, "Strings and Functions").

## Idea: errors and try / except

When Python hits a problem it raises an **exception** (an error). Normally that stops the program. With `try`/`except` you can catch it and decide what to do:

```python
try:
    result = risky_thing()
except ConnectionError:
    print("network problem")
```

Only the named error is caught (`ConnectionError`). Anything else still stops the program, which is good: you should not hide errors you do not understand. A bare `raise` inside `except` throws the same error again.

## Idea: passing a function

`retry(fn)` receives another **function** `fn`. Calling `fn()` runs it. In the lab, `flaky()` fails twice and works on the third call, like a real service recovering.

## Idea: a limited loop

`for i in range(attempts):` repeats `attempts` times with `i` = 0, 1, 2, ... On success, `return fn()` leaves the function immediately. On failure, loop again. On the **last** try (`i == attempts - 1`) you must `raise` so the caller finds out it really failed (otherwise the function would quietly return `None`).

## Your plan

1. Write the `for` loop.
2. In `try:` do `return fn()`.
3. In `except ConnectionError:` check whether this was the last attempt, and if so `raise`.
4. Run. The output should be `ok after 3 attempts`.

## What real scripts add

- **Exponential backoff:** wait 1 second, then 2, then 4, so you do not flood a struggling server, plus a little random **jitter**.
- **Retry only safe things:** repeating a "charge the credit card" call could charge twice. Only retry operations that are **idempotent** (safe to repeat), as in the Automation Mindset lesson.
- **Logging:** record each failure with Python's `logging` module so you can see what happened later.
