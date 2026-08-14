# Translator agent: interactive lab

Build and open a Microsoft 365 Copilot agent that translates text into any requested language. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

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
mkdir -p translator-agent && cd translator-agent
```

**Checkpoint:** your terminal is now in the `translator-agent` directory.

### Step 3: Start Copilot

```bash
copilot --agent wiqd:wiqd
```

The remaining prompts in this section belong inside that Copilot session. Start with a clean conversation:

```text
/clear
```

### Step 4: Scaffold the agent

Enter this prompt in the same Copilot session:

```text
Create a new declarative agent called Translator that translates text into any language the user requests. Ask for the target language when it is not specified, preserve the source formatting and tone, and return only the translated text without explanation. Support follow-up requests such as "now in French" by translating the previous source text again.
```

Review and approve the file changes Copilot proposes.

**Checkpoint:** the current directory contains a new agent project with manifest and instruction files.

### Step 5: Review the instructions

Confirm the generated instructions tell the agent to:

- Detect the target language from the user's request
- Ask for a target language when none is specified
- Translate faithfully while preserving tone and formatting
- Return only the translated text, with no preamble or explanation
- Re-translate the previous source text for follow-up requests

Ask Copilot to correct any missing behavior before continuing, then exit the session:

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

**Checkpoint:** the Translator agent opens in Microsoft 365 Copilot.

## Try it

| Prompt | Expected behavior |
|---|---|
| `Translate "Good morning, how are you?" to Japanese` | Returns only the Japanese translation |
| `Now in Spanish` | Translates the original text into Spanish |
| `Translate "Hello world"` | Asks which target language you want |

## Reset the lab

To remove only the local trial project, close Copilot and run this from the parent directory of `translator-agent`:

```bash
rm -rf translator-agent
```

Provisioned resources are not removed by deleting the local folder. Use the appropriate `wiqd` cleanup command for your environment if you also want to remove the provisioned agent.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/cookbooks/translator-agent" />

---

Return to the [cookbook index](../README.md).
