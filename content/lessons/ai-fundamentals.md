## Start here if AI is new to you

You hear "AI", "machine learning" and "LLM" used as if they were the same thing. They are nested ideas, and knowing the difference helps you choose the right tool and spot hype.

## The map, from big to small

- **Artificial intelligence (AI)**: the broad goal of making computers do tasks that seem intelligent (recognizing faces, translating, playing chess).
- **Machine learning (ML)**: one way to reach that goal. Instead of a programmer writing rules ("if the email says WINNER it is spam"), you show the computer **many examples** and it works out the patterns itself.
- **Deep learning**: ML using **neural networks** with many layers. It powers image recognition and modern language models.
- **LLM (large language model)**: a neural network trained on huge amounts of text to **predict the next piece of text**. Because predicting text well requires picking up grammar, facts and style, LLMs can write, summarize, translate and code.

## Two phases: training and inference

- **Training** is the expensive part: fitting the model to data, often on thousands of specialized chips.
- **Inference** is using the finished model to answer a question.

As a developer you will almost always do **inference only**, by calling a hosted model through an **API** (a way for your program to send a request and get an answer).

## What is a token?

Models do not read letters or whole words. They read **tokens**: pieces of text, often a short word or part of a word ("unbelievable" might be 3 tokens). Speed, price and the maximum amount of text a model can handle (its **context window**) are all measured in tokens.

## Why do models "hallucinate"?

An LLM predicts text that sounds **plausible**. It does not look facts up unless you give it a tool to do so. So it can state something false in a confident, fluent voice. This is called a **hallucination**. Rule of thumb: the more the answer matters (medical, legal, security, money), the more you must verify it.

## A first example

A **spam filter** is classic ML: show it thousands of emails labeled spam or not, and it learns which word patterns matter. You will build a tiny one yourself in a later lesson.

## How this track builds

1. This map. 2. **Machine learning from scratch** (learn a line with gradient descent). 3. **Embeddings** (text as numbers). 4. **RAG** (give a model your own documents). 5. **Prompting**, **validating output** and **AI security**.

Come back to Python Foundations first if loops and functions feel shaky; the labs use them.

## Check yourself

Take the quiz below.
