"use client";
import { useState } from "react";
import {
  aesDecrypt, aesEncrypt, caesar, fromBase64, md5Hex, rot13, shaHex, toBase64, urlDecode, urlEncode, vigenere, xorFromHex, xorToHex,
} from "@/lib/crypto-tools";

type Tool = "encoding" | "hash" | "classical" | "aes";

const TOOLS: { id: Tool; label: string }[] = [
  { id: "encoding", label: "Encode / decode" },
  { id: "hash", label: "Hashing" },
  { id: "classical", label: "Classical ciphers" },
  { id: "aes", label: "AES encrypt / decrypt" },
];

/** Everything runs in the browser. Nothing you type is sent anywhere. */
export function CryptoWorkbench() {
  const [tool, setTool] = useState<Tool>("aes");
  return (
    <div>
      <p className="muted">All of this runs locally in your browser. Nothing you type is sent to a server. Do not use classical ciphers to protect real secrets: they exist to teach how encryption works.</p>
      <div className="chips" role="tablist" aria-label="Crypto tools">
        {TOOLS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tool === t.id} aria-pressed={tool === t.id} className="chip" onClick={() => setTool(t.id)}>{t.label}</button>
        ))}
      </div>
      {tool === "encoding" && <Encoding />}
      {tool === "hash" && <Hashing />}
      {tool === "classical" && <Classical />}
      {tool === "aes" && <Aes />}
    </div>
  );
}

function Box({ title, children, explain }: { title: string; children: React.ReactNode; explain: React.ReactNode }) {
  return (
    <section className="card stack">
      <h3 style={{ margin: 0 }}>{title}</h3>
      {children}
      <details>
        <summary>How this works</summary>
        <div className="muted small">{explain}</div>
      </details>
    </section>
  );
}

function Encoding() {
  const [input, setInput] = useState("Hello, TalonForge!");
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const run = (fn: () => string) => {
    try { setOut(fn()); setErr(null); } catch (e) { setErr((e as Error).message || "Invalid input"); setOut(""); }
  };
  return (
    <Box
      title="Encode and decode"
      explain={<>Encoding changes <em>format</em>, not secrecy. Base64 turns bytes into printable text, URL encoding makes text safe for web addresses. Anyone can reverse them without a key, so they are <strong>not</strong> encryption.</>}
    >
      <div className="field"><label htmlFor="enc-in">Input</label><textarea id="enc-in" rows={3} value={input} onChange={(e) => setInput(e.target.value)} className="mono" /></div>
      <div className="row">
        <button className="btn" onClick={() => run(() => toBase64(input))}>Base64 encode</button>
        <button className="btn" onClick={() => run(() => fromBase64(input))}>Base64 decode</button>
        <button className="btn" onClick={() => run(() => urlEncode(input))}>URL encode</button>
        <button className="btn" onClick={() => run(() => urlDecode(input))}>URL decode</button>
      </div>
      {err && <p className="warn" role="alert">{err}</p>}
      {out && <pre className="out-box" aria-label="Result">{out}</pre>}
    </Box>
  );
}

function Hashing() {
  const [input, setInput] = useState("password");
  const [rows, setRows] = useState<{ algo: string; hash: string }[]>([]);
  async function compute() {
    const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
    const res = await Promise.all(algos.map(async (a) => ({ algo: a, hash: await shaHex(a, input) })));
    setRows([{ algo: "MD5 (broken, for recognition only)", hash: md5Hex(input) }, ...res]);
  }
  return (
    <Box
      title="Hash a message"
      explain={<>A hash is a fixed-length fingerprint of any input. The same input always gives the same hash, you can&apos;t reverse it, and changing even one character changes the whole hash. Try <code>password</code> then <code>Password</code>. Length hints at the algorithm: MD5 is 32 hex characters, SHA-1 is 40, SHA-256 is 64, SHA-512 is 128.</>}
    >
      <div className="field"><label htmlFor="h-in">Message</label><input id="h-in" value={input} onChange={(e) => setInput(e.target.value)} /></div>
      <button className="btn primary" onClick={compute}>Compute hashes</button>
      {rows.length > 0 && (
        <table className="tbl">
          <tbody>{rows.map((r) => <tr key={r.algo}><th scope="row">{r.algo}</th><td><code className="wrap">{r.hash}</code></td></tr>)}</tbody>
        </table>
      )}
    </Box>
  );
}

function Classical() {
  const [text, setText] = useState("Attack at dawn");
  const [shift, setShift] = useState(3);
  const [key, setKey] = useState("LEMON");
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const run = (fn: () => string) => { try { setOut(fn()); setErr(null); } catch (e) { setErr((e as Error).message); setOut(""); } };
  return (
    <Box
      title="Classical ciphers (learning only)"
      explain={<><strong>Caesar</strong> shifts each letter by a fixed amount; there are only 25 useful keys so it&apos;s trivial to brute-force. <strong>ROT13</strong> is Caesar with shift 13 (apply it twice to undo). <strong>Vigenère</strong> shifts by a repeating keyword, which defeats simple letter-frequency counting but is still breakable. <strong>XOR</strong> combines each byte with a key byte; with a repeating short key it is weak, with a truly random one-time key as long as the message it is unbreakable (but the key can never be reused).</>}
    >
      <div className="field"><label htmlFor="c-in">Text (or hex for XOR decrypt)</label><textarea id="c-in" rows={3} value={text} onChange={(e) => setText(e.target.value)} className="mono" /></div>
      <div className="row">
        <div className="field"><label htmlFor="c-s">Caesar shift</label><input id="c-s" type="number" min={-25} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))} /></div>
        <div className="field"><label htmlFor="c-k">Key (Vigenère / XOR)</label><input id="c-k" value={key} onChange={(e) => setKey(e.target.value)} /></div>
      </div>
      <div className="row">
        <button className="btn" onClick={() => run(() => caesar(text, shift))}>Caesar encrypt</button>
        <button className="btn" onClick={() => run(() => caesar(text, -shift))}>Caesar decrypt</button>
        <button className="btn" onClick={() => run(() => rot13(text))}>ROT13</button>
        <button className="btn" onClick={() => run(() => vigenere(text, key))}>Vigenère encrypt</button>
        <button className="btn" onClick={() => run(() => vigenere(text, key, true))}>Vigenère decrypt</button>
        <button className="btn" onClick={() => run(() => xorToHex(text, key))}>XOR encrypt (hex)</button>
        <button className="btn" onClick={() => run(() => xorFromHex(text, key))}>XOR decrypt</button>
      </div>
      {err && <p className="warn" role="alert">{err}</p>}
      {out && <pre className="out-box" aria-label="Result">{out}</pre>}
    </Box>
  );
}

function Aes() {
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("Meet me at noon.");
  const [packed, setPacked] = useState("");
  const [result, setResult] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function enc() {
    setBusy(true); setErr(null); setResult("");
    try { setResult(await aesEncrypt(pass, msg)); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  async function dec() {
    setBusy(true); setErr(null); setResult("");
    try { setResult(await aesDecrypt(pass, packed)); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  return (
    <Box
      title="Encrypt and decrypt a message with AES-256"
      explain={<>Your passphrase is stretched into a 256-bit key with <strong>PBKDF2</strong> (210,000 rounds of HMAC-SHA-256) and a random <strong>salt</strong>. The message is encrypted with <strong>AES-GCM</strong> using a random <strong>IV</strong>, which also produces an authentication tag: if the passphrase is wrong or anyone changes even one character, decryption fails instead of returning garbage. The output <code>v1.salt.iv.data</code> contains everything needed except the passphrase. Encrypting the same message twice gives different output because the salt and IV are new each time. Share the passphrase through a different channel than the encrypted text, and use a long passphrase.</>}
    >
      <div className="field"><label htmlFor="a-pass">Passphrase</label><input id="a-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="off" /></div>
      <div className="field"><label htmlFor="a-msg">Message to encrypt</label><textarea id="a-msg" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} className="mono" /></div>
      <button className="btn primary" onClick={enc} disabled={busy}>Encrypt</button>
      <div className="field"><label htmlFor="a-packed">Encrypted text to decrypt</label><textarea id="a-packed" rows={3} value={packed} onChange={(e) => setPacked(e.target.value)} className="mono" placeholder="v1.… (paste the encrypted output here)" /></div>
      <div className="row">
        <button className="btn" onClick={() => { if (result.startsWith("v1.")) setPacked(result); }} disabled={!result.startsWith("v1.")}>Copy result into the decrypt box</button>
        <button className="btn primary" onClick={dec} disabled={busy}>Decrypt</button>
      </div>
      {busy && <p className="muted" role="status">Working…</p>}
      {err && <p className="warn" role="alert">{err}</p>}
      {result && <pre className="out-box" aria-label="Result">{result}</pre>}
    </Box>
  );
}
