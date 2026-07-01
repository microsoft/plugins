---
title: "Prove it's good: the evals loop"
description: Generate, run, and score evals so improvement is measured, not guessed.
draft: true
sidebar:
  order: 4
  badge:
    text: Draft
    variant: caution
---


Improve the agent against a score, not a vibe.

> **Aha:** prompt changes move a number, not a feeling.

## Prerequisites

<!-- TODO: confirm -->
- a working agent, ideally with an action from [Give your agent real powers](/cookbooks/add-api-action)

## Steps

### 1. Initialize evals

```bash
wiqd agent eval init
```

**Expected output:** <!-- TODO -->

### 2. Run the evals

```bash
wiqd agent eval
```

**Expected output:** <!-- TODO: a sample score report -->

### 3. Compare runs

<!-- TODO: how to read the delta between runs -->

## Verify

Make a change, rerun, and confirm the score moves.

## Next steps

- [Grounded answers from your org →](/cookbooks/grounded-answers)
