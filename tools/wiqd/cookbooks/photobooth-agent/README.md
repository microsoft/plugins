# Photobooth agent: interactive lab

Build and open a Microsoft 365 Copilot agent that turns uploaded images into photobooth-style composites. This README is organized like a notebook: run one cell at a time, confirm its checkpoint, and then continue.

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
mkdir -p photobooth-agent && cd photobooth-agent
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
Create a new declarative agent called Photobooth that accepts user-uploaded images and creates photobooth-style image responses. Apply creative filters such as black-and-white, sepia, pop-art, and sketch. Combine multiple styled versions into a single photobooth strip and return the composite image. Let users request specific styles or regenerate the result with different effects.
```

Review and approve the proposed file changes.

**Checkpoint:** the current directory contains a new agent project with manifest and instruction files.

### Step 5: Review the instructions

Confirm the generated instructions tell the agent to:

- Accept one or more user-uploaded images
- Apply black-and-white, sepia, pop-art, and sketch styles
- Arrange styled images in a 2-by-2 or 1-by-4 strip
- Return the composite image directly in chat
- Honor requests for specific styles or regeneration

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
| Upload a photo and ask `Create a photobooth strip` | Returns four styled versions in one composite |
| `Make it all pop-art style` | Regenerates every frame in pop-art style |
| Upload two photos and ask `Combine these into a photobooth` | Uses both images with different effects |

## Reset the lab

From the parent directory of `photobooth-agent`:

```bash
rm -rf photobooth-agent
```

Deleting the local folder does not remove provisioned resources.

---

Return to the [cookbook index](../README.md).
