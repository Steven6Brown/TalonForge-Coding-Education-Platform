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
