# Microsoft Learn Helper

Microsoft Learn Helper is a Microsoft 365 Copilot plugin that searches and
reads current official Microsoft documentation and code samples.

The plugin connects to the public
[Microsoft Learn MCP server](https://learn.microsoft.com/api/mcp). The
connector is read-only and does not require an API key or user sign-in.

## What this sample demonstrates

- Adding a remote MCP server as an agent connector
- Describing MCP tools for Microsoft 365 Copilot
- Searching current Microsoft documentation
- Fetching complete documentation pages for additional context
- Finding official code samples by language
- Packaging and provisioning a connector plugin

## Try the plugin

### Prerequisites

You need:

- Access to Microsoft 365 Copilot Cowork
- Permission to upload a custom plugin in your tenant
- Copilot Credits for testing in Cowork

### 1. Upload the package

Use the prebuilt [`package.zip`](package.zip), or build a package from the
source files in [`appPackage/`](appPackage/).

In Microsoft 365 Copilot Cowork:

1. Open the plugin inventory.
2. Select the option to upload a custom plugin.
3. Upload `package.zip`.
4. Find **Microsoft Learn Helper** and enable it for the current Cowork
   session.

The connector uses anonymous access, so Cowork should not ask you to sign in.

### 2. Test the connector

Try prompts such as:

```text
Find the current Microsoft documentation for building a declarative agent.
Summarize the prerequisites and cite the source.
```

```text
Find an official TypeScript code sample for authenticating with Microsoft
Graph. Explain the sample and link to its source.
```

```text
Search Microsoft Learn for the latest Azure Functions Node.js guidance, then
read the most relevant page and summarize its recommendations.
```

## Available tools

| Tool | Purpose |
|------|---------|
| `microsoft_docs_search` | Searches official Microsoft documentation and returns relevant excerpts and source URLs |
| `microsoft_docs_fetch` | Fetches the complete content of a Microsoft documentation page |
| `microsoft_code_sample_search` | Finds current code samples in official Microsoft documentation, optionally filtered by language |

## Project structure

| File or folder | Purpose |
|----------------|---------|
| [`appPackage/manifest.json`](appPackage/manifest.json) | Defines the Microsoft Learn remote MCP connector |
| [`appPackage/microsoft-learn-mcp-tools.json`](appPackage/microsoft-learn-mcp-tools.json) | Describes the MCP tools exposed to Copilot |
| [`wiqd.plugin.json`](wiqd.plugin.json) | Identifies the project as a WIQD plugin with an agent connector |
| [`m365agents.yml`](m365agents.yml) | Defines provisioning, validation, packaging, and publishing actions |
| [`m365agents.local.yml`](m365agents.local.yml) | Defines the local provisioning workflow |

## Develop the sample

This project includes Microsoft 365 Agents Toolkit lifecycle files. Open the
project in VS Code with Microsoft 365 Agents Toolkit, then use its lifecycle
commands to provision, package, validate, and publish the plugin to your
development environment.

You can also inspect and modify the plugin with
[WIQD](https://microsoft.github.io/wiqd/). See the
[Microsoft Learn MCP connector cookbook](../../../tools/wiqd/cookbooks/plugins/microsoft-learn-mcp/README.md)
for a guided, end-to-end build of this sample.

## Important

This sample is for learning and demonstration purposes. Review the manifest,
developer information, descriptions, icons, and tenant policies before sharing
or publishing a derived plugin.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/samples/plugins/microsoft-learn-plugin" />
