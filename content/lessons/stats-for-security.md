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
