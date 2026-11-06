## Watch what the program does

**Dynamic analysis** runs a sample in a controlled, isolated lab and records its behavior. The data are **events**: file, registry, process, thread and network operations.

## Common tools

- **Process Monitor (Procmon):** records registry, file system, process/thread and network events in real time.
- **Process Explorer:** a detailed task manager showing the process tree, loaded DLLs, handles and image details. New processes highlight green, exiting ones red, packed images purple. Malware often lacks version info or uses random names.
- **Regshot:** snapshots the registry before and after.
- **Network tools:** Wireshark, and simulators such as INetSim, FakeNet or ApateDNS that answer the sample's network requests inside the lab.

## Workflow in Procmon

1. Stop the capture and clear old events; reset filters.
2. Add a filter for the sample's **process name**.
3. Start capturing, run the sample in the lab, then stop.
4. Use the registry, file system, process and network views to analyze the events.

## How filters combine

- Filters on **different attributes** are **AND**ed (process is X *and* operation is Y).
- Multiple values for the **same attribute** are **OR**ed (operation is Y *or* Z).
- Filtering only changes what you see; all recorded events remain available.

## Limits

Process monitors can miss driver activity and certain API calls, so combine tools.

## Safety

Use an isolated VM, snapshot it, simulate network services, and revert to a clean image after every run.

## Your task

Implement the filter-matching logic described above.
