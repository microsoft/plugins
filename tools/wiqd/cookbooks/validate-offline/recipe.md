---
title: "Ship-safe: validate against the store rulebook offline"
description: Run store and manifest checks locally before you submit.
draft: true
sidebar:
  order: 3
  badge:
    text: Draft
    variant: caution
---

Catch shipping issues before store review.

> **Aha:** the rulebook flags failures locally, without waiting for store review.

## Prerequisites

<!-- TODO: confirm -->
- an agent project to validate

## Steps

### 1. Validate against the rulebook

```bash
wiqd agent validate
```

**Expected output:** <!-- TODO: a sample pass/fail report -->

## Verify

Confirm a clean run, or inspect the reported issues.

## Next steps

- [Prove it's good: the evals loop →](/cookbooks/evals-loop)
