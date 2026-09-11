# Ground a handbook agent in your SharePoint content

Build an agent that answers only from a SharePoint site or folder you are
authorized to use. The recipe scopes access to the URL you provide, requires
citations, and enables the platform control that discourages model knowledge.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Choose one SharePoint site, library, or folder that your signed-in account can
  read.
- Pick one fact that exists in the selected content and one question that the
  content cannot answer. You will use both as tests.
- Run from a parent directory where `handbook-guide` does not already exist.

## Build the grounded agent

Start one interactive Copilot session:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Create a declarative agent project named handbook-guide and make the generated
project root the current working directory. Call the agent Handbook Guide.
Before configuring grounding, ask me for the exact SharePoint site, library, or
folder URL that I am authorized to use.
```

When Copilot asks for the source, enter:

```text
Use this SharePoint URL and no other tenant content:
<paste your authorized SharePoint URL>

Scope the OneDriveAndSharePoint capability to that URL. Upgrade the declarative
agent schema if required, set discourage_model_knowledge to true, and instruct
the agent to cite the document it used. If the source is unavailable or does
not contain the answer, say so instead of guessing. Add conversation starters,
run static validation, and stop before provisioning.
```

**Checkpoint:** validation passes, the capability is scoped to exactly the URL
you supplied, and no tenant-specific URL is copied from this cookbook.

## Provision and test

Enter:

```text
Provision Handbook Guide to the dev environment and show me its Microsoft 365
Copilot launch URL.
```

Open the returned URL and test:

| Prompt | Expected behavior |
|---|---|
| Ask about the fact you selected before starting | Answers from the configured content and cites the source |
| Ask for the title or summary of a document in the scoped folder | Retrieves only from the supplied location |
| Ask the deliberately unanswerable question | States that the configured sources do not contain the answer |

**Checkpoint:** the agent cites accessible SharePoint content and refuses to
invent an answer when the content is silent.

## Clean up

Ask the same Copilot session to uninstall the dev environment, and approve the
destructive action only after it names the resources that will be removed.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/sharepoint-knowledge-agent" />

---

Return to the [cookbook index](../../README.md).
