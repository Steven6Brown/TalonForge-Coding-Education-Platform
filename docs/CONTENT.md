# Authoring guide

TalonForge is written for people who have **never done the subject before**. The tests enforce the basics, but the intent matters more than the checks: a learner should never be asked to use something the page has not taught.

## Lessons

1. Write `content/lessons/<id>.md`.
2. Add the lesson metadata (id, track, title, summary, minutes, xp, level, lab) to a batch file in `src/lib/content/` and register it in `lessons.ts`; list its id in a track.
3. Open with a **Start here** section for beginners, explain every term you use, and end with a worked example and a short self-check.
4. Quiz lessons: the lesson text must teach every answer its quiz checks (a test compares them).

### The Markdown subset

`##` and `###` headings, paragraphs, `-`/`1.` lists, `>` quotes, fenced code blocks, **tables** (`| a | b |` then `| --- | --- |`), `**bold**`, `*italic*` and `` `inline code` ``. There are no links, images or raw HTML on purpose: text is rendered to React elements and never as HTML.

## Code labs (JavaScript, Python, SQL)

Give every code lab:

- `concepts`: one titled block per idea the solution needs (what it is, a tiny example).
- `plan`: a numbered, step-by-step approach that does not reveal the full solution.
- `prerequisites`: links to the foundation lessons to read first (they must come earlier in the curriculum; a test checks this).
- at least two `hints`, from gentle to specific.
- optionally an `example` the learner can load and experiment with.

Shared scaffolds live in `src/lib/content/lab-scaffolds.ts` and `lab-scaffolds-b.ts` (keyed by lesson id) and are merged in `lessons.ts`. JavaScript labs run in a worker: the solution must pass and the starter must fail (tested automatically).

## Terminal (shell) labs

Add a filesystem in `filesystems*.ts` and, if needed, extra commands in `profiles.ts`. In the lesson, list the commands the lab needs with a worked example. **Run the commands against the simulator** before documenting them: not every GNU option is implemented (for example `grep -B` is not).

## SIEM labs

Searches run over the fictional events in `src/lib/siem/data.ts`. Lab answers should come from the exported `TRUTH` object, never be hard-coded, so they cannot drift from the data.

## Career scenarios

Scenarios live in `src/lib/sim/` (`helpdesk*.ts`, `soc.ts`, `handson.ts`) as plain data:

- A scenario has `difficulty`, a ticket, and `steps`. Each step is either choices (`c(label, points 0-3, tag, next, feedback)`), a **hands-on** task, or an `end`.
- Hands-on tasks (`hands`): `terminal` (command patterns, canned output, optional `after` ids so output changes after a fix, `required` ids), `console` (check or select fields with a correct value and a reason), `ticket` (fields plus keyword checks) and `siem` (a question, answers and sample searches).
- Add a guide in `guides.ts` (or the file's own guides object): an `objective`, a `primer` of key terms and optional `coach` hints per step. Advanced scenarios show no hints.
- Register the scenario in `roles.ts`. Tests check the graph (links valid, no cycles, a scoring path) and the shape of each hands-on task.
- Everything is fictional. Do not reuse real names, companies or credentials.

## Style

Plain English, short sentences, define terms the first time, show real output, and say what to do when something goes wrong. Avoid hype and do not present practice as a credential.
