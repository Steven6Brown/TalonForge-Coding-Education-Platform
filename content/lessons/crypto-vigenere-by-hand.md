## From Caesar to Vigenère

A **Caesar cipher** shifts every letter by the same amount, so there are only 25 possible keys and frequency analysis breaks it. In the 1500s the **Vigenère cipher** improved on it by using a **keyword**: each letter is shifted by the corresponding letter of the key, which then repeats. The same plaintext letter can encrypt to different ciphertext letters, hiding simple letter frequencies. It was called "le chiffre indéchiffrable" for about three centuries.

## Encrypting by hand

```
Plain:  A T T A C K A T D A W N
Key:    L E M O N L E M O N L E
Cipher: L X F O P V E F R N H R
```

Each column adds the numbers (A=0 ... Z=25) and wraps at 26: A(0) + L(11) = L; T(19) + E(4) = X(23).

## How it's broken

- **Kasiski examination** finds the key length from repeated sequences.
- Once the key length is known, each position is just a Caesar cipher and can be solved by **frequency analysis**.
- A key as long as the message that is truly random and never reused (a **one-time pad**) is unbreakable. Short keys are not.

## Modern takeaway

Strength comes from large key spaces **and** good design. Today use AES-256-GCM or ChaCha20-Poly1305 from a vetted library. Classical ciphers are for learning and puzzles.

## Try it

On the Tools page, **Classical ciphers** lets you encrypt and decrypt with Caesar, ROT13, Vigenère and XOR so you can check your lab results.

## Your task

Implement `vigenereEncrypt` for uppercase text.

## Walk-through: encrypt four letters on paper

Number the alphabet from 0: A=0, B=1, C=2, ... L=11, M=12, N=13, O=14, ... T=19, ... X=23, Y=24, Z=25.

Plaintext `ATTA`, key `LEMO`. Line the key up under the message and add the numbers in each column. If the sum is 26 or more, subtract 26 (wrap around the alphabet):

```
Column 1: A(0)  + L(11) = 11 -> L
Column 2: T(19) + E(4)  = 23 -> X
Column 3: T(19) + M(12) = 31 -> 31 - 26 = 5 -> F
Column 4: A(0)  + O(14) = 14 -> O
```

So `ATTA` becomes `LXFO`, matching the table above. Notice that the two `T`s became **different** letters (`X` and `F`) because their key letters differ: that is why simple letter counting no longer works.

**When the message is longer than the key,** the key repeats: with key `LEMON` and a 12-letter message the key letters are `LEMONLEMONLE`.

## Turning it into code

For each letter at position `i` of the message:

1. Turn the letter into a number: `text.charCodeAt(i) - 65` (the code for `A` is 65).
2. Find the key letter for this position: `key[i % key.length]` (the `%` makes the key wrap round).
3. Turn that into a number the same way.
4. Add them, then wrap with `% 26`.
5. Turn back into a letter: `String.fromCharCode(sum + 65)`.

Build up the answer with `out += ...` in a loop and return it at the end.

## Decrypting

Subtract instead of adding, and add 26 before `% 26` so the result is never negative: `(c - k + 26) % 26`.

## Check yourself

What is `A` encrypted with key letter `Z`? (0 + 25 = 25, which is `Z`.) What is `Z` with key letter `B`? (25 + 1 = 26, wraps to 0, `A`.)
