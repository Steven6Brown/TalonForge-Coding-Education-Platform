## Start here

**Before this lesson:** complete the SELECT and JOIN lessons. A subquery is simply a second question whose answer feeds the first.

## Think of it as two questions

"Who earns more than the average salary?" is really two questions in a row:

1. What *is* the average salary? (one number)
2. Who earns more than that number?

You could run question 1, write the number down, then type it into question 2. A **subquery** lets the database do that for you in one statement by putting question 1 inside parentheses.

## Build it in two steps

1. Run the small query by itself first and look at the result:

```sql
SELECT AVG(salary) FROM employees;
```

2. Now use it as a value:

```sql
SELECT name FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY name;
```

If the combined query fails, the quickest fix is to run the inner query alone again; if it works alone, the problem is in the outer query.

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
