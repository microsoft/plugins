# Zero to agent: interactive lab

Build and open a Microsoft 365 Copilot agent from an empty folder. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

> [!NOTE]
> Markdown cannot execute commands directly. Use the copy button on each code block, paste the command into a terminal, and keep the same Copilot session open for all remaining steps.

## Before you start

You need:

- Node.js 24 or later
- `wiqd` installed and signed in
- GitHub Copilot CLI available as `copilot`
- Permission to provision an agent to a dev environment

### Step 1: Check the environment

> [!NOTE]
> See [Getting started](../../README.md#getting-started) in the cookbook README for wiqd prerequisites and installation instructions.

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

Keep this Copilot session open for the remaining steps.

## Run the agent

### Step 5: Move into the agent project

Copilot reports the path of the project it created. Move the current session into that project root:

```text
/cwd <path-to-new-agent-project>
```

Replace the placeholder with the path Copilot reported.

**Checkpoint:** the current directory contains the agent's `appPackage` directory and lifecycle configuration file.

### Step 6: Validate locally

Enter this prompt in the same Copilot session:

```text
Validate the agent with wiqd. If validation reports errors, explain them and help me fix them before continuing.
```

**Checkpoint:** validation completes without errors. Fix any reported errors before continuing.

### Step 7: Provision to dev

Enter this prompt in the same Copilot session:

```text
Provision the agent to the dev environment with wiqd.
```

**Checkpoint:** provisioning succeeds and returns a Microsoft 365 Copilot share link.

### Step 8: Open in Copilot

Enter this prompt in the same Copilot session:

```text
Open the provisioned agent in Microsoft 365 Copilot with wiqd.
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

Return to the [cookbook index](../../README.md).
