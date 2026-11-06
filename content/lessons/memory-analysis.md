## Volatile evidence

Some evidence exists only while a machine is running. **Memory forensics** analyzes a capture of RAM to see what the system was doing.

## Order of volatility

Collect the most volatile data first: CPU registers and cache, then **memory**, network state, running processes, then disk, then logs and backups. Powering a machine off destroys the first items.

## What memory can reveal

- Running and hidden **processes** and their command lines
- Active **network connections** and listening ports
- Loaded modules and injected code that never touched disk
- Registry hives and strings loaded in memory
- Sometimes passwords or keys in clear text

## Workflow

1. Capture memory with a trusted tool, noting exactly what you ran and when.
2. **Hash the capture** and record it in the chain of custody.
3. Analyze with a framework such as **Volatility**: list processes, network sockets and suspicious modules.
4. Compare findings to disk, log and network evidence.

Capturing memory slightly changes the system, so document your actions so the work can be repeated and explained.

## Check yourself

Take the quiz below.
