import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LESSONS } from "./lessons";

/** Loads lesson Markdown. The id is checked against the known allowlist, which blocks path traversal. */
export async function loadLessonBody(id: string): Promise<string> {
  if (!LESSONS.some((l) => l.id === id)) throw new Error("Unknown lesson");
  return readFile(path.join(process.cwd(), "content", "lessons", `${id}.md`), "utf8");
}
