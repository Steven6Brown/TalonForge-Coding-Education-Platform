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

## Vocabulary and an analogy

- **RAM (memory):** the computer's short-term workspace. It holds the programs running right now and the data they use. It is erased when power is lost.
- **Process:** a running program. Each has a name and an ID number (PID).
- **Memory image (dump):** a saved copy of everything in RAM at one moment.
- **Volatile:** disappears when the machine is turned off.

**Analogy:** disk is like files in a filing cabinet, and RAM is like what is spread across the desk right now. If you walk away and the desk is cleared, you lose anything that was only on the desk. A crime scene investigator photographs the desk *first*.

## Why memory matters

Some malware never writes itself to disk. It lives only in memory, so a disk scan finds nothing. A memory image can show it: a process with an odd name, a connection to an unknown address, or code injected into a normal program.

## Order of volatility (collect in this order)

1. CPU registers and cache (gone almost instantly)
2. **RAM**
3. Network connections and running processes
4. Disk contents
5. Logs and backups (most durable)

Never "turn it off to be safe": that destroys steps 1 to 3.

## What an analyst asks of a memory image

| Question | What you look for |
| --- | --- |
| What was running? | A process list: unusual names, wrong parent programs |
| Who was it talking to? | Network connections to unfamiliar addresses |
| Was anything hidden? | Processes or modules that do not show up in normal lists |

Tools such as Volatility automate these lists. Remember the workflow: capture, hash the capture, record it in the chain of custody, analyze a copy.

## Check yourself

Why capture RAM before disk? (RAM is volatile: it is lost on power-off, while the disk stays.)
