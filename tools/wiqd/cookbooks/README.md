wiqd cookbooks are short, end-to-end recipes built around one clear outcome:
**build it → make it do something → make it safe → make it good → make it grounded.**

## Getting started

Before running any cookbook, make sure you have these installed and configured:

### 1. Install Node.js 24+

wiqd requires Node.js 24 or later. Install via your preferred method:

```bash
# macOS / Linux (via nvm)
nvm install 24 && nvm use 24

# Windows (via fnm)
fnm install 24 && fnm use 24
```

### 2. Install wiqd CLI

```bash
# macOS / Linux
curl -fsSL https://aka.ms/wiqd/install.sh | bash

# Windows (PowerShell)
iex "& { $(irm 'https://aka.ms/wiqd/install.ps1') }"
```

Verify the installation:

```bash
wiqd --version
```

### 3. Install GitHub Copilot CLI

The recipes require the standalone [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli):

```bash
# Install on any platform with Node.js 22 or later
npm install -g @github/copilot

# Verify that the standalone CLI supports custom agents
copilot --help
```

Confirm that the help output includes the `--agent` option before continuing. If it does not, check which executable your shell resolves for `copilot`, then reinstall the standalone CLI.

### 4. Sign in to your Microsoft 365 account

You need a Microsoft 365 account with access to Copilot and an Azure subscription for provisioning declarative agents. Start an interactive sign-in:

```bash
wiqd auth login --interactive
```

On macOS and Linux, this normally opens your system browser. Sign in with the work or school account for the tenant where you want to provision the agent, then complete any consent or multi-factor authentication prompts. `wiqd` delegates authentication to its installed providers, so you may see more than one provider reported in the terminal.

Confirm that the intended account is signed in:

```bash
wiqd auth status
```

If the status shows an account from the wrong tenant, sign out and repeat the interactive login, choosing the correct account in the browser:

```bash
wiqd auth logout
wiqd auth login --interactive
```

See the [wiqd authentication guide](https://microsoft.github.io/wiqd/getting-started/authentication/) for provider details and troubleshooting.

### 5. Confirm everything is ready

```bash
wiqd doctor
```

This checks your environment for common issues (Node version, auth status, CLI version).

---

## Start with a guided recipe

New to wiqd? Begin with one of these self-contained recipes. Each takes you
from setup to a working solution and shows you how to test its core behavior.
You can use the resulting project as a starting point for the extension and
lifecycle recipes in the next section.

| Recipe | Type | What you'll build |
|--------|------|-------------------|
| [Zero to agent, live in Copilot](./declarative-agents/zero-to-agent/README.md) | Declarative agent | Scaffold, provision, and open your first agent |
| [Translator agent](./declarative-agents/translator-agent/README.md) | Declarative agent | Translate text into any language |
| [Photobooth agent](./declarative-agents/photobooth-agent/README.md) | Declarative agent | Apply effects and create photobooth-style image composites |
| [Mind Your Language agent](./declarative-agents/mind-your-language-agent/README.md) | Declarative agent | Coach tone and rewrite passive-aggressive text |
| [Zava Insurance agent (MCP)](./declarative-agents/insurance-agent-mcp/README.md) | Declarative agent | Connect an agent to an MCP server for live insurance data |
| [Demo Planning agent](./declarative-agents/demo-planning-agent/README.md) | Declarative agent | Plan demos, workshops, hackathons, and presentations |
| [Microsoft Learn MCP connector](./plugins/microsoft-learn-mcp/README.md) | Plugin | Create and test a plugin with a public, no-auth MCP connector |

## Extend and improve your solution

Use these recipes to add capabilities or work on a later stage of the solution
lifecycle. Some build on a specific guided recipe, while others work with any
existing agent or plugin. Check **Start with** before you begin.

| Recipe | Focus | Start with | What you'll learn |
|--------|-------|------------|-------------------|
| [Ground an existing agent in your SharePoint content](./declarative-agents/sharepoint-knowledge-agent/README.md) | Grounding | An existing declarative agent, such as [Zero to agent](./declarative-agents/zero-to-agent/README.md) | Scope organizational knowledge, require grounded answers, and verify citations |
| [Build a public web research agent](./declarative-agents/public-web-research-agent/README.md) | Research | An existing declarative agent | Scope research to approved public sites and produce source-backed answers |
| [Upgrade the Learn connector into a technology advisor](./plugins/learn-tech-advisor/README.md) | Composition | [Microsoft Learn MCP connector](./plugins/microsoft-learn-mcp/README.md) | Combine a reusable plugin skill with a declarative agent |
| [Hill-climb agent quality with evals](./lifecycle/eval-hill-climb/README.md) | Evaluation | An existing working agent | Measure quality, diagnose failures, improve behavior, and compare results |
| [Debug an agent in DevUI](./lifecycle/devui-debugging/README.md) | Debugging | An existing agent with a test scenario | Inspect tool selection, execution, grounding, citations, and failures |
| [Deliver an agent to a team](./lifecycle/team-delivery/README.md) | Delivery | A validated agent | Validate a package, configure shared scope, and target distribution |
| [Round-trip a plugin across formats](./plugins/plugin-portability/README.md) | Portability | An existing plugin | Export and re-import Agent Plugin, Claude, and Cursor formats |

> All recipes use GitHub Copilot CLI prompts (`--agent wiqd:wiqd`) and `wiqd` CLI commands.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd" />
