# Mind Your Language agent: interactive lab

Build and open a Microsoft 365 Copilot tone coach that rewrites passive-aggressive, sarcastic, or harsh messages. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

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
mkdir -p mind-your-language && cd mind-your-language
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
Create a new declarative agent called Mind Your Language that acts as a tone coach. When a user pastes text, detect passive-aggressive, sarcastic, or unkind phrasing and rewrite it in a kinder, more constructive tone. Explain what changed and why, and offer alternative phrasings ranked from most direct to most gentle. If the text is already kind, confirm that no changes are needed.
```

Review and approve the proposed file changes.

**Checkpoint:** the current directory contains a new agent project with manifest and instruction files.

### Step 5: Review the instructions

Confirm the generated instructions tell the agent to:

- Detect passive-aggressive, sarcastic, or harsh phrasing
- Identify phrases that could land poorly
- Preserve the original intent in a kinder rewrite
- Briefly explain why each change improves the tone
- Offer two or three alternatives from direct to gentle
- Leave already-kind text unchanged

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
| `Per my last email, I already explained this.` | Flags the passive-aggressive phrase and offers kinder rewrites |
| `Great job finishing that a week late.` | Detects sarcasm and suggests a constructive alternative |
| `Thanks for your help today!` | Confirms the positive tone and suggests no changes |

## Reset the lab

From the parent directory of `mind-your-language`:

```bash
rm -rf mind-your-language
```

Deleting the local folder does not remove provisioned resources.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/cookbooks/mind-your-language" />

---

Return to the [cookbook index](../README.md).
