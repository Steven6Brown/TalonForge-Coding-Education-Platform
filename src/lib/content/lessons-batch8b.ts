import type { Lesson } from "./types";

/** Batch 8b: two more malware-analytics lessons from the owner's Cyber 366 lecture PDFs (original text, defensive focus). */
export const BATCH8B_LESSONS: Lesson[] = [
  {
    id: "strings-and-initial-analysis",
    track: "malware-analytics",
    title: "Strings & Initial Analysis Steps",
    summary: "Pull readable text out of a binary and decide what's useful.",
    minutes: 30,
    xp: 90,
    level: "intermediate",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement extractStrings(bytes, minLen): bytes is an array of numbers (0-255). Return every run of printable ASCII characters (codes 32 to 126) that is at least minLen long, in order, as strings.",
      starter: `function extractStrings(bytes, minLen) {
  // TODO: walk the bytes, build up the current run, and save it when a non-printable byte ends it
  return [];
}
`,
      harness: `
{
  const bytes = [0x56, 0x50, 0x33, 0, 0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x61, 0x2e, 0x65, 0, 0x01, 0x41, 0x42, 0x43, 0x44, 0x45];
  const got = JSON.stringify(extractStrings(bytes, 4));
  const ok = got === JSON.stringify(["http://a.e", "ABCDE"]) && extractStrings([], 4).length === 0 && extractStrings([0x41, 0x42, 0x43], 4).length === 0;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED: " + got);
}`,
      expected: "ALL TESTS PASSED",
      hints: ["A byte is printable when `b >= 32 && b <= 126`.", "Keep a `current` string; when a non-printable byte arrives, save `current` if its length >= minLen, then reset it.", "Don't forget to check the last run after the loop ends."],
      solution: `function extractStrings(bytes, minLen) {
  const out = [];
  let cur = "";
  for (const b of bytes) {
    if (b >= 32 && b <= 126) cur += String.fromCharCode(b);
    else {
      if (cur.length >= minLen) out.push(cur);
      cur = "";
    }
  }
  if (cur.length >= minLen) out.push(cur);
  return out;
}`,
    },
  },
  {
    id: "pe-sections-and-packing",
    track: "malware-analytics",
    title: "PE Sections, Packing & Unpacking",
    summary: "Spot packed programs from section sizes, then analyze the unpacked code.",
    minutes: 30,
    xp: 90,
    level: "advanced",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement isLikelyPacked(rawSize, virtualSize): return true when a section's virtual (in-memory) size is MORE THAN TWICE its raw (on-disk) size, otherwise false. This is a rough heuristic, as explained in the lesson.",
      starter: `function isLikelyPacked(rawSize, virtualSize) {
  // TODO
  return false;
}
`,
      harness: `
{
  const ok =
    isLikelyPacked(108032, 107952) === false &&
    isLikelyPacked(1024, 40960) === true &&
    isLikelyPacked(4096, 4096) === false &&
    isLikelyPacked(4096, 9000) === true;
  console.log(ok ? "ALL TESTS PASSED" : "TESTS FAILED");
}`,
      expected: "ALL TESTS PASSED",
      hints: ["Compare `virtualSize > rawSize * 2`."],
      solution: `function isLikelyPacked(rawSize, virtualSize) {
  return virtualSize > rawSize * 2;
}`,
    },
  },
];
