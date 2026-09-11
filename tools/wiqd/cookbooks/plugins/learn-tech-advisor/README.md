# Compose a Learn technology advisor

Build one standalone plugin from three Wiqd components:

1. A public Microsoft Learn MCP connector
2. A reusable Technology Finder skill
3. A declarative agent that applies the skill

The result does more than search documentation: it asks for constraints,
retrieves current evidence, compares viable options, and recommends a path.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Run from a parent directory where `learn-tech-advisor` does not already exist.
- No MCP credentials are required.

## Compose the plugin

Start one interactive Copilot session:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Create a standalone plugin named learn-tech-advisor and make its project root
the current working directory.

Inspect https://learn.microsoft.com/api/mcp with MCP initialize and tools/list.
Save the exact result object as appPackage/microsoft-learn-tools.json with the
shape {"tools":[...]}. Add the Microsoft Learn connector with no authentication
and pass that relative file through --tool-description. Then add a skill named
Technology Finder and add a declarative agent component, using the supported
Wiqd plugin add commands for all three capabilities.

Replace the generated skill template with a reusable decision workflow:
- Ask for the user's goal, preferred language or platform, and hard constraints.
- Search official documentation before comparing options.
- Search official code samples when implementation detail is requested.
- Fetch the most relevant pages before giving a final recommendation.
- Compare two or three viable options in a concise table.
- Separate sourced facts from the recommendation and link every source.
- Say when official documentation does not support a claim.

Configure the declarative agent to invoke that skill for technology-selection
questions. Add conversation starters, show the plugin summary, run static
validation, and stop before provisioning.
```

**Checkpoint:** the plugin summary lists `agentConnectors`, `agentSkills`, and
`declarativeAgent`; the skill is no longer a template; and validation passes.

## Provision and test

Enter:

```text
Provision Learn Tech Advisor locally. Then package it and deep-validate the
generated package. Show me any skipped provider instead of treating a skip as a
pass.
```

Enable the plugin in Copilot Cowork and try:

| Prompt | Expected behavior |
|---|---|
| `Should I use Azure Functions or Container Apps for a small event-driven API?` | Asks for missing constraints, retrieves current docs, compares options, and recommends one |
| `Show the current TypeScript approach for DefaultAzureCredential.` | Uses code-sample search and links the official source |
| `What evidence supports that recommendation?` | Fetches the strongest pages and separates evidence from judgment |

**Checkpoint:** the response follows the skill workflow rather than returning a
raw list of search results.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/plugins/learn-tech-advisor" />

---

Return to the [cookbook index](../../README.md).
