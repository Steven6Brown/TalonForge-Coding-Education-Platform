## Networks fail. Scripts should cope.

Temporary failures (timeouts, 503s) are normal. A **retry** wrapper tries again a few times; production versions add **exponential backoff** (wait 1s, 2s, 4s) and a little random jitter.

```python
for i in range(attempts):
    try:
        return fn()
    except ConnectionError:
        if i == attempts - 1:
            raise
```

Only retry errors that are safe to retry, and only operations that are idempotent. Log each failure with the standard `logging` module.

## Your task

Implement `retry` so `flaky()` succeeds on its third call.
