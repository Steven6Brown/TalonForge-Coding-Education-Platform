/** Number-base and text/binary helpers used by the Converter tool and its tests. Pure functions. */

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

export function isValidInBase(text: string, base: number): boolean {
  if (!text) return false;
  const allowed = DIGITS.slice(0, base);
  return [...text.toLowerCase()].every((c) => allowed.includes(c));
}

/** Parses text written in `base` (2-36) into a BigInt. Throws if invalid. */
export function parseInBase(text: string, base: number): bigint {
  const t = text.trim().toLowerCase().replace(/^0[xbo]/, "");
  if (!isValidInBase(t, base)) throw new Error(`"${text}" is not a valid base-${base} number`);
  let n = 0n;
  for (const c of t) n = n * BigInt(base) + BigInt(DIGITS.indexOf(c));
  return n;
}

export function toBase(n: bigint, base: number): string {
  if (n === 0n) return "0";
  let out = "";
  let x = n < 0n ? -n : n;
  while (x > 0n) {
    out = DIGITS[Number(x % BigInt(base))] + out;
    x /= BigInt(base);
  }
  return (n < 0n ? "-" : "") + out;
}

/** Groups binary digits in 4s from the right for readability: 11010110 -> 1101 0110 */
export function groupBinary(bin: string, size = 4): string {
  const pad = (size - (bin.length % size)) % size;
  const padded = "0".repeat(pad) + bin;
  return padded.match(new RegExp(`.{1,${size}}`, "g"))?.join(" ") ?? bin;
}

/** The classic "divide by the base and read the remainders bottom to top" explanation. */
export function divisionSteps(n: bigint, base: number): { n: bigint; q: bigint; r: number }[] {
  const steps: { n: bigint; q: bigint; r: number }[] = [];
  let x = n < 0n ? -n : n;
  if (x === 0n) return [{ n: 0n, q: 0n, r: 0 }];
  while (x > 0n) {
    const q = x / BigInt(base);
    const r = Number(x % BigInt(base));
    steps.push({ n: x, q, r });
    x = q;
  }
  return steps;
}

/** "Hi" -> "01001000 01101001" (UTF-8 bytes, 8 bits each). */
export function textToBinary(text: string): string {
  return [...new TextEncoder().encode(text)].map((b) => b.toString(2).padStart(8, "0")).join(" ");
}

/** "01001000 01101001" -> "Hi". Accepts spaces or none (length must be a multiple of 8). */
export function binaryToText(bin: string): string {
  const clean = bin.replace(/\s+/g, "");
  if (!/^[01]*$/.test(clean) || clean.length % 8 !== 0) throw new Error("Binary text must be 0s and 1s in groups of 8 bits");
  const bytes = new Uint8Array(clean.length / 8);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 8, i * 8 + 8), 2);
  return new TextDecoder().decode(bytes);
}

export function textToHex(text: string): string {
  return [...new TextEncoder().encode(text)].map((b) => b.toString(16).padStart(2, "0")).join(" ");
}

export function hexToText(hex: string): string {
  const clean = hex.replace(/\s+/g, "").replace(/^0x/i, "");
  if (!/^[0-9a-fA-F]*$/.test(clean) || clean.length % 2 !== 0) throw new Error("Hex must use 0-9 and a-f in pairs");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return new TextDecoder().decode(bytes);
}
