import { describe, expect, it } from "vitest";
import { Shell } from "@/lib/shell/shell";
import { FILESYSTEMS } from "@/lib/content/filesystems";

describe("sudo log triage lab", () => {
  const s = new Shell(FILESYSTEMS.sudolog);
  it("counts April entries and ranks users", () => {
    expect(s.run("grep sudo access1.log | grep Apr | grep -c harrypotter").output.trim()).toBe("5");
    const rank = s.run("grep sudo access1.log | awk '{print $6}' | sort | uniq -c | sort -rn | head -n 1").output;
    expect(rank).toMatch(/7\s+harrypotter/);
  });
});
