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

## Recipes

| # | Recipe | Type | What it does |
|---|--------|------|--------------|
| 1 | [Zero to agent, live in Copilot](./declarative-agents/zero-to-agent/README.md) | Declarative agent | Scaffold, provision, and open your first agent |
| 2 | [Translator agent](./declarative-agents/translator-agent/README.md) | Declarative agent | Translate text into any language |
| 3 | [Photobooth agent](./declarative-agents/photobooth-agent/README.md) | Declarative agent | Apply effects and create photobooth-style image composites |
| 4 | [Mind Your Language agent](./declarative-agents/mind-your-language-agent/README.md) | Declarative agent | Tone coach that rewrites passive-aggressive text |
| 5 | [Zava Insurance agent (MCP)](./declarative-agents/insurance-agent-mcp/README.md) | Declarative agent | Connect to an MCP server for live insurance data |
| 6 | [Demo Planning agent](./declarative-agents/demo-planning-agent/README.md) | Declarative agent | Plan demos, workshops, hackathons, and presentations |
| 7 | [Microsoft Learn MCP connector](./plugins/microsoft-learn-mcp/README.md) | Plugin | Create and test a first Cowork plugin with a public, no-auth MCP connector |

## New highlight recipes

These seven additions focus on capabilities that the original catalog does not
cover. Several intentionally begin with an existing agent or plugin so they
teach the new workflow instead of repeating scaffolding.

| # | Recipe | Type | What it adds |
|---|--------|------|--------------|
| 1 | [Ground an existing agent in your SharePoint content](./declarative-agents/sharepoint-knowledge-agent/README.md) | Declarative agent | User-owned organizational grounding, citations, and grounded-only answers |
| 2 | [Build a public web research agent](./declarative-agents/public-web-research-agent/README.md) | Declarative agent | Site-scoped research over current public sources |
| 3 | [Upgrade the Learn connector into a technology advisor](./plugins/learn-tech-advisor/README.md) | Composite plugin | Reusable skill + declarative agent layered onto the existing connector |
| 4 | [Hill-climb agent quality with evals](./lifecycle/eval-hill-climb/README.md) | Quality workflow | Measure, diagnose, fix, and compare without weakening tests |
| 5 | [Debug an agent in DevUI](./lifecycle/devui-debugging/README.md) | Debug workflow | Inspect tool selection, execution, grounding, citations, and failures |
| 6 | [Deliver an agent to a team](./lifecycle/team-delivery/README.md) | Delivery workflow | Shared scope, package validation, and targeted sharing |
| 7 | [Round-trip a plugin across formats](./plugins/plugin-portability/README.md) | Plugin lifecycle | Export and re-import Open Plugin, Claude, or Cursor formats |

## Validate the cookbook catalog

From the repository root:

```bash
node tools/wiqd/cookbooks/validate.mjs
```

The check verifies that every original recipe remains present, all seven new
highlights are indexed, relative links resolve, and no new recipe contains a
private tenant URL or concrete email address.

> All recipes use GitHub Copilot CLI prompts (`--agent wiqd:wiqd`) and `wiqd` CLI commands.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd" />
