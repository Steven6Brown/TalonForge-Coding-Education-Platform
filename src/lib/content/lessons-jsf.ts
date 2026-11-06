import type { Lesson } from "./types";

/**
 * JavaScript Foundations: a ground-up path for people who have never written JavaScript.
 * Every lab here teaches the exact ideas it needs (concepts, plan, example) before asking for code.
 */
export const JSF_LESSONS: Lesson[] = [
  {
    id: "js-first-program",
    track: "js-foundations",
    title: "Your First Program: console.log and Reading Output",
    summary: "What code is, how to run it, and how to read what comes back.",
    minutes: 15,
    xp: 30,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Change the program so it prints exactly: Hello, TalonForge",
      concepts: [
        {
          title: "What is a program?",
          body: "A program is a list of instructions written in a language the computer understands. JavaScript runs the instructions **from top to bottom, one line at a time**. You write instructions in the editor, press **Run**, and the result appears in the Output box.",
        },
        {
          title: "console.log: how a program shows you something",
          body: "`console.log(...)` means *print this to the output*. Whatever you put between the parentheses `( )` is shown. Each `console.log` prints on its own line. Don't forget the semicolon `;` at the end of a line: it marks the end of an instruction.",
        },
        {
          title: "Text needs quotes",
          body: "Text in code is called a **string**. A string must be wrapped in quotes: `\"like this\"` or `'like this'`. Without quotes JavaScript thinks the words are names of things and gets confused. Numbers do **not** need quotes: `console.log(5)` prints 5.",
        },
        {
          title: "Comments",
          body: "Anything after `//` on a line is a **comment**: a note for humans that the computer ignores. Use comments to explain your code.",
        },
        {
          title: "Reading the result",
          body: "The Output box shows what your `console.log` lines printed. If you see a red message, that's an **error**: the program couldn't run. Don't worry, errors are normal. The box under the output explains what the error probably means in plain English.",
        },
      ],
      plan: [
        "Find the line that says `console.log(\"\");`. It prints an empty message.",
        "Click between the two quote marks and type `Hello, TalonForge`.",
        "Press **Run**. The output should be exactly `Hello, TalonForge` (capital H and T, a comma and a space).",
      ],
      example: "// Try changing these and pressing Run\nconsole.log(\"Hi there\");\nconsole.log(2 + 3);\nconsole.log(\"2 + 3\");\n// notice the last two lines print different things. Why?\n",
      starter: "// Change the line below so it prints: Hello, TalonForge\nconsole.log(\"\");\n",
      expected: "Hello, TalonForge",
      hints: ["The text goes between the quotes: console.log(\"...\");", "Check capital letters and the comma. Output must match exactly."],
      solution: "console.log(\"Hello, TalonForge\");",
    },
  },
  {
    id: "js-variables-types",
    track: "js-foundations",
    title: "Variables, Strings, Numbers & Template Literals",
    summary: "Store values with names and build sentences from them.",
    minutes: 25,
    xp: 40,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Use the two variables to print exactly: student failed 3 logins",
      concepts: [
        {
          title: "Variables: names for values",
          body: "A **variable** is a labeled box that holds a value. You create one with `const name = value;`. Later you use the name instead of retyping the value. Use `const` when the value won't change and `let` when it will.\n\n```\nconst user = \"student\";\nlet attempts = 0;\nattempts = attempts + 1;   // allowed because we used let\n```",
        },
        {
          title: "Types of values",
          body: "- **String:** text in quotes, `\"student\"`.\n- **Number:** `3`, `3.5`, `-10`. You can do math: `+ - * /`.\n- **Boolean:** `true` or `false`.\nUse `typeof value` to ask what type something is.",
        },
        {
          title: "Template literals: sentences with values inside",
          body: "Wrap text in **backticks** (the key above Tab, not a quote) and put a variable inside `${ }` to insert its value:\n\n```\nconst name = \"Ana\";\nconsole.log(`Hello, ${name}!`);   // prints Hello, Ana!\n```\nWithout the backticks, `${name}` would print literally.",
        },
      ],
      plan: [
        "Look at the two variables already created: `user` and `failures`.",
        "Replace `console.log(\"\")` with a template literal that uses both: starts with a backtick, then `${user}`, then the words, then `${failures}`, then more words, then the closing backtick.",
        "The sentence needs spaces: `student failed 3 logins`.",
        "Press **Run** and compare the output.",
      ],
      example: "const city = \"Paris\";\nconst days = 4;\nconsole.log(`I will visit ${city} for ${days} days`);\nconsole.log(typeof city, typeof days);\n",
      starter: "const user = \"student\";\nconst failures = 3;\n// Build the sentence with a template literal (backticks and ${ }):\nconsole.log(\"\");\n",
      expected: "student failed 3 logins",
      hints: ["console.log(`${user} failed ${failures} logins`);", "Backticks, not quotes, are what make ${ } work."],
      solution: "console.log(`${user} failed ${failures} logins`);",
    },
  },
  {
    id: "js-string-methods",
    track: "js-foundations",
    title: "Working with Text: length, indexOf, slice, trim, split",
    summary: "Cut a piece out of a line of text, the heart of parsing logs and headers.",
    minutes: 30,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "The variable `line` holds a header line. Print only the value after the colon with no extra spaces: example.com",
      concepts: [
        {
          title: "Strings have positions",
          body: "Every character in a string has a position number, called an **index**, and counting **starts at 0**. In `\"Host: example.com\"` the `H` is index 0, `o` is 1, `s` is 2, `t` is 3 and the colon `:` is index 4.",
        },
        {
          title: "indexOf: where is it?",
          body: "`text.indexOf(\":\")` returns the index of the **first** colon, or `-1` if it isn't found.\n\n```\nconst line = \"Host: example.com\";\nconst colon = line.indexOf(\":\");   // 4\n```",
        },
        {
          title: "slice: cut out a piece",
          body: "`text.slice(start)` returns everything from index `start` to the end. `text.slice(start, end)` returns from `start` up to (but not including) `end`.\n\n```\nline.slice(0, 4)   // \"Host\"\nline.slice(5)      // \" example.com\"  (starts after the colon, still has a leading space)\n```",
        },
        {
          title: "trim and toLowerCase: clean up",
          body: "`text.trim()` removes spaces from both ends. `text.toLowerCase()` makes every letter lowercase. You can chain them: `line.slice(5).trim()`.",
        },
        {
          title: "split: break text into a list",
          body: "`text.split(\",\")` cuts the text at every comma and returns an **array** (list): `\"a,b,c\".split(\",\")` is `[\"a\", \"b\", \"c\"]`. Splitting on `\"\\n\"` gives lines.",
        },
      ],
      plan: [
        "Find where the colon is: `const colon = line.indexOf(\":\");`",
        "Slice everything **after** the colon: `line.slice(colon + 1)`",
        "Remove the leading space with `.trim()`",
        "Print the result with `console.log(...)`.",
      ],
      example: "const line = \"User-Agent: curl/8.4.0\";\nconsole.log(line.length);\nconsole.log(line.indexOf(\":\"));\nconsole.log(line.slice(0, 10));\nconsole.log(line.slice(12));\nconsole.log(\"a,b,c\".split(\",\"));\n",
      starter: "const line = \"Host: example.com\";\n// 1) find the colon  2) slice after it  3) trim  4) print\nconsole.log(\"\");\n",
      expected: "example.com",
      hints: ["const colon = line.indexOf(\":\");", "line.slice(colon + 1) still has a space at the start. Add .trim()."],
      solution: "const colon = line.indexOf(\":\");\nconsole.log(line.slice(colon + 1).trim());",
    },
  },
  {
    id: "js-arrays-loops",
    track: "js-foundations",
    title: "Lists and Loops: arrays, for, break, push, join",
    summary: "Repeat work for every item and stop when you should.",
    minutes: 35,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "`lines` is a list of text lines from an HTTP request. Collect the header lines (everything after the first line, up to the first empty line) into `headers`, then print them joined with \" | \".",
      concepts: [
        {
          title: "Arrays: ordered lists",
          body: "An **array** holds several values in order: `const colors = [\"red\", \"green\", \"blue\"];`. Positions start at 0: `colors[0]` is `\"red\"`, `colors[2]` is `\"blue\"`. `colors.length` is `3`.",
        },
        {
          title: "Adding to an array: push",
          body: "`list.push(value)` adds a value to the end. Start with an empty array `[]` and push in a loop:\n\n```\nconst found = [];\nfound.push(\"a\");\nfound.push(\"b\");   // found is [\"a\", \"b\"]\n```",
        },
        {
          title: "The for loop",
          body: "A loop repeats code. This one counts `i` from 1 up to the end of the array:\n\n```\nfor (let i = 1; i < lines.length; i++) {\n  // lines[i] is the current item\n}\n```\nRead it as: *start i at 1; keep going while i is less than the length; add 1 each time.* Starting at 1 **skips the first item** (index 0).",
        },
        {
          title: "if, comparison and break",
          body: "`if (condition) { ... }` runs the code only when the condition is true. `===` checks that two values are exactly equal: `lines[i] === \"\"` is true for an empty line. `break` **stops the loop immediately**.\n\n```\nif (lines[i] === \"\") {\n  break;\n}\n```",
        },
        {
          title: "join: array back to text",
          body: "`list.join(\" | \")` glues the items into one string with the separator between them: `[\"a\",\"b\"].join(\" | \")` is `\"a | b\"`.",
        },
      ],
      plan: [
        "Write a `for` loop that starts at `i = 1` (skipping the first line, the request line).",
        "Inside the loop, `if (lines[i] === \"\") { break; }` to stop at the blank line.",
        "Otherwise `headers.push(lines[i]);`",
        "After the loop, print `headers.join(\" | \")`.",
      ],
      example: "const fruits = [\"apple\", \"banana\", \"cherry\"];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(i, fruits[i]);\n}\nconst copy = [];\ncopy.push(\"x\");\ncopy.push(\"y\");\nconsole.log(copy.join(\"-\"));\n",
      starter: "const lines = [\"GET /login HTTP/1.1\", \"Host: example.com\", \"User-Agent: curl\", \"\", \"this is the body\"];\nconst headers = [];\n\n// TODO: loop, stop at the empty line, push header lines into headers\n\nconsole.log(headers.join(\" | \"));\n",
      expected: "Host: example.com | User-Agent: curl",
      hints: ["for (let i = 1; i < lines.length; i++) { ... }", "Inside: if (lines[i] === \"\") { break; } then headers.push(lines[i]);"],
      solution: "for (let i = 1; i < lines.length; i++) {\n  if (lines[i] === \"\") {\n    break;\n  }\n  headers.push(lines[i]);\n}\nconsole.log(headers.join(\" | \"));",
    },
  },
  {
    id: "js-objects",
    track: "js-foundations",
    title: "Objects: Storing Key/Value Pairs",
    summary: "Build a lookup table with names for each value.",
    minutes: 25,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Turn the list of \"key=value\" texts into an object and print it with JSON.stringify.",
      concepts: [
        {
          title: "Objects: a table of named values",
          body: "An **object** stores values under names (called **keys**): `const user = { name: \"Ana\", role: \"admin\" };`. Read a value with a dot or brackets: `user.name` or `user[\"name\"]`.",
        },
        {
          title: "Bracket notation with a variable key",
          body: "When the key is stored in a variable, you **must** use brackets: `settings[key] = value;`. (`settings.key` would literally use the name \"key\".) Start with an empty object `{}` and fill it in a loop.",
        },
        {
          title: "for...of: loop over the items",
          body: "`for (const pair of pairs) { ... }` runs the block once for every item in the array, with the current item in `pair`. It's simpler than counting an index when you don't need the number.",
        },
        {
          title: "Splitting a pair",
          body: "`\"role=admin\".split(\"=\")` gives `[\"role\", \"admin\"]`. Name the pieces: `const parts = pair.split(\"=\"); const key = parts[0]; const value = parts[1];`.",
        },
        {
          title: "JSON.stringify: see an object as text",
          body: "`JSON.stringify(obj)` converts an object to a one-line text so `console.log` prints it neatly: `{\"role\":\"admin\"}`.",
        },
      ],
      plan: [
        "Write `for (const pair of pairs) { ... }`.",
        "Inside: split the pair on `=` and keep the two parts as `key` and `value`.",
        "Store it: `settings[key] = value;`",
        "The starter already prints the object at the end.",
      ],
      example: "const car = {};\ncar[\"color\"] = \"red\";\nconst k = \"wheels\";\ncar[k] = 4;\nconsole.log(JSON.stringify(car));\nconsole.log(car.color, car[k]);\n",
      starter: "const pairs = [\"role=admin\", \"team=blue\", \"level=3\"];\nconst settings = {};\n\n// TODO: for each pair, split on \"=\" and store settings[key] = value\n\nconsole.log(JSON.stringify(settings));\n",
      expected: "{\"role\":\"admin\",\"team\":\"blue\",\"level\":\"3\"}",
      hints: ["for (const pair of pairs) {", "const parts = pair.split(\"=\"); settings[parts[0]] = parts[1];"],
      solution: "for (const pair of pairs) {\n  const parts = pair.split(\"=\");\n  settings[parts[0]] = parts[1];\n}\nconsole.log(JSON.stringify(settings));",
    },
  },
  {
    id: "js-functions-return",
    track: "js-foundations",
    title: "Functions: Parameters and return",
    summary: "Package code so you can reuse it, and get answers back.",
    minutes: 30,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt: "Finish splitHeader(line): it must return an array [name, value] where the name is lowercase and both have no extra spaces.",
      concepts: [
        {
          title: "What a function is",
          body: "A **function** is a named, reusable block of code. You define it once and call it as often as you like:\n\n```\nfunction double(n) {\n  return n * 2;\n}\nconsole.log(double(4));   // 8\n```",
        },
        {
          title: "Parameters and arguments",
          body: "`n` in `function double(n)` is a **parameter**: a placeholder. When you call `double(4)`, the value `4` (the **argument**) is put into `n` for that call.",
        },
        {
          title: "return: giving back an answer",
          body: "`return value;` ends the function and hands the value back to whoever called it. A function without `return` gives back `undefined` (nothing useful). Printing inside a function is **not** the same as returning.",
        },
        {
          title: "Returning two values in an array",
          body: "To return two things, put them in an array: `return [name, value];`. The caller can read them with `result[0]` and `result[1]`.",
        },
      ],
      plan: [
        "Find the colon with `line.indexOf(\":\")`.",
        "`name` = text before the colon (`slice(0, colon)`), trimmed and lowercased.",
        "`value` = text after the colon (`slice(colon + 1)`), trimmed.",
        "`return [name, value];`",
      ],
      example: "function shout(text) {\n  return text.toUpperCase() + \"!\";\n}\nconsole.log(shout(\"hello\"));\nfunction pair(a, b) {\n  return [a, b];\n}\nconsole.log(pair(1, 2));\n",
      starter: "function splitHeader(line) {\n  // TODO: return [lowercase name, value]\n  return [];\n}\n\nconsole.log(splitHeader(\"Host: example.com\").join(\"=\"));\n",
      expected: "host=example.com",
      hints: ["const colon = line.indexOf(\":\");", "const name = line.slice(0, colon).trim().toLowerCase();", "return [name, value];"],
      solution: "function splitHeader(line) {\n  const colon = line.indexOf(\":\");\n  const name = line.slice(0, colon).trim().toLowerCase();\n  const value = line.slice(colon + 1).trim();\n  return [name, value];\n}\nconsole.log(splitHeader(\"Host: example.com\").join(\"=\"));",
    },
  },
  {
    id: "js-conditionals-comparison",
    track: "js-foundations",
    title: "Decisions: if / else, Comparisons and Logic",
    summary: "Make your program choose, using HTTP status codes.",
    minutes: 30,
    xp: 60,
    level: "beginner",
    lab: {
      kind: "code",
      language: "javascript",
      prompt:
        "Implement statusClass(code): return \"success\" for 200-299, \"redirect\" for 300-399, \"client error\" for 400-499, \"server error\" for 500-599, and \"unknown\" for anything else.",
      concepts: [
        {
          title: "if / else if / else",
          body: "```\nif (score >= 90) {\n  grade = \"A\";\n} else if (score >= 80) {\n  grade = \"B\";\n} else {\n  grade = \"C\";\n}\n```\nJavaScript checks the conditions **top to bottom** and runs only the first block whose condition is true.",
        },
        {
          title: "Comparison operators",
          body: "`===` equal, `!==` not equal, `<` less, `<=` less or equal, `>` greater, `>=` greater or equal. Always use `===` (three equals) to compare. A single `=` **assigns** a value, it doesn't compare.",
        },
        {
          title: "Combining conditions",
          body: "`&&` means AND (both must be true), `||` means OR (either), `!` means NOT. A range check: `code >= 200 && code <= 299`.",
        },
        {
          title: "Returning early",
          body: "Inside a function, `return` ends it right away. So you can write `if (...) return \"success\";` one after another and finish with a final `return \"unknown\";`.",
        },
      ],
      plan: [
        "Write an `if` for the success range: `code >= 200 && code <= 299` then `return \"success\";`",
        "Repeat for the other three ranges.",
        "After all the ifs, `return \"unknown\";`.",
      ],
      example: "function sign(n) {\n  if (n > 0) return \"positive\";\n  if (n < 0) return \"negative\";\n  return \"zero\";\n}\nconsole.log(sign(5), sign(-2), sign(0));\n",
      starter: "function statusClass(code) {\n  // TODO\n  return \"unknown\";\n}\n",
      harness: "\n{\n  const cases = [[200, \"success\"], [299, \"success\"], [301, \"redirect\"], [404, \"client error\"], [500, \"server error\"], [100, \"unknown\"], [600, \"unknown\"]];\n  const bad = cases.filter(([c, want]) => statusClass(c) !== want);\n  console.log(bad.length === 0 ? \"ALL TESTS PASSED\" : \"TESTS FAILED: \" + JSON.stringify(bad[0]));\n}",
      expected: "ALL TESTS PASSED",
      hints: ["if (code >= 200 && code <= 299) return \"success\";", "Finish with return \"unknown\"; after all the checks."],
      solution: "function statusClass(code) {\n  if (code >= 200 && code <= 299) return \"success\";\n  if (code >= 300 && code <= 399) return \"redirect\";\n  if (code >= 400 && code <= 499) return \"client error\";\n  if (code >= 500 && code <= 599) return \"server error\";\n  return \"unknown\";\n}",
    },
  },
  {
    id: "js-reading-errors",
    track: "js-foundations",
    title: "Reading Error Messages and Debugging",
    summary: "What the common red messages mean and how to fix them.",
    minutes: 20,
    xp: 50,
    level: "beginner",
    lab: {
      kind: "quiz",
      questions: [
        {
          q: "You paste `curl -i https://example.com` into the editor and see `SyntaxError: Unexpected identifier 'https'`. What happened?",
          options: [
            "That text isn't JavaScript. Commands like curl belong in a terminal, not the code editor",
            "The internet is down",
            "You need more RAM",
          ],
          answer: 0,
          why: "The editor only runs JavaScript. Lines starting with // are comments; anything else must be valid code.",
        },
        {
          q: "`ReferenceError: total is not defined`. What's the most likely cause?",
          options: ["You used `total` without creating it with const/let first, or misspelled it", "Your computer is slow", "You have too many comments"],
          answer: 0,
          why: "Names are case-sensitive: `Total` and `total` are different.",
        },
        {
          q: "`TypeError: Cannot read properties of undefined (reading 'length')` means:",
          options: ["You tried to use a value that doesn't exist (it is undefined)", "A loop is too long", "A string is too short"],
          answer: 0,
          why: "Check the variable has a value, or that an array index or object key really exists.",
        },
        {
          q: "`SyntaxError: Unexpected end of input` usually means:",
          options: ["A bracket or brace was opened but never closed", "You printed too much", "A variable is missing"],
          answer: 0,
          why: "Count your `(`, `{` and `[` against your `)`, `}` and `]`.",
        },
        {
          q: "Your lab prints the right thing plus extra lines before it. Will it still pass?",
          options: ["Yes: the lab checks the LAST non-empty line of output", "No, never", "Only if you delete all other lines"],
          answer: 0,
          why: "That's why debug prints are fine while you work. Make sure the final line is the answer.",
        },
        {
          q: "What's a good first step when code doesn't work?",
          options: [
            "Read the error's line, add console.log to see what values really are, and change one thing at a time",
            "Rewrite everything",
            "Ignore it",
          ],
          answer: 0,
          why: "Small experiments and printing values are the core debugging skills. The Ask helper in this app can also explain an error.",
        },
      ],
    },
  },
];
