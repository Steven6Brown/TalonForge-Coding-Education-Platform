"use client";
import { useState } from "react";
import type { Lab } from "@/lib/content/types";
import { checkOutput, normalizeAnswer } from "@/lib/runner";
import { CodeRunner } from "./CodeRunner";
import { Terminal } from "./Terminal";
import { SiemConsole } from "./SiemConsole";
import { Markdown, renderInline } from "@/lib/markdown";

type Props = { lab: Lab; lessonId: string; done: boolean; onPass: () => void };

/** Progressive hints (revealed one at a time) shared by code and shell labs. */
function Hints({ hints, solution }: { hints: string[]; solution?: string }) {
  const [shown, setShown] = useState(0);
  const [showSol, setShowSol] = useState(false);
  return (
    <div className="hints">
      {hints.slice(0, shown).map((h, i) => (
        <p key={i} className="hint">
          💡 {h}
        </p>
      ))}
      <div className="row">
        {shown < hints.length && (
          <button className="btn small" onClick={() => setShown(shown + 1)}>
            Show hint ({shown + 1}/{hints.length})
          </button>
        )}
        {solution && shown >= hints.length && !showSol && (
          <button className="btn small" onClick={() => setShowSol(true)}>
            Reveal solution
          </button>
        )}
      </div>
      {showSol && solution && (
        <pre className="solution" tabIndex={0}>
          <code>{solution}</code>
        </pre>
      )}
    </div>
  );
}

function PassBanner({ done }: { done: boolean }) {
  return done ? (
    <p className="pass" role="status">
      ✅ Lab complete. Progress saved.
    </p>
  ) : null;
}

export function LabPanel({ lab, lessonId, done, onPass }: Props) {
  if (lab.kind === "code") return <CodeLab lab={lab} done={done} onPass={onPass} />;
  if (lab.kind === "shell") return <ShellLab lab={lab} lessonId={lessonId} done={done} onPass={onPass} />;
  if (lab.kind === "siem") return <SiemLab lab={lab} done={done} onPass={onPass} />;
  return <QuizLab lab={lab} done={done} onPass={onPass} />;
}

function CodeLab({ lab, done, onPass }: { lab: Extract<Lab, { kind: "code" }>; done: boolean; onPass: () => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const hasScaffold = !!(lab.concepts?.length || lab.plan?.length || lab.prerequisites?.length);
  return (
    <section className="lab" aria-labelledby="lab-h">
      <h2 id="lab-h">Lab</h2>
      <p>{lab.prompt}</p>
      {hasScaffold && (
        <div className="scaffold">
          {lab.prerequisites && lab.prerequisites.length > 0 && (
            <p className="small">
              New to this language? Start with:{" "}
              {lab.prerequisites.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && ", "}
                  <a href={`/learn/${p.track}/${p.id}`}>{p.title}</a>
                </span>
              ))}
              .
            </p>
          )}
          {lab.concepts && lab.concepts.length > 0 && (
            <details open>
              <summary>Before you start: the ideas you&apos;ll use</summary>
              {lab.concepts.map((c) => (
                <div key={c.title} className="concept">
                  <h3>{c.title}</h3>
                  <Markdown source={c.body} />
                </div>
              ))}
            </details>
          )}
          {lab.plan && lab.plan.length > 0 && (
            <details open>
              <summary>Your step-by-step plan</summary>
              <ol className="plan">
                {lab.plan.map((step, i) => (
                  <li key={i}>{renderInline(step)}</li>
                ))}
              </ol>
            </details>
          )}
        </div>
      )}
      <CodeRunner
        language={lab.language}
        starter={lab.starter}
        harness={lab.harness}
        setup={lab.setup}
        example={lab.example}
        onAsk={(code, output) =>
          window.dispatchEvent(new CustomEvent("tf-ask", { detail: { question: "", code, output, language: lab.language } }))
        }
        onResult={(res) => {
          if (res.ok && checkOutput(res.stdout, lab.expected)) {
            setMsg(null);
            onPass();
          } else if (res.ok) setMsg("Not quite yet. Check the output and try again.");
          else setMsg(null);
        }}
      />
      {msg && !done && <p className="warn">{msg}</p>}
      <PassBanner done={done} />
      <Hints hints={lab.hints} solution={lab.solution} />
    </section>
  );
}

/** Orientation for people who have never used a terminal. Collapsed by default so it doesn't nag experts. */
function TerminalBasics() {
  return (
    <details className="scaffold">
      <summary>New to the terminal? How this works</summary>
      <ul>
        <li><strong>It is a text conversation.</strong> You type a command, press <kbd>Enter</kbd>, and the computer prints the result. Nothing happens until you press Enter.</li>
        <li><strong>Read the prompt.</strong> Something like <code>student@forge:~$</code> means: user <em>student</em> on computer <em>forge</em>, currently in <code>~</code> (your home folder). The <code>$</code> means it is waiting for you.</li>
        <li><strong>The first word is the command, the rest are options and targets.</strong> In <code>ls -a mission</code>, <code>ls</code> lists files, <code>-a</code> is an option (include hidden files) and <code>mission</code> is the folder to list.</li>
        <li><strong>Handy keys:</strong> <kbd>↑</kbd> brings back your previous command, <kbd>Tab</kbd> completes a file name you started typing.</li>
        <li><strong>The big five to start:</strong> <code>pwd</code> (where am I?), <code>ls</code> (what is here?), <code>cd folder</code> (go into a folder; <code>cd ..</code> goes back), <code>cat file</code> (show a file), <code>grep word file</code> (show only lines containing a word).</li>
        <li><strong>Lost?</strong> Type <code>help</code> to list the available commands, and <code>pwd</code> to see where you are. Use the Hints below the lab one at a time. You cannot break anything: this is a safe practice computer.</li>
        <li><strong>Names with spaces</strong> need quotes: <code>cat &quot;my file.txt&quot;</code>. A name starting with a dash needs <code>./</code> in front.</li>
      </ul>
    </details>
  );
}

function ShellLab({
  lab,
  lessonId,
  done,
  onPass,
}: {
  lab: Extract<Lab, { kind: "shell" }>;
  lessonId: string;
  done: boolean;
  onPass: () => void;
}) {
  const [found, setFound] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = normalizeAnswer(input);
    const hit = lab.answers.find((a) => normalizeAnswer(a) === n);
    if (!hit) setMsg("Not correct. Keep digging.");
    else if (found.includes(hit)) setMsg("You already submitted that one.");
    else {
      const next = [...found, hit];
      setFound(next);
      setMsg(`Correct! ${next.length}/${lab.answers.length} found.`);
      if (next.length === lab.answers.length) onPass();
    }
    setInput("");
  }

  return (
    <section className="lab" aria-labelledby="lab-h">
      <h2 id="lab-h">Lab</h2>
      <p>{lab.prompt}</p>
      <TerminalBasics />
      <Terminal key={lessonId} fs={lab.fs} />
      <form onSubmit={submit} className="answer-form">
        <label htmlFor="answer">Submit answer / flag ({found.length}/{lab.answers.length})</label>
        <div className="row">
          <input id="answer" value={input} onChange={(e) => setInput(e.target.value)} maxLength={200} autoComplete="off" spellCheck={false} placeholder="FLAG{...} or answer" />
          <button className="btn primary" type="submit" disabled={!input.trim()}>
            Submit
          </button>
        </div>
      </form>
      {msg && <p role="status" className={msg.startsWith("Correct") ? "pass" : "warn"}>{msg}</p>}
      <PassBanner done={done} />
      <Hints hints={lab.hints} />
    </section>
  );
}

function QuizLab({ lab, done, onPass }: { lab: Extract<Lab, { kind: "quiz" }>; done: boolean; onPass: () => void }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const allAnswered = lab.questions.every((_, i) => picked[i] !== undefined);
  const correct = lab.questions.filter((q, i) => picked[i] === q.answer).length;

  function check() {
    setChecked(true);
    if (correct === lab.questions.length) onPass();
  }

  return (
    <section className="lab" aria-labelledby="lab-h">
      <h2 id="lab-h">Quiz</h2>
      {lab.questions.map((q, qi) => (
        <fieldset key={qi} className="quiz-q">
          <legend>
            {qi + 1}. {q.q}
          </legend>
          {q.options.map((o, oi) => (
            <label key={oi} className="opt">
              <input
                type="radio"
                name={`q${qi}`}
                checked={picked[qi] === oi}
                onChange={() => {
                  setPicked({ ...picked, [qi]: oi });
                  setChecked(false);
                }}
              />
              <span>{o}</span>
            </label>
          ))}
          {checked && (
            <p className={picked[qi] === q.answer ? "pass" : "warn"} role="status">
              {picked[qi] === q.answer ? "Correct. " : "Not quite. "}
              {q.why}
            </p>
          )}
        </fieldset>
      ))}
      <button className="btn primary" onClick={check} disabled={!allAnswered}>
        Check answers
      </button>
      {checked && correct < lab.questions.length && (
        <p className="warn" role="status">
          {correct}/{lab.questions.length} correct. Fix the misses and check again.
        </p>
      )}
      <PassBanner done={done} />
    </section>
  );
}

function SiemLab({ lab, done, onPass }: { lab: Extract<Lab, { kind: "siem" }>; done: boolean; onPass: () => void }) {
  const [found, setFound] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = normalizeAnswer(input);
    const hit = lab.answers.find((a) => normalizeAnswer(a) === n);
    if (!hit) setMsg("Not correct. Check your search results again.");
    else if (found.includes(hit)) setMsg("You already submitted that one.");
    else {
      const next = [...found, hit];
      setFound(next);
      setMsg(`Correct! ${next.length}/${lab.answers.length} found.`);
      if (next.length === lab.answers.length) onPass();
    }
    setInput("");
  }

  return (
    <section className="lab" aria-labelledby="lab-h">
      <h2 id="lab-h">Lab: Mini-SIEM</h2>
      <p>{lab.prompt}</p>
      {(lab.concepts?.length || lab.plan?.length) && (
        <div className="scaffold">
          {lab.concepts && lab.concepts.length > 0 && (
            <details open>
              <summary>Before you start: the ideas you&apos;ll use</summary>
              {lab.concepts.map((c) => (
                <div key={c.title} className="concept">
                  <h3>{c.title}</h3>
                  <Markdown source={c.body} />
                </div>
              ))}
            </details>
          )}
          {lab.plan && lab.plan.length > 0 && (
            <details open>
              <summary>Your step-by-step plan</summary>
              <ol className="plan">{lab.plan.map((st, i) => <li key={i}>{renderInline(st)}</li>)}</ol>
            </details>
          )}
        </div>
      )}
      <SiemConsole samples={lab.samples} />
      <form onSubmit={submit} className="answer-form">
        <label htmlFor="siem-answer">Submit your answer ({found.length}/{lab.answers.length})</label>
        <div className="row">
          <input id="siem-answer" value={input} onChange={(e) => setInput(e.target.value)} maxLength={200} autoComplete="off" spellCheck={false} />
          <button className="btn primary" type="submit" disabled={!input.trim()}>Submit</button>
        </div>
      </form>
      {msg && <p role="status" className={msg.startsWith("Correct") ? "pass" : "warn"}>{msg}</p>}
      <PassBanner done={done} />
      <Hints hints={lab.hints} />
    </section>
  );
}
