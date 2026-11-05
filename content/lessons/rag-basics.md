## Retrieval-Augmented Generation

Models don't know your private documents. **RAG** fixes that: (1) split documents into chunks, (2) find the chunks most relevant to the question, (3) put them in the prompt, (4) have the model answer using them.

Retrieval can be keyword scoring (like your lab) or embeddings with cosine similarity. Real systems often combine both.

Security: enforce document permissions **before** retrieval, and treat retrieved text as untrusted (it can contain injected instructions).

## Your task

Implement `topDoc` with simple keyword overlap scoring.
