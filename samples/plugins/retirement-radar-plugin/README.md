# Retirement Radar for Copilot Cowork

Retirement Radar helps you find retired and deprecated Microsoft technology before an old script fails in production.

Give Copilot Cowork a script, configuration file, package list, or architecture note. Retirement Radar checks every Microsoft API, SDK, PowerShell module, endpoint, and service it finds against live Microsoft Learn documentation, then returns:

- A clear supported, deprecated, or retired verdict
- Official retirement dates and Microsoft Learn sources
- Supported replacements
- Updated code based on official samples
- A prioritized migration checklist

## Try the plugin

### Prerequisites

You need:

- Access to **Microsoft 365 Copilot Cowork**
- Copilot Credits for testing in Cowork

The plugin uses the public, read-only [Microsoft Learn MCP server](https://learn.microsoft.com/api/mcp). It does not require an API key or a connector sign-in.

### 1. Get the plugin package

Use the prebuilt package:

```text
appPackage.dev.zip
```

The ZIP must contain `manifest.json`, `mcp-tools.json`, the icons, and `skills/` at its root. Do not zip the `appPackage` folder itself.

### 2. Upload and enable it in Cowork

1. Open **Microsoft 365 Copilot Cowork**.
2. Open the plugin inventory.
3. Select the option to upload a custom plugin.
4. Upload `appPackage.dev.zip`.
5. Find **Retirement Radar** and enable it for the current Cowork session.

The plugin should show:

- The **Retirement Radar** skill
- The **Microsoft Learn** connector

The connector uses anonymous access, so Cowork should not ask you to sign in.

### 3. Run the demo

Open [`demo/legacy-admin-script copy.txt`](demo/legacy-admin-script%20copy.txt), copy the complete script, and paste it into Cowork with this prompt:

> Is this still safe to run tonight? Check it for retired Microsoft APIs.

Retirement Radar should:

1. Inventory the Microsoft technologies in the script.
2. Check each one against current Microsoft Learn content.
3. Classify each finding as **Broken now**, **Breaking soon**, **Deprecated**, or **OK**.
4. Cite an official source for every dated claim.
5. Recommend supported replacements.

The demo includes intentionally old technology such as:

- MSOnline and AzureAD PowerShell
- Azure AD Graph (`graph.windows.net`)
- AzureRM PowerShell
- Office 365 connectors in Teams

Because Retirement Radar checks Microsoft Learn at runtime, its wording and findings can change as Microsoft updates the documentation.

### 4. Ask for the migration

Continue in the same Cowork session:

> Rewrite the whole script with the supported replacements.

The plugin uses Microsoft Learn code samples to produce an updated PowerShell script while preserving the intent and variable names where possible.

## More prompts to try

Retirement Radar can inspect more than PowerShell. Try it with application code, dependency files, infrastructure definitions, or architecture notes:

```text
Check this project for deprecated Microsoft SDKs and APIs. Cite an official source for every finding.
```

```text
Which dependencies in this package file need migration within the next 12 months?
```

```text
This integration started returning 403 errors. Check whether any Microsoft endpoint or authentication library in it has been retired.
```

```text
Create a prioritized migration plan, then rewrite only the broken parts.
```

Do not paste live secrets, access tokens, connection strings, or production webhook URLs into the chat. Replace them with redacted values first.

## What is in the plugin

```text

appPackage/
├── manifest.json
├── mcp-tools.json
├── color.png
├── outline.png
└── skills/
    └── retirement-radar/
        ├── SKILL.md
        └── references/
            └── report-template.md

```

Retirement Radar is a standard Microsoft 365 app package for Copilot Cowork:

| Component | Purpose |
|---|---|
| `agentSkills[0]` | Registers the `retirement-radar` workflow from `skills/retirement-radar/SKILL.md` |
| `agentConnectors[0]` | Connects Cowork to the remote Microsoft Learn MCP server |
| `mcp-tools.json` | Describes the Microsoft Learn tools exposed to the skill |

There is no declarative agent or hosted backend in this package. The skill contains the workflow, and the connector provides live Microsoft Learn search, page retrieval, and code-sample tools.

## Troubleshooting

### The plugin does not appear in Cowork

- Confirm that `appPackage.dev.zip` uploaded successfully.
- Reopen the plugin inventory after the upload completes.
- Check that the plugin is installed and enabled for the current session.

### The package upload fails

- Open the ZIP and confirm `manifest.json` is at the root.
- Confirm `skills/retirement-radar/SKILL.md` exists with that exact capitalization.
- Confirm the ZIP contains `mcp-tools.json`, `color.png`, and `outline.png`.
- Do not place a parent `appPackage/` directory inside the ZIP.

### The skill does not activate

Use an explicit prompt containing phrases such as **retired**, **deprecated**, **still supported**, or **check Microsoft dependencies**. Also confirm that Retirement Radar is enabled in the Cowork session.

### Microsoft Learn results are unavailable

The skill depends on `https://learn.microsoft.com/api/mcp`. Confirm that your organization allows Cowork to reach that HTTPS endpoint.

## Learn more

- [Copilot Camp: Build your first Copilot Cowork plugin](https://microsoft.github.io/copilot-camp/pages/copilot-cowork/02-cowork-plugins/)

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/samples/plugins/retirement-radar-plugin" />
