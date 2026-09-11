# Wiqd cookbooks

These ten short labs showcase distinct Wiqd capabilities through scenarios that
can be reproduced with public services or data you control. Each lab uses one
continuous GitHub Copilot CLI session, explicit checkpoints, and supported Wiqd
commands. No recipe requires hardcoded secrets, tenant identifiers, personal
addresses, or hand-edited plugin manifests.

The recipes were verified with Wiqd 0.14.0.

## Getting started

### 1. Install Node.js 24 or later

Use your preferred version manager:

```bash
# macOS or Linux with nvm
nvm install 24
nvm use 24
```

```powershell
# Windows with fnm
fnm install 24
fnm use 24
```

### 2. Install or update Wiqd

```bash
# macOS or Linux
curl -fsSL https://aka.ms/wiqd/install.sh | bash
```

```powershell
# Windows
iex "& { $(irm 'https://aka.ms/wiqd/install.ps1') }"
```

Confirm that Wiqd 0.14.0 or later is installed:

```bash
wiqd --version --skill wiqd --workflow atk
wiqd update --check --json --skill wiqd --workflow atk
```

### 3. Install GitHub Copilot CLI

Install the standalone
[GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli):

```bash
npm install -g @github/copilot
copilot --help
```

Confirm that `copilot --help` includes the `--agent` option.

### 4. Sign in when a recipe provisions or tests in Microsoft 365

Local scaffolding and static validation do not require tenant access.
Provisioning, sharing, DevUI, and live evals require a Microsoft 365 account
with the necessary Copilot and app-upload permissions.

```bash
wiqd auth login --interactive --skill wiqd --workflow atk
wiqd auth status --json --skill wiqd --workflow atk
wiqd doctor --json --skill wiqd --workflow atk
```

## Conventions

- Run each recipe from a parent directory where its target project folder does
  not already exist.
- Start Copilot once with `copilot --agent wiqd:wiqd`, then enter every recipe
  prompt in that same session.
- When a recipe asks for a SharePoint URL or email address, provide a resource
  you own or are authorized to use. Never paste the angle-bracket placeholder
  literally.
- Wiqd creates manifests through `agent create`, `agent add action`, and
  `plugin create/add`; the recipes do not ask you to fabricate plugin manifests.
- Consequential MCP operations must be summarized and confirmed in a separate
  user turn before the tool is called.
- Deployment order is deliberate: validate, provision, package, deep-validate,
  then share.

## Recipes

| # | Recipe | Type | Highlight |
|---|--------|------|-----------|
| 1 | [First agent, live in Copilot](./declarative-agents/zero-to-agent/README.md) | Declarative agent | Create, validate, provision, and open a first agent |
| 2 | [Ground a handbook agent in your SharePoint content](./declarative-agents/sharepoint-knowledge-agent/README.md) | Declarative agent | User-owned grounding, citations, and grounded-only answers |
| 3 | [Build a public web research agent](./declarative-agents/public-web-research-agent/README.md) | Declarative agent | Site-scoped web grounding over public sources |
| 4 | [Operate on live Zava claims through MCP](./declarative-agents/zava-claims-agent/README.md) | Declarative agent + MCP | Live reads and explicit confirmation before writes |
| 5 | [Build a Microsoft Learn connector](./plugins/microsoft-learn-mcp/README.md) | Standalone plugin | Public no-auth MCP connector with pinned tool descriptions |
| 6 | [Compose a Learn technology advisor](./plugins/learn-tech-advisor/README.md) | Composite plugin | Connector + reusable skill + declarative agent |
| 7 | [Hill-climb agent quality with evals](./lifecycle/eval-hill-climb/README.md) | Quality workflow | Generate, run, diagnose, fix, and compare without weakening tests |
| 8 | [Debug an agent in DevUI](./lifecycle/devui-debugging/README.md) | Debug workflow | Inspect tool selection, execution, grounding, citations, and failures |
| 9 | [Deliver an agent to a team](./lifecycle/team-delivery/README.md) | Delivery workflow | Shared scope, provision, package, validate, and targeted sharing |
| 10 | [Round-trip a plugin across formats](./plugins/plugin-portability/README.md) | Plugin lifecycle | Export and re-import Open Plugin, Claude, or Cursor formats |

## Validate the cookbook set

From the repository root:

```bash
node tools/wiqd/cookbooks/validate.mjs
```

The check verifies the recipe count, index numbering, relative links, required
checkpoints, Wiqd telemetry flags in shell examples, and removal of retired
recipes.

## Public services used

- [Microsoft Learn MCP Server](https://learn.microsoft.com/training/support/mcp)
- [Zava Insurance MCP endpoint](https://zava-insurance-mcp.azurewebsites.net/mcp)
- [Wiqd documentation](https://microsoft.github.io/wiqd/)

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd" />
