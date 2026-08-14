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

## Getting started

Before running any cookbook, make sure you have these installed and configured:

### 1. Install Node.js 24+

wiqd requires Node.js 24 or later. Install via your preferred method:

```bash
# macOS / Linux (via nvm)
nvm install 24 && nvm use 24

# Windows (via fnm)
fnm install 24 && fnm use 24
```

### 2. Install wiqd CLI

```bash
# macOS / Linux
curl -fsSL https://aka.ms/wiqd/install.sh | bash

# Windows (PowerShell)
iex "& { $(irm 'https://aka.ms/wiqd/install.ps1') }"
```

Verify the installation:

```bash
wiqd --version
```

### 3. Install GitHub Copilot CLI

The GH Copilot prompt-based recipes (cookbooks 6–10) require the GitHub Copilot CLI extension:

```bash
# Install the GitHub CLI if you don't have it
brew install gh          # macOS
winget install GitHub.cli # Windows

# Install the Copilot CLI extension
gh extension install github/gh-copilot

# Verify it works
gh copilot --version
```

> The `copilot` command used in the recipes is an alias for `gh copilot`. If your shell doesn't have the alias, use `gh copilot` directly or create one:
> ```bash
> alias copilot="gh copilot"
> ```

> **Tip:** For best results with wiqd agent scaffolding, use **Opus 4.8** or **5.6 Terra** as your Copilot model. Change it with:
> ```bash
> gh copilot config set model opus-4.8
> ```
> To see all available models: `gh copilot config list-models`

### 4. Sign in to your Microsoft 365 account

You need a Microsoft 365 account with access to Copilot and an Azure subscription for provisioning agents.

### 5. Confirm everything is ready

```bash
wiqd doctor
```

This checks your environment for common issues (Node version, auth status, CLI version).

---

## Recipes

### Core workflow

1. [Zero to agent, live in Copilot](/cookbooks/zero-to-agent) — scaffold, provision, and open your first agent
2. [Give your agent real powers](/cookbooks/add-api-action) — add an API action with authentication
3. [Ship-safe: validate offline](/cookbooks/validate-offline) — catch issues before you provision
4. [Prove it's good: the evals loop](/cookbooks/evals-loop) — generate evals, run them, compare results
5. [Grounded answers from your org](/cookbooks/grounded-answers) — connect your agent to organizational knowledge

### Prompt-based agents (requires GitHub Copilot CLI)

6. [Translator agent](/cookbooks/translator-agent) — translate text into any language
7. [Photobooth agent](/cookbooks/photobooth-agent) — apply effects and create photobooth-style image composites
8. [Mind Your Language agent](/cookbooks/mind-your-language) — tone coach that rewrites passive-aggressive text
9. [Zava Insurance agent (MCP)](/cookbooks/zava-insurance) — connect to an MCP server for live insurance data
10. [Demo Planning agent](/cookbooks/demo-planning) — plan demos, workshops, hackathons, and presentations

**Rollout:** ship #1 first; pair #3 and #4 closely.

**Coming next:** distribute it with `wiqd agent share` or `wiqd agent publish`.
