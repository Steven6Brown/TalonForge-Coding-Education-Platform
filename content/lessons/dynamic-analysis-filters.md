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

## Walk-through: filtering a flood of events

While a sample runs, a monitor records thousands of events like:

```
{ process: "sample.exe", operation: "WriteFile", path: "C:\\temp\\a.txt" }
{ process: "svchost.exe", operation: "ReadFile", path: "C:\\win\\x.dll" }
```

Filters hide the noise. The rule you implement:

- Several filters for the **same attribute** are joined with **OR**: `process = sample.exe` OR `process = dropper.exe`.
- Filters for **different attributes** are joined with **AND**: the process rule AND the operation rule must both pass.
- **No filters** means show everything.

**Example filters:** `process=sample.exe`, `process=dropper.exe`, `operation=WriteFile`.

- Event 1 (`sample.exe`, `WriteFile`): process matches one of the two, operation matches. **Shown.**
- Event 2 (`svchost.exe`, `ReadFile`): process matches neither. **Hidden.**
- Event 3 (`sample.exe`, `ReadFile`): process matches, but operation does not. **Hidden.**

## The algorithm

1. **Group** the filters by attribute: `process: ["sample.exe", "dropper.exe"]`, `operation: ["WriteFile"]`.
2. An event matches when, **for every group**, the event's value for that attribute is **in the list**.
3. If there are no groups, "for every group" is vacuously true, so everything matches. Using `.every(...)` on an empty list gives `true` automatically.

## Why analysts do this

Filters only change what you **see**; the recorded events are still there. Filtering by the sample's process name is the first step because it removes thousands of unrelated events.

## Check yourself

With filters `process=a`, `process=b` and no operation filter, does an event with process `b` match? (Yes: the only attribute group is `process`, and `b` is in the list.)
