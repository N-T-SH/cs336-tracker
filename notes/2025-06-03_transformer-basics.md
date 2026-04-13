---
title: "Transformer Architecture Basics"
date: 2025-06-03
day: 3
week: 1
tags: [lecture-notes, transformers, attention]
focus: lecture-notes
duration_hours: 2.5
cs336_topic: "Transformer Architecture"
---

# Transformer Architecture Basics

Reviewing the original "Attention Is All You Need" paper and modern adaptations.

## Core Components

1. **Multi-Head Self-Attention**: Parallel attention mechanisms
2. **Feed-Forward Networks**: Position-wise transformations
3. **Layer Norm & Residuals**: Stabilizing deep networks

> [!NOTE]
> The original paper used Post-LN, but modern LLMs typically use Pre-LN for better stability.

## Attention Mechanism

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

## Implementation Sketch

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class Attention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        
        self.w_qkv = nn.Linear(d_model, 3 * d_model, bias=False)
        self.w_o = nn.Linear(d_model, d_model, bias=False)
    
    def forward(self, x):
        B, T, C = x.shape
        qkv = self.w_qkv(x).split(C, dim=-1)
        q, k, v = [y.view(B, T, self.n_heads, self.d_head).transpose(1, 2) for y in qkv]
        
        # Scaled dot-product attention
        attn = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        
        attn = attn.transpose(1, 2).contiguous().view(B, T, C)
        return self.w_o(attn)
```

## Reading

- [[Attention Is All You Need]] — Original transformer paper
- [[LLaMA paper]] — Modern efficient architecture
