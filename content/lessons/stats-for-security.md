## Numbers that spot the unusual

Security analysts constantly ask "is this normal?" Basic statistics answers it.

## Center and spread

- **Mean** = sum / count. Sensitive to outliers.
- **Median** = the middle value of the sorted data (average the two middle values when the count is even). Robust to outliers.
- **Variance** = the average squared distance from the mean; **standard deviation (SD)** = its square root, in the data's own units.

Use the **population** formula (divide by n) when you have all the data, and the **sample** formula (divide by n - 1) when estimating from a sample.

## Using it for detection

If daily failed logins average 6.4 with an SD of about 2, a day with 25 is far outside normal and worth investigating. A common rule flags values more than 3 SD from the mean (a **z-score** above 3), but check that your data isn't heavily skewed.

## Tools

Python's `statistics` module offers `mean`, `median` and `pstdev`; R and spreadsheets do the same. Writing it by hand once helps you trust the results.

## Your task

Compute the mean, median and population standard deviation for the sample counts.

## Walk-through: the three numbers by hand

Use a small, different data set: failed logins per day `[2, 4, 4, 4, 5, 5, 7, 9]`.

**Mean (the average).** Add everything and divide by how many: `(2+4+4+4+5+5+7+9) / 8 = 40 / 8 = 5`.

**Median (the middle).** Sort the list (it already is) and take the middle value. With 8 values there are two middle ones, the 4th and 5th: `4` and `5`. Average them: `(4 + 5) / 2 = 4.5`.

**Standard deviation (how spread out).** Steps:

1. Subtract the mean from each value: `-3, -1, -1, -1, 0, 0, 2, 4`.
2. Square each (this removes minus signs): `9, 1, 1, 1, 0, 0, 4, 16`.
3. Average those squares: `(9+1+1+1+0+0+4+16) / 8 = 32 / 8 = 4`.
4. Take the square root: `sqrt(4) = 2`.

So the typical day is about 5 failed logins, give or take **2**.

## Why analysts use it

If a day suddenly has 20 failed logins, you can say how unusual it is: it is `(20 - 5) / 2 = 7.5` standard deviations above the mean, far outside normal. That is how simple anomaly detection works.

## Python tools for the lab

- `sum(counts) / len(counts)` for the mean.
- `sorted(counts)` for the sorted list; `len(s) // 2` is the middle position (whole-number division).
- `math.sqrt(...)` for the square root. A generator like `sum((x - mean) ** 2 for x in counts)` adds up the squared differences.
- In an f-string, `{value:.2f}` prints two decimals.

## If something goes wrong

- Median off by one: for an even count you must average **two** middle values, not take one.
- Standard deviation too large: you divided by `len - 1` (that is the *sample* version). This lab asks for the **population** version: divide by `len`.

## Check yourself

What is the median of `[3, 9, 5]`? (Sort to 3, 5, 9: the middle is 5.)
