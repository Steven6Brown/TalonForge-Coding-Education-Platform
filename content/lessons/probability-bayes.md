## Counting and probability

For equally likely outcomes: `P(event) = |event| / |sample space|`.

- **Permutations** (order matters): `P(n, r) = n! / (n - r)!`
- **Combinations** (order doesn't): `C(n, r) = n! / (r! (n - r)!)`
- **Inclusion-exclusion:** `|A ∪ B| = |A| + |B| - |A ∩ B|`
- **Pigeonhole principle:** with more items than boxes, some box holds at least two. It explains why hash **collisions** are unavoidable.

## Conditional probability and independence

`P(A | B)` means "the probability of A given B": `P(A ∩ B) / P(B)`. Events are **independent** when `P(A ∩ B) = P(A) * P(B)`.

## Bayes' theorem

```
P(A | B) = P(B | A) * P(A) / P(B)
```

It turns "how likely is this evidence if the hypothesis is true" into "how likely is the hypothesis given the evidence". Example: if 90% of spam contains "free", 20% of mail is spam, and 30% of all mail contains "free", then a message containing "free" is spam with probability `0.9 * 0.2 / 0.3 = 0.6`.

## Why security cares

Spam filters, intrusion detection and alert triage all rest on this. Beware the **base-rate fallacy**: a test that is 99% accurate still produces mostly false alarms when real attacks are rare.

## Your task

Implement `bayes`.
