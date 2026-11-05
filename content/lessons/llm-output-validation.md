## Model output is untrusted data

A typical LLM feature: your **server** sends text to a model API, gets text back, and uses it. Keep the API key in a server environment variable, add authentication and rate limits, and handle failures and timeouts.

Then treat the reply like any user input:

1. Parse safely (try/catch).
2. Validate against a schema (types, allowlisted values, length limits).
3. Only then store it or act on it. Never run model output as code, SQL or shell.
4. Have a fallback for malformed or missing output.

## Your task

Write `parseModelOutput` that returns a validated object or `null`, and never throws.
