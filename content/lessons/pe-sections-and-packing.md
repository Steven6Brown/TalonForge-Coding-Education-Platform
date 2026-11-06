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
