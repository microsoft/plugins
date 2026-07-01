---
title: "Give your agent real powers: API → action"
description: Turn an OpenAPI spec into a working plugin action with auth.
draft: true
sidebar:
  order: 2
  badge:
    text: Draft
    variant: caution
---

Goal: make the agent call a real API.

Aha: the agent stops talking and does something useful.

At a glance: `wiqd agent add action --openapi-spec ./api.yaml`.
For secured APIs, also run `wiqd agent add auth`.

Prereqs:
- completed [Zero to agent](/cookbooks/zero-to-agent)
- an OpenAPI spec at `./api.yaml`
- credentials if the API is secured

Steps:
1. Run `wiqd agent add action --openapi-spec ./api.yaml`.
2. If needed, run `wiqd agent add auth`.

Verify: prompt the agent to call the API and confirm the request succeeds.

Next: [Ship-safe: validate offline](/cookbooks/validate-offline)
