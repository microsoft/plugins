---
title: "Prove it's good: the evals loop"
description: Generate, run, and score evals against your agent so you can improve it against a number — not a vibe.
draft: true
sidebar:
  order: 4
  badge:
    text: Draft
    variant: caution
---

> 🚧 **Placeholder.** Fill in the steps and capture real output before removing `draft: true`.

## The aha

> _"I can improve my agent against a number, not a vibe."_

See that a prompt change actually moved grounding/quality. This is what
separates a demo from a product people trust.

## Recipe at a glance

| | |
|---|---|
| **Outcome** | A repeatable score for your agent that moves when you improve it. |
| **Core capability** | Generate, run, and score evals against your agent. |
| **Commands** | `wiqd agent eval init` → `wiqd agent eval` → analyze / compare runs |
| **Level** | Advanced |
| **Time** | _(TODO: confirm)_ |

## Prerequisites

<!-- TODO: confirm -->
- [ ] A working agent (ideally one with an action from [Recipe 2](/cookbooks/add-api-action))

## Steps

### Step 1 — Initialize evals

```bash
wiqd agent eval init
```

<!-- TODO: describe what gets generated (eval set, scaffolding) -->

**Expected output:** <!-- TODO -->

### Step 2 — Run the evals

```bash
wiqd agent eval
```

<!-- TODO: describe scoring dimensions (e.g. grounding, quality) -->

**Expected output:** <!-- TODO: capture a sample score report -->

### Step 3 — Analyze / compare runs

<!-- TODO: document the analyze / compare workflow and how to read a delta between runs -->

**Expected output:** <!-- TODO -->

## Verify

<!-- TODO: make a prompt change, re-run, and confirm the score moved -->

## Troubleshooting

<!-- TODO -->

## Next steps

- [Grounded answers from your org →](/cookbooks/grounded-answers)
