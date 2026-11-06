## Start here if you have never automated anything

**Automation** means getting the computer to do a job for you, the same way, every time you ask (or on a schedule). A script is just a list of instructions written down so the computer can follow them without you.

You do not need to know how to code to understand this lesson. The next lessons in this track teach the code, one small piece at a time. First learn when automation is a good idea, and how to make it safe.

## Which jobs are worth automating?

Ask three questions about a task:

1. **Do I do it again and again?** (weekly report, renaming photos, checking logs)
2. **Does it follow clear rules?** ("every file ending in .pdf goes in the Documents folder")
3. **Is a mistake expensive when I do it by hand?** (copying 400 rows into a spreadsheet is boring, and boring work causes typos)

If you answered yes, it is a good candidate. If it is a one-off, or it needs human judgment ("which candidate should we hire?"), keep a person in charge.

**Example:** you download invoices every month and rename them `invoice-march.pdf`. The rules are clear, it repeats, and typos are easy. Good candidate.

## Four habits that make scripts trustworthy

A script that moves or deletes files can do damage very quickly, because it does not get tired and it does not ask "are you sure?". Build in these habits from your first script:

- **Idempotent** (say: eye-dem-POH-tent). Running it twice leaves the same result as running it once. A script that appends a line to a file every run is NOT idempotent: run it twice and you get a duplicate. A script that makes sure a line exists is. This matters because scripts fail halfway and get re-run.
- **Dry run first.** Add a mode that only **prints** what it would do ("would move report.pdf to Documents") and changes nothing. Read the output. Then run it for real.
- **Log everything and fail loudly.** Write what happened to a log file and show errors clearly. A script that fails silently is worse than no script.
- **No secrets in the code.** Passwords, API keys and tokens never go inside the script (people share scripts and upload them to GitHub). Read them from an **environment variable** (a named setting stored on your computer outside the code) or a secret manager.

## Start small

Automate one step first. Make it work. Then chain steps. Large automations are made of small, tested ones.

## What the rest of this track covers

- **Organizing files** with Python (dictionaries and loops).
- **CSV and JSON reports**, the two formats you will meet most.
- **APIs and pagination:** asking web services for data a page at a time.
- **Retries and logging:** making scripts survive flaky networks.
- **Scheduling with cron** and **CI/CD** so it runs without you.

If Python is new to you, work through the **Python Foundations** track first. Everything here builds on it.

## Your task

Answer the quiz below. If you get one wrong, read the explanation: it names the habit above that applies.
