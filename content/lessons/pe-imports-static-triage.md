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
