# Zero to agent: interactive lab

Build and open a Microsoft 365 Copilot agent from an empty folder. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

> [!NOTE]
> Markdown cannot execute commands directly. Use the copy button on each code block, paste the command into a terminal, and keep the same Copilot session open for Steps 3 and 4.

## Before you start

You need:

- Node.js 24 or later
- `wiqd` installed and signed in
- GitHub Copilot CLI available as `copilot`
- Permission to provision an agent to a dev environment

### Step 1: Check the environment

> [!NOTE]
> See [Getting started](../README.md#getting-started) in the cookbook README for wiqd prerequisites and installation instructions.

Run in a terminal:

```bash
node --version
wiqd --version
copilot --version
wiqd doctor
```

**Checkpoint:** Node reports version 24 or later, and the other commands complete successfully.

If `copilot` is not found but `gh copilot` works, create the alias used by this lab:

```bash
alias copilot="gh copilot"
```

## Build the agent

### Step 2: Create the workspace

```bash
mkdir -p hello-wiqd && cd hello-wiqd
```

**Checkpoint:** your terminal is now in the `hello-wiqd` directory.

```bash
pwd
```

### Step 3: Start Copilot

Start an interactive Copilot session from the project directory:

```bash
copilot --agent wiqd:wiqd
```

The remaining prompts in this section belong inside that Copilot session. Start with a clean conversation:

```text
/clear
```

**Checkpoint:** Copilot clears its conversation context and waits for the next prompt.

### Step 4: Scaffold the agent

Enter this prompt in the same Copilot session:

```text
Create a new declarative agent called Hello WIQD. The agent should greet every user with a warm hello and introduce itself as having been created by WIQD. Give it the personality of a curious, innocent, and wonder-filled character, like a child seeing the world for the first time. It should be enthusiastic, gentle, and genuinely delighted to meet the user. Keep responses short, sweet, and warm.
```

Review and approve the file changes Copilot proposes.

**Checkpoint:** the current directory contains a new agent project with manifest and instruction files.

Exit the Copilot session when scaffolding is complete:

```text
/exit
```

## Run the agent

### Step 5: Validate locally

```bash
wiqd agent validate
```

**Checkpoint:** validation completes without errors. Fix any reported errors before continuing.

### Step 6: Provision to dev

```bash
wiqd agent provision --env dev
```

**Checkpoint:** provisioning succeeds and returns a Microsoft 365 Copilot share link.

### Step 7: Open in Copilot

```bash
wiqd agent open
```

**Checkpoint:** the Hello WIQD agent opens in Microsoft 365 Copilot.

## Try it

Run these prompts one at a time in the opened agent:

| Prompt | Expected behavior |
|---|---|
| `Hi` | Greets you warmly, mentions WIQD, and expresses delight at meeting you |
| `What are you?` | Describes itself with curiosity and child-like wonder |
| `Tell me something fun` | Shares something with brief, genuine enthusiasm |

## Reset the lab

To remove only the local trial project, close Copilot and run this from the parent directory of `hello-wiqd`:

```bash
rm -rf hello-wiqd
```

Provisioned resources are not removed by deleting the local folder. Use the appropriate `wiqd` cleanup command for your environment if you also want to remove the provisioned agent.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/cookbooks/zero-to-agent" />

---

Return to the [cookbook index](../README.md).
