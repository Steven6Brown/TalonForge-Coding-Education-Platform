## Start here if you have never used a database

A **database** is an organized place to store information so it can be searched quickly. The most common kind stores data in **tables**, like spreadsheet sheets:

| id | name | title | salary |
|----|------|-------|--------|
| 1 | Ada | Programmer | 95000 |
| 2 | Grace | Programmer | 88000 |

- A **table** holds one kind of thing (employees).
- A **column** is one property (name, salary). Each column has a name.
- A **row** is one record (one employee).

**SQL** (say "sequel" or "S-Q-L") is the language you use to ask a database questions. A question is called a **query**. You do not install anything here: the database runs inside your browser and is rebuilt for every run, so you cannot break anything.

## How to read a query

Read it like a sentence: *"SELECT these columns FROM this table WHERE this is true, ORDER BY this."* You will always write the clauses in that order. Statements end with a semicolon.

## Tips for a first query

1. Look at the **Tables in this lab** list below so you know the exact column names.
2. Start simple: `SELECT * FROM employees;` shows every column of every row (`*` means "all"). Run it to see the data.
3. Then narrow it: pick the column you need, add a `WHERE`, then an `ORDER BY`.
4. Text values go in **single quotes** (`'Programmer'`), numbers do not.
5. If you see an error, read it: it usually names the word it did not understand.

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
