## Propositions and connectives

A **proposition** is a statement that is either true or false. Combine them with AND (`∧`), OR (`∨`), XOR, and NOT (`¬`). A **truth table** lists every combination of inputs and the result, so you can check what a statement really means (important for firewall rules and access policies).

## The conditional and its relatives

For "if p then q" (`p → q`):

- **Converse:** `q → p`
- **Inverse:** `¬p → ¬q`
- **Contrapositive:** `¬q → ¬p` (always equivalent to the original)

`p → q` is false **only** when p is true and q is false. If p is never true, the statement is **vacuously true**.

## Equivalences

- **Tautology:** always true. **Contradiction:** never true.
- **De Morgan:** `¬(p ∧ q) = ¬p ∨ ¬q` and `¬(p ∨ q) = ¬p ∧ ¬q`.

## Predicates and quantifiers

A **predicate** `P(x)` is a statement whose truth depends on `x`. `∀x` means "for all", `∃x` means "there exists". Negating flips the quantifier: `¬∀x P(x) = ∃x ¬P(x)`. Order matters in nested quantifiers: over the integers, `∀x ∃y (x + y = 0)` is true, but `∃x ∀y (x + y = 0)` is false.

## Proof techniques

- **Direct:** assume the hypothesis, reason step by step to the conclusion.
- **Contrapositive:** prove `¬q → ¬p` instead.
- **Contradiction:** assume the statement is false and derive an impossibility.
- **Induction:** prove a base case, then show that n true implies n+1 true.
- **Cases / exhaustion:** check every possibility.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Proof by contradiction.** Assume the statement is **false** and show that this leads to something impossible, so it must be true. Euclid's proof that there are infinitely many primes works this way: assume there is a largest prime, then build a number that breaks that assumption.
- **De Morgan's law.** Negating an AND turns it into an OR of the negations: **not (p and q) is the same as (not p) or (not q)**. Likewise not (p or q) equals (not p) and (not q). Firewall and filter rules use this logic constantly when you flip a condition.

## Worked examples: truth tables and a firewall rule

**Truth table for AND, OR and NOT** (T = true, F = false):

| p | q | p AND q | p OR q | NOT p |
| --- | --- | --- | --- | --- |
| T | T | T | T | F |
| T | F | F | T | F |
| F | T | F | T | T |
| F | F | F | F | T |

**The conditional `p -> q` ("if p then q")** is false in exactly one row: p true and q false. Example promise: "If it rains, I take an umbrella." The only way to break it is rain with no umbrella. If it does not rain, the promise is not broken (vacuously true).

**Contrapositive example.** "If a user is an admin (p), they can delete files (q)." The contrapositive: "If a user cannot delete files, they are not an admin." Always equivalent to the original. The converse, "if they can delete files, they are an admin", is **not** equivalent.

**De Morgan in a firewall.** Allow traffic when NOT (source is blocked AND port is 22)? Flip it with De Morgan: allow when (source is NOT blocked) OR (port is NOT 22). Check one case: source blocked, port 80. Original: NOT(T AND F) = NOT F = T. Flipped: F OR T = T. Same.

**Quantifiers.** "Every user has a password" is `for all x, P(x)`. Its negation is "**there exists** a user without a password" (`there exists x, not P(x)`). Flip the quantifier when you negate.

## Self-check

1. When is `p -> q` false? (p true and q false.)
2. Negate "all servers are patched". ("Some server is not patched.")
