## Start here

**Before this lesson:** do "SQL: SELECT, WHERE & ORDER BY" first. This lesson adds two new ideas: combining tables, and summarizing many rows into one number.

## Why are there two tables?

Imagine storing the department name ("Engineering") in every employee row. If it is renamed you must change hundreds of rows, and a typo creates a "different" department. Instead, databases store each fact **once**. The `employees` table keeps only a number, `dept_id`, and the `departments` table says what that number means:

```
employees:    name=Ada,  dept_id=2
departments:  id=2,      name=Engineering
```

The number in `dept_id` is a **foreign key**: it points at the `id` of a row in another table. A **JOIN** follows that pointer so you can see both pieces of information together.

## Summaries (aggregates)

Sometimes you do not want the rows, you want an answer *about* the rows: how many? what is the total? the average? Functions like `COUNT`, `SUM`, `AVG`, `MIN` and `MAX` collapse many rows into one value. `GROUP BY` does it once for each group (for example once per department).

## A way to build the query without panic

Build it in three small steps and run after each:

1. First just the join: `SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id;` Check it looks right.
2. Replace the columns with `d.name, SUM(e.salary)` and add `GROUP BY d.name`.
3. Give the sum a name with `AS total` and add `ORDER BY total DESC`.

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
