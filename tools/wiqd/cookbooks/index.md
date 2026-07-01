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

wiqd cookbooks are short, end-to-end recipes built around one clear outcome:
**build it → make it do something → make it safe → make it good → make it grounded.**

> **Agents:** read [`/catalog.json`](/catalog.json) for the machine-readable
> index and [`/llms.txt`](/llms.txt) for orientation before crawling these pages.

1. [Zero to agent, live in Copilot](/cookbooks/zero-to-agent) — `wiqd agent create` → `provision` → `open`
2. [Give your agent real powers](/cookbooks/add-api-action) — `wiqd agent add action` (+ `add auth`)
3. [Ship-safe: validate offline](/cookbooks/validate-offline) — `wiqd agent validate`
4. [Prove it's good: the evals loop](/cookbooks/evals-loop) — `wiqd agent eval init` → `eval` → compare
5. [Grounded answers from your org](/cookbooks/grounded-answers) — `wiqd agent ask` / `monitor` → `list`

**Rollout:** ship #1 first; pair #3 and #4 closely.

**Coming next:** Recipe 6 — distribute it with `wiqd agent share` or `wiqd agent publish`.
