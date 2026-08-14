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

| # | Recipe | What it does |
|---|--------|--------------|
| 1 | [Zero to agent, live in Copilot](./zero-to-agent/README.md) | Scaffold, provision, and open your first agent |
| 2 | [Translator agent](./translator-agent/README.md) | Translate text into any language |
| 3 | [Photobooth agent](./photobooth-agent/README.md) | Apply effects and create photobooth-style image composites |
| 4 | [Mind Your Language agent](./mind-your-language/README.md) | Tone coach that rewrites passive-aggressive text |
| 5 | [Zava Insurance agent (MCP)](./zava-insurance/README.md) | Connect to an MCP server for live insurance data |
| 6 | [Demo Planning agent](./demo-planning/README.md) | Plan demos, workshops, hackathons, and presentations |

> All recipes use GitHub Copilot CLI prompts (`--agent wiqd:wiqd`) and `wiqd` CLI commands.

