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

## Worked example: designing a small ticket database

**Step 1: list the things you track (entities).** A help desk tracks `employees`, `departments` and `tickets`.

**Step 2: give each a primary key** (a unique id).

**Step 3: link them with foreign keys.**

```
departments(id PK, name)
employees(id PK, name, dept_id FK -> departments.id)
tickets(id PK, title, status, opened_by FK -> employees.id)
```

**Relationships:**

- One department has many employees (one-to-many): `employees.dept_id` points at `departments.id`.
- One employee opens many tickets (one-to-many): `tickets.opened_by` points at `employees.id`.

**Many-to-many example:** a ticket can involve many employees and an employee can work many tickets. A database cannot hold that directly, so add a **junction table**:

```
ticket_assignees(ticket_id FK, employee_id FK)
```

Each row says "this employee is assigned to this ticket".

## Why not one big table?

If every ticket row repeated the employee's name and department, a rename would need hundreds of edits, and typos would create "different" departments. **Normalization** means storing each fact **once** and pointing to it. The foreign key also lets the database refuse a ticket for an employee who does not exist.

## Security angle

A clear design makes it easy to give each application only the access it needs (least privilege) and to protect sensitive columns (hash or encrypt them).

## Self-check

1. What uniquely identifies a row? (The primary key.)
2. What column points at another table's key? (A foreign key.)
3. How do you model many-to-many? (A junction table.)
