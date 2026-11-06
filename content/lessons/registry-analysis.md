## What the registry is

The Windows **registry** is a hierarchical database of system and user settings. It also records traces of activity, which makes it a rich source of forensic evidence.

## Hives and what they hold

Registry data is stored in **hive** files:

- **SAM**: local user accounts (names, account IDs, password hashes)
- **SYSTEM**: hardware, services, time zone, attached USB device history
- **SOFTWARE**: installed programs and system-wide settings
- **SECURITY**: security policy data
- **NTUSER.DAT** (one per user): that user's settings and recent activity (`HKEY_CURRENT_USER`)

## Artifacts examiners look for

- **Autostart locations** (for example `Run` keys): programs set to launch at logon, a common persistence spot
- **Recently used files and typed paths** in the user's hive
- **Installed software and uninstall entries**
- **USB devices** previously connected
- **User accounts** and last logon times

## Method

1. Work from a forensic image or exported copies of the hives, never the live original.
2. Load the hives in a registry viewer (for example Registry Explorer or FTK Imager's registry viewer).
3. Note key last-write times, which show when a key was last modified.
4. Corroborate registry findings with other artifacts (files, logs, browser history).

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Work on a copy.** Opening or booting the original system changes timestamps and data, which destroys the **original evidence** and weakens its value in court. Examiners **image first** (make an exact copy, then verify it with a hash) and analyze the copy of the registry hives.
