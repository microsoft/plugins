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

Goal: get answers from real org context and see the grounding.

Aha: the answer cites real data and the retrieval is inspectable.

At a glance: `wiqd agent ask -q "…"` / `wiqd agent monitor` → `wiqd agent list`.

Prereqs:
- a provisioned agent with Work IQ access

Steps:
1. Run `wiqd agent ask -q "…"`.
2. Run `wiqd agent monitor`.
3. Run `wiqd agent list`.

Verify: the answer uses org data and the grounding is visible.

Next: distribute it with `wiqd agent share` or `wiqd agent publish`.
