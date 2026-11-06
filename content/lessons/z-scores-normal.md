## The bell curve

Many measurements cluster around a mean in a symmetric, bell-shaped **normal distribution**. Its spread is the **standard deviation (SD)**.

## The 68-95-99 rule

- About **68%** of values fall within 1 SD of the mean
- About **95%** within 2 SD
- About **99.7%** within 3 SD

If breach sizes have mean 100 and SD 10, roughly 68% of breaches affect 90-110 people and 95% affect 80-120.

## Z-scores

A **z-score** says how many SDs a value is from the mean:

```
z = (x - mean) / SD          e.g. (115 - 100) / 10 = 1.5
```

With a z-table (or `math.erf` in code) you convert z to probability:

- P(X >= 115): z = 1.5, area beyond z = **0.0668**
- P(85 <= X <= 115): z from -1.5 to 1.5 = **0.8664**

Negative z-scores mean below the mean. Because the curve is symmetric, the area beyond +z equals the area beyond -z.

## Using it

Percentiles: for the bottom 10% of a distribution with mean 20 and SD 5, z is about -1.28, so x = 20 - 1.28 * 5 = 13.6.

In security, z-scores flag anomalies: a day with z above 3 for failed logins is unusual. Check your data is roughly normal first.

## Your task

Implement `zscore` and compute the two probabilities above.

## Walk-through: reading a z-score

A **z-score** answers: "how many standard deviations is this value from the average?"

```
z = (x - mean) / sd
```

**Example.** Daily logins average 100 with standard deviation 10.

- A day with 130 logins: `z = (130 - 100) / 10 = 3`. That is 3 standard deviations above normal: very unusual.
- A day with 95: `z = (95 - 100) / 10 = -0.5`. Slightly below average, completely ordinary.

## From z to a probability

For data shaped like a bell curve (a **normal distribution**), the function `phi(z)` (given in the lab) returns the probability of being **at or below** that z:

| z | phi(z) | meaning |
| --- | --- | --- |
| 0 | 0.5 | exactly average: half the days are lower |
| 1 | 0.8413 | about 84% of days are at or below one standard deviation above the mean |
| 2 | 0.9772 | about 98% |

**"At least" questions use the other side.** For `x = 110`: `z = 1`, so `P(X >= 110) = 1 - phi(1) = 1 - 0.8413 = 0.1587`, about 16% of days.

**"Between" questions subtract two values.** `P(90 <= X <= 110)` is `phi(1) - phi(-1) = 0.8413 - 0.1587 = 0.6826`: roughly 68% of days fall within one standard deviation of the mean (the famous 68-95-99.7 rule).

## Your plan for the lab

1. Write `zscore(x, mean, sd)` returning `(x - mean) / sd`.
2. For the "at least" value: `1 - phi(zscore(...))`.
3. For "between": `phi(z_high) - phi(z_low)`.
4. Run; the print line formats four decimals for you.

## If something goes wrong

- A probability above 1 or below 0: you used `phi` the wrong way round. Subtract the smaller from the larger.
- The "at least" answer looks like the "at most" answer: you forgot `1 -`.

## Check yourself

If 90 is one standard deviation below an average of 100, what is `phi` of its z? (z = -1, and `phi(-1)` is about 0.1587.)
