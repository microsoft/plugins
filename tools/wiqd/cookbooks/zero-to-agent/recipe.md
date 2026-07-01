---
title: Zero to agent, live in Copilot
description: Scaffold, provision, and open your own Copilot agent in under a minute — from an empty folder to a real M365 share link.
draft: true
sidebar:
  order: 1
  badge:
    text: Draft
    variant: caution
---

> 🚧 **Placeholder.** Fill in the steps and capture real output before removing `draft: true`.

## The aha

> _"I went from an empty folder to chatting with my own Copilot agent in under a minute."_

This is the single biggest conversion moment — nothing else lands until someone
sees their agent answer in Copilot.

## Recipe at a glance

| | |
|---|---|
| **Outcome** | An empty folder becomes a live agent you can chat with in Copilot. |
| **Core capability** | Scaffolding + one-command provisioning that returns a real M365 share link. |
| **Commands** | `wiqd agent create` → `wiqd agent provision --env dev` → `wiqd agent open` |
| **Level** | Beginner — start here |
| **Time** | ~1 minute _(TODO: confirm)_ |

## Prerequisites

<!-- TODO: confirm the real prerequisites -->
- [ ] wiqd installed and signed in
- [ ] Permission to provision to a dev environment

## Steps

### Step 1 — Scaffold the agent

```bash
wiqd agent create
```

<!-- TODO: describe prompts/flags and what the scaffold produces -->

**Expected output:** <!-- TODO: capture the generated file tree -->

### Step 2 — Provision to dev

```bash
wiqd agent provision --env dev
```

<!-- TODO: describe what provisioning does -->

**Expected output:** a share link of the form
`https://m365.cloud.microsoft/chat/?titleId=…` <!-- TODO: capture full output -->

### Step 3 — Open it in Copilot

```bash
wiqd agent open
```

**Expected output:** <!-- TODO -->

## Verify

<!-- TODO: how to confirm the agent answers in Copilot -->

## Troubleshooting

<!-- TODO -->

## Next steps

- [Give your agent real powers →](/cookbooks/add-api-action)
