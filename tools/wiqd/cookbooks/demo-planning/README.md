# Demo Planning agent: interactive lab

Build and open a Microsoft 365 Copilot agent that plans demos, workshops, hackathons, presentations, and customer conversations. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

> [!NOTE]
> Markdown cannot execute commands directly. Use the copy button on each code block, paste the command into a terminal, and keep the same Copilot session open for Steps 3 through 5.

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

Ask Copilot to correct any missing behavior, then exit:

```text
/exit
```

## Run the agent

### Step 6: Validate locally

```bash
wiqd agent validate
```

**Checkpoint:** validation completes without errors.

### Step 7: Provision to dev

```bash
wiqd agent provision --env dev
```

**Checkpoint:** provisioning succeeds and returns a Microsoft 365 Copilot share link.

### Step 8: Open in Copilot

```bash
wiqd agent open
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
