# Upgrade the Learn connector into a technology advisor

Turn the existing Microsoft Learn connector plugin into a composite,
independently shippable plugin by adding reusable decision logic and a
declarative-agent experience. This lab starts after connector setup so it does
not repeat endpoint discovery or tool-description authoring.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Complete [Microsoft Learn MCP connector](../microsoft-learn-mcp/README.md), or
  start from a validated copy of that plugin.
- Confirm that `appPackage/manifest.json` already contains the Microsoft Learn
  connector and its MCP tool-description file.

## Add the reusable skill and agent

Start one interactive Copilot session from the connector plugin root:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Upgrade this existing Microsoft Learn connector plugin into a technology
advisor. Do not recreate or alter the connector endpoint. Use the supported
WIQD plugin add commands to add a skill named Technology Finder and a
declarative agent component.

Replace the generated skill template with a reusable decision workflow:
- Ask for the user's goal, preferred language or platform, and hard constraints.
- Search official documentation before comparing options.
- Search official code samples when implementation detail is requested.
- Fetch the most relevant pages before giving a final recommendation.
- Compare two or three viable options in a concise table.
- Separate sourced facts from the recommendation and link every source.
- Say when official documentation does not support a claim.

Configure the declarative agent to invoke the skill for technology-selection
questions. Add conversation starters, show the plugin summary, run static
validation, and stop before provisioning.
```

**Checkpoint:** the existing connector remains unchanged, the plugin summary
now lists `agentConnectors`, `agentSkills`, and `declarativeAgent`, the skill is
no longer a template, and validation passes.

## Deploy the composite update

Enter:

```text
Provision or re-provision this composite plugin locally. Then package it and
deep-validate the generated package. Show me any skipped provider instead of
treating a skip as a pass.
```

Enable the updated plugin in Copilot Cowork and try:

| Prompt | Expected behavior |
|---|---|
| `Should I use Azure Functions or Container Apps for a small event-driven API?` | Asks for missing constraints, retrieves current docs, compares options, and recommends one |
| `Show the current TypeScript approach for DefaultAzureCredential.` | Uses code-sample search and links the official source |
| `What evidence supports that recommendation?` | Fetches the strongest pages and separates evidence from judgment |

**Checkpoint:** the reusable skill turns connector results into a repeatable
decision workflow rather than another raw documentation search.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/plugins/learn-tech-advisor" />

---

Return to the [cookbook index](../../README.md).
