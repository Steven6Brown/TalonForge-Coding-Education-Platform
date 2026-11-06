## Start here

How does a search engine know that "car repair" and "fix my automobile" mean nearly the same thing, even though they share no words? It turns text into **numbers** that capture meaning. These number lists are called **embeddings**.

**What you need first:** JavaScript arrays, loops and functions (JavaScript Foundations track).

## What an embedding is

An **embedding** is a list of numbers (a **vector**) produced by a model. Texts with similar meaning get vectors that point in similar directions. For example (tiny, made-up 3-number vectors):

```
"cat"    -> [0.9, 0.1, 0.0]
"kitten" -> [0.8, 0.2, 0.1]
"engine" -> [0.0, 0.1, 0.9]
```

"cat" and "kitten" are close; "engine" is far. Real embeddings have hundreds or thousands of numbers.

## How to measure "close": cosine similarity

Treat each vector as an arrow. **Cosine similarity** asks: do the two arrows point the same way?

- 1 means the same direction (very similar)
- 0 means at right angles (unrelated)
- -1 means opposite directions

The formula is `dot(a, b) / (length(a) * length(b))`.

### Dot product

Multiply the numbers in matching positions and add them up:

```
a = [1, 2, 3], b = [4, 5, 6]
dot = 1*4 + 2*5 + 3*6 = 32
```

In JavaScript: `a.reduce((sum, x, i) => sum + x * b[i], 0)`. The `i` is the position, so `b[i]` is the matching number in `b`.

### Length of a vector

Square every number, add them, then take the square root: `Math.sqrt(v.reduce((s, x) => s + x * x, 0))`.

## Special case

If either vector has length 0 (all zeros) you would divide by zero. The task says to return 0 in that case.

## Your plan

1. Compute `dot`.
2. Write a small helper `norm(v)` for the length.
3. Multiply `norm(a) * norm(b)`; if that is 0, return 0.
4. Otherwise return `dot` divided by it.

## Where this is used

Search, recommendations and **RAG** (the next lesson) all work by embedding text, then finding the stored vectors with the highest cosine similarity to your question. A **vector database** stores embeddings so that nearest-neighbor search is fast.
