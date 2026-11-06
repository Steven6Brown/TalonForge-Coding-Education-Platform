import { describe, expect, it } from "vitest";
import { searchGlossary } from "@/lib/helper/local";
import { localAnswer } from "@/lib/helper/local";

describe("built-in helper", () => {
  it("finds the right entries for beginner questions", () => {
    expect(searchGlossary("what does slice do?")[0].id).toBe("js-slice");
    expect(searchGlossary("how do i use indexOf")[0].id).toBe("js-indexof");
    expect(searchGlossary("what is a hash")[0].id).toBe("sec-hash");
    expect(searchGlossary("why use async await")[0].id).toBe("js-async");
    expect(searchGlossary("what is port 443")[0].id).toBe("sec-port");
    expect(searchGlossary("what's the difference between const and let").some((e) => e.id === "js-const-let")).toBe(true);
  });
  it("explains an error from the learner's output", () => {
    const a = localAnswer({ question: "", output: "SyntaxError: Unexpected identifier 'https'", language: "javascript", code: "curl -i https://x" });
    expect(a.text).toMatch(/isn't JavaScript|only accepts JavaScript/);
    expect(a.source).toBe("built-in");
  });
  it("gives a polite fallback for unknown questions", () => {
    expect(localAnswer({ question: "zzzzqqq" }).text).toMatch(/rephras/i);
  });
});
