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
> See [Getting started](../README.md#getting-started) in the cookbook README for wiqd prerequisites and installation instructions.

```bash
node --version
wiqd --version
copilot --version
wiqd doctor
```

**Checkpoint:** Node reports version 24 or later, and the other commands complete successfully.

If `copilot` is not found but `gh copilot` works, run:

```bash
alias copilot="gh copilot"
```

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
Create a new declarative agent called Zava Insurance that helps users with insurance queries such as policy lookups, coverage questions, and claim status.
```

Review and approve the proposed file changes.

**Checkpoint:** the current directory contains a new agent project with manifest and instruction files.

### Step 5: Add the MCP action

Enter this prompt in the same Copilot session:

```text
Add an MCP server action to the Zava Insurance agent using this endpoint: https://zava-insurance-mcp.azurewebsites.net/mcp
```

Review and approve the manifest changes.

### Step 6: Review the configuration

Confirm the generated project includes:

- The MCP endpoint `https://zava-insurance-mcp.azurewebsites.net/mcp`
- An MCP action in the agent manifest
- Instructions that use the available tools for policy, claim, and coverage requests

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
Open the provisioned agent in Microsoft 365 Copilot with wiqd.
```

## Try it

| Prompt | Expected behavior |
|---|---|
| `What's the status of policy #12345?` | Calls the MCP server and returns policy details |
| `Does my plan cover dental?` | Queries coverage through the MCP endpoint |
| `I need to file a claim for water damage` | Starts a claim flow with the MCP tools |

## Reset the lab

From the parent directory of `zava-insurance`:

```bash
rm -rf zava-insurance
```

Deleting the local folder does not remove provisioned resources.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/cookbooks/zava-insurance" />

---

Return to the [cookbook index](../README.md).
