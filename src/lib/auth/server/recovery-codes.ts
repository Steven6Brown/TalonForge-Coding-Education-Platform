import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

/** Unambiguous alphabet (no 0/1/i/l/o) so codes are easy to read and type. */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
export const RECOVERY_CODE_COUNT = 10;

/** One code looks like "k3m9x-p2q7r" (10 random chars, ~50 bits of entropy). */
export function generateRecoveryCode(): string {
  const bytes = randomBytes(10);
  let s = "";
  for (let i = 0; i < 10; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return `${s.slice(0, 5)}-${s.slice(5)}`;
}

/** Store only salted scrypt hashes, never the plaintext codes. Format: "<saltHex>:<hashHex>". */
export async function hashRecoveryCode(code: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(code, salt, 32);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyRecoveryCode(code: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(code, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected); // constant-time compare
}
