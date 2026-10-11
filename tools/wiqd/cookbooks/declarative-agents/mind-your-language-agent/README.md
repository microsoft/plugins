# Mind Your Language agent: interactive lab

Build and open a Microsoft 365 Copilot tone coach that rewrites passive-aggressive, sarcastic, or harsh messages. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

> [!NOTE]
> Markdown cannot execute commands directly. Run terminal commands in a
> terminal, enter prompts in the GitHub Copilot app or CLI, and keep the same
> Copilot conversation open for all remaining steps.

## Before you start

You need:

- Node.js 24 or later
- `wiqd` installed and signed in
- Access to the GitHub Copilot app or GitHub Copilot CLI
- Permission to provision an agent to a dev environment

### Step 1: Check the environment

> [!NOTE]
> See [Getting started](../../README.md#getting-started) in the cookbook README for wiqd prerequisites and installation instructions.

```bash
node --version
wiqd --version
wiqd doctor
```

If you plan to use the CLI, also run `copilot --version`.

**Checkpoint:** Node reports version 24 or later, and the commands for your
chosen workflow complete successfully.

## Build the agent

### Step 2: Create the workspace

```bash
mkdir -p mind-your-language && cd mind-your-language
```

### Step 3: Start Copilot

In the GitHub Copilot app, open the **Default agent** selector and choose
**wiqd**. If you prefer the CLI, run:

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
| `Per my last email, I already explained this.` | Flags the passive-aggressive phrase and offers kinder rewrites |
| `Great job finishing that a week late.` | Detects sarcasm and suggests a constructive alternative |
| `Thanks for your help today!` | Confirms the positive tone and suggests no changes |

## Reset the lab

From the parent directory of `mind-your-language`:

```bash
rm -rf mind-your-language
```

Deleting the local folder does not remove provisioned resources.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/mind-your-language-agent" />

---

Return to the [cookbook index](../../README.md).
