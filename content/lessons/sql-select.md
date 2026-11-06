## Asking a table a question

`SELECT` reads rows. Its main clauses, in the order you write them:

```sql
SELECT name, salary          -- which columns
FROM employees               -- which table
WHERE salary >= 80000        -- which rows
ORDER BY name;               -- sort order
```

## Filtering with WHERE

- Comparison: `=`, `<>`, `<`, `<=`, `>`, `>=`
- Combine with `AND`, `OR`, `NOT` (use parentheses when mixing them)
- Ranges: `salary BETWEEN 70000 AND 80000` (includes both ends)
- Patterns: `name LIKE 'H%'` (starts with H)
- Missing values: `email IS NULL` (never `= NULL`)

## Sorting

`ORDER BY salary DESC` sorts high to low. You can sort by several columns: `ORDER BY dept_id, name`.

## Tables in this lab

```
departments(id, name)
employees(id, name, title, salary, dept_id, hired)
```

The database is created fresh for every run in your browser (SQLite compiled to WebAssembly), so you can't break anything.

## Your task

Write a query that returns the names of programmers earning at least 80000, alphabetically. The last line of the output (`-- result:`) is what the lab checks.
