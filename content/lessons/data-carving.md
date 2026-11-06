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
