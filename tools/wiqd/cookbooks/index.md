---
title: wiqd Cookbooks
description: Short end-to-end recipes for building, powering, validating, scoring, and grounding an agent.
draft: true
sidebar:
  order: 0
  badge:
    text: Draft
    variant: caution
---

wiqd cookbooks are short, end-to-end recipes built around one clear outcome.

1. Zero to agent, live in Copilot - `wiqd agent create` → `provision` → `open`
2. Give your agent real powers - `wiqd agent add action` (+ `add auth`)
3. Ship-safe: validate offline - `wiqd agent validate`
4. Prove it's good: the evals loop - `wiqd agent eval init` → `eval` → compare
5. Grounded answers from your org - `wiqd agent ask` / `monitor` → `list`

Rollout order: ship #1 first. Pair #3 and #4 closely.

Coming next: Recipe 6, distribute it with `wiqd agent share` or `wiqd agent publish`.
