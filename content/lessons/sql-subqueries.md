## A query inside a query

A **subquery** is a SELECT used inside another statement. It can return a single value, a list or a table.

## Scalar subquery (one value)

```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

The inner query runs first and produces one number (the average); the outer query compares each row against it.

## List subquery with IN

```sql
SELECT name FROM employees
WHERE dept_id IN (SELECT id FROM departments WHERE name = 'Finance');
```

## Tips

- Wrap subqueries in parentheses.
- A scalar subquery must return exactly one row and one column.
- A JOIN can often replace a subquery and may be easier to read; use whichever is clearer.
- Subqueries are also where beginners can accidentally return duplicate or NULL values, so test with small data.

## Your task

List the names of employees who earn more than the average salary of all employees, alphabetically.
