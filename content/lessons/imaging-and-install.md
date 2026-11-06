## The big picture

Setting up a computer means: get an OS image → put it on bootable media → boot from it → install. Do it often and you'll never fear a reinstall.

## 1. Get and verify the image

Download the ISO from the **official** site. Verify the SHA-256 checksum (and the GPG signature if provided):

```
sha256sum ubuntu-24.04.iso        # Linux/macOS
Get-FileHash .\file.iso           # Windows PowerShell
```

Compare with the vendor's published hash from a trusted channel.

## 2. Flash it to USB

- **Windows:** Rufus or Ventoy (Ventoy lets one USB hold many ISOs).
- **macOS/Linux:** balenaEtcher, or `dd`:

```
sudo dd if=image.iso of=/dev/sdX bs=4M status=progress
```

> `dd` has no safety net. The wrong `of=` device destroys that disk. Run `lsblk` first and triple-check.

## 3. Boot from it

Reboot and tap the boot-menu key (F12, F2, Esc or Del depending on vendor). You may need to tweak **UEFI** settings: boot order, Secure Boot, or disable fast boot.

## 4. Install choices

- **Wipe vs dual-boot:** dual-booting is flexible but riskier; back up first.
- **Full-disk encryption** (LUKS, BitLocker) protects a lost laptop.
- Create a non-root user; set a strong password; update after first boot.

## Practice without risk

Use a **virtual machine** (VirtualBox, VMware Workstation Player, Proxmox) to rehearse every step with snapshots.

## Check yourself

Answer the quiz below to finish the lesson.

## Key facts this lesson's quiz checks

- **Why verify the checksum?** A **checksum** (hash) is a fingerprint of a file. If your download's SHA-256 matches the one the vendor publishes, the file was not corrupted or changed. It only proves much if the published hash comes from a **trusted source**: a hash sitting on the same hacked page as the file proves little. Where possible also verify the vendor's **digital signature**.
- **Flashing erases the drive.** Writing an installer image to a USB drive overwrites the whole device, so any existing files are **lost**. Double-check you picked the right drive letter or device before pressing Start (or before running `dd`, which will happily overwrite your main disk if you choose it by mistake).
