## Start here

A language model only knows what it saw in training. It has never read your company's policies, your notes or yesterday's news. If you ask it about them it may guess (hallucinate). **RAG**, short for **Retrieval-Augmented Generation**, fixes that by handing the model the right documents along with the question.

**What you need first:** JavaScript arrays, objects, loops and functions (JavaScript Foundations), plus the Embeddings lesson for background.

## The four steps

1. **Split** your documents into small pieces called **chunks**.
2. **Retrieve**: find the chunks most relevant to the user's question. (This is a search problem.)
3. **Augment**: put those chunks into the prompt: "Answer using only this information: ..."
4. **Generate**: the model writes the answer, grounded in your text.

This lab builds step 2, the retrieval, with a very simple method.

## Scoring by shared words

Real systems often use embeddings and cosine similarity. A simpler version counts **how many of the question's words appear in each document**. The document with the most overlap wins.

To compare words fairly, convert text to lowercase and pull out the words with a **regular expression**:

```js
const words = (s) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) || []);
```

- `.match(/[a-z0-9]+/g)` finds every run of letters or digits (the `g` means "all matches"). It returns `null` when there are none, hence `|| []`.
- `new Set(...)` keeps each word once, so repeating a word does not inflate the score.

Then for each document count how many question words are in its set:

```js
let score = 0;
for (const w of q) if (dw.has(w)) score++;
```

Keep the best score and its id. Use `>` (not `>=`) so that on a tie the **first** document stays the winner.

## Your plan

1. Write the `words` helper.
2. Make `q = words(query)`.
3. Loop over `docs`, scoring each as above.
4. Return the id with the highest score.

## Security: RAG has its own risks

- Enforce **who may see which document** *before* retrieval, or the model might quote a document the user should not read.
- Retrieved text is **untrusted**: a document can contain hidden instructions ("ignore the rules and ..."). This is **prompt injection**; see the AI Security lesson.
