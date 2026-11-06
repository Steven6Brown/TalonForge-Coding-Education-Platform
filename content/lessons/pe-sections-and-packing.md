## Executable formats

- **Windows:** Portable Executable (**PE**), including `.exe`, `.dll`, `.sys`
- **Linux/Unix:** **ELF**
- **macOS and mobile:** **Mach-O**

The PE format holds what the Windows loader needs to map the file into memory: a header (with a small DOS stub, plus a compile **timestamp**, which can be faked) and sections.

## Common sections

- **.text:** the executable code (usually the only section that runs)
- **.data / .bss:** initialized / uninitialized variables
- **.rdata (or .idata/.edata):** imports and exports
- **.rsrc:** resources (icons, menus, strings)
- **.reloc:** rebasing information

Section names are usually consistent for a compiler, but can be changed to confuse analysis, so don't rely on names alone.

## Obfuscated and packed programs

**Obfuscation** hides code and behavior. **Packing** is one form: the real code is compressed, and a small wrapper decompresses it into memory when the program runs. Packed files show:

- almost **no readable strings** and **few imported libraries**
- a section whose **virtual (memory) size is much larger than its raw (disk) size**, because it expands when unpacked

If raw and virtual sizes are close, the file is probably not packed.

## Detecting and unpacking

Tools can identify the packer or compiler (for example PEiD) and unpack common formats (UPX: `upx -d file`). After unpacking, the **hash changes**, and you repeat static analysis on the unpacked code, which now shows readable strings and many imports. Authors can modify packers, so unpacking won't always work.

## Heuristics are hints

Size ratios, string counts and import counts raise suspicion; none is proof. Combine them with behavior observed in an isolated lab.

## Your task

Implement the raw-versus-virtual-size heuristic.

## Walk-through: spotting a packed section

A Windows program is split into **sections**. Two numbers describe each one:

- **Raw size:** how many bytes it takes on **disk**.
- **Virtual size:** how many bytes it takes **in memory** once loaded.

Normally they are similar. Compare two sections:

| Section | Raw size | Virtual size | Ratio |
| --- | --- | --- | --- |
| `.text` (code) | 4,096 | 4,500 | about 1.1 |
| `.UPX0` | 512 | 20,000 | about 39 |

The second section is tiny on disk but huge in memory. That pattern suggests the program is **packed**: the real code is compressed or encrypted on disk and unpacked into that big memory area when it runs. Packers hide the real code from simple scanners.

## The rule you implement

"Virtual size is more than **twice** the raw size." In code that single comparison is the whole function:

```js
return virtualSize > rawSize * 2;
```

For the table: `4500 > 4096 * 2`? No (8192), so false. `20000 > 512 * 2`? Yes (1024), so true.

## A heuristic, not proof

Some legitimate programs have large uninitialized data sections that grow in memory (such as `.bss`), so this rule can give **false positives**. Analysts combine it with other signs: unusual section names, very high **entropy** (randomness) in the data, and few imports.

## Check yourself

With raw 1000 and virtual 2000, is it flagged? (No: it must be *more than* twice, and 2000 is exactly twice.)
