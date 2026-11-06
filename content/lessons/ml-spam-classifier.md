## Spam filtering as machine learning

Early spam filters used word lists and hand-written rules. Modern filters learn from labeled examples. One classic approach is **Naive Bayes**: it estimates how often each word appears in spam versus legitimate mail (ham), then applies Bayes' theorem to a new message.

## The recipe

1. **Train:** count word occurrences in spam and in ham.
2. **Score** a message for each class: start with the prior (`log(0.5)` for equal classes) and add `log P(word | class)` for each known word.
3. **Classify** as the higher-scoring class.

## Two practical tricks

- **Laplace smoothing:** use `(count + 1) / (total_words + vocabulary_size)` so a word never seen in a class doesn't force the probability to zero.
- **Log probabilities:** multiplying many small numbers underflows; adding their logs is stable and gives the same ordering.

It's "naive" because it assumes words are independent given the class, which is false but works surprisingly well.

## Evaluating a classifier

Accuracy alone can mislead. Track **false positives** (good mail marked spam) and **false negatives** (spam let through), and use separate data for testing. Attackers adapt, so filters need retraining.

## Your task

Complete `word_counts` and `score`. The tiny dataset is made up for the lab; real filters train on thousands of messages.
