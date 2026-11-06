## The report is the deliverable

Findings only matter if others can understand, verify and act on them. Forensic reports are read by managers, lawyers and other examiners, so clarity and accuracy are essential.

## A solid structure

1. **Executive summary:** what you were asked, what you found, and what it means, in plain language.
2. **Evidence and integrity:** what was examined, how it was acquired, and the recorded hash values.
3. **File system hierarchy:** where the important folders and files are.
4. **User accounts:** who used the system and what each account contains.
5. **Data files:** documents, images and other content relevant to the case.
6. **Application history:** browsers, programs, messaging and email clients used.
7. **Indicators of compromise:** malicious files, suspicious programs, URLs and timeline.
8. **References and appendices.**

## Writing rules

- Separate **facts** (what the evidence shows) from **conclusions** (what you infer). Qualify uncertainty.
- Make every claim traceable to an artifact, tool and location.
- Use neutral language; avoid speculation about people.
- Include enough detail for another examiner to reproduce your results.
- Handle sensitive content carefully and limit it to what the case needs.

## Check yourself

Take the quiz below.

## Worked example: a fact versus a conclusion

Weak writing mixes the two:

> "The suspect obviously stole the files using his laptop."

Strong writing separates them and ties each claim to an artifact:

> **Finding (fact):** On the image `laptop01.E01` (SHA-256 recorded in Section 2), the folder `C:\Users\jsmith\Documents\Finance` contains 214 files. The registry shows a USB device with serial `XYZ123` was connected on 2026-01-12 at 14:03 UTC (Artifact: `SYSTEM\...\USBSTOR`, tool: Registry Explorer).
>
> **Conclusion (inference, moderate confidence):** The timing is consistent with the files being copied to that device. This examination did not recover the destination copies, so the conclusion cannot be confirmed from this image alone.

Notice: **what was seen**, **where** it lives, **which tool**, and an honest statement of **how sure** you are.

## Executive summary template

1. **What was asked:** "Determine whether finance files left the company on removable media."
2. **What was found:** two or three plain sentences.
3. **What it means and what comes next:** a recommendation for the reader.

Write it so a manager who reads nothing else knows the outcome.

## Checks before you submit

- Can another examiner repeat each step from your notes?
- Are the evidence hashes listed, and do they match?
- Did you avoid speculating about a person's motives?
- Did you include only the sensitive content the case needs?

## Self-check

1. Which section lists hash values? (Evidence and integrity.)
2. Is "the user must have deleted it" a fact or a conclusion? (A conclusion, and it needs evidence and a confidence level.)
