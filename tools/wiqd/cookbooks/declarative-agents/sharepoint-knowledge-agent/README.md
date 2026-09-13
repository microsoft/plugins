# Ground an existing agent in your SharePoint content

Upgrade an existing declarative agent so it answers only from a SharePoint site
or folder you are authorized to use. This lab focuses on source scoping,
citations, and grounded-only behavior instead of repeating project scaffolding.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Start in an existing, statically validated declarative-agent project. The
  [Zero to agent](../zero-to-agent/README.md) project is sufficient.
- Choose one SharePoint site, library, or folder that your signed-in account can
  read.
- Pick one fact that exists in the selected content and one question that the
  content cannot answer.

## Add organizational grounding

Start one interactive Copilot session from the existing agent project root:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
I want to ground this existing agent in one SharePoint source. Inspect the
current manifest and instructions, then ask me for the exact SharePoint site,
library, or folder URL that I am authorized to use. Do not change the project
until I provide it.
```

When Copilot asks for the source, enter:

```text
Use this SharePoint URL and no other tenant content:
<paste your authorized SharePoint URL>

Scope the OneDriveAndSharePoint capability to exactly that URL. Preserve the
agent's existing purpose, upgrade the declarative-agent schema only if required,
set discourage_model_knowledge to true, and update the instructions and
conversation starters so answers cite the document used. If the source is
unavailable or does not contain the answer, say so instead of guessing. Run
static validation and stop before provisioning.
```

**Checkpoint:** validation passes, the existing agent retains its original
purpose, and its new grounding scope contains only the URL you supplied.

## Deploy the update

Enter:

```text
Provision the updated agent to its existing development environment and show me
the Microsoft 365 Copilot launch URL.
```

Open the returned URL and test:

| Prompt | Expected behavior |
|---|---|
| Ask about the fact selected before starting | Answers from the configured content and cites the source |
| Ask for the title or summary of a document in the scoped folder | Retrieves only from the supplied location |
| Ask the deliberately unanswerable question | States that the configured source does not contain the answer |

**Checkpoint:** the added organizational grounding is observable without
turning the recipe into another first-agent walkthrough.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/sharepoint-knowledge-agent" />

---

Return to the [cookbook index](../../README.md).
