import { describe, expect, it } from "vitest";
import { binaryToText, divisionSteps, groupBinary, hexToText, parseInBase, textToBinary, textToHex, toBase } from "@/lib/numbers";
import { aesDecrypt, aesEncrypt, caesar, fromBase64, md5Hex, rot13, shaHex, toBase64, vigenere, xorFromHex, xorToHex } from "@/lib/crypto-tools";

describe("number helpers", () => {
  it("converts between bases", () => {
    expect(toBase(255n, 2)).toBe("11111111");
    expect(toBase(2619n, 16)).toBe("a3b");
    expect(parseInBase("a3b", 16)).toBe(2619n);
    expect(parseInBase("0b1101", 2)).toBe(13n);
    expect(() => parseInBase("12", 2)).toThrow();
    expect(groupBinary("11010110")).toBe("1101 0110");
    expect(divisionSteps(13n, 2).map((s) => s.r)).toEqual([1, 0, 1, 1]);
  });
  it("converts text to and from binary and hex", () => {
    expect(textToBinary("Hi")).toBe("01001000 01101001");
    expect(binaryToText("01001000 01101001")).toBe("Hi");
    expect(textToHex("Hi")).toBe("48 69");
    expect(hexToText("48 69")).toBe("Hi");
    expect(() => binaryToText("0101")).toThrow();
  });
});

describe("classical ciphers and encodings", () => {
  it("caesar, rot13 and vigenere round-trip", () => {
    expect(caesar("Hello, World!", 3)).toBe("Khoor, Zruog!");
    expect(caesar(caesar("Hello", 3), -3)).toBe("Hello");
    expect(rot13(rot13("Attack at Dawn"))).toBe("Attack at Dawn");
    expect(vigenere("ATTACKATDAWN", "LEMON")).toBe("LXFOPVEFRNHR"); // classic textbook example
    expect(vigenere("LXFOPVEFRNHR", "LEMON", true)).toBe("ATTACKATDAWN");
  });
  it("xor and base64 round-trip", () => {
    expect(xorFromHex(xorToHex("secret", "k3y"), "k3y")).toBe("secret");
    expect(toBase64("hello")).toBe("aGVsbG8=");
    expect(fromBase64("aGVsbG8=")).toBe("hello");
  });
});

describe("hashes", () => {
  it("matches known vectors", async () => {
    expect(md5Hex("abc")).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(md5Hex("")).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(await shaHex("SHA-256", "abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(await shaHex("SHA-1", "abc")).toBe("a9993e364706816aba3e25717850c26c9cd0d89d");
  });
});

describe("AES-GCM", () => {
  it("round-trips, uses fresh randomness, and rejects a wrong passphrase", async () => {
    const a = await aesEncrypt("correct horse", "meet at noon");
    const b = await aesEncrypt("correct horse", "meet at noon");
    expect(a).not.toBe(b); // new salt and IV each time
    expect(await aesDecrypt("correct horse", a)).toBe("meet at noon");
    await expect(aesDecrypt("wrong", a)).rejects.toThrow();
    const tampered = a.slice(0, -2) + (a.endsWith("A=") ? "B=" : "A=");
    await expect(aesDecrypt("correct horse", tampered)).rejects.toThrow();
  }, 20000);
});
