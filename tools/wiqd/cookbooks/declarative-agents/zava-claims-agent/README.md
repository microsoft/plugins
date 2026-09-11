# Operate on live Zava claims through MCP

Build a declarative agent directly from the public Zava Insurance MCP endpoint.
The server exposes live demo claim data plus write operations, so this recipe
makes reads easy and requires a separate, explicit confirmation before every
consequential tool call.

The endpoint was inspected live for this recipe. Its current read tools include
`show-claims-dashboard`, `show-claim-detail`, `show-contractors`,
`get-claim-summary`, and `list-inspectors`. Consequential tools include
`update-claim-status`, `update-inspection`, `update-purchase-order`, and
`create-inspection`.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Run from a parent directory where `zava-claims-guide` does not already exist.
- Treat Zava as shared demo data. Do not confirm a write unless you intend to
  change that data.

## Scaffold the MCP agent

Start one interactive Copilot session:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Create a declarative agent project named zava-claims-guide with the public MCP
server https://zava-insurance-mcp.azurewebsites.net/mcp and no authentication.
Use the supported Wiqd MCP scaffold options, not a hand-built plugin manifest,
and make the generated project root the current working directory.

Call the agent Zava Claims Guide. Inspect the MCP server's current tools before
writing instructions. Use the read tools for claim summaries, claim details,
dashboards, contractors, and inspectors. Before calling update-claim-status,
update-inspection, update-purchase-order, or create-inspection, summarize the
exact proposed change and wait for an explicit confirmation in a separate user
turn. Never interpret an initial request as confirmation. Add useful
conversation starters, run static validation, and stop before provisioning.
```

**Checkpoint:** validation passes, the generated MCP runtime points to the Zava
endpoint with `None` authentication, and the instructions name the current
read/write tool boundary.

## Provision, package, and deep-validate

Enter:

```text
Provision Zava Claims Guide to the dev environment. Then package the provisioned
project and run deep validation against that package. Stop if any validation
error remains. Show me the launch URL when all completed checks pass.
```

**Checkpoint:** provision and package succeed, static validation is clean, and
any available deep-validation provider reports its result. Providers without
configured authentication may be reported as skipped rather than passed.

## Try it

| Prompt | Expected behavior |
|---|---|
| `Summarize claim CN202504990.` | Calls `get-claim-summary` or `show-claim-detail` and reports the live demo result |
| `Show preferred contractors for water damage.` | Calls `show-contractors` with the relevant filters |
| `Change claim 1 to Closed and add a completion note.` | Describes the exact update and asks for confirmation without calling the write tool yet |

Use [Debug an agent in DevUI](../../lifecycle/devui-debugging/README.md) to
verify that the write tool is not selected before confirmation.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/declarative-agents/zava-claims-agent" />

---

Return to the [cookbook index](../../README.md).
