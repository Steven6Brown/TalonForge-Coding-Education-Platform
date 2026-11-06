"use client";
import { useMemo, useState } from "react";
import { binaryToText, divisionSteps, groupBinary, hexToText, isValidInBase, parseInBase, textToBinary, textToHex, toBase } from "@/lib/numbers";

const BASES = [
  { base: 2, label: "Binary (base 2)" },
  { base: 8, label: "Octal (base 8)" },
  { base: 10, label: "Decimal (base 10)" },
  { base: 16, label: "Hexadecimal (base 16)" },
];

/** Binary / decimal / hex / octal converter with the worked steps, plus text <-> binary/hex. */
export function NumberConverter() {
  const [value, setValue] = useState("214");
  const [base, setBase] = useState(10);
  const [text, setText] = useState("Hi!");
  const [bin, setBin] = useState("01001000 01101001");
  const [binErr, setBinErr] = useState<string | null>(null);
  const [binOut, setBinOut] = useState("");

  const parsed = useMemo(() => {
    if (!value.trim()) return { n: null as bigint | null, error: null as string | null };
    try {
      return { n: parseInBase(value, base), error: null };
    } catch (e) {
      return { n: null, error: (e as Error).message };
    }
  }, [value, base]);

  const steps = parsed.n !== null && parsed.n < 4096n ? divisionSteps(parsed.n, 2) : [];

  function decodeBinary() {
    try {
      setBinOut(binaryToText(bin));
      setBinErr(null);
    } catch (e) {
      setBinErr((e as Error).message);
      setBinOut("");
    }
  }

  return (
    <div className="stack">
      <section className="card">
        <h3 style={{ marginTop: 0 }}>Number base converter</h3>
        <div className="row">
          <div className="field" style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="nc-v">Number</label>
            <input id="nc-v" value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false} />
          </div>
          <div className="field">
            <label htmlFor="nc-b">is written in</label>
            <select id="nc-b" value={base} onChange={(e) => setBase(Number(e.target.value))}>
              {BASES.map((b) => <option key={b.base} value={b.base}>{b.label}</option>)}
            </select>
          </div>
        </div>
        {parsed.error && <p className="warn" role="alert">{parsed.error}</p>}
        {!parsed.error && value.trim() && !isValidInBase(value.trim().toLowerCase().replace(/^0[xbo]/, ""), base) && null}
        {parsed.n !== null && (
          <>
            <table className="tbl">
              <tbody>
                <tr><th scope="row">Decimal</th><td><code>{toBase(parsed.n, 10)}</code></td></tr>
                <tr><th scope="row">Binary</th><td><code>{groupBinary(toBase(parsed.n, 2))}</code></td></tr>
                <tr><th scope="row">Octal</th><td><code>{toBase(parsed.n, 8)}</code></td></tr>
                <tr><th scope="row">Hex</th><td><code>{toBase(parsed.n, 16).toUpperCase()}</code></td></tr>
              </tbody>
            </table>
            {steps.length > 0 && (
              <details open>
                <summary>How the binary was found (divide by 2, read the remainders from the bottom up)</summary>
                <table className="tbl">
                  <thead><tr><th scope="col">Number</th><th scope="col">÷ 2</th><th scope="col">Remainder (a bit)</th></tr></thead>
                  <tbody>
                    {steps.map((s, i) => <tr key={i}><td>{String(s.n)}</td><td>{String(s.q)}</td><td><strong>{s.r}</strong></td></tr>)}
                  </tbody>
                </table>
                <p className="muted small">Read the remainders <strong>bottom to top</strong>: {steps.map((s) => s.r).reverse().join("")}. Each binary place is worth double the one on its right: 128, 64, 32, 16, 8, 4, 2, 1.</p>
              </details>
            )}
          </>
        )}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Text to binary and hex</h3>
        <div className="field">
          <label htmlFor="nc-t">Type text</label>
          <input id="nc-t" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <table className="tbl">
          <tbody>
            <tr><th scope="row">Binary (8 bits per character)</th><td><code>{textToBinary(text)}</code></td></tr>
            <tr><th scope="row">Hex</th><td><code>{textToHex(text)}</code></td></tr>
            <tr><th scope="row">Decimal (ASCII codes)</th><td><code>{[...new TextEncoder().encode(text)].join(" ")}</code></td></tr>
          </tbody>
        </table>
        <p className="muted small">Computers store each character as a number (ASCII/UTF-8). <code>H</code> is 72, which is <code>01001000</code> in binary and <code>48</code> in hex.</p>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Binary to text</h3>
        <div className="field">
          <label htmlFor="nc-bin">Paste binary (groups of 8 bits)</label>
          <textarea id="nc-bin" value={bin} onChange={(e) => setBin(e.target.value)} rows={3} className="mono" />
        </div>
        <div className="row">
          <button className="btn primary" onClick={decodeBinary}>Decode</button>
          <button className="btn" onClick={() => { try { setBinOut(hexToText(bin)); setBinErr(null); } catch (e) { setBinErr((e as Error).message); } }}>Decode as hex instead</button>
        </div>
        {binErr && <p className="warn" role="alert">{binErr}</p>}
        {binOut && <p role="status">Result: <strong>{binOut}</strong></p>}
      </section>
    </div>
  );
}
