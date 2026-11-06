## Why PowerShell?

Windows and Active Directory environments run on it. It's also installed on most corporate laptops, which is why attackers and defenders both use it. PowerShell 7 also runs on Linux and macOS.

## Objects, not text

Bash pipes text. PowerShell pipes **objects** with properties:

```powershell
Get-Process | Where-Object CPU -gt 100 | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU
```

Commands follow **Verb-Noun** naming: `Get-Service`, `Stop-Process`, `Set-Content`. Discover with `Get-Command *user*` and `Get-Help Get-LocalUser -Examples`.

## Handy security cmdlets

```powershell
Get-LocalUser                      # local accounts
Get-LocalGroupMember Administrators
Get-NetTCPConnection -State Listen # listening ports
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 20   # failed logons
Get-FileHash .\file.iso -Algorithm SHA256
```

## Execution policy is not security

`Set-ExecutionPolicy` stops accidental script runs, but it's easy to bypass. Real controls: application allowlisting, **Constrained Language Mode**, and logging (**Script Block Logging**, transcription).

## Practice safely

Use a Windows VM or Windows Sandbox. Read scripts before you run them, and never paste commands from strangers into an admin shell.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Cmdlets are named Verb-Noun.** `Get-LocalUser` lists the local user accounts on a Windows machine. Its relatives are staples for audits and incident response: `Get-LocalGroupMember` (who is in a group, for example Administrators) and `Get-WinEvent` (read Windows event logs). To discover commands, use `Get-Command *User*` and `Get-Help Get-LocalUser`.

## Worked examples: reading a PowerShell command

Read a pipeline left to right: each `|` hands **objects** (things with named properties) to the next command.

```powershell
Get-Process | Where-Object CPU -gt 100 | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU
```

1. `Get-Process` produces one object per running program.
2. `Where-Object CPU -gt 100` keeps those whose `CPU` property is greater than (`-gt`) 100.
3. `Sort-Object CPU -Descending` puts the biggest first.
4. `Select-Object -First 5 Name, CPU` keeps the top five and shows only two properties.

**Comparison words:** `-eq` equals, `-ne` not equal, `-gt` greater than, `-lt` less than, `-like` with wildcards.

**A small audit:** to see who is an administrator, `Get-LocalGroupMember Administrators` lists the members. To see failed sign-ins, `Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 20` reads the latest 20 events with ID 4625.

**When you do not know a command:** `Get-Command *user*` lists commands with "user" in the name, and `Get-Help Get-LocalUser -Examples` shows examples.

## Self-check

1. Which command lists local accounts? (`Get-LocalUser`.)
2. Is `Set-ExecutionPolicy` a strong security control? (No. It only prevents accidental script runs and is easy to bypass.)
3. Why not paste commands from strangers into an admin shell? (They run with full privileges and may be malicious.)
