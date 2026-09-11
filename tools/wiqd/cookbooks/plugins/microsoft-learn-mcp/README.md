# Microsoft Learn MCP connector: first Copilot Cowork plugin

Build, install, and test a plugin that searches and reads current Microsoft Learn documentation through the public Microsoft Learn MCP server as an agent connector.

The server at `https://learn.microsoft.com/api/mcp` is free, uses streamable HTTP, and does not require authentication. It currently exposes tools to search documentation, search code samples, and fetch complete documentation pages.

> [!NOTE]
> Markdown cannot execute commands directly. Start Copilot once, enter each prompt in the same session, and confirm its checkpoint before continuing.

## Before you start

You need:

- Node.js 24 or later
- `wiqd` v0.13.1 or later installed and signed in
- Access to Copilot Cowork
- Permission to provision and share an app in your Microsoft 365 development tenant

See [Getting started](../../README.md#getting-started) for installation and sign-in instructions.

### Step 1: Check the environment

Start the WIQD Copilot agent:

```bash
copilot --agent wiqd:wiqd
```

Enter this prompt:

```text
Check that my environment is ready to build and provision a plugin with WIQD. Confirm that Node.js is version 24 or later, WIQD is version 0.13.1 or later, I am signed in, and WIQD doctor reports no blocking errors. Help me fix any failed check before continuing.
```

**Checkpoint:** Copilot confirms that the environment is ready.

## Build the plugin

### Step 2: Create the plugin

Enter this prompt in the same Copilot session:

```text
Create a standalone plugin called Microsoft Learn Helper in a new microsoft-learn-helper directory, then make the generated plugin root the current working directory for this Copilot session.
```

**Checkpoint:** the current working directory is the generated plugin root and contains `wiqd.plugin.json`, `m365agents.yml`, and `appPackage/manifest.json`.

### Step 3: Add the no-auth connector

Enter this prompt in the same Copilot session:

```text
Add a connector named Microsoft Learn to this plugin using the public MCP endpoint https://learn.microsoft.com/api/mcp. Configure it with no authentication. Inspect the server's current tools and include an MCP tool-description file in the app package so the connector can be verified by Copilot Cowork. Its purpose is to search and read current official Microsoft documentation and code samples.
```

Review and approve the proposed file changes.

**Checkpoint:** `appPackage/manifest.json` contains a Microsoft Learn entry in `agentConnectors`, references a tool-description file in the app package, and has no authorization block.

### Step 4: Inspect and validate locally

Enter this prompt in the same Copilot session:

```text
Show me a summary of this plugin, then validate it locally with WIQD. If validation reports errors, explain and fix them before continuing.
```

**Checkpoint:** the plugin summary lists the Microsoft Learn connector and static validation completes successfully.

## Install the plugin in Copilot Cowork

### Step 5: Provision the plugin

Enter this prompt in the same Copilot session:

```text
Provision this Copilot Cowork plugin.
```

**Checkpoint:** WIQD reports that **Microsoft Learn Helper** was provisioned successfully.

## Test it in Copilot Cowork

1. Open Copilot Cowork.
2. Open the plugin UI and find the provisioned **Microsoft Learn Helper** plugin.
3. Install the plugin.
4. Start a new Copilot Cowork session with **Microsoft Learn Helper** enabled.
5. Run each prompt below and confirm that Cowork invokes the expected connector tool and returns content from Microsoft Learn.

| Prompt | Expected behavior |
|---|---|
| `Find the current Microsoft guidance for building a remote MCP server in TypeScript.` | Calls `microsoft_docs_search` and summarizes relevant official documentation with links. |
| `Show me a C# code sample for authenticating with DefaultAzureCredential.` | Calls `microsoft_code_sample_search` with C# as the language. |
| `Read this Learn page and summarize its prerequisites: <Microsoft Learn URL>` | Calls `microsoft_docs_fetch` for the supplied URL. |

## References

- [Build a plugin with WIQD](https://microsoft.github.io/wiqd/getting-started/build-a-plugin/)
- [WIQD plugin authoring reference](https://microsoft.github.io/wiqd/getting-started/plugin-reference/)
- [Microsoft Learn MCP Server overview](https://learn.microsoft.com/training/support/mcp)

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/plugins/microsoft-learn-mcp" />

---

Return to the [cookbook index](../../README.md).