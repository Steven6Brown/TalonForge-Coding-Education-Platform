## Start here

This lab builds a real (small) machine-learning model: a **spam classifier** using an algorithm called **Naive Bayes**. It is the same family of method that early email spam filters used.

**What you need first:** Python loops, dictionaries and functions (Python Foundations). The Machine Learning From Scratch lesson shows the learning mindset.

## The idea in plain words

You have example messages already labeled **spam** or **ham** (ham means normal mail). Count how often each word appears in each group. "free" and "prize" appear often in spam; "meeting" and "noon" appear in ham.

To classify a new message, ask: *which group makes these words more likely?* Whichever group wins is the label.

## Step 1: count words

```python
counts = {}
total = 0
for m in messages:
    for w in m.split():
        counts[w] = counts.get(w, 0) + 1
        total += 1
```

`m.split()` breaks a message into words. `counts.get(w, 0) + 1` adds one to the word's count (starting from 0 if new). `total` is the number of words seen. `word_counts` must return `counts, total`.

## Step 2: score a message

The probability of a word in a class is roughly `count / total`. Two fixes:

- **Smoothing:** a word never seen in spam would give probability 0 and wipe out everything else. Add 1 to each count: `(count + 1) / (total + len(vocab))`. This is **Laplace smoothing**.
- **Logarithms:** multiplying many small probabilities gets too tiny for a computer. Taking the **log** turns multiplication into addition: add `math.log(probability)` for each word. Start from `math.log(0.5)` because spam and ham are assumed equally likely at first.

```python
s = math.log(0.5)
for w in message.split():
    if w in vocab:
        s += math.log((counts.get(w, 0) + 1) / (total + len(vocab)))
```

Words not in `vocab` (never seen at all) are skipped.

## Step 3: compare

`classify` already compares the spam score with the ham score. The bigger score wins.

## Your plan

1. Write `word_counts` and return `(counts, total)`.
2. Write `score` as above.
3. Run: four labels print, comma-separated.

## Limits to know

The model only knows the words in its tiny training set, and it ignores word order. Real filters use far more data and more features. Judge classifiers with precision and recall, which is the next lesson.
