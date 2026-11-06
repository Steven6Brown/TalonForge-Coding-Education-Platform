## Variables

A **variable** is something you measure. In a study, the **independent variable (IV, predictor, X)** is the potential cause and the **dependent variable (DV, outcome, Y)** is the effect that depends on it.

Variables are **categorical** (distinct categories) or **continuous** (a score on a scale).

## Four levels of measurement

From least to most precise:

1. **Nominal** (categorical): names or labels only. Example: where an attack occurred (US, Europe, Asia), or whether it was cyber or physical.
2. **Ordinal** (categorical): ordered, but the gaps aren't equal. Example: hazard severity 1 (catastrophic) to 4 (negligible).
3. **Interval** (continuous): equal gaps, no true zero. Example: temperature in Celsius, or a 10-100 expert-opinion scale.
4. **Ratio** (continuous): equal gaps **and a true zero**. Example: Kelvin, counts of attacks, response time in days.

## Which statistic fits?

- **Mode:** works for every type, best for nominal.
- **Median:** ordinal, interval and ratio; resistant to extreme values (good for salaries or attack counts with outliers).
- **Mean:** interval and ratio; uses every score but is pulled by outliers.

## Spread

**Range** = highest - lowest. **Variance** = sum of squared deviations divided by n - 1 (for a sample). **Standard deviation** = square root of the variance, back in the original units. Deviations from the mean always sum to zero, which is why we square them.

## Check yourself

Take the quiz below.

## Worked examples: pick the level and the statistic

Ask two questions of any variable: *are the values just labels?* and *is there a true zero?*

| Variable | Level | Why |
| --- | --- | --- |
| Country where an attack started | Nominal | Labels only, no order |
| Severity: low, medium, high | Ordinal | Ordered, but the gaps are not equal |
| Temperature in Celsius | Interval | Equal gaps, but 0 degrees is not "no temperature" |
| Number of attacks per week | Ratio | Equal gaps and a true zero (0 attacks means none) |

**Which statistic fits?**

- Nominal: only the **mode** (most common label).
- Ordinal: **median** or mode.
- Interval and ratio: **mean** too.

**Why median beats mean sometimes.** Weekly attack counts `[3, 4, 4, 5, 90]`. The mean is `106 / 5 = 21.2`, pulled up by the one huge week. The median is the middle value, `4`, which describes a typical week better. **Outliers** drag the mean but barely move the median.

## Spread, by hand

For `[2, 4, 6]` the mean is 4. The deviations are `-2, 0, 2`: they always add to zero, which is why we square them: `4, 0, 4`. For a **sample**, divide the sum (8) by `n - 1 = 2` to get the **variance** 4; the **standard deviation** is its square root, 2 (in the original units). **Range** is highest minus lowest: `6 - 2 = 4`.

## Variables in a study

If you ask "does training reduce phishing clicks?", training is the **independent variable** (the cause you change) and the click rate is the **dependent variable** (the effect you measure).

## Self-check

1. Is a 1-to-5 satisfaction rating nominal, ordinal or interval? (Ordinal: ordered, gaps not guaranteed equal.)
2. Is response time in minutes ratio? (Yes: true zero.)
