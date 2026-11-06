## Accuracy can mislead

Imagine 1 in 1,000 events is an attack. A classifier that says "benign" every time is 99.9% accurate and catches nothing. For security problems you need metrics that look at the rare class.

## The confusion matrix

- **True positive (TP):** attack flagged correctly
- **False positive (FP):** benign flagged as an attack (alert noise)
- **False negative (FN):** attack missed (the dangerous one)
- **True negative (TN):** benign passed correctly

## Metrics

- **Precision** = TP / (TP + FP): of the things I flagged, how many were real?
- **Recall** = TP / (TP + FN): of the real attacks, how many did I catch?
- **F1** = 2 * precision * recall / (precision + recall): a single balance of the two.

There's a trade-off. Lowering the threshold raises recall but lowers precision (more alerts). Choose based on the cost of each error, and keep a separate test set so you measure on data the model never saw.

## Your task

Implement `metrics(tp, fp, fn)` and handle the zero-denominator cases without producing `NaN`.
