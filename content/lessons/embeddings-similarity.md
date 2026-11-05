## Meaning as numbers

An **embedding** turns text (or images) into a list of numbers so that similar meanings sit close together. Search, recommendations and RAG all rely on this.

**Cosine similarity** compares the *direction* of two vectors: `dot(a, b) / (|a| * |b|)`. 1 means same direction, 0 unrelated, -1 opposite.

Real embeddings come from a model (hundreds or thousands of dimensions). Vector databases store them for fast nearest-neighbor search.

## Your task

Implement `cosineSimilarity`. Hidden tests check identical, orthogonal, scaled, opposite and zero vectors.
