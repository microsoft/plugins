---
title: Mind Your Language agent
description: Build a tone-coaching agent that rewrites passive-aggressive or unkind text into kinder alternatives.
draft: true
sidebar:
  order: 8
  badge:
    text: Draft
    variant: caution
---

Build a Copilot agent that coaches users toward kinder communication by detecting passive-aggressive or harsh tone and suggesting gentler rewrites.

> **Aha:** paste a draft message and get a kinder version back instantly — no more accidental snark in Slack.

## Prerequisites

- wiqd installed and signed in
- permission to provision to a dev environment

## Steps

> **Tip:** Run `/clear` in Copilot Chat before starting to clear any previous session context.

### 1. Create a project folder

```
copilot -i "create a new folder called mind-your-language"
```

```
/cwd mind-your-language

```
copilot -i "create a new declarative agent called Mind Your Language that acts as a tone coach. When a user pastes text, the agent should detect passive-aggressive, sarcastic, or unkind phrasing and rewrite it in a kinder, more constructive tone. It should explain what was changed and why, and offer alternative phrasings ranked from most direct to most gentle." --agent wiqd:wiqd
```

**Expected output:** a new agent project with manifest and instruction files.

### 3. Review the generated instructions

Open the generated instruction file and confirm it includes:

- Analyze pasted text for passive-aggressive, sarcastic, or harsh tone
- Highlight specific phrases that could land poorly
- Provide a rewritten version that preserves the original intent but is kinder
- Explain briefly why each change improves tone
- Offer 2–3 alternative phrasings ranked from direct to gentle
- If the text is already kind, confirm it and suggest no changes

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

1. Paste: **"Per my last email, I already explained this."**
   — agent flags "per my last email" as passive-aggressive and offers kinder rewrites.
2. Paste: **"Great job finishing that a week late."**
   — agent detects sarcasm and suggests a constructive alternative.
3. Paste: **"Thanks for your help today!"**
   — agent confirms the tone is positive and suggests no changes.

## Next steps

- [Prove it's good: the evals loop →](/cookbooks/evals-loop)
- [Ship-safe: validate offline →](/cookbooks/validate-offline)
