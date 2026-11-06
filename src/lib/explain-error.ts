/**
 * Turns raw JavaScript/Python/SQL error text into a plain-English explanation for beginners.
 * Returns null when there is nothing helpful to add. Pure function (unit tested).
 */
export function explainError(language: "javascript" | "python" | "sql", raw: string): string | null {
  const m = raw ?? "";
  if (language === "javascript") {
    if (/Unexpected identifier/i.test(m))
      return "JavaScript found a word where it didn't expect one. Common causes: (1) you pasted plain text or a command (like `curl ...` or a URL) into the editor — the editor only accepts JavaScript code; (2) a missing comma, quote or operator just before the word it names. Fix: remove anything that isn't JavaScript, or check the line just above the one mentioned.";
    if (/Unexpected token/i.test(m))
      return "JavaScript hit a symbol it didn't expect. Look for a missing or extra bracket `)`, `}` or `]`, a missing comma between items, or a quote that was never closed.";
    if (/Unexpected end of input/i.test(m))
      return "Your code stopped before it was finished. Usually a `{`, `(` or `[` was opened but never closed. Count your opening and closing brackets.";
    if (/Invalid or unexpected token/i.test(m))
      return "There's a character JavaScript can't read, often a curly “smart” quote copied from a document, or an unclosed string. Retype the quotes as plain \" or '.";
    if (/is not defined/i.test(m))
      return "You used a name JavaScript doesn't know. Check the spelling (capital letters matter), and make sure you created it with `const` or `let` before using it.";
    if (/is not a function/i.test(m))
      return "You tried to call something that isn't a function. Check the name and whether it's the right type (for example `.split` works on strings, `.push` on arrays).";
    if (/Cannot read propert(y|ies) of (undefined|null)/i.test(m))
      return "You tried to use a value that doesn't exist (undefined or null). Check that the variable has a value and that an index or key you used actually exists.";
    if (/Assignment to constant variable/i.test(m))
      return "You tried to change a variable created with `const`. Use `let` if the value needs to change.";
    if (/Identifier '.*' has already been declared/i.test(m))
      return "You created the same variable name twice with const/let. Use each name once, or change the value of the existing one without redeclaring it.";
    if (/Timed out/i.test(m))
      return "Your code ran too long, which usually means an endless loop. Check that a loop's condition eventually becomes false, or that you move to the next item.";
    return null;
  }
  if (language === "python") {
    if (/IndentationError/i.test(m))
      return "Python uses indentation (spaces at the start of a line) to group code. Lines inside a `for`, `if` or `def` must be indented by the same amount (4 spaces).";
    if (/SyntaxError/i.test(m))
      return "Python couldn't understand a line. Look for a missing colon `:` after `if`/`for`/`def`, an unclosed quote or bracket, or text that isn't Python.";
    if (/NameError/i.test(m))
      return "You used a name Python doesn't know. Check the spelling (capitals matter) and that you assigned it before using it.";
    if (/TypeError/i.test(m))
      return "You combined or called things of the wrong type, for example adding a string and a number. Convert with `str()` or `int()`.";
    if (/IndexError/i.test(m))
      return "You asked for a list position that doesn't exist. Lists start at 0 and end at length - 1; an empty list has no item 0.";
    if (/KeyError/i.test(m))
      return "That key isn't in the dictionary. Use `.get(key, default)` or check `key in dict` first.";
    if (/ValueError/i.test(m))
      return "A function got the right type but an unusable value, like `int('abc')`.";
    if (/ZeroDivisionError/i.test(m)) return "You divided by zero. Check the denominator before dividing.";
    return null;
  }
  if (/no such table/i.test(m))
    return "The table name doesn't exist. Check spelling against the tables listed in the lesson, or (for create/insert labs) make sure your CREATE TABLE statement runs before the query that uses it.";
  if (/no such column/i.test(m))
    return "That column name isn't in the table. Check the spelling and which table the column belongs to (use an alias like e.name when joining).";
  if (/syntax error/i.test(m))
    return "SQL couldn't read the statement. Check keyword order (SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY), commas between columns, quotes around text values, and a semicolon between statements.";
  return null;
}
