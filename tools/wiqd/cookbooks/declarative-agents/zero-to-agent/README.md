# First agent, live in Copilot

Create a small declarative agent, validate it locally, provision it, and open
the launch link returned by Wiqd. This is the shortest complete path through the
Wiqd build and preview lifecycle.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Run from a parent directory where `hello-wiqd` does not already exist.
- Confirm that your account can upload a custom app to a development tenant.

## Build and validate

Start one interactive Copilot session:

```bash
copilot --agent wiqd:wiqd
```

Enter this prompt:

```text
Create a new declarative agent project named hello-wiqd. Call the agent Hello WIQD.
It should greet users warmly, explain that it was created with Wiqd, and keep
answers concise. Add three useful conversation starters. Use the supported Wiqd
agent scaffold, make the generated project root the current working directory,
and run static validation. Stop after validation; do not provision yet.
```

**Checkpoint:** Copilot reports a clean static validation and the current
directory contains `appPackage/declarativeAgent.json` and `m365agents.yml`.

## Provision and open

Enter:

```text
Provision this agent to the dev environment with Wiqd. After provisioning,
show me the Microsoft 365 Copilot launch URL and make no other project changes.
```

**Checkpoint:** provisioning succeeds and returns a URL containing a generated
`titleId`. Open that URL in your browser.

## Try it

| Prompt | Expected behavior |
|---|---|
| `Hi` | Greets you warmly and identifies itself as created with Wiqd |
| `What can you help me with?` | Gives a short description consistent with its instructions |
| `Write a 500-word essay` | Still responds concisely instead of ignoring its scope |

## Clean up

If you provisioned only for this lab, enter:

```text
Uninstall the dev environment for this agent with Wiqd. Explain exactly what
cloud resources will be removed and wait for my confirmation before deleting.
```

Local source remains on disk after uninstall.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/zero-to-agent" />

---

Return to the [cookbook index](../../README.md).
