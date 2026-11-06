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
