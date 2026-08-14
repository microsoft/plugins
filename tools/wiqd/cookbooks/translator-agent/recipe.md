---
title: Translator agent
description: Build a declarative agent that translates text into any language using scripted instructions.
draft: true
sidebar:
  order: 6
  badge:
    text: Draft
    variant: caution
---

Build a Copilot agent that translates user input into any requested language.

> **Aha:** a single agent handles every language — no per-locale config needed.

## Prerequisites

- wiqd installed and signed in
- permission to provision to a dev environment

## Steps

> **Tip:** Run `/clear` in Copilot Chat before starting to clear any previous session context.

### 1. Create a project folder

```
copilot -i "create a new folder called translator-agent and open it" --agent wiqd:wiqd
```

### 2. Scaffold the agent

```
copilot -i "create a new declarative agent called Translator that translates text into any language the user requests. The agent should ask for the target language if not specified, preserve formatting, and return only the translated text without explanation." --agent wiqd:wiqd
```

**Expected output:** a new agent project with manifest and instruction files.

### 3. Review the generated instructions

Open the generated instruction file and confirm it includes:

- Detect the target language from the user's prompt
- If no target language is specified, ask the user which language they want
- Translate the input text faithfully, preserving tone and formatting
- Return only the translated text — no preamble or explanation
- Support follow-up requests like "now in French" to re-translate

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

1. Ask: **"Translate 'Good morning, how are you?' to Japanese"**
   — agent replies with the Japanese translation only.
2. Follow up: **"Now in Spanish"**
   — agent translates the same text to Spanish.
3. Ask without specifying a language: **"Translate 'Hello world'"**
   — agent asks which language you want.

## Next steps

- [Prove it's good: the evals loop →](/cookbooks/evals-loop)
- [Ship-safe: validate offline →](/cookbooks/validate-offline)
