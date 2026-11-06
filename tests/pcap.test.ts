import { describe, expect, it } from "vitest";
import { Shell } from "@/lib/shell/shell";
import { FILESYSTEMS } from "@/lib/content/filesystems";

describe("packet analysis lab", () => {
  const s = new Shell(FILESYSTEMS.pcap);
  it("DNS server, HTTP code and requested path are discoverable", () => {
    expect(s.run("grep 'query A' capture2.txt | head -n 1").output).toContain("10.20.0.53");
    expect(s.run("grep 'HTTP/1.1 200' capture2.txt").output).toContain("200 OK");
    expect(s.run("grep GET capture2.txt").output).toContain("/deals/index.html");
  });
});
