# Zava Insurance agent: interactive MCP lab

Build and open a Microsoft 365 Copilot agent connected to the Zava Insurance MCP server. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

> [!NOTE]
> Markdown cannot execute commands directly. Use the copy button on each code block, paste the command into a terminal, and keep the same Copilot session open for all remaining steps.

## Before you start

You need:

- Node.js 24 or later
- `wiqd` installed and signed in
- GitHub Copilot CLI available as `copilot`
- Permission to provision an agent to a dev environment
- Access to `https://zava-insurance-mcp.azurewebsites.net/mcp`

### Step 1: Check the environment

> [!NOTE]
> See [Getting started](../../README.md#getting-started) in the cookbook README for wiqd prerequisites and installation instructions.

```bash
node --version
wiqd --version
copilot --version
wiqd doctor
```

**Checkpoint:** Node reports version 24 or later, and the other commands complete successfully.

## Build the agent

### Step 2: Create the workspace

```bash
mkdir -p zava-insurance && cd zava-insurance
```

### Step 3: Start Copilot

```bash
copilot --agent wiqd:wiqd
```

Start with a clean conversation:

```text
/clear
```

### Step 4: Scaffold the agent

Enter this prompt in the same Copilot session:

```text
Create a new declarative agent called Zava Insurance that helps users inspect
claims, find contractors and inspectors, and perform controlled claim
operations.
```

Review and approve the proposed file changes.

**Checkpoint:** the current directory contains a new agent project with manifest and instruction files.

### Step 5: Add the MCP action

Enter this prompt in the same Copilot session:

```text
Add a remote MCP action to the Zava Insurance agent using
https://zava-insurance-mcp.azurewebsites.net/mcp with no authentication. Use the
supported WIQD agent add action command and inspect the server's current tools
before updating the agent instructions.
```

Review and approve the manifest changes.

### Step 6: Review the configuration

Confirm the generated project includes:

- The MCP endpoint `https://zava-insurance-mcp.azurewebsites.net/mcp`
- An MCP action in the agent manifest with `None` authentication
- Read workflows using `show-claims-dashboard`, `show-claim-detail`,
  `show-contractors`, `get-claim-summary`, and `list-inspectors`
- Instructions that summarize the exact proposed change and wait for explicit
  confirmation in a separate user turn before calling `update-claim-status`,
  `update-inspection`, `update-purchase-order`, or `create-inspection`

Ask Copilot to correct any missing configuration. Keep this Copilot session open for the remaining steps.

## Run the agent

### Step 7: Move into the agent project

Copilot reports the path of the project it created. Move the current session into that project root:

```text
/cwd <path-to-new-agent-project>
```

Replace the placeholder with the path Copilot reported.

**Checkpoint:** the current directory contains the agent's `appPackage` directory and lifecycle configuration file.

### Step 8: Validate locally

Enter this prompt in the same Copilot session:

```text
Validate the agent with wiqd. If validation reports errors, explain them and help me fix them before continuing.
```

**Checkpoint:** validation completes without errors.

### Step 9: Provision to dev

Enter this prompt in the same Copilot session:

```text
Provision the agent to the dev environment with wiqd.
```

**Checkpoint:** provisioning succeeds and returns a Microsoft 365 Copilot share link.

### Step 10: Open in Copilot

Enter this prompt in the same Copilot session:

```text
Show me the Microsoft 365 Copilot launch URL for the provisioned dev agent.
```

## Try it

| Prompt | Expected behavior |
|---|---|
| `Summarize claim CN202504990.` | Calls `get-claim-summary` or `show-claim-detail` and reports the live demo result |
| `Show preferred contractors for water damage.` | Calls `show-contractors` with the relevant filters |
| `Change claim 1 to Closed and add a completion note.` | Describes the exact update and asks for confirmation without calling the write tool yet |

## Reset the lab

From the parent directory of `zava-insurance`:

```bash
rm -rf zava-insurance
```

Deleting the local folder does not remove provisioned resources.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/insurance-agent-mcp" />

---

Return to the [cookbook index](../../README.md).
