---
title: Intro & Tokenization
date: 2026-04-13
day: 1
week: 1
tags:
  - lecture-notes
focus: lecture-notes
duration_hours: 3
cs336_topic: Tokenization
cover_image: "![[Pasted image 20260413212008.png]]"
---

## Architecture Review

![[Pasted image 20260413212008.png]]

# BPE Tokenization



Today I learned about Byte Pair Encoding (BPE), the algorithm used by most modern language models for tokenization.

## Key Concepts

- **Unicode handling**: Breaking text into bytes first, then merging
- **Vocabulary size trade-offs**: More tokens = shorter sequences but larger embedding matrix
- **Special tokens**: `[BOS]`, `[EOS]`, `[PAD]`, `[UNK]`

## Implementation Notes

The basic algorithm:
1. Start with character-level tokens (bytes)
2. Count all adjacent pairs
3. Merge the most frequent pair
4. Repeat until vocabulary size reached

```python
import re
from collections import defaultdict

def get_stats(vocab):
    pairs = defaultdict(int)
    for word, freq in vocab.items():
        symbols = word.split()
        for i in range(len(symbols) - 1):
            pairs[(symbols[i], symbols[i+1])] += freq
    return pairs
```

## Next Steps

- Implement BPE training on a small corpus
- Compare GPT-2 tokenizer vs custom trained one
