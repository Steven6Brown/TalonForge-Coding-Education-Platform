## Fighting analytic bias

Analysts naturally favor the first explanation they think of and collect evidence that supports it (**confirmation bias**). **Analysis of Competing Hypotheses (ACH)**, developed for intelligence analysis, forces you to consider several explanations and try to *disprove* them.

## The steps

1. List all reasonable **hypotheses**.
2. List significant **evidence** and assumptions.
3. Build a **matrix**: for each piece of evidence, rate each hypothesis as **C** (consistent), **I** (inconsistent) or **N** (neutral/not applicable).
4. Refine the matrix; drop evidence that doesn't discriminate between hypotheses.
5. Draw tentative conclusions: the hypothesis with the **fewest inconsistencies** is most likely, because evidence that *fits* everything proves little.
6. Test sensitivity: which single piece of evidence would change the answer? How reliable is it?
7. Report conclusions and the other hypotheses you considered.
8. Define **indicators** to watch for.

## Example use in security

"Why is the server slow?" Hypotheses: DDoS, misconfigured backup, malware, hardware failure. Logs, traffic and process lists become rows in the matrix.

## Your task

Implement `leastInconsistent`, the scoring step: count the "I" ratings per hypothesis and return the best-supported column.
