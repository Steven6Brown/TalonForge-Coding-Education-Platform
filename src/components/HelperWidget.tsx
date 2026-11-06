"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { localAnswer, type HelperAnswer } from "@/lib/helper/local";
import { Markdown } from "@/lib/markdown";

type Msg = { role: "you" | "helper"; text: string; source?: HelperAnswer["source"] };
type Ctx = { code?: string; output?: string; language?: "javascript" | "python" | "sql" };

const AI_KEY = "tf:helper:ai";
const STARTERS = ["What does slice do?", "What is a for loop?", "What is port 443?", "Difference between hashing and encryption", "What is a SIEM?", "What does SyntaxError mean?"];

/** Small talon mark used as the helper's avatar. */
function Avatar({ size = 36 }: { size?: number }) {
  return (
    <span className="helper-avatar" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5c5 0 9 3 10 8 1-2 3-3 6-3-1 5-5 8-10 8-3 0-5-2-6-5" />
        <path d="M9 14l-2 5" />
      </svg>
    </span>
  );
}

/** Floating helper. Built-in answers work offline; optional AI answers need a server key and the learner's opt-in. */
export function HelperWidget() {
  const path = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [ctx, setCtx] = useState<Ctx>({});
  const [aiAvailable, setAiAvailable] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [how, setHow] = useState(false);
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

  async function ask(text?: string) {
    const question = (text ?? q).trim();
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
      <button className={"helper-fab" + (open ? " open" : "")} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="helper-panel">
        <Avatar size={30} />
        <span>{open ? "Close" : "Ask the helper"}</span>
      </button>
      {open && (
        <section id="helper-panel" className="helper-panel" role="dialog" aria-label="Ask the helper">
          <header className="helper-top">
            <Avatar size={42} />
            <div>
              <h2 className="helper-h">Talon, your study helper</h2>
              <p className="helper-status small">
                <span className={"dot" + (useAi && aiAvailable ? " ai" : "")} aria-hidden="true" />
                {useAi && aiAvailable ? "AI answers on" : "Built-in answers, works offline"}
              </p>
            </div>
            <button className="btn small" onClick={() => setHow(!how)} aria-expanded={how}>{how ? "Hide" : "How I work"}</button>
          </header>

          {how && (
            <div className="helper-how small">
              <p><strong>Built-in mode (default).</strong> I match the words in your question against a library of about 50 explained terms and your lesson list, and I translate error messages in your output into plain English. Everything runs in your browser; nothing is sent anywhere. I am a keyword lookup, not a mind-reader, so use the exact name of the thing (for example <em>slice</em> or <em>port 443</em>).</p>
              <p><strong>Attaching your code.</strong> Inside a lab, press &ldquo;Ask the helper about this&rdquo; and I will see your code and last output.</p>
            </div>
          )}

          <div ref={logRef} className="helper-log" role="log" aria-live="polite">
            {msgs.length === 0 && (
              <div className="helper-welcome">
                <p>Hi! Ask me about a word, an error or a concept. {ctx.code ? "Your lab code and last output are attached." : "Inside a lab you can attach your code too."}</p>
                <div className="helper-chips">
                  {STARTERS.map((s) => (<button key={s} className="helper-chip" onClick={() => void ask(s)}>{s}</button>))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`helper-msg ${m.role}`}>
                <span className="helper-who">{m.role === "you" ? "You" : m.source === "ai" ? "Talon · AI" : "Talon"}</span>
                <div className="helper-bubble">{m.role === "helper" ? <Markdown source={m.text} /> : <p>{m.text}</p>}</div>
              </div>
            ))}
            {busy && <p className="helper-typing" role="status"><span /><span /><span /></p>}
          </div>

          <label className="sr-only" htmlFor="helper-q">Your question</label>
          <div className="helper-input">
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
            <button className="btn primary" onClick={() => void ask()} disabled={busy} aria-label="Send question">Send</button>
          </div>
          <div className="row">
            {ctx.code && <button className="btn small" onClick={() => setCtx({})}>Detach my code</button>}
            {aiAvailable && (
              <label className="check small">
                <input type="checkbox" checked={useAi} onChange={(e) => toggleAi(e.target.checked)} />
                <span>Use AI answers (sends your question and attached code to the AI provider through this app&apos;s server)</span>
              </label>
            )}
          </div>
        </section>
      )}
    </>
  );
}
