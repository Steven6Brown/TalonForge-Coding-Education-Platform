## What you'll build

A tiny **dictionary check**: hash each word in a list and compare it to a target hash. It's how weak passwords are found in leaked databases, and how defenders test their own password policies.

> Only do this on hashes you own or have been given for training. Cracking real people's leaked credentials is harmful and often illegal.

## Hashes in the browser

Browsers include the **Web Crypto API**. `crypto.subtle.digest("SHA-256", bytes)` returns the hash as raw bytes (it is asynchronous, so you `await` it). Convert bytes to the familiar 64-character hex string to compare.

## Why this works (and what stops it)

- The same input always gives the same hash, so matching a hash proves you found an input that produces it.
- Common passwords are guessed quickly because plain SHA-256 is **fast**: billions of guesses per second on a GPU.
- Defenses: **long, unique passwords**, **salts** (so one precomputed table can't be reused across users), and **slow hashes** (Argon2id, bcrypt, scrypt) that make each guess expensive. Also breached-password checks and MFA.

## Practice

On the Tools page, hash words with SHA-256 and compare lengths with MD5 and SHA-1. Then change one character and watch the whole hash change.

## Your task

Write `sha256Hex` (async, using Web Crypto) and `findPassword` that loops over a wordlist.
