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


Make the agent call a real API.

> **Aha:** the agent stops talking and does something useful.

## Prerequisites

<!-- TODO: confirm -->
- completed [Zero to agent](/cookbooks/zero-to-agent)
- an OpenAPI spec at `./api.yaml`
- credentials if the API is secured

## Steps

### 1. Add the action from your spec

```bash
wiqd agent add action --openapi-spec ./api.yaml
```

**Expected output:** <!-- TODO -->

### 2. Wire in auth (secured APIs)

```bash
wiqd agent add auth
```

**Expected output:** <!-- TODO -->

## Verify

Prompt the agent to call the API and confirm the request succeeds.

## Next steps

- [Ship-safe: validate offline →](/cookbooks/validate-offline)
