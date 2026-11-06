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

## Walk-through: collecting inherited permissions

Roles from the lab:

```
engineer:           own permissions [read]
productionEngineer: own [deploy],  inherits engineer
qualityEngineer:    own [test],    inherits engineer
projectLead:        own [approve], inherits productionEngineer AND qualityEngineer
```

What can a `projectLead` do? Follow the chain:

1. Own permission: `approve`.
2. Inherits `productionEngineer`: `deploy`, and that role inherits `engineer`: `read`.
3. Inherits `qualityEngineer`: `test`, and that role also inherits `engineer`: `read` again.

Collect everything and remove duplicates: `approve, deploy, read, test`. Sorted: `["approve", "deploy", "read", "test"]`. Notice `read` appears twice on the way but only once in the answer: that is why a `Set` is used.

## The recursion

Write a helper `visit(name)`:

1. Look up the role: `const r = roles[name]`. If it does not exist, stop.
2. Add each of its own permissions to the set.
3. Call `visit` for each name in `inherits`.

Because a role can inherit from a role that inherits from another, the function follows the chain by calling itself. At the end, `[...out].sort()` turns the set into a sorted list.

## Why RBAC is popular

You give permissions to **roles** and people get roles, so when someone changes jobs you swap their role instead of editing dozens of individual permissions. Hierarchies avoid repeating permissions.

## Check yourself

What are `qualityEngineer`'s effective permissions? (`["read", "test"]`.)
