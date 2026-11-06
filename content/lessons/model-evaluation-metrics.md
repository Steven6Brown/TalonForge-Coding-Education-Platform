## Start here

You built a classifier. How do you know if it is any good? "It is 95% accurate" can be a lie when 95% of messages are normal anyway: a model that always says "not spam" scores 95% and catches nothing. We need better measurements.

**What you need first:** JavaScript variables, conditionals and functions (JavaScript Foundations).

## The four outcomes

Every prediction lands in one of four boxes. Think of a malware detector:

- **True positive (tp):** it flagged a file and the file really was malware. Good catch.
- **False positive (fp):** it flagged a harmless file. A false alarm that wastes analyst time.
- **False negative (fn):** it missed real malware. Dangerous.
- **True negative:** it correctly ignored a harmless file.

## Precision and recall

- **Precision** = `tp / (tp + fp)`. Of everything the model flagged, how much was real? Low precision means too many false alarms.
- **Recall** = `tp / (tp + fn)`. Of all the real problems, how many did the model catch? Low recall means threats slip through.

There is usually a trade-off: make the model more sensitive and recall rises but precision falls.

## F1 score

**F1** combines both into one number: `2 * precision * recall / (precision + recall)`. It is high only when both are high.

## Worked example

A detector flags 10 files; 8 are real malware (tp = 8, fp = 2). It missed 4 real ones (fn = 4).

- precision = 8 / (8 + 2) = 0.8
- recall = 8 / (8 + 4) = 0.667
- f1 = 2 * 0.8 * 0.667 / (0.8 + 0.667) = 0.727

## Dividing by zero

If the model flags nothing, `tp + fp` is 0 and the division would give `NaN` (not a number). Guard it with the **ternary** form `condition ? valueIfTrue : valueIfFalse`:

```js
const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
```

## Your plan

1. Compute precision with the guard.
2. Compute recall with the guard.
3. Compute f1 with a guard on `precision + recall`.
4. Return `{ precision, recall, f1 }`.

## Which matters more?

For a security tool, missing an attack (low recall) is often worse than a false alarm, but too many false alarms cause **alert fatigue**, where analysts start ignoring alerts. Good teams tune for the right balance.
