## Roles instead of individuals

With **RBAC**, a **role** is a named job function. Permissions attach to roles, and users are assigned to roles. For a hospital network: a *doctor* role may prescribe and review histories, a *nurse* role may administer medication and monitor patients, and a *billing* role may track supplies and costs. Every doctor gets the doctor role, so onboarding is "assign the role".

## Role hierarchies

In a hierarchy, a higher role **includes** all rights of the roles below it:

```
projectLead
 ├─ productionEngineer ─┐
 └─ qualityEngineer ────┴─ engineer
```

The project lead has the production engineer's rights, the quality engineer's rights and its own. Both lower roles inherit from the same `engineer` role, so inheritance can reach a role by more than one path. A correct implementation therefore collects permissions **recursively into a set** so duplicates vanish.

## Sessions and least privilege

A **session** ties an authenticated user to the roles currently active. Each role should hold the **minimum permissions** its job needs (least privilege), and conflicting roles shouldn't be combined for one person (**separation of duties**), such as the person who requests a payment also approving it.

## Operations

- Job change: add the new roles, remove the old ones.
- Departure: remove role assignments (easier to prove than hunting individual permissions).
- Review: regularly audit who holds which roles.

## Your task

Implement `effectivePermissions` over a role hierarchy.
