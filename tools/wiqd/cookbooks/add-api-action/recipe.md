---
title: "Give your agent real powers: API → action"
description: Turn an OpenAPI spec into a working plugin action, with auth wired in, so your agent stops talking and starts doing.
draft: true
sidebar:
  order: 2
  badge:
    text: Draft
    variant: caution
---

> 🚧 **Placeholder.** Fill in the steps and capture real output before removing `draft: true`.

## The aha

> _"My agent stopped just talking and actually did something."_

Calls my API, books the thing, reads the system of record. This is where a toy
becomes a tool.

## Recipe at a glance

| | |
|---|---|
| **Outcome** | Your agent gains a real action backed by your API. |
| **Core capability** | Turn an OpenAPI spec into a working plugin action with auth wired in. |
| **Commands** | `wiqd agent add action --openapi-spec ./api.yaml` (+ `wiqd agent add auth` for secured APIs) |
| **Level** | Intermediate |
| **Time** | _(TODO: confirm)_ |

## Prerequisites

<!-- TODO: confirm -->
- [ ] Completed [Zero to agent](/cookbooks/zero-to-agent)
- [ ] An OpenAPI spec (`./api.yaml`) for the API you want to call
- [ ] Credentials / auth details if the API is secured

## Steps

### Step 1 — Add the action from your spec

```bash
wiqd agent add action --openapi-spec ./api.yaml
```

<!-- TODO: describe how operations map to actions -->

**Expected output:** <!-- TODO -->

### Step 2 — Wire in auth (secured APIs)

```bash
wiqd agent add auth
```

<!-- TODO: describe supported auth types and prompts -->

**Expected output:** <!-- TODO -->

## Verify

<!-- TODO: prompt the agent to invoke the action and confirm the call succeeds -->

## Troubleshooting

<!-- TODO -->

## Next steps

- [Ship-safe: validate offline →](/cookbooks/validate-offline)
