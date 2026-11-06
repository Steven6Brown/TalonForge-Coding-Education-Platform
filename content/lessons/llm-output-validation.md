## Start here

Imagine your app asks an AI model to summarize a security alert and reply as JSON, then your code reads the severity and decides what to do. What if the model replies with extra chat text, forgets a field, or returns `severity: "super-duper-high"`? If your code trusts it, the app breaks or does something unsafe.

The rule: **model output is untrusted data**, exactly like text typed by a stranger.

**What you need first:** JavaScript objects, conditionals and functions (JavaScript Foundations). Python Security's JSON lesson helps too.

## How an LLM feature is usually built

Your **server** sends text to a model API, receives text back, and uses it. Keep the API key in a server **environment variable** (never in browser code), add login and rate limits, and handle timeouts and failures.

## Four steps for every reply

1. **Parse safely.** `JSON.parse` throws an error on bad JSON, so wrap it in `try { ... } catch { return null; }`.
2. **Clean up.** Models often wrap JSON in markdown code fences (a line of three backticks before and after the JSON). Remove them first.
3. **Validate** against what you expect: the right type, an allowed value, a length limit.
4. **Fall back.** If anything is wrong, return `null` and let the rest of your program handle it. Never run model output as code, SQL or a shell command.

## The pieces you need in JavaScript

- `String(text).trim()` makes sure it is text and removes surrounding spaces.
- `.replace(/^```(?:json)?\s*|\s*```$/g, "")` removes a leading fence and a trailing fence (the regex in the starter code does this). (A **regular expression** between slashes describes a text pattern.)
- `["low", "medium", "high"].includes(o.severity)` checks the value is one of the allowed words.
- `typeof o.summary === "string"` checks the type; `o.summary.length <= 200` checks the length.

## Your plan

1. Put everything inside `try` and return `null` in `catch`.
2. Clean the text, then `JSON.parse` it.
3. If the result is not an object, return `null`.
4. If `severity` is not allowed, return `null`. If `summary` is not a string of at most 200 characters, return `null`.
5. Otherwise return a **new** object containing only `severity` and `summary` (drop any extra fields).

The hidden checks try valid JSON, fenced JSON, bad JSON, missing fields and wrong values.

## Why this matters

This is the same input validation you learned for web security, applied to AI. It is also the defense against *insecure output handling*, one of the top risks for AI applications.
