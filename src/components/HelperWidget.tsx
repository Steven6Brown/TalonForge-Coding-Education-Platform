"use client";
import { useEffect, useRef, useState } from "react";
import { localAnswer } from "@/lib/helper/local";
import { Markdown } from "@/lib/markdown";

type Msg = { role: "you" | "helper"; text: string };
type Ctx = { code?: string; output?: string; language?: "javascript" | "python" | "sql" };

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

/** Floating study helper. It answers from a built-in glossary and explains lab errors, entirely in the browser. */
export function HelperWidget() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [ctx, setCtx] = useState<Ctx>({});
  const [how, setHow] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

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
  }, [msgs]);

  function ask(text?: string) {
    const question = (text ?? q).trim();
    if (!question && !ctx.code) return;
    const answer = localAnswer({ question, code: ctx.code, output: ctx.output, language: ctx.language });
    setMsgs((m) => [...m, { role: "you", text: question || "(explain my code)" }, { role: "helper", text: answer.text }]);
    setQ("");
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
                <span className="dot" aria-hidden="true" />
                Works offline, nothing leaves your browser
              </p>
            </div>
            <button className="btn small" onClick={() => setHow(!how)} aria-expanded={how}>{how ? "Hide" : "How I work"}</button>
          </header>

          {how && (
            <div className="helper-how small">
              <p><strong>I am a lookup, not a mind-reader.</strong> I match the words in your question against a library of about 50 explained terms and your lesson list, and I translate error messages in your output into plain English. Everything runs in your browser: nothing is sent anywhere. Use the exact name of the thing (for example <em>slice</em> or <em>port 443</em>) for the best answers.</p>
              <p><strong>Attaching your code.</strong> Inside a lab, press &ldquo;Ask the helper about this&rdquo; and I will see your code and last output, so I can explain the error.</p>
            </div>
          )}

          <div ref={logRef} className="helper-log" role="log" aria-live="polite">
            {msgs.length === 0 && (
              <div className="helper-welcome">
                <p>Hi! Ask me about a word, an error or a concept. {ctx.code ? "Your lab code and last output are attached." : "Inside a lab you can attach your code too."}</p>
                <div className="helper-chips">
                  {STARTERS.map((s) => (<button key={s} className="helper-chip" onClick={() => ask(s)}>{s}</button>))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`helper-msg ${m.role}`}>
                <span className="helper-who">{m.role === "you" ? "You" : "Talon"}</span>
                <div className="helper-bubble">{m.role === "helper" ? <Markdown source={m.text} /> : <p>{m.text}</p>}</div>
              </div>
            ))}
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
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
              placeholder="Type your question and press Enter"
            />
            <button className="btn primary" onClick={() => ask()} aria-label="Send question">Send</button>
          </div>
          {ctx.code && (
            <div className="row">
              <button className="btn small" onClick={() => setCtx({})}>Detach my code</button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
