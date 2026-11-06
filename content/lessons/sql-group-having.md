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
