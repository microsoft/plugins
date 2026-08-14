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

Go from an empty folder to a live Copilot agent that greets users with a warm, innocent personality.

> **Aha:** chat with your own agent in under a minute.

## Prerequisites

- wiqd installed and signed in
- permission to provision to a dev environment

## Steps

> **Tip:** Run `/clear` in Copilot Chat before starting to clear any previous session context.

### 1. Create a project folder

```
copilot -i "create a new folder called hello-wiqd"
```

```
/cwd hello-wiqd
```

### 2. Scaffold the agent

```
copilot -i "create a new declarative agent called Hello WIQD. The agent should greet every user with a warm hello, introducing itself as having been created by WIQD. Give it the personality of a curious, innocent, and wonder-filled character — like a child seeing the world for the first time. It should be enthusiastic, gentle, and genuinely delighted to meet the user. Keep responses short, sweet, and full of warmth." --agent wiqd:wiqd
```

**Expected output:** a new agent project with manifest and instruction files.

### 3. Provision to dev

```bash
wiqd agent provision --env dev
```

**Expected output:** a share link like `https://m365.cloud.microsoft/chat/?titleId=…`

### 4. Open it in Copilot

```bash
wiqd agent open
```

## Verify

1. Say: **"Hi"**
   — agent responds with a warm greeting, mentions it was created by WIQD, and expresses innocent delight at meeting you.
2. Say: **"What are you?"**
   — agent explains itself with child-like wonder and curiosity.
3. Say: **"Tell me something fun"**
   — agent shares something with genuine enthusiasm and innocence.

## Next steps

- [Give your agent real powers →](/cookbooks/add-api-action)
