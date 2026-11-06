## Why design matters

A relational database stores data in **tables** (rows and columns). Good design keeps data consistent, avoids duplication and makes queries simple. Bad design makes bugs, wrong reports and security gaps.

## Core ideas

- **Entity:** a thing you track (employee, department, ticket). Each becomes a table.
- **Primary key (PK):** a column that uniquely identifies each row (`id`). It can't be NULL or repeat.
- **Foreign key (FK):** a column that points to another table's primary key (`employees.dept_id` → `departments.id`). The database can enforce that the referenced row exists.
- **Relationships:** one-to-many (one department, many employees) is the most common; many-to-many needs a **junction table**.

## Normalization (in short)

Store each fact once. Instead of repeating "Engineering" in every employee row, store it once in `departments` and reference its id. This prevents inconsistent spellings and makes updates safe.

## Diagrams

An **entity-relationship (ER) diagram** shows tables, keys and the lines between them. Sketch one before writing SQL.

## Security angle

Least-privilege database accounts, parameterized queries (see the SQL injection lesson), and encrypting or hashing sensitive columns all start with a clear schema.

## Check yourself

Take the quiz below. The next lessons use a real in-browser SQLite database.
