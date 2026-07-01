---
title: Grounded answers from your org (and see how)
description: Ask a live agent real org questions and inspect what it grounded on.
draft: true
sidebar:
  order: 5
  badge:
    text: Draft
    variant: caution
---


Get answers from real org context — and see the grounding.

> **Aha:** the answer cites real data and the retrieval is inspectable.

## Prerequisites

<!-- TODO: confirm -->
- a provisioned agent with Work IQ access

## Steps

### 1. Ask a grounded question

```bash
wiqd agent ask -q "…"
```

**Expected output:** <!-- TODO: the answer plus grounding info -->

### 2. Monitor the live agent (Work IQ)

```bash
wiqd agent monitor
```

**Expected output:** <!-- TODO -->

### 3. Inspect developer info

```bash
wiqd agent list
```

**Expected output:** <!-- TODO -->

## Verify

The answer uses org data and the grounding is visible.

## Next steps

- Distribute it with `wiqd agent share` or `wiqd agent publish` _(Recipe 6 — coming soon)_
