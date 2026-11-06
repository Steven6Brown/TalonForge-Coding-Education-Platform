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
