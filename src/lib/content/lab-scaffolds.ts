import type { Lab } from "./types";

type Scaffold = Pick<Extract<Lab, { kind: "code" }>, "concepts" | "plan" | "example" | "prerequisites">;

const JS_START = { id: "js-first-program", track: "js-foundations", title: "Your First Program" };
const JS_STRINGS = { id: "js-string-methods", track: "js-foundations", title: "Working with Text" };
const JS_LOOPS = { id: "js-arrays-loops", track: "js-foundations", title: "Lists and Loops" };
const JS_OBJECTS = { id: "js-objects", track: "js-foundations", title: "Objects" };
const JS_FUNCS = { id: "js-functions-return", track: "js-foundations", title: "Functions" };
const JS_COND = { id: "js-conditionals-comparison", track: "js-foundations", title: "Decisions" };
const PY_START = { id: "py-first-program", track: "python-foundations", title: "Your First Python Program" };
const PY_LOOPS = { id: "py-lists-loops-dicts", track: "python-foundations", title: "Lists, Loops and Dictionaries" };
const PY_STRINGS = { id: "py-strings-functions", track: "python-foundations", title: "Strings and Functions" };

/**
 * Extra beginner scaffolding for existing code labs, keyed by lesson id. Applied in lessons.ts so every
 * lab can teach the ideas it needs without editing each lesson definition.
 */
export const SCAFFOLDS: Record<string, Scaffold> = {
  "js-basics": {
    prerequisites: [JS_START, JS_LOOPS],
    concepts: [
      { title: "Array of objects", body: "The data is an **array** `[ ... ]` whose items are **objects** `{ port: 443, state: \"open\" }`. Read a value with a dot: `item.port`, `item.state`." },
      { title: "filter: keep only matching items", body: "`array.filter(item => condition)` returns a **new array** with only the items for which the condition is true.\n\n```\n[1, 2, 3, 4].filter(n => n > 2)   // [3, 4]\n```\nThe `item => ...` part is a tiny function (an **arrow function**) called once per item." },
      { title: "map: change every item", body: "`array.map(item => newValue)` returns a new array of the same length where each item is replaced by the result.\n\n```\n[1, 2, 3].map(n => n * 10)   // [10, 20, 30]\n```" },
      { title: "sort: put in order (careful!)", body: "`array.sort()` sorts items **as text** by default, so `[10, 9, 1]` becomes `[1, 10, 9]`. For numbers give it a comparison function: `array.sort((a, b) => a - b)` (smallest first)." },
      { title: "join: array to text", body: "`array.join(\",\")` joins items into text with commas: `[22, 80].join(\",\")` is `\"22,80\"`." },
    ],
    plan: [
      "Keep only open ports: `scan.filter(r => r.state === \"open\")`.",
      "Turn each result into just its port number: `.map(r => r.port)`.",
      "Sort the numbers smallest first: `.sort((a, b) => a - b)`.",
      "Join with commas: `.join(\",\")` and wrap the whole chain in `console.log(...)`.",
    ],
    example: "const nums = [5, 12, 8, 1];\nconst big = nums.filter(n => n > 4);\nconst doubled = big.map(n => n * 2);\nconsole.log(doubled);\nconsole.log([10, 9, 1].sort());\nconsole.log([10, 9, 1].sort((a, b) => a - b));\n",
  },
  "http-anatomy": {
    prerequisites: [JS_START, JS_STRINGS, JS_LOOPS, JS_OBJECTS, JS_FUNCS],
    concepts: [
      {
        title: "Where raw comes from",
        body: "`RAW` in the starter code is a **string** holding a whole HTTP request as text. Browsers send exactly this text to servers. In the string, `\\r\\n` means \"end this line and start the next one\" (a carriage return plus a new line). So `RAW` is really four lines and an empty line:\n\n```\nGET /login HTTP/1.1\nHost: example.com\nUser-Agent: curl/8.4.0\nCookie: session=abc123\n(empty line)\n```",
      },
      {
        title: "Step 1: cut the text into lines with split",
        body: "`raw.split(\"\\r\\n\")` cuts the string wherever `\\r\\n` appears and returns an **array** of lines: `[\"GET /login HTTP/1.1\", \"Host: example.com\", ... , \"\", \"\"]`. The first item (index 0) is the request line, which isn't a header, so skip it.",
      },
      {
        title: "Step 2: loop over the lines",
        body: "`for (const line of lines) { ... }` runs the block once for each line. To skip the first one, use `lines.slice(1)` (a copy starting at index 1): `for (const line of lines.slice(1))`. When you reach an **empty line** (`line === \"\"`), the headers are over, so `break` out of the loop.",
      },
      {
        title: "Step 3: split each header at the FIRST colon",
        body: "A header looks like `Host: example.com`. Find the colon with `line.indexOf(\":\")`. The **name** is `line.slice(0, i)` and the **value** is `line.slice(i + 1)`. Use `.trim()` to remove spaces. Cut at the *first* colon only, because values can contain colons too.",
      },
      {
        title: "Step 4: store them in an object",
        body: "Start with `const out = {};`. For each header: `out[name] = value;`. The name should be lowercase so lookups are easy: `name.toLowerCase()`. Finally `return out;`: the tests call your function and look at what it returns.",
      },
    ],
    plan: [
      "Inside `parseHeaders`, create `const out = {};`.",
      "Split `raw` into lines and skip the first: `raw.split(\"\\r\\n\").slice(1)`.",
      "Loop with `for (const line of ...)`. If `line === \"\"` then `break`.",
      "`const i = line.indexOf(\":\");` then name = `line.slice(0, i).trim().toLowerCase()`, value = `line.slice(i + 1).trim()`.",
      "Store `out[name] = value;` and after the loop `return out;`.",
    ],
    example: "const text = \"GET / HTTP/1.1\\r\\nHost: a.com\\r\\n\\r\\n\";\nconst lines = text.split(\"\\r\\n\");\nconsole.log(lines);\nconsole.log(lines[1].indexOf(\":\"));\nconst h = {};\nh[\"host\"] = lines[1].slice(6);\nconsole.log(h);\n",
  },
  "xss-escape": {
    prerequisites: [JS_START, JS_STRINGS, JS_FUNCS],
    concepts: [
      { title: "Why escape?", body: "Characters like `<` and `>` start HTML tags. If user text containing `<script>` is placed in a page unchanged, the browser treats it as **code**. **Escaping** replaces dangerous characters with harmless **HTML entities** that display as the character but never act as markup." },
      { title: "The five replacements", body: "| Character | Becomes |\n| --- | --- |\n| `&` | `&amp;` |\n| `<` | `&lt;` |\n| `>` | `&gt;` |\n| `\"` | `&quot;` |\n| `'` | `&#39;` |" },
      { title: "replace with a regular expression", body: "`text.replace(/&/g, \"&amp;\")` replaces **every** `&` (the `g` means *global*). Without `g` only the first match is replaced. Slashes `/.../` hold the pattern. You can chain calls: `s.replace(...).replace(...)`." },
      { title: "Order matters: & first", body: "If you replace `<` with `&lt;` **first** and then replace `&` with `&amp;`, the `&` inside `&lt;` would be changed to `&amp;lt;`. So always replace `&` **first**." },
    ],
    plan: [
      "Start your function body with `return s.replace(/&/g, \"&amp;\")`.",
      "Chain on one `.replace(...)` for each of `<`, `>`, `\"` and `'` using the table above.",
      "End the chain with `;`. Press Run: all hidden tests must pass.",
    ],
    example: "const s = \"a < b & c\";\nconsole.log(s.replace(/</g, \"&lt;\"));\nconsole.log(s.replace(/&/g, \"and\"));\nconsole.log(s.replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\"));\n",
  },
  "number-bases": {
    prerequisites: [JS_START, JS_LOOPS, JS_FUNCS],
    concepts: [
      { title: "The idea", body: "To write a number in base `b`, repeatedly divide by `b`. Each **remainder** is one digit, and the first remainder is the **rightmost** digit. Example, 13 in base 2: 13÷2=6 r **1**, 6÷2=3 r **0**, 3÷2=1 r **1**, 1÷2=0 r **1** → read remainders bottom to top: `1101`." },
      { title: "% and Math.floor", body: "`n % b` is the **remainder** after division (`13 % 2` is `1`). `Math.floor(n / b)` is the division result rounded down (`Math.floor(13 / 2)` is `6`)." },
      { title: "A string of digit characters", body: "`\"0123456789abcdef\"[10]` is `\"a\"`: a string can be indexed like an array. Use it to turn a remainder (0-15) into its digit character." },
      { title: "while loop", body: "`while (n > 0) { ... }` repeats **while the condition is true**. Inside, change `n` so the loop eventually ends. Build the answer by putting each new digit **in front**: `out = digit + out`." },
    ],
    plan: [
      "Handle zero: `if (n === 0) return \"0\";`",
      "Create `const digits = \"0123456789abcdef\";` and `let out = \"\";`.",
      "`while (n > 0)`: `out = digits[n % base] + out;` then `n = Math.floor(n / base);`",
      "`return out;`",
    ],
    example: "const digits = \"0123456789abcdef\";\nconsole.log(13 % 2, Math.floor(13 / 2));\nconsole.log(digits[11]);\nlet out = \"\";\nout = \"1\" + out;\nout = \"0\" + out;\nconsole.log(out);\n",
  },
  "euclid-gcd": {
    prerequisites: [JS_FUNCS, JS_COND],
    concepts: [
      { title: "What GCD means", body: "The **greatest common divisor** of two numbers is the biggest number that divides both. `gcd(12, 18)` is 6." },
      { title: "The Euclidean algorithm", body: "Replace the pair (a, b) with (b, a % b) over and over until b is 0. The answer is then `a`. Example: gcd(172, 64) → (64, 44) → (44, 20) → (20, 4) → (4, 0) → **4**." },
      { title: "Swapping two variables at once", body: "`[a, b] = [b, a % b];` assigns both at the same time (**destructuring**). The right side is computed first, so it's safe." },
      { title: "LCM from GCD", body: "The **least common multiple** is `a / gcd(a, b) * b`." },
    ],
    plan: [
      "In `gcd`: `while (b !== 0) { [a, b] = [b, a % b]; }` then `return a;`",
      "In `lcm`: `return (a / gcd(a, b)) * b;`",
    ],
    example: "let a = 172, b = 64;\nwhile (b !== 0) {\n  console.log(a, b);\n  [a, b] = [b, a % b];\n}\nconsole.log(\"gcd is\", a);\n",
  },
  subnetting: {
    prerequisites: [JS_STRINGS, JS_FUNCS],
    concepts: [
      { title: "CIDR notation", body: "`10.0.0.0/24` means the first **24 bits** identify the network. The `/24` is the **prefix length**." },
      { title: "How many hosts?", body: "A network has `2^(32 - prefix)` addresses. Two are reserved (network and broadcast), so **usable hosts = 2^(32 - prefix) - 2**. For /24: 2^8 - 2 = 254." },
      { title: "Powers in JavaScript", body: "`2 ** 8` is 256 (the `**` operator means *to the power of*)." },
      { title: "Getting the prefix out of the text", body: "`\"10.0.0.0/24\".split(\"/\")` gives `[\"10.0.0.0\", \"24\"]`. The second item is text, so convert it with `Number(...)`." },
    ],
    plan: ["Split the text on `/` and take index 1.", "Convert it with `Number(...)`.", "`return 2 ** (32 - prefix) - 2;`"],
    example: "console.log(2 ** 8);\nconsole.log(\"10.0.0.0/24\".split(\"/\"));\nconsole.log(Number(\"24\") + 1);\n",
  },
  "py-basics": {
    prerequisites: [PY_START, PY_LOOPS],
    concepts: [
      { title: "Lists and for loops", body: "`ports = [22, 80, 443]` is a **list**. `for p in ports:` runs the indented lines below it once for each item, with the current item in `p`." },
      { title: "Indentation is how Python groups code", body: "Lines indented by **4 spaces** under `for` or `if` are *inside* it. Forgetting the colon `:` or the indent gives a SyntaxError or IndentationError." },
      { title: "if and comparison", body: "`if p < 1024:` runs the indented block only when the comparison is true. Comparison operators: `==`, `!=`, `<`, `<=`, `>`, `>=`." },
      { title: "Counting", body: "Start `count = 0`, and add one with `count += 1` each time something matches. `print(count)` shows the total." },
    ],
    plan: ["Keep `count = 0`.", "Write `for p in ports:`.", "Indent inside it: `if p < 1024:` and under that (indented again) `count += 1`.", "Leave `print(count)` at the left edge, after the loop."],
    example: "nums = [3, 8, 1]\ntotal = 0\nfor n in nums:\n    if n > 2:\n        total += n\nprint(total)\n",
  },
  "py-bytes": {
    prerequisites: [PY_START, PY_STRINGS],
    concepts: [
      { title: "Text versus bytes", body: "Computers store **bytes** (numbers 0-255). **Text** is bytes interpreted with an encoding. `\"hi\".encode()` turns text into bytes; `b\"hi\".decode()` turns bytes into text." },
      { title: "Hex strings", body: "`\"6869\"` is hexadecimal text. `bytes.fromhex(\"6869\")` converts it to the bytes `b'hi'`. `data.hex()` goes the other way." },
      { title: "Base64", body: "`import base64` then `base64.b64decode(some_bytes)` decodes Base64 data into raw bytes. Base64 is **encoding, not encryption**." },
      { title: "Peeling layers", body: "When data has layers (hex of Base64 of text), undo them from the **outside in**, one step per line, and keep the result in a variable so you can inspect each step with `print`." },
    ],
    plan: ["`raw = bytes.fromhex(HEX)`  (layer 1: hex → bytes)", "`b64 = base64.b64decode(raw)`  (layer 2: Base64 → bytes)", "`message = b64.decode()`  (layer 3: bytes → text)", "Keep the `print(message)` line at the end."],
    example: "import base64\nprint(bytes.fromhex(\"6869\"))\nprint(\"hi\".encode())\nprint(base64.b64encode(b\"hello\"))\nprint(base64.b64decode(b\"aGVsbG8=\").decode())\n",
  },
  "py-log-analysis": {
    prerequisites: [PY_START, PY_LOOPS, PY_STRINGS],
    concepts: [
      { title: "splitlines and split", body: "`LOG.splitlines()` gives a list of lines. `line.split()` cuts a line into words (by spaces): a list like `[\"Jan\", \"12\", ..., \"from\", \"203.0.113.45\", ...]`." },
      { title: "Finding a position in a list", body: "`parts.index(\"from\")` returns the position of the word `from`. The IP is the next word: `parts[parts.index(\"from\") + 1]`." },
      { title: "in: does text contain text?", body: "`if \"Failed password\" in line:` is true when the line contains that phrase." },
      { title: "Counter", body: "`failures[ip] += 1` adds one to the count for that IP. A `Counter` starts every count at 0, and `.most_common(1)` returns the biggest." },
    ],
    plan: ["Inside the loop, `if \"Failed password\" in line:`", "`parts = line.split()`", "`ip = parts[parts.index(\"from\") + 1]`", "`failures[ip] += 1`"],
    example: "from collections import Counter\nc = Counter()\nfor w in \"a b a c a b\".split():\n    c[w] += 1\nprint(c.most_common(1))\nparts = \"x from 1.2.3.4 port\".split()\nprint(parts[parts.index(\"from\") + 1])\n",
  },
  "py-caesar": {
    prerequisites: [PY_START, PY_STRINGS],
    concepts: [
      { title: "ord and chr", body: "`ord(\"A\")` gives the number 65 for a letter, and `chr(65)` gives the letter back. Capital letters A-Z are 65-90." },
      { title: "Shifting with wrap-around", body: "To shift a letter by `k`: `(ord(ch) - 65 + k) % 26 + 65`. Subtracting 65 makes A=0; `% 26` wraps past Z back to A; adding 65 returns to a letter code." },
      { title: "isalpha", body: "`ch.isalpha()` is true for letters. Leave spaces and punctuation unchanged." },
      { title: "Building a string", body: "Start `out = \"\"` and add each character with `out += chr(...)`. `return out` at the end." },
    ],
    plan: ["`out = \"\"`", "`for ch in text:`", "If `ch.isalpha()`: add `chr((ord(ch) - 65 + k) % 26 + 65)`; else add `ch` unchanged.", "`return out`"],
    example: "print(ord(\"A\"), chr(66))\nprint((ord(\"Z\") - 65 + 3) % 26)\nprint(\"a\".isalpha(), \" \".isalpha())\n",
  },
  "py-hashing": {
    prerequisites: [PY_START, PY_STRINGS],
    concepts: [
      { title: "What a hash is", body: "A hash function turns any input into a fixed-length fingerprint. The same input always gives the same hash, and you can't reverse it. A dictionary attack hashes many guesses and compares them with the target." },
      { title: "hashlib", body: "`import hashlib` then `hashlib.sha256(b\"text\").hexdigest()` returns the hash as a hex string. It needs **bytes**, so convert text with `word.encode()`." },
      { title: "Comparing", body: "`==` compares two strings. When your guess's hash equals `TARGET`, you've found the password: `print(word)`." },
    ],
    plan: ["Inside the loop: `h = hashlib.sha256(word.encode()).hexdigest()`", "`if h == TARGET:` then `print(word)` (indented)"],
    example: "import hashlib\nprint(hashlib.sha256(b\"abc\").hexdigest())\nprint(hashlib.sha256(\"abc\".encode()).hexdigest() == hashlib.sha256(b\"abc\").hexdigest())\n",
  },
};
