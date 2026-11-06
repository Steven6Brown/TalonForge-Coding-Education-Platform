import type { ReactNode } from "react";
import { parseBlocks } from "./markdown-parse";

/**
 * Minimal, dependency-free Markdown renderer. It builds React elements directly (never raw HTML),
 * so lesson text can't inject markup. Supports: ## / ### headings, paragraphs, - and 1. lists,
 * > quotes, ``` fenced code, **bold**, *italic* and `inline code`.
 */

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    if (tok.startsWith("`")) out.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**")) out.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else out.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose">
      {parseBlocks(source).map((b, i) => {
        switch (b.t) {
          case "h":
            return b.level === 2 ? <h2 key={i}>{renderInline(b.text)}</h2> : <h3 key={i}>{renderInline(b.text)}</h3>;
          case "p":
            return <p key={i}>{renderInline(b.text)}</p>;
          case "quote":
            return <blockquote key={i}>{renderInline(b.text)}</blockquote>;
          case "code":
            return (
              <pre key={i} tabIndex={0} aria-label="Code example">
                <code>{b.text}</code>
              </pre>
            );
          case "table":
            return (
              <div key={i} className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      {b.head.map((c, j) => (
                        <th key={j} scope="col">
                          {renderInline(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>{renderInline(c)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}
