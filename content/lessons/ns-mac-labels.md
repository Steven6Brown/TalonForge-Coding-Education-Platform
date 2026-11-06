## Multilevel security

In **mandatory access control**, a central policy compares the **classification label** of an object with the **clearance** of a subject. Levels are ordered:

`unclassified < confidential < secret < top secret`

## The two classic rules

- **Simple security property ("no read up"):** a subject may read an object only if their clearance is **greater than or equal to** the label. A secret user can read unclassified and secret documents, not top secret.
- **Star property ("no write down"):** a subject may write only to objects at **their level or higher**. A secret user can write to a secret or top secret resource but not to an unclassified one, because that could move secret information to a lower level.

Together these protect **confidentiality**. (A different model, Biba, uses the opposite rules to protect **integrity**: no read down, no write up.)

## Why it is "mandatory"

Users and owners can't override it. Access depends on labels, not on who owns the data; a cleared person can't hand access to someone else; only administrators relabel data.

## Where you see it

Government and military systems, and operating-system security modules such as SELinux and AppArmor that enforce mandatory policies on processes.

## Your task

Implement `macAllows(clearance, label, op)` for `read` and `write`.
