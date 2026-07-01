---
title: wiqd Cookbooks
description: End-to-end recipes that each deliver one unmistakable "aha" — build an agent, give it powers, make it safe, prove it's good, and ground it in your org.
draft: true
sidebar:
  order: 0
  badge:
    text: Draft
    variant: caution
---

> 🚧 **Placeholder section.** These pages are stubs. Fill in each recipe's steps
> and expected output, then remove `draft: true` from the frontmatter to publish.

Each cookbook is a complete, end-to-end recipe built around **one moment of
belief**. Together they encode a narrative arc:

**build it → make it do something → make it safe → make it good → make it grounded.**

## The five recipes

| # | Recipe | The aha | Commands |
|---|--------|---------|----------|
| 1 | [Zero to agent, live in Copilot](/cookbooks/zero-to-agent) | "I went from an empty folder to chatting with my own Copilot agent in under a minute." | `wiqd agent create` → `provision` → `open` |
| 2 | [Give your agent real powers](/cookbooks/add-api-action) | "My agent stopped just talking and actually did something." | `wiqd agent add action` (+ `add auth`) |
| 3 | [Ship-safe: validate offline](/cookbooks/validate-offline) | "It caught the exact issues that would've failed store certification." | `wiqd agent validate` |
| 4 | [Prove it's good: the evals loop](/cookbooks/evals-loop) | "I can improve my agent against a number, not a vibe." | `wiqd agent eval init` → `eval` → compare |
| 5 | [Grounded answers from your org](/cookbooks/grounded-answers) | "It answered with real company data, and I can see what it grounded on." | `wiqd agent ask` / `monitor` → `list` |

## Suggested rollout

- **Ship #1 first** — it's the hook. Nothing else lands until someone sees their
  own agent answer in Copilot.
- **Pair #3 + #4 tightly** — validate + evals are wiqd's real moat versus
  hand-authoring a manifest.

## Coming next

- **Recipe 6 — Distribute it:** `wiqd agent share` / `wiqd agent publish`. The
  "it's real for my whole team now" payoff, sequenced after #1–5 establish
  belief. _(Not yet stubbed — add when ready.)_
