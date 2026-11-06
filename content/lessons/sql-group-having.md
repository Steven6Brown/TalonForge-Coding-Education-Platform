## Start here

**Before this lesson:** complete the JOIN and aggregates lesson (`COUNT`, `GROUP BY`). This lesson answers a new question type: "which *groups* meet a condition?"

## A tiny example to picture it

Say the employees table holds these rows (only the department is shown):

```
Engineering, Engineering, Engineering, Sales, Sales, HR
```

`GROUP BY department` puts matching rows into piles: Engineering (3), Sales (2), HR (1). `COUNT(*)` counts each pile.

Now: "only show departments with MORE than 2 people." You cannot use `WHERE`, because `WHERE` looks at **individual rows** and runs before the piles exist. The head count only exists after grouping, so you need **HAVING**, which filters the piles. Here only Engineering (3) remains.

## Step by step

1. Write the grouped count and run it: `... GROUP BY d.name;` You should see every department with its count.
2. Add `HAVING COUNT(*) > 2` and run again. Smaller departments disappear.
3. Give the count the name `n` with `AS n`.

## Why you will care

"Which users have more than 5 failed logins?" is exactly this pattern on a log table, one of the most common queries a security analyst writes.

## WHERE vs HAVING

Both filter, but at different times:

- **WHERE** filters individual **rows** before grouping.
- **HAVING** filters **groups** after aggregation.

```sql
SELECT d.name, COUNT(*) AS n
FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE e.salary > 70000        -- rows first
GROUP BY d.name
HAVING COUNT(*) > 2;          -- then groups
```

## Order of evaluation

`FROM / JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. That's why an aggregate can't appear in `WHERE`, and why you can often use a column alias in `ORDER BY` but not in `WHERE`.

## Common patterns

- "Which categories have more than N items?" → `GROUP BY ... HAVING COUNT(*) > N`
- "Which users have more than 5 failed logins?" → the same pattern on a log table: a classic security query.

## Your task

Show each department's name and head count as `n`, only for departments with more than 2 employees.
