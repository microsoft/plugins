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

Goal: improve the agent against a score.

Aha: prompt changes move a number, not a vibe.

At a glance: `wiqd agent eval init` → `wiqd agent eval` → compare runs.

Prereqs:
- a working agent, ideally with an action from [Give your agent real powers](/cookbooks/add-api-action)

Steps:
1. Run `wiqd agent eval init`.
2. Run `wiqd agent eval`.
3. Compare the results across runs.

Verify: make a change, rerun, and confirm the score moves.

Next: [Grounded answers from your org](/cookbooks/grounded-answers)
