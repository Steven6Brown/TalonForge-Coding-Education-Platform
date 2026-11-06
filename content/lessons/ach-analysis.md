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

## Walk-through: scoring a small ACH matrix

Question: *who sent the phishing email?* Three hypotheses (columns) and three pieces of evidence (rows). Mark each cell **C** (consistent), **I** (inconsistent) or **N** (neutral).

| Evidence | H1: outside criminals | H2: a disgruntled employee | H3: a competitor |
| --- | --- | --- | --- |
| Sent from an overseas server | C | I | C |
| Used internal staff names | C | C | N |
| Targeted only finance staff | C | I | I |

Count the **I** marks in each column:

- H1: 0
- H2: 2
- H3: 1

H1 has the **fewest inconsistencies**, so it is the working favorite. Notice the method: you do not look for the hypothesis with the most support, you look for the one that is *least contradicted*. Evidence that fits every hypothesis (all C) tells you nothing.

## Why this is useful

It forces you to consider alternatives and guards against **confirmation bias**, the tendency to seek out only the facts that support what you already believe.

## In code

`matrix[0].map(() => 0)` makes a zero for each column. Loop over rows and, for each cell equal to `"I"`, add 1 to that column's count. `counts.indexOf(Math.min(...counts))` returns the first column with the smallest count, which handles ties by lowest index.

## Check yourself

In the table, which hypothesis would win if row 3 were all `C`? (H1 still 0, H2 would have 1, H3 would have 0: a tie between H1 and H3, and the lowest index, H1, wins.)
