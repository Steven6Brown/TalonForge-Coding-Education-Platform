"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { localAnswer, type HelperAnswer } from "@/lib/helper/local";
import { Markdown } from "@/lib/markdown";

type Msg = { role: "you" | "helper"; text: string; source?: HelperAnswer["source"] };
type Ctx = { code?: string; output?: string; language?: "javascript" | "python" | "sql" };

const AI_KEY = "tf:helper:ai";

/** Floating "Ask" helper. Built-in answers work offline; optional AI answers need a server key and the learner's opt-in. */
export function HelperWidget() {
  const path = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [ctx, setCtx] = useState<Ctx>({});
  const [aiAvailable, setAiAvailable] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setUseAi(window.localStorage.getItem(AI_KEY) === "1"); } catch { /* storage blocked */ }
    fetch("/api/helper").then((r) => r.json()).then((d: { ai?: boolean }) => setAiAvailable(!!d.ai)).catch(() => setAiAvailable(false));
  }, []);

  useEffect(() => {
    function onAsk(e: Event) {
      const d = (e as CustomEvent<Ctx & { question?: string }>).detail;
      setCtx({ code: d.code, output: d.output, language: d.language });
      setQ(d.question ?? "");
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    window.addEventListener("tf-ask", onAsk);
    return () => window.removeEventListener("tf-ask", onAsk);
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  function toggleAi(v: boolean) {
    setUseAi(v);
    try { window.localStorage.setItem(AI_KEY, v ? "1" : "0"); } catch { /* ignore */ }
  }

  async function ask() {
    const question = q.trim();
    if (!question && !ctx.code) return;
    setMsgs((m) => [...m, { role: "you", text: question || "(explain my code)" }]);
    setQ("");
    setBusy(true);
    let answer: HelperAnswer | null = null;
    if (useAi && aiAvailable) {
      try {
        const res = await fetch("/api/helper", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ question, code: ctx.code?.slice(0, 6000), output: ctx.output?.slice(0, 2000), language: ctx.language, lesson: path.startsWith("/learn") ? path : undefined }),
        });
        if (res.ok) {
          const d = (await res.json()) as { answer?: string };
          if (d.answer) answer = { text: d.answer, source: "ai" };
        }
      } catch { /* fall back to built-in */ }
    }
    if (!answer) answer = localAnswer({ question, code: ctx.code, output: ctx.output, language: ctx.language });
    setMsgs((m) => [...m, { role: "helper", text: answer.text, source: answer.source }]);
    setBusy(false);
  }

  return (
    <>
      <button className="helper-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="helper-panel">
        {open ? "Close helper" : "Ask the helper"}
      </button>
      {open && (
        <section id="helper-panel" className="helper-panel" role="dialog" aria-label="Ask the helper">
          <h2 className="helper-h">Ask a question</h2>
          <p className="muted small">
            Ask about a word, an error or a concept. {ctx.code ? "Your lab code and last output are attached." : "Open a lab and press “Ask the helper about this” to attach your code."}
          </p>
          <div ref={logRef} className="helper-log" role="log" aria-live="polite">
            {msgs.length === 0 && <p className="muted small">Try: “what does slice do?”, “why is my code a SyntaxError?”, “what is port 443?”</p>}
            {msgs.map((m, i) => (
              <div key={i} className={`helper-msg ${m.role}`}>
                <strong>{m.role === "you" ? "You" : m.source === "ai" ? "Helper (AI)" : "Helper"}</strong>
                {m.role === "helper" ? <Markdown source={m.text} /> : <p>{m.text}</p>}
              </div>
            ))}
            {busy && <p className="muted" role="status">Thinking…</p>}
          </div>
          <label className="sr-only" htmlFor="helper-q">Your question</label>
          <textarea
            id="helper-q"
            ref={inputRef}
            rows={2}
            value={q}
            maxLength={1000}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void ask(); } }}
            placeholder="Type your question and press Enter"
          />
          <div className="row">
            <button className="btn primary small" onClick={() => void ask()} disabled={busy}>Ask</button>
            {ctx.code && <button className="btn small" onClick={() => setCtx({})}>Detach my code</button>}
            {aiAvailable && (
              <label className="check small">
                <input type="checkbox" checked={useAi} onChange={(e) => toggleAi(e.target.checked)} />
                <span>Use AI answers (sends your question and attached code to the AI provider through this app&apos;s server)</span>
              </label>
            )}
          </div>
          {!aiAvailable && <p className="muted small">Built-in helper only. AI answers can be enabled by the site owner.</p>}
        </section>
      )}
    </>
  );
}
