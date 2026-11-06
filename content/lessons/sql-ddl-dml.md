## Start here

So far you only **read** data. Real applications also **create tables** and **change data**. This lesson shows the commands that do that, and teaches the most important safety habit in SQL.

## Order matters

Statements run from top to bottom, and each one needs the one before it to have worked:

1. **CREATE TABLE** builds an empty table (you cannot insert into a table that does not exist yet).
2. **INSERT** adds rows.
3. **UPDATE** changes rows that already exist.
4. **SELECT** (already written in the lab) shows the result.

## How to do this lab

The starter gives you the three statements as **comments** (lines beginning with `--`). A comment is ignored by the database. To activate a line, delete the `-- ` at its start. For step 2 you write the INSERT yourself, with three rows: two with the status `'open'` and one with `'closed'`.

After each step you can add `SELECT * FROM tickets;` and press Run to look at the table.

## The safety habit

`UPDATE tickets SET status = 'triaged'` **without** a `WHERE` changes **every row**. Many real data disasters were a forgotten WHERE. Before you UPDATE or DELETE, run a `SELECT` with the same WHERE and check it returns exactly the rows you intend.

## Two kinds of statements

- **DDL (Data Definition Language)** defines structure: `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`.
- **DML (Data Manipulation Language)** changes data: `INSERT`, `UPDATE`, `DELETE`. `SELECT` reads it.

## CREATE TABLE

```sql
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL
);
```

Constraints (`PRIMARY KEY`, `NOT NULL`, `FOREIGN KEY`, `UNIQUE`) make the database reject bad data.

## INSERT

```sql
INSERT INTO tickets (title, status) VALUES ('Phishing report', 'open'), ('Lost laptop', 'open');
```

## UPDATE and DELETE

```sql
UPDATE tickets SET status = 'triaged' WHERE status = 'open';
DELETE FROM tickets WHERE status = 'closed';
```

**Always include a `WHERE`.** Without it, `UPDATE` and `DELETE` affect *every* row. In real systems, test with a `SELECT` using the same `WHERE` first and use transactions so you can roll back.

## Your task

Create the table, insert three tickets, update the open ones, and let the final SELECT confirm the result.
