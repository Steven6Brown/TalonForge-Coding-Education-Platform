## Relational databases in brief

A **relational database** stores data in **tables** (rows and columns). Each table has a **primary key** that uniquely identifies every row, and **foreign keys** that reference another table's primary key to relate records. A **database management system (DBMS)** (for example SQL Server, Oracle, MySQL, DB2) builds and maintains the database and provides a uniform interface through **SQL**. The DBMS checks **authorization tables** before running a statement.

## Database access control

DBMSs provide discretionary or role-based access control with rights such as create, insert, delete, update and read, on the whole database, tables, or selected rows and columns. Rights can depend on content (for example, a manager sees salaries only for their own department). Administration styles:

- **Centralized:** a few privileged users grant and revoke rights.
- **Ownership-based:** a table's creator manages rights to it.
- **Decentralized:** owners may also delegate the right to grant and revoke.

## Why it matters

Database breaches are expensive: fines, investigations and remediation. (Examples from the course: a 2013 retailer breach that affected about 41 million consumers and cost $18.5 million, and a 2009 payment-processor breach that cost about $12.6 million.) Use **defense in depth**: strong authentication, encryption, firewalls, IDS, operating-system controls and database rights. Many of these layers fail against an **insider**, so add controls as close to the database as possible.

## Security considerations (checklist)

- Review system accounts; disable any not tied to a business process and owner.
- Give accounts expiration dates; report locked-out accounts.
- **Disable (don't delete) accounts** on termination to preserve audit trails.
- Log off or lock after inactivity; lock accounts after repeated failed logins; audit attempts on deactivated accounts and failed logins.
- Profile normal usage (time of day, duration) to spot anomalies.
- Require **multi-factor authentication** for sensitive access (smart cards, OTP tokens, biometrics).
- Send passwords only over encrypted channels; hash or encrypt password files and audit access to them.

## Common database attacks

SQL injection, brute force, privilege escalation, abuse of unused services and features, unpatched database vulnerabilities, **inference attacks** (deducing restricted data from allowed queries) and **stolen unencrypted backups**.

## SQL injection

When an application builds SQL by pasting user input into the query, an attacker can change the query's logic. For example, input like `' OR '1'='1` makes a WHERE condition always true, so the login succeeds without a valid password. The malicious input travels through the firewall as ordinary web traffic, the application passes it to the database, and the database runs it as code.

Defenses:

- **Parameterized queries** (prepared statements): the database treats input only as data (the best fix).
- **Validate input**: type, length, format and range, with allowlists (a numeric ID must contain only digits).
- Least-privilege database accounts, patching, generic error messages (errors shouldn't reveal query structure), monitoring and auditing.
- Static and dynamic code testing.
- A **trusted interface or filter** that screens queries and returns only data the user is authorized to see.

## Your task

Write a simple input validator using allowlist patterns and length limits.
