/**
 * Educational crypto helpers for the Crypto Workbench. Classical ciphers are for learning ONLY (they are easy to break).
 * AES-GCM uses the browser's Web Crypto API; nothing ever leaves the user's device.
 */

/* ---------- Classical ciphers ---------- */
const A = "A".charCodeAt(0);
const a = "a".charCodeAt(0);

export function caesar(text: string, shift: number): string {
  const k = ((shift % 26) + 26) % 26;
  return text.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= "Z" ? A : a;
    return String.fromCharCode(((ch.charCodeAt(0) - base + k) % 26) + base);
  });
}

export const rot13 = (t: string) => caesar(t, 13);

/** Vigenere over letters only; the key advances only on letters. decrypt=true reverses it. */
export function vigenere(text: string, key: string, decrypt = false): string {
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Key must contain letters");
  let i = 0;
  return text.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= "Z" ? A : a;
    const shift = k.charCodeAt(i++ % k.length) - A;
    const s = decrypt ? 26 - shift : shift;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

/** XOR text with a repeating key, returning hex. Use xorFromHex to decrypt. */
export function xorToHex(text: string, key: string): string {
  if (!key) throw new Error("Key can't be empty");
  const t = new TextEncoder().encode(text);
  const k = new TextEncoder().encode(key);
  return [...t].map((b, i) => (b ^ k[i % k.length]).toString(16).padStart(2, "0")).join("");
}

export function xorFromHex(hex: string, key: string): string {
  if (!key) throw new Error("Key can't be empty");
  const clean = hex.replace(/\s+/g, "");
  if (!/^[0-9a-fA-F]*$/.test(clean) || clean.length % 2) throw new Error("Hex must be pairs of 0-9 a-f");
  const k = new TextEncoder().encode(key);
  const bytes = new Uint8Array(clean.length / 2).map((_, i) => parseInt(clean.slice(i * 2, i * 2 + 2), 16) ^ k[i % k.length]);
  return new TextDecoder().decode(bytes);
}

/* ---------- Encodings ---------- */
export function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

export function fromBase64(b64: string): string {
  const bin = atob(b64.replace(/\s+/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export const urlEncode = (t: string) => encodeURIComponent(t);
export const urlDecode = (t: string) => decodeURIComponent(t);

/* ---------- Hashing ---------- */
const toHex = (buf: ArrayBuffer | Uint8Array) => [...new Uint8Array(buf as ArrayBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

export async function shaHex(algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512", text: string): Promise<string> {
  return toHex(await crypto.subtle.digest(algo, new TextEncoder().encode(text)));
}

/** MD5 (RFC 1321). Broken for security: included so learners can recognise it. */
export function md5Hex(text: string): string {
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);
  const msg = new TextEncoder().encode(text);
  const bitLen = msg.length * 8;
  const padded = new Uint8Array(((msg.length + 8) >> 6) * 64 + 64);
  padded.set(msg);
  padded[msg.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, bitLen >>> 0, true);
  dv.setUint32(padded.length - 4, Math.floor(bitLen / 2 ** 32), true);
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  for (let off = 0; off < padded.length; off += 64) {
    const M = Array.from({ length: 16 }, (_, i) => dv.getUint32(off + i * 4, true));
    let A_ = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A_ + K[i] + M[g]) >>> 0;
      A_ = D; D = C; C = B;
      const s = S[(i >> 4) * 4 + (i % 4)];
      B = (B + ((F << s) | (F >>> (32 - s)))) >>> 0;
    }
    a0 = (a0 + A_) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const out = new DataView(new ArrayBuffer(16));
  out.setUint32(0, a0, true); out.setUint32(4, b0, true); out.setUint32(8, c0, true); out.setUint32(12, d0, true);
  return toHex(out.buffer);
}

/* ---------- AES-256-GCM with a passphrase ---------- */
const ITERATIONS = 210_000; // PBKDF2-HMAC-SHA256 iterations (OWASP 2023 guidance for PBKDF2-SHA256)

async function deriveKey(pass: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** Output format: v1.<salt>.<iv>.<ciphertext+tag> (all Base64). A fresh random salt and IV are used every time. */
export async function aesEncrypt(passphrase: string, plaintext: string): Promise<string> {
  if (!passphrase) throw new Error("Enter a passphrase");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext)));
  return ["v1", b64(salt), b64(iv), b64(ct)].join(".");
}

export async function aesDecrypt(passphrase: string, packed: string): Promise<string> {
  const parts = packed.trim().split(".");
  if (parts.length !== 4 || parts[0] !== "v1") throw new Error("That doesn't look like TalonForge encrypted text (expected v1.salt.iv.data)");
  try {
    const key = await deriveKey(passphrase, unb64(parts[1]));
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(parts[2]) as BufferSource }, key, unb64(parts[3]) as BufferSource);
    return new TextDecoder().decode(pt);
  } catch {
    // AES-GCM authenticates: a wrong passphrase OR any tampering fails the integrity check.
    throw new Error("Couldn't decrypt: wrong passphrase, or the text was changed");
  }
}
