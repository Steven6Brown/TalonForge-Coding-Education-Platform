## Start here

"Machine learning" sounds mysterious. In this lab you build the core idea in about ten lines of plain Python, with no libraries. By the end you will have a program that **learns a rule from examples**.

**What you need first:** Python loops, lists and arithmetic (Python Foundations track).

## The problem

You are given examples: when `x` is 1, `y` is 3; when `x` is 2, `y` is 5; and so on. There is a hidden rule behind them. A straight line is described by two numbers:

```
y = w * x + b
```

`w` (the **weight**, or slope) says how steeply `y` rises as `x` grows. `b` (the **bias**) is where the line starts. At first the computer knows nothing, so it guesses `w = 0` and `b = 0`. Learning means improving those two numbers.

## Idea 1: measure how wrong you are

For one example, the **error** is `prediction - truth`:

```python
err = (w * x + b) - y
```

If `err` is positive you predicted too high, if negative too low. To judge the whole data set, square each error (so negatives do not cancel positives) and average them. That is the **mean squared error**. Smaller is better.

## Idea 2: nudge the numbers downhill

Imagine the error as a hilly landscape. You want the lowest point. At any spot, the **gradient** tells you which direction is uphill. So you step the opposite way. For a line with squared error, averaged over `n` examples:

- `dw = sum of (2 * err * x) / n`
- `db = sum of (2 * err) / n`

Then update:

```python
w -= lr * dw      # w = w - lr * dw
b -= lr * db
```

`lr` is the **learning rate**, the step size. Too big and you overshoot and the numbers explode. Too small and learning crawls. Here `lr = 0.05` works.

This process is called **gradient descent**.

## Idea 3: repeat

One small step is not enough. The outer `for epoch in range(2000)` repeats the whole thing 2000 times. Each pass is an **epoch**. The error shrinks each time and `w` and `b` settle on the answer.

## Your plan

1. Inside the epoch loop, set `n = len(xs)` and `dw = db = 0.0`.
2. Loop over `zip(xs, ys)` (which pairs up each x with its y). For each pair compute `err` and add `2 * err * x / n` to `dw` and `2 * err / n` to `db`.
3. After that inner loop, update `w` and `b` using `lr`.
4. Run. It should print about `2.0 1.0`, the hidden rule `y = 2x + 1`.

## Why this matters

A neural network is the same idea with millions of weights instead of two. Training a language model is gradient descent too. If you understand this lab, you understand the heart of machine learning.
