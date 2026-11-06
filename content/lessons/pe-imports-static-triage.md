## What an executable tells you without running it

Windows programs use the **Portable Executable (PE)** format: a header with metadata (type of application, required libraries, section layout) followed by sections. The import information lists the **functions the program asks the operating system for**.

## Libraries and what they suggest

- **kernel32.dll:** core OS functions: files (`CreateFile`, `ReadFile`, `WriteFile`), processes and memory
- **advapi32.dll:** services and the **registry** (`RegSetValueEx`, `RegOpenKeyEx`)
- **user32.dll:** user interface and input (a keyboard hook function here deserves attention)
- **ws2_32.dll / wsock32.dll:** networking (`connect`, `send`, `recv`)
- **wininet.dll:** higher-level protocols such as HTTP and FTP
- **ntdll.dll:** low-level kernel access

`A` and `W` suffixes mean ANSI and wide-character (Unicode) variants of the same function.

## How code finds its functions

- **Statically linked:** library code copied into the program (large, rare on Windows).
- **At load time (dynamic):** the loader resolves imports when the program starts; most programs.
- **At runtime:** functions are looked up when needed (`LoadLibrary`, `GetProcAddress`), common in **packed or obfuscated** programs. A packed sample often shows very few imports and almost no readable strings.

## Static triage workflow

1. Hash the file and check reputation.
2. Look at headers and imports with a PE viewer (for example PEStudio).
3. Extract strings and note interesting ones.
4. Map imports to capabilities: *reads/writes files, changes the registry, uses the network, hooks input*.

Capabilities are hints, not proof: legitimate programs use these functions too. Combine several signals and confirm with dynamic analysis in an isolated lab.

## Your task

Write `capabilityReport` to turn a list of imports into a sorted list of unique capability labels.

## Walk-through: reading imports like an analyst

An executable lists the system functions it calls. Think of it as a shopping list that hints at what the program plans to do.

Example import list:

```
kernel32.dll!CreateFileA
kernel32.dll!WriteFile
ws2_32.dll!connect
ws2_32.dll!send
user32.dll!SetWindowsHookExA
```

**Group them by purpose** using the table the lab gives (`CAPS`):

| Import | Capability |
| --- | --- |
| CreateFileA, WriteFile | file access |
| connect, send | network communication |
| SetWindowsHookExA | input hooking |

A program that can **hook keyboard input** and also **talk to the network** deserves a closer look: it could be capturing keystrokes and sending them out. That is a *hypothesis from static triage*, not proof. You confirm it with more analysis.

## Handling the details

- The format is `dll!Function`. `imp.split("!")[1]` is the function name.
- Names are matched case-insensitively, so use `.toLowerCase()` (the table keys are lowercase).
- Windows functions often come in ANSI (`...A`) and wide (`...W`) versions. If `createfilea` is not in the table, try again without the last letter: `fn.slice(0, -1)` gives `createfile`.
- Unknown functions are ignored.
- Use a `Set` so a capability is listed once even if several functions share it, then `[...set].sort()`.

## Why only suggest, never conclude

Legitimate programs use these functions too (a backup tool uses file access and network). Imports tell you what a program *can* do. Behavior analysis tells you what it *does*.

## Check yourself

What does `CAPS["readfile"]` give in the table? (`"file access"`.) What if the key is missing? (`undefined`, so the function is ignored.)
