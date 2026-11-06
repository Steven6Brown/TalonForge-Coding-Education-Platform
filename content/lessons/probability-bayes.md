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

## Walk-through: why a good alert can still be wrong

**The situation.** A security tool flags suspicious logins. Suppose:

- 1% of logins are really malicious. So `P(A) = 0.01` where A = "malicious".
- The tool catches 99% of malicious ones: `P(B|A) = 0.99`, where B = "tool raises an alert".
- It also falsely alerts on 5% of innocent logins: `P(B | not A) = 0.05`.

**Question:** an alert fires. How likely is it that the login really is malicious? That is `P(A|B)`.

**Step 1: how often does the tool alert at all?** Add the two ways an alert can happen:

```
P(B) = P(B|A) x P(A) + P(B|not A) x P(not A)
     = 0.99 x 0.01 + 0.05 x 0.99
     = 0.0099 + 0.0495
     = 0.0594
```

**Step 2: apply Bayes' theorem.**

```
P(A|B) = P(B|A) x P(A) / P(B)
       = 0.99 x 0.01 / 0.0594
       = 0.0099 / 0.0594
       ≈ 0.167
```

Only about **17%** of alerts are real, even though the tool catches 99% of attacks. The reason: real attacks are rare (1%), so the many innocent logins produce far more false alerts than the few attacks produce real ones. This is called the **base rate** effect, and it is why analysts suffer alert fatigue.

## What the function does

`bayes(pBgivenA, pA, pB)` just does `pBgivenA * pA / pB` using the three numbers you give it. In the example: `bayes(0.99, 0.01, 0.0594)` is about `0.1667`.

## If something goes wrong

- Result above 1: you mixed up the arguments or divided in the wrong order.
- `NaN`: `pB` is 0 or a value is missing.

## Check yourself

If attacks were rarer (0.1%), would the share of real alerts go up or down? (Down: even more of the alerts would be false.)
