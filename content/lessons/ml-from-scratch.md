## Learning = reducing error

Fit a line `y = w*x + b` to data. Measure error with **mean squared error**, then nudge `w` and `b` downhill along the gradient (**gradient descent**).

For each point, `err = (w*x + b) - y`. The averaged gradients are:

- `dw = mean(2 * err * x)`
- `db = mean(2 * err)`

Update: `w -= lr * dw`, `b -= lr * db`. The **learning rate** `lr` is the step size: too big diverges, too small is slow.

Neural networks are the same idea with many more parameters and layers.

## Your task

Train the line in plain Python. The hidden rule is `y = 2x + 1`.
