# Translator agent: interactive lab

Build and open a Microsoft 365 Copilot agent that translates text into any requested language. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

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
mkdir -p translator-agent && cd translator-agent
```

**Checkpoint:** your terminal is now in the `translator-agent` directory.

### Step 3: Start Copilot

In the GitHub Copilot app, open the **Default agent** selector and choose
**wiqd**. If you prefer the CLI, run:

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

Ask Copilot to correct any missing behavior before continuing. Keep this Copilot session open for the remaining steps.

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

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/translator-agent" />

---

Return to the [cookbook index](../../README.md).
