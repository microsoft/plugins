---
title: "Ship-safe: validate against the store rulebook offline"
description: Run 130+ certification and manifest rules locally — before you submit — so you never waste a store review cycle.
draft: true
sidebar:
  order: 3
  badge:
    text: Draft
    variant: caution
---

> 🚧 **Placeholder.** Fill in the steps and capture real output before removing `draft: true`.

## The aha

> _"It caught the exact issues that would've failed store certification — before I wasted a review cycle."_

De-risking the scariest part of shipping is a huge trust unlock.

## Recipe at a glance

| | |
|---|---|
| **Outcome** | Certification and manifest issues surfaced locally, before submission. |
| **Core capability** | 130+ store-certification / manifest rules (store-ops rules + MVL + LSP) checked locally, no network. |
| **Commands** | `wiqd agent validate` |
| **Level** | Intermediate |
| **Time** | _(TODO: confirm)_ |

## Prerequisites

<!-- TODO: confirm -->
- [ ] An agent project to validate

## Steps

### Step 1 — Validate against the rulebook

```bash
wiqd agent validate
```

<!-- TODO: describe rule categories (store-ops, MVL, LSP) and how results are reported -->

**Expected output:** <!-- TODO: capture a sample pass/fail report -->

## Verify

<!-- TODO: confirm a clean run, and show what a caught issue looks like -->

## Troubleshooting

<!-- TODO -->

## Next steps

- [Prove it's good: the evals loop →](/cookbooks/evals-loop)
