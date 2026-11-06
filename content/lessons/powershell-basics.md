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
