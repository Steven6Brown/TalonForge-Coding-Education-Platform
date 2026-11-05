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
