---
title: Zero to agent, live in Copilot
description: Scaffold, provision, and open a Copilot agent from an empty folder.
draft: true
sidebar:
  order: 1
  badge:
    text: Draft
    variant: caution
---

Go from an empty folder to a live Copilot agent.

> **Aha:** chat with your own agent in under a minute.

## Prerequisites

<!-- TODO: confirm -->
- wiqd installed and signed in
- permission to provision to a dev environment

## Steps

### 1. Scaffold the agent

```bash
wiqd agent create
```

**Expected output:** <!-- TODO: the generated file tree -->

### 2. Provision to dev

```bash
wiqd agent provision --env dev
```

**Expected output:** a share link like `https://m365.cloud.microsoft/chat/?titleId=…` <!-- TODO: full output -->

### 3. Open it in Copilot

```bash
wiqd agent open
```

**Expected output:** <!-- TODO -->

## Verify

The agent opens in Copilot and answers in chat.

## Next steps

- [Give your agent real powers →](/cookbooks/add-api-action)
