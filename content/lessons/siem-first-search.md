## Reading a search

The search box in this lab works like Splunk. Read left to right:

`source=auth action=failure | stats count by src_ip | sort -count`

1. `source=auth action=failure` finds events that are authentication logs **and** failures. Several terms mean AND.
2. `| stats count by src_ip` counts those events per source IP.
3. `| sort -count` orders results with the largest count first (the minus sign means high to low).

## Useful building blocks

- `field=value`, `field!=value`, wildcards like `host=web-*`
- `OR`, `NOT`, and quoted text
- `stats count`, `stats dc(field)` (distinct count), `stats sum(field) as total by host`
- `top 5 field`, `head 10`, `table host user`, `dedup field`, `where count > 10`

## Tips

- Start broad, then narrow. Add one term at a time.
- Look at the result count first. A surprising number is a clue.
- If you get an error, read the message. Most are a missing field name or a stray character.

Try the sample buttons, then answer the question using the console.

## Walk-through: reading a search one piece at a time

Use the sample buttons in the console, then change one thing at a time. Searches are read **left to right**, and the pipe `|` passes the results along.

**Step 1: just filter.** `source=auth` shows all authentication events. Look at the columns to learn the field names (`user`, `src_ip`, `action`...). The count above the table tells you how many events matched.

**Step 2: narrow it.** `source=auth action=failure` keeps only failures. Two terms side by side mean AND: both must be true.

**Step 3: count.** Add `| stats count` and you get one row with a single number: how many events matched. That number answers "how many failures?".

**Step 4: break it down.** `| stats count by src_ip` makes one row per address with its count. Add `| sort -count` to put the biggest first. The minus sign means "high to low".

**Step 5: limit.** `| head 5` keeps just the first five rows.

## If something goes wrong

- **No results:** check the spelling of the field and value. Searches are exact (`action=failure`, not `action=failed`).
- **An error message:** read it. It usually names the command or field it did not understand.
- **Too many rows:** add `| head 10` or narrow the filter.

## Check yourself

Which search shows the five hosts that appear most often in firewall events? (`source=firewall | top 5 host`.)
