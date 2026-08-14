---
title: Photobooth agent
description: Build a declarative agent that modifies images and creates photobooth-style composites.
draft: true
sidebar:
  order: 7
  badge:
    text: Draft
    variant: caution
---

Build a Copilot agent that takes user-uploaded images, applies fun modifications, and returns photobooth-style composite images.

> **Aha:** users upload photos and get back a styled photobooth strip — all through chat.

## Prerequisites

- wiqd installed and signed in
- permission to provision to a dev environment

## Steps

> **Tip:** Run `/clear` in Copilot Chat before starting to clear any previous session context.

### 1. Create a project folder

```
copilot -i "create a new folder called photobooth-agent"
```

```
/cwd photobooth-agent
```

### 2. Scaffold the agent

```
copilot -i "create a new declarative agent called Photobooth that accepts user-uploaded images and creates photobooth-style image responses. The agent should apply creative filters and effects like black-and-white, sepia, pop-art, and sketch. It should combine multiple styled versions into a single photobooth strip layout and return the composite image." --agent wiqd:wiqd
```

**Expected output:** a new agent project with manifest and instruction files.

### 3. Review the generated instructions

Open the generated instruction file and confirm it includes:

- Accept one or more images from the user
- Apply a set of visual styles (e.g., black-and-white, sepia, pop-art, sketch)
- Arrange styled images into a 2×2 or 1×4 photobooth strip layout
- Return the composite image directly in chat
- Allow the user to request specific styles or regenerate with different effects

### 4. Provision to dev

```bash
wiqd agent provision --env dev
```

**Expected output:** a share link like `https://m365.cloud.microsoft/chat/?titleId=…`

### 5. Open it in Copilot

```bash
wiqd agent open
```

## Verify

1. Upload a photo and ask: **"Create a photobooth strip"**
   — agent returns a composite image with four styled versions.
2. Ask: **"Make it all pop-art style"**
   — agent regenerates with pop-art applied to each frame.
3. Upload two photos and say: **"Combine these into a photobooth"**
   — agent creates a strip using both images with different effects.

## Next steps

- [Prove it's good: the evals loop →](/cookbooks/evals-loop)
- [Ship-safe: validate offline →](/cookbooks/validate-offline)
