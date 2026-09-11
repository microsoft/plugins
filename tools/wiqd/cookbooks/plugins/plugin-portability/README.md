# Round-trip a plugin across formats

Export a validated WIQD plugin to the Agent Plugin, Claude, and Cursor formats,
then import the Agent Plugin export into a fresh WIQD project and validate that
the connector, skill, and declarative agent survived.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Start from a validated composite plugin such as
  [Learn Technology Advisor](../learn-tech-advisor/README.md).
- Keep the entire export directory together. The declarative-agent payload is
  carried beside the exported manifest and is required for a lossless import.

## Export the plugin

From the validated plugin root, start one interactive Copilot session:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Validate this WIQD plugin. If validation is clean, export it with the supported
WIQD plugin export command to all three formats: open-plugin, claude-plugin, and
cursor-plugin. Put each format in its default export directory. Do not provision
or change the source plugin.
```

**Checkpoint:** the plugin contains `export/open-plugin`,
`export/claude-plugin`, and `export/cursor-plugin`, and each export has its
format-specific manifest plus the carried skill and agent content.

## Prove the round trip

Enter:

```text
Import export/open-plugin into a new sibling project named
<current-plugin-name>-roundtrip using the supported WIQD plugin import command.
Because this export came from WIQD, reuse its round-trip privacy, terms, and
agent metadata rather than inventing replacements. Show the imported plugin and
run static validation. Compare its capability list with the source plugin.
```

**Checkpoint:** import reports that the agent was restored, validation passes,
and both projects list the same `agentConnectors`, `agentSkills`, and
`declarativeAgent` capabilities.

## Test the boundary

Copy an entire export directory to a temporary location and import it again.
Do not copy only the manifest: that intentionally omits the carried agent and is
not a valid lossless round trip.

**Checkpoint:** a complete exported directory imports successfully without
asking for new privacy or terms URLs.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/plugins/plugin-portability" />

---

Return to the [cookbook index](../../README.md).
