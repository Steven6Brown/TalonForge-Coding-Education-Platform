import { LESSONS } from "@/lib/content/lessons";
import { explainError } from "@/lib/explain-error";
import { GLOSSARY, type Entry } from "./glossary";

export type HelperQuery = { question: string; code?: string; output?: string; language?: "javascript" | "python" | "sql" };
export type HelperAnswer = { text: string; source: "built-in" };

const STOP = new Set(["what", "does", "do", "is", "the", "a", "an", "how", "why", "i", "to", "in", "of", "and", "me", "my", "it", "this", "that", "mean", "means", "work", "works", "use", "used", "using", "can", "you", "explain", "tell", "about", "when", "should", "for", "on", "with", "are", "get"]);

const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9.$=>{}\\_-]+/).filter((t) => t && !STOP.has(t));

/** Scores glossary entries by overlapping keywords. Exported for tests. */
export function searchGlossary(question: string, max = 3): Entry[] {
  const q = question.toLowerCase();
  const toks = tokens(question);
  const scored = GLOSSARY.map((e) => {
    let score = 0;
    for (const k of e.keys) {
      if (q.includes(k) && (k.length > 2 || toks.includes(k))) score += k.length > 4 ? 3 : 2;
      else if (toks.includes(k)) score += 2;
    }
    // Match whole words in the title, not substrings ("port" must not match "import").
    const titleWords = e.title.toLowerCase().split(/[^a-z0-9]+/);
    if (toks.some((t) => t.length > 2 && titleWords.includes(t))) score += 1;
    return { e, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, max).map((x) => x.e);
}

function relatedLessons(question: string, max = 3) {
  const toks = tokens(question).filter((t) => t.length > 3);
  if (!toks.length) return [];
  return LESSONS.map((l) => {
    const hay = `${l.title} ${l.summary}`.toLowerCase();
    return { l, score: toks.filter((t) => hay.includes(t)).length };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.l);
}

/** Answers from the built-in knowledge base. Never throws; always returns something helpful. */
export function localAnswer(q: HelperQuery): HelperAnswer {
  const parts: string[] = [];
  const err = q.output && q.language ? explainError(q.language, q.output) : null;
  if (err) parts.push(`**About the error in your output**\n\n${err}`);

  const hits = searchGlossary(q.question || (q.output ?? ""));
  for (const h of hits) {
    parts.push(`**${h.title}**\n\n${h.body}${h.example ? `\n\n\`\`\`\n${h.example}\n\`\`\`` : ""}`);
  }

  const rel = relatedLessons(q.question);
  if (rel.length) parts.push("**Related lessons:** " + rel.map((l) => `${l.title}`).join(" · "));

  if (!parts.length) {
    parts.push(
      "I don't have a built-in answer for that yet. Try rephrasing with the name of the thing (for example *slice*, *for loop*, *hash*, *port 443*), or paste the exact error message.",
    );
  }
  if (q.code && !hits.length && !err) {
    parts.push("Tip: run your code and press **Ask the helper about this** again so I can read the error output, or use the hint button in the lab.");
  }
  return { text: parts.join("\n\n"), source: "built-in" };
}
