## Combining tables with JOIN

Related data lives in separate tables. A **JOIN** matches rows using the key columns:

```sql
SELECT e.name, d.name AS department
FROM employees e
JOIN departments d ON e.dept_id = d.id;
```

- **INNER JOIN** (`JOIN`): only rows with a match on both sides.
- **LEFT JOIN**: all rows from the left table, with NULLs where there's no match (useful to find employees with no department).
- Table aliases (`e`, `d`) keep queries short and avoid ambiguity.

## Summarizing with aggregates

`COUNT`, `SUM`, `AVG`, `MIN`, `MAX` collapse many rows into one value.

```sql
SELECT d.name, SUM(e.salary) AS total
FROM employees e
JOIN departments d ON e.dept_id = d.id
GROUP BY d.name
ORDER BY total DESC;
```

`GROUP BY` makes one result row per group. Every selected column must either be in the `GROUP BY` or inside an aggregate.

## Your task

Show each department's name and total payroll as `total`, largest first.
