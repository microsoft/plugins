---
title: Grounded answers from your org (and see how)
description: Talk to and observe a live agent with real org context via Work IQ — and inspect exactly what it grounded on.
draft: true
sidebar:
  order: 5
  badge:
    text: Draft
    variant: caution
---

> 🚧 **Placeholder.** Fill in the steps and capture real output before removing `draft: true`.

## The aha

> _"It answered with my company's real data, and I can see exactly what it grounded on."_

Retrieval you can _inspect_ is what makes people believe the output.

## Recipe at a glance

| | |
|---|---|
| **Outcome** | A live agent answering from real org context, with its retrieval visible. |
| **Core capability** | Talk to / observe a live agent with real org context (Work IQ) and inspect its retrieval + developer info. |
| **Commands** | `wiqd agent ask -q "…"` / `wiqd agent monitor` → `wiqd agent list` |
| **Level** | Intermediate |
| **Time** | _(TODO: confirm)_ |

## Prerequisites

<!-- TODO: confirm -->
- [ ] A provisioned agent with access to org context (Work IQ)

## Steps

### Step 1 — Ask a grounded question

```bash
wiqd agent ask -q "…"
```

<!-- TODO: describe the answer plus the retrieval/grounding info returned -->

**Expected output:** <!-- TODO -->

### Step 2 — Monitor the live agent (Work IQ)

```bash
wiqd agent monitor
```

<!-- TODO: describe what monitoring surfaces -->

**Expected output:** <!-- TODO -->

### Step 3 — Inspect developer info

```bash
wiqd agent list
```

<!-- TODO: describe the developer info shown per agent -->

**Expected output:** <!-- TODO -->

## Verify

<!-- TODO: confirm the answer cites real org data and the grounding is inspectable -->

## Troubleshooting

<!-- TODO -->

## Next steps

- Distribute it: `wiqd agent share` / `wiqd agent publish` _(Recipe 6 — coming soon)_
