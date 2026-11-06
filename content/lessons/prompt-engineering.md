## Start here

A **prompt** is the text you send to a language model. A prompt is an interface: vague input gives vague output. Prompt engineering is the skill of writing prompts that reliably produce what you need.

## The four parts of a strong prompt

1. **Role:** who the model should act as. "You are a senior Python code reviewer."
2. **Task:** exactly what to do. "Find bugs in the function below."
3. **Input:** the material to work on, clearly separated from the instructions (for example inside triple backticks).
4. **Output format:** how the answer should look. "Reply with a numbered list of issues, then the corrected code."

Compare:

- Weak: "check my code"
- Strong: "You are a senior Python reviewer. Find bugs in the function below and reply with a numbered list of issues and a corrected version."

The strong one states role, task, input and format.

## Show examples (few-shot prompting)

Models copy patterns. Include two or three examples of the input and the exact output you want, and the model will follow the format and tone. This is **few-shot prompting** (zero-shot means no examples).

## Say what to do when information is missing

"If the log has no IP address, answer `unknown` rather than guessing." This reduces hallucination.

## When your program reads the answer

If code will use the output, ask for **strict JSON** with named fields, and then **validate it in code** (the next lessons show how). Models can still return malformed or unexpected output, so never skip validation.

## Improve prompts like you improve code: test them

Collect 10 to 20 realistic inputs with the answers you expect (an **eval set**). Run your prompt on all of them, change one thing, run again and compare. Without tests you are just guessing which version is better.

## Safety basics

- Never put passwords or API keys in a prompt.
- Text from users (or from emails and web pages) that you paste into a prompt can contain instructions of its own. Keep that in mind: see the AI Security lesson.

## Check yourself

Take the quiz below.
