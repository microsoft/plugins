---
title: Zava Insurance agent with MCP action
description: Build a declarative agent powered by an MCP server action for insurance queries.
draft: true
sidebar:
  order: 9
  badge:
    text: Draft
    variant: caution
---

Build a Copilot agent that connects to the Zava Insurance MCP server to handle insurance-related queries and actions.

> **Aha:** wire up an MCP server and your agent can look up policies, file claims, and answer coverage questions — live data, no mocks.

## Prerequisites

- wiqd installed and signed in
- permission to provision to a dev environment
- access to the Zava Insurance MCP endpoint

## Steps

> **Tip:** Run `/clear` in Copilot Chat before starting to clear any previous session context.

### 1. Create a project folder

```
copilot -i "create a new folder called zava-insurance"
```

```
/cwd zava-insurance
```

### 2. Scaffold the agent

```
copilot -i "create a new declarative agent called Zava Insurance that helps users with insurance queries like policy lookups, coverage questions, and claims status." --agent wiqd:wiqd
```

**Expected output:** a new agent project with manifest and instruction files.

### 3. Add the MCP server action

```
copilot -i "add an MCP server action to the Zava Insurance agent using the endpoint https://zava-insurance-mcp.azurewebsites.net/mcp" --agent wiqd:wiqd
```

**Expected output:** the agent manifest is updated with the MCP server action configuration pointing to the Zava Insurance endpoint.

### 4. Review the generated configuration

Verify the agent manifest includes:

- MCP server URL: `https://zava-insurance-mcp.azurewebsites.net/mcp`
- Action type set to MCP
- The agent instructions reference the available MCP tools for policy lookup, claims, and coverage

### 5. Provision to dev

```bash
wiqd agent provision --env dev
```

**Expected output:** a share link like `https://m365.cloud.microsoft/chat/?titleId=…`

### 6. Open it in Copilot

```bash
wiqd agent open
```

## Verify

1. Ask: **"What's the status of policy #12345?"**
   — agent calls the MCP server and returns policy details.
2. Ask: **"Does my plan cover dental?"**
   — agent queries coverage information via the MCP endpoint.
3. Ask: **"I need to file a claim for water damage"**
   — agent initiates a claim flow using the MCP server tools.

## Next steps

- [Ship-safe: validate offline →](/cookbooks/validate-offline)
- [Prove it's good: the evals loop →](/cookbooks/evals-loop)
