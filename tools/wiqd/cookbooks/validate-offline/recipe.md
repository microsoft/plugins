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

Goal: catch shipping issues before review.

Aha: the rulebook flags failures locally, without waiting for store review.

At a glance: `wiqd agent validate`.

Prereqs:
- an agent project to validate

Steps:
1. Run `wiqd agent validate`.

Verify: confirm a clean run or inspect the reported issues.

Next: [Prove it's good: the evals loop](/cookbooks/evals-loop)
