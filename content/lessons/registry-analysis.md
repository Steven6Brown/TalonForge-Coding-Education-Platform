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

## Worked example: investigating persistence and USB use

**Question 1: how does this malware survive a reboot?** Look at the autostart (**Run**) keys in the software and user hives. A key such as `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` holds programs that start at logon. Finding `updater = C:\Users\jsmith\AppData\Roaming\svc.exe` there is suspicious: legitimate updaters rarely live in a user's roaming folder under a vague name. That is a **persistence** mechanism.

**Question 2: was a USB drive connected?** The SYSTEM hive keeps a history of attached USB devices (vendor, product, serial number, and times). Match the serial to a specific drive to show *that device* was connected, and when.

**Question 3: what did this user open recently?** The user's `NTUSER.DAT` records recent documents, typed paths and other activity for that account.

## The method

1. Work from a **forensic image** or exported copies of the hives. Opening the live system alters timestamps and data.
2. Load hives in a viewer such as Registry Explorer.
3. Go to each artifact location and **note the key path and its last-written time**.
4. Record everything in your report with the tool and location so someone else can repeat it.

## Hive cheat sheet

| Hive | Holds |
| --- | --- |
| SAM | Local accounts and password hashes |
| SYSTEM | Hardware, services, time zone, USB history |
| SOFTWARE | Installed programs, system settings |
| SECURITY | Security policy |
| NTUSER.DAT | One user's settings and recent activity |

## Self-check

1. Where do you look for programs that start at logon? (Run keys.)
2. Why use a copy of the hives? (To preserve the original evidence.)
