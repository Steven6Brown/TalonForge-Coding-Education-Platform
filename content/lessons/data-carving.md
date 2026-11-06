## Recovering files without a file system

When a file is deleted, its data often remains on disk even though the directory entry is gone. **Data carving** recovers files directly from raw bytes by recognizing known patterns instead of relying on the file system.

## File signatures

Many formats start (and some end) with fixed byte patterns called **magic numbers**:

- **JPEG** starts with `FF D8 FF` and ends with `FF D9`
- **PNG** starts with `89 50 4E 47 0D 0A 1A 0A`
- **PDF** starts with `%PDF` (`25 50 44 46`)
- **ZIP** starts with `50 4B 03 04`

A carver scans the raw data for a header, then reads until a footer (or a size limit), and writes that slice out as a recovered file.

## Limits

- Fragmented files can't be rebuilt by simple header/footer scanning.
- Overwritten data is gone.
- Carved files lack names and timestamps, so combine carving with file-system analysis.

Tools such as Autopsy, Scalpel, Foremost and PhotoRec automate carving. Always work on an image, not the original disk.

## Your task

Implement a JPEG carver on a hex string: find each `ffd8ff` header, the next `ffd9` footer, and return the byte ranges.

## Walk-through: carving one tiny file

Imagine this raw data as hex, two characters per byte (offset numbers are shown for each byte):

```
offset: 0  1  2  3  4  5  6  7
byte:   00 ff d8 ff 00 ff d9 00
```

A JPEG starts with `ff d8 ff` and ends with `ff d9`.

1. Scan from the start. At offset 1 the three bytes are `ff d8 ff`: a **start marker**.
2. Scan forward for `ff d9`. Offset 4 holds `00 ff`: no. Offset 5 holds `ff d9`: yes, that is the **end marker**.
3. The file runs from offset 1 up to and including the end marker. The end marker occupies offsets 5 and 6, so the end is **exclusive** at 7: `[1, 7]`.
4. Continue scanning after offset 7 for another file.

Result: `[[1, 7]]`.

## Converting between bytes and characters

Each byte is **two** hex characters, so byte `n` is `hex.slice(n * 2, n * 2 + 2)`. The three-byte marker at offset `i` is `hex.slice(i * 2, i * 2 + 6)` and should equal `"ffd8ff"`. The number of bytes is `hex.length / 2`.

## Why forensics uses this

When a file system is damaged or files are deleted, the directory no longer points at them, but the **data may still be on disk**. Carving finds files by their start and end patterns (**file signatures**), without needing the file system. Real tools do this for many formats.

## If something goes wrong

- Offsets look doubled or halved: you mixed characters and bytes. Remember 2 characters = 1 byte.
- An unfinished file at the end is returned: only record a file when an end marker was found.

## Check yourself

In `ffd8ffe000ffd9`, where does the file end? (Bytes: ff d8 ff e0 00 ff d9. The `ff d9` is at offsets 5 and 6, so the end is 7: `[0, 7]`.)
