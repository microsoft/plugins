---
title: Demo Planning agent
description: Build a declarative agent that helps plan demos, workshops, hackathons, presentations, and customer conversations.
draft: true
sidebar:
  order: 10
  badge:
    text: Draft
    variant: caution
---

Build a Copilot agent that helps users plan professional demos, workshops, hackathons, presentations, and customer conversations.

> **Aha:** describe your event and get a structured plan with timeline, talking points, and audience-tailored content — ready to present.

## Prerequisites

- wiqd installed and signed in
- permission to provision to a dev environment

## Steps

> **Tip:** Run `/clear` in Copilot Chat before starting to clear any previous session context.

### 1. Create a project folder

```
copilot -i "create a new folder called demo-planning and open it" --agent wiqd:wiqd
```

### 2. Scaffold the agent

```
copilot -i "create a new declarative agent called Demo Planner that helps users plan professional demos, workshops, hackathons, presentations, and customer conversations. The agent should ask about the audience, goals, time constraints, and format, then generate a structured plan with an agenda, talking points, demo scripts, and preparation checklists." --agent wiqd:wiqd
```

**Expected output:** a new agent project with manifest and instruction files.

### 3. Review the generated instructions

Open the generated instruction file and confirm it includes:

- Ask clarifying questions: audience, event type, duration, goals, and tech stack
- Generate a structured agenda with time allocations
- Provide talking points and transition scripts for each section
- Include a demo script with step-by-step actions and fallback plans
- Create a preparation checklist (environment setup, backup slides, test runs)
- Tailor tone and depth to the audience (technical vs. executive vs. mixed)
- Support follow-ups like "make it shorter" or "add a Q&A section"

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

1. Ask: **"I need to plan a 30-minute product demo for enterprise customers"**
   — agent asks about the product, audience role, and key goals, then returns a structured agenda.
2. Ask: **"Plan a 2-hour hackathon kickoff for 50 developers"**
   — agent generates a timeline with setup, intro, hacking blocks, and judging.
3. Follow up: **"Add a 10-minute Q&A at the end"**
   — agent updates the plan and adjusts time allocations.

## Next steps

- [Prove it's good: the evals loop →](/cookbooks/evals-loop)
- [Ship-safe: validate offline →](/cookbooks/validate-offline)
