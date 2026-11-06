## Start here

**Before this lesson:** Python Foundations (strings, loops, functions). The Tools page has a **Crypto Workbench** where you can try a Caesar shift by hand first, which makes this lab much easier.

## Doing it by hand first

Write the alphabet: A B C D E F ... Z. With a shift of 3, every letter moves three places later: A becomes D, B becomes E, and at the end it wraps around: X becomes A, Y becomes B, Z becomes C. To decrypt you shift the other way (or use the matching key).

Try one: shift `KHOOR` back by 3 and you get `HELLO`.

## Turning that into code

Python can turn letters into numbers and back:

- `ord("A")` is 65 (the number for A), `ord("B")` is 66, ... so a letter's position in the alphabet is `ord(letter) - 65`.
- `chr(68)` is `"D"` (number back to a letter).
- `%` (modulo) gives the remainder after dividing, and it makes numbers **wrap around**: `(25 + 3) % 26` is `2`, so Z (25) plus 3 becomes C (2).

So shifting one uppercase letter is:

```python
chr((ord(ch) - 65 + k) % 26 + 65)
```

Read it inside out: letter to a 0-25 number, add the shift, wrap with `% 26`, then add 65 to get back to a real letter code.

## Things to remember

- Only shift **letters**. Leave spaces and punctuation as they are: check with `ch.isalpha()`.
- The loop in the lab tries all 26 possible keys. That is called **brute force**, and it is why a cipher with only 26 keys is worthless.

## The oldest cipher

The **Caesar cipher** shifts each letter forward by a key `k`. With `k = 3`, `A→D`, `B→E`, `Z→C`. It's trivially weak, which makes it a perfect first cryptanalysis exercise.

## Why it breaks

There are only **26 possible keys**. A computer simply tries them all (a *brute-force* or *exhaustive key search*) and a human (or a keyword check) spots the readable result.

> Lesson that scales up: a cipher is only as strong as the size of its key space *and* the absence of shortcuts. Modern ciphers like AES use 2^128+ keys.

## Letter math

```python
ord("A")        # 65
chr(65)         # 'A'
(ord("D") - 65 + 3) % 26   # wrap-around with modulo
```

Process each letter: convert to 0-25, add the shift, `% 26`, convert back. Leave spaces and punctuation alone.

## Your task

Finish `shift(text, k)` in the editor. The loop already tries all 26 keys and prints any result that contains the word `EAGLE`. Print the decrypted message.

Related ideas worth reading about later: frequency analysis, Vigenère cipher, one-time pad.
