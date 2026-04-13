---
title: "Building the Data Pipeline"
date: 2025-06-02
day: 2
week: 1
tags: [code-prototype, data]
focus: code-prototype
duration_hours: 4
cs336_topic: "Tokenization & Data"
---

# Building the Data Pipeline

Setting up the data loading and preprocessing pipeline for training.

## Components

| Component | Purpose | Status |
|-----------|---------|--------|
| WebDataset | Streaming large datasets | ✅ Done |
| Tokenizer | BPE encoding | ✅ Done |
| Dataloader | Batching & shuffling | 🔄 In Progress |

## Code

```python
from torch.utils.data import IterableDataset, DataLoader

class TokenizedDataset(IterableDataset):
    def __init__(self, url, tokenizer, seq_len=1024):
        self.url = url
        self.tokenizer = tokenizer
        self.seq_len = seq_len
    
    def __iter__(self):
        for sample in self.stream_samples():
            tokens = self.tokenizer.encode(sample['text'])
            # Chunk into sequences
            for i in range(0, len(tokens) - self.seq_len, self.seq_len):
                yield tokens[i:i + self.seq_len + 1]
```

## Memory Considerations

Streaming is essential for large datasets. Cannot load entire dataset into RAM.
