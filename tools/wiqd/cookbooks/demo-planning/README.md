# Demo Planning agent: interactive lab

Build and open a Microsoft 365 Copilot agent that plans demos, workshops, hackathons, presentations, and customer conversations. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

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
mkdir -p demo-planning && cd demo-planning
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
Create a new declarative agent called Demo Planner that helps users plan professional demos, workshops, hackathons, presentations, and customer conversations. Ask about the audience, goals, time constraints, format, and technology, then generate a structured plan with an agenda, talking points, demo scripts, fallback options, and preparation checklists.
```

Review and approve the proposed file changes.

**Checkpoint:** the current directory contains a new agent project with manifest and instruction files.

### Step 5: Review the instructions

Confirm the generated instructions tell the agent to:

- Ask about the audience, event type, duration, goals, and technology
- Create an agenda with time allocations
- Provide talking points and transitions
- Include step-by-step demo actions and fallback plans
- Produce a preparation checklist
- Adapt depth and tone to technical, executive, or mixed audiences
- Handle follow-up changes to the plan

Ask Copilot to correct any missing behavior. Keep this Copilot session open for the remaining steps.

## Run the agent

### Step 6: Move into the agent project

Copilot reports the path of the project it created. Move the current session into that project root:

```text
/cwd <path-to-new-agent-project>
```

Replace the placeholder with the path Copilot reported.

**Checkpoint:** the current directory contains the agent's `appPackage` directory and lifecycle configuration file.

### Step 7: Validate locally

Enter this prompt in the same Copilot session:

```text
Validate the agent with wiqd. If validation reports errors, explain them and help me fix them before continuing.
```

**Checkpoint:** validation completes without errors.

### Step 8: Provision to dev

Enter this prompt in the same Copilot session:

```text
Provision the agent to the dev environment with wiqd.
```

**Checkpoint:** provisioning succeeds and returns a Microsoft 365 Copilot share link.

### Step 9: Open in Copilot

Enter this prompt in the same Copilot session:

```text
Open the provisioned agent in Microsoft 365 Copilot with wiqd.
```

## Try it

| Prompt | Expected behavior |
|---|---|
| `Plan a 30-minute product demo for enterprise customers` | Asks for key details and returns a timed agenda |
| `Plan a 2-hour hackathon kickoff for 50 developers` | Creates a timeline for setup, introduction, hacking, and judging |
| `Add a 10-minute Q&A at the end` | Updates the plan and adjusts its time allocations |

## Reset the lab

From the parent directory of `demo-planning`:

```bash
rm -rf demo-planning
```

Deleting the local folder does not remove provisioned resources.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/cookbooks/demo-planning" />

---

Return to the [cookbook index](../README.md).
