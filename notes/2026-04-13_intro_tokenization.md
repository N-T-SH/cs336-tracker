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
## Logistics:
- Runnable lecture with env. variables
- 5 assignments, good for research engineering muscles
- Prototype locally, then benchmark on clusters
- AI tool use - self declared - `only in chat mode for pre-req and errors`

## Lecture 1:

### Motivation

- Researchers are disconnected from underlying implementation
- Abstraction improves productivity but abstractions are leaky
- Scope for fundamental research
- We want to work on small models but have to be careful about the point where LLM emergent behavior kicks in
- Takeaways
	- **Mechanics**
	- **Mindset** - scaling, squeeze out performance
	- **Intuitions** - data and modeling decisions

> Interpretation that **Bitter lesson** means that scale is all that matters, algorithms don't matter is incorrect. Right interpretation is that algorithms at scale is what matters. Accuracy of your model is really a product of your efficiency and the number of resources you put in. Efficiency, if you think about it, is way more important at larger scale.

**What is the best model one can build given a certain compute and data budget?**

### Landscape

- Entropy of English pre-LLM
- n-gram models for machine translation, etc.
- 2010s: Seq2seq, Adam optimizer, attention, transformer, MoE, and parallelism papers
- 2010s: ELMo, BERT, T5 foundation models
- Post-2010s: Closed scaled models + open models

### Course Components

- Focus on efficiency
- 5 pillars of the course:

![[Pasted image 20260413233041.png]]

**Tokenizer - BPE - more in the lecture**

**Model Architecture**

![[Pasted image 20260413212008.png]]

**Variants**:
- Activation Functions: ReLU
- Positional encodings: RoPE
- Normalization: RMS Norm
- Placement of Norm: pre vs post
- MLP: Dense, MoE
- Attention: full, sliding, linear
- Lower dimensional attention: group-query attention, multi-head latent attention (MLA)
- State space models and other alternates

**Training Decisions:**
- Optimizer: ADAM, Muon, SOAP
- Learning rate schedule: cosine, WSD
- Batch size
- Regularization: dropout, weight decay
- Hyper-parameters: no. of heads, grid search

#### Assignment 1 - Basics: 
- [Handout](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf)
- Implement BPE tokenizer, Transformer, cross-entropy, AdamW optimizer, training loop
- Use PyTorch but not something like it's transformer implementation
- OpenWeb data and leaderboard to minimize perplexity based on it
- 90 mins on H100 for benchmarking last years - **validation loss 3.12**


#### Systems
- Kernels - GPU then memory is in different levels of cache that needs to be sent back and forth. How do you organize the compute, even a matrix multiplication, to maximize the utilization of the GPUs by minimizing the data movement? We're going to use Triton
- Parallelism - Training runs that use 10s of Ks of GPU's
- Inference - generate tokens given a prompt and model weights. Needed for RL and test time compute. Has two phases pre-fill and decode. Pre-fill can be always at one, decode is autoregressive and hence sequential, throughput becomes memory bound instead of GPU bound.
- Optimizations like smaller models, speculative decoding
![[Pasted image 20260414000453.png]]

#### Assignment 2 - Systems: 
- [Handout](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_spring2025_assignment2_systems.pdf))
- Implement Kernel, data parallel training, FSDP, optimizer sharding
- Benchmarking and profiling

#### Scaling Laws:
- Experiment at small scale, predict loss at large scale
- DeepMind Chinchilla paper. For every level of compute, you can get the optimal parameter count. Tokens to train on = size of model (no. of parameters) \* 20

![[Pasted image 20260414002027.png]]

#### Assignment 3 - Scaling Laws: 
- [Handout](https://github.com/stanford-cs336/assignment3-scaling/blob/main/cs336_spring2025_assignment3_scaling.pdf)
- Query a training API with hyper-parameters and get a loss. Then use it to generate a scaling law to give model config given FLOPs budget with target of minimizing loss

#### Data
- Differentiates models
![[Pasted image 20260414002835.png]]

**Evaluation**:
- Perplexity
- MMLU
- Instruction Following
- Chain of Thought - Test time compute
- Full systems - RAG/Agents/etc.

**Data Curation** - Not all data is created equal
**Data Processing** - Preserve structure, filtering

#### Assignment 4 - Data: 
- [Handout](https://github.com/stanford-cs336/assignment4-data/blob/main/cs336_spring2025_assignment4_data.pdf)
- Minimize perplexity given token budget by using classifiers for filtering, deduping, etc. 

#### Alignment
- Making a base model useful, right now it just does next token prediction
	- follow instructions
	- tune the style
	- incorporate safety
- Two phases
	- Supervised Fine Tuning - prompt - response pairs + supervised learning - P(response|prompt)
	- Learning form feedback - without expensive annotation
		- Preference Data
		- Verifiers (Formal for math or code) or (Learned LLM as a judge)
		- Algorithms - PPO (from RL) or DPO (from preference data) or GRPO (remove value function from PPO)

#### Assignment 5 - Alignment: 
- [Handout](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2025_assignment5_alignment.pdf) and [Safety Supplement](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2025_assignment5_supplement_safety_rlhf.pdf)
- Implement SFT, DPO, GRPO


#### Efficiency
- **Data Processing** - Avoid wasting compute on bad data
- **Tokenization** - working on raw bytes is elegant but inefficient
- **Architecture** - KV cache, etc.
- **Training** - Epoch reduction
- **Scaling Laws** - Minimum compute to figure out hyper-parameters
- **Alignment** - Allows for smaller base models
- Future when data constrained - run multiple epochs

### Tokenization

- Turning unicode strings into integers and back
- Vocab size is the range
- Spaces are part of tokens unlike NLP n-grams where they're taken out. hello and ' 'hello are two different tokens.
- In BPE pre-tokenizer adds the space
- Compression ratio for GPT-2 is 1.6 for bytes represented per token

#### BPE
- Simplest version is **character based** so just convert each character to it's code point representation. Problem is some code points are really large. Because chars are rare, vocab is inefficiently used and compression ratio is 1.5
- **Byte based** using UTF8 - everything is bw 0 to 255. Problem is very long sequences, compression ratio is 1 and hence inefficient
- **Word based** - like in NLP, each word is a token. Massive vocab size, new input with new word can't be tokenized and is a problem
- **Byte Pair Encoding** - Train tokenizer on raw text, common ones are single tokens, rare ones are multiple tokens. GPT-2 breaks down into segments then BPE.
- Start with each byte is a token, then successively merge the most common ones. Start with 2 integers that represent bytes or their merges
- Count up occurrences of pairs of bytes. Pick highest and merge [116, 104] -> 256 (new vocab integer), replace pair with new index
![[Pasted image 20260414014427.png]]
- Do it recursively and the indices size reduces, i.e. compression improves
![[Pasted image 20260414014639.png]]
- It's inefficient, needs improvement in implementation

#### Summary
- Tokenizer - strings <-> indices
- BPE is effective
- Is a necessary evil compared to bytes