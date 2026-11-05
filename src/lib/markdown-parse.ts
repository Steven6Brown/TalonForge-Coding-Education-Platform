/** Pure (JSX-free) block parser for the lesson Markdown subset. Rendering lives in markdown.tsx. */

export type Block =
  | { t: "h"; level: 2 | 3; text: string }
  | { t: "p"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "quote"; text: string }
  | { t: "code"; text: string };

export function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      blocks.push({ t: "code", text: buf.join("\n") });
      continue;
    }
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push({ t: "h", level: h[1].length as 2 | 3, text: h[2] });
      i++;
      continue;
    }
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ t: "quote", text: buf.join(" ") });
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^\s*(?:[-*]|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (m) {
          items.push(m[1]);
          i++;
        } else if (/^\s{2,}\S/.test(lines[i]) && items.length) {
          // continuation / nested content is folded into the previous item
          items[items.length - 1] += " " + lines[i].trim();
          i++;
        } else break;
      }
      blocks.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !/^#{2,3}\s/.test(lines[i]) &&
      !lines[i].startsWith(">") &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i])
    )
      buf.push(lines[i++]);
    blocks.push({ t: "p", text: buf.join(" ") });
  }
  return blocks;
}
