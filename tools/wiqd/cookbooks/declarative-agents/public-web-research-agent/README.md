# Build a public web research agent

Create a research agent grounded in two public, authoritative sources:
Microsoft Learn and Microsoft-owned GitHub repositories. This demonstrates
site-scoped web grounding without private tenant content.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Run from a parent directory where `microsoft-tech-radar` does not already
  exist.

## Build and validate

Start one interactive Copilot session:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Create a declarative agent project named microsoft-tech-radar and make the
generated project root the current working directory. Call the agent Microsoft
Tech Radar. Add WebSearch grounded only in these sites:
- https://learn.microsoft.com/
- https://github.com/microsoft/

Instruct it to prefer current official documentation, cite every factual
recommendation, distinguish documented facts from its recommendation, and state
when it cannot find current evidence. Add conversation starters for feature
research, migration research, and repository discovery. Run static validation
and stop before provisioning.
```

**Checkpoint:** validation passes and the WebSearch capability contains only
the two public source scopes.

## Provision and test

Enter:

```text
Provision Microsoft Tech Radar to the dev environment and show me its Microsoft
365 Copilot launch URL.
```

Open the returned URL and try:

| Prompt | Expected behavior |
|---|---|
| `What is the current guidance for connecting an MCP server to Microsoft 365 Copilot?` | Uses current Microsoft Learn pages and cites them |
| `Find a Microsoft-owned GitHub repository related to declarative agents.` | Uses the scoped GitHub source and links the repository |
| `Recommend an approach and separate the facts from your recommendation.` | Labels sourced facts and its recommendation distinctly |

**Checkpoint:** answers contain links from the configured public sources rather
than unsupported claims.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/public-web-research-agent" />

---

Return to the [cookbook index](../../README.md).
