# Build a Microsoft Learn connector

Build a standalone Copilot Cowork plugin that searches and reads current
Microsoft documentation through the public Microsoft Learn MCP server. The
server uses streamable HTTP, requires no authentication, and currently exposes
three tools:

- `microsoft_docs_search`
- `microsoft_code_sample_search`
- `microsoft_docs_fetch`

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Confirm that your tenant allows custom app upload and Copilot Cowork plugins.
- Run from a parent directory where `microsoft-learn-connector` does not already
  exist.

## Build the connector

Start one interactive Copilot session:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Create a standalone plugin named microsoft-learn-connector and make its project
root the current working directory.

Inspect https://learn.microsoft.com/api/mcp with MCP initialize and tools/list.
Save the exact tools/list result object in
appPackage/microsoft-learn-tools.json as {"tools":[...]}; preserve every tool
name, description, and input schema. Then use the supported Wiqd plugin add
connector command to add a connector named Microsoft Learn with no
authentication, that endpoint, and
--tool-description microsoft-learn-tools.json. Do not hand-edit
appPackage/manifest.json. Show the plugin summary and run static validation.
Stop before provisioning.
```

**Checkpoint:** `wiqd.plugin.json` lists `agentConnectors`,
`appPackage/microsoft-learn-tools.json` contains the three live tools, the
manifest references that file, and validation passes without the Cowork
"Could not verify connection" warning.

## Provision and package

Enter:

```text
Provision this plugin to the local environment. After provisioning succeeds,
package it, then run deep validation against the generated package. Stop if any
validation error remains and report any provider that was skipped.
```

**Checkpoint:** the plugin is provisioned before packaging, the package contains
the tool-description file, and feasible deep validation passes.

## Test in Copilot Cowork

Install the provisioned **Microsoft Learn Connector** in Copilot Cowork, enable
it for a new session, and try:

| Prompt | Expected tool |
|---|---|
| `Find the current Microsoft guidance for remote MCP servers.` | `microsoft_docs_search` |
| `Show a C# example that uses DefaultAzureCredential.` | `microsoft_code_sample_search` with `language` set to `csharp` |
| `Read this Learn page and list its prerequisites: <Microsoft Learn URL>` | `microsoft_docs_fetch` |

**Checkpoint:** each answer is grounded in current official documentation and
includes the source URL.

## References

- [Microsoft Learn MCP Server](https://learn.microsoft.com/training/support/mcp)
- [Register MCP servers as agent connectors](https://learn.microsoft.com/microsoftteams/platform/m365-apps/agent-connectors)
- [Wiqd plugin authoring](https://microsoft.github.io/wiqd/getting-started/build-a-plugin/)

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/plugins/microsoft-learn-mcp" />

---

Return to the [cookbook index](../../README.md).
