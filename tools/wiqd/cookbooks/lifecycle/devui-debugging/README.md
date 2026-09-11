# Debug an agent in DevUI

Launch Wiqd's local DevUI, send a real prompt, and inspect the full turn:
matched and selected plugins, tool execution, grounding, citations, request
identifiers, latency, raw JSON, and failures.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Start in a provisioned declarative-agent project.
- For the richest tool trace, use
  [Zava Insurance agent](../../declarative-agents/insurance-agent-mcp/README.md).
- DevUI binds only to `127.0.0.1` and uses your existing Work IQ
  authentication.

## Enable and launch DevUI

Start one interactive Copilot session from the agent project root:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Enable the Wiqd devui preview flag with the supported config command. Read this
project's provisioned title ID, then start DevUI for that agent. Use direct
transport and open the browser. Do not modify or re-provision the agent.
```

**Checkpoint:** DevUI opens locally with the intended agent preselected.

## Watch a successful turn

For Zava Claims Guide, enter:

```text
Use Wiqd DevUI ask to send "Summarize claim CN202504990" to this agent and open
the live turn. Then tell me which plugin and tool DevUI selected, whether the
tool execution succeeded, and which request, conversation, and task IDs identify
the run.
```

For another agent, replace the quoted prompt with one of its conversation
starters.

**Checkpoint:** DevUI shows the matched and selected plugin, the executed tool
when applicable, latency, raw event data, and the rendered answer.

## Inspect grounding and failure behavior

Enter:

```text
In the same DevUI, run one prompt that should retrieve grounded content and one
safe prompt that should fail, such as an unknown demo claim number. Compare the
retrieval and citation sections, tool arguments, execution result, and surfaced
error. Do not retry with invented identifiers and do not call a write tool.
```

**Checkpoint:** the grounded turn shows its evidence, while the failing turn
shows a real error or empty result instead of a success-shaped answer.

## Restore the preview flag

When finished, enter:

```text
Stop the running Wiqd DevUI and reset the devui feature flag to its default.
```

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/lifecycle/devui-debugging" />

---

Return to the [cookbook index](../../README.md).
