# Deliver an agent to a team

Take a validated agent from local development to a targeted team preview:
configure shared scope, provision the shared environment, package resolved
artifacts, deep-validate the package, and share it with named users or a
mail-enabled security group.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Start in a validated declarative-agent project.
- Obtain the exact email addresses of preview users or the mail address of a
  security group. WIQD does not resolve display names.
- Confirm that your tenant permits app upload and sharing.

## Configure the shared environment

Start one interactive Copilot session from the project root:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Prepare this agent for a team preview in the dev environment. Inspect the
existing environment configuration first. Create the dev environment through
WIQD if it does not exist, configure AGENT_SCOPE=shared without adding secrets,
and ensure shared-version handling is correct. Show me the resulting non-secret
environment settings and stop before provisioning.
```

**Checkpoint:** the dev environment is explicitly shared and contains no
hardcoded tenant ID, title ID, OAuth reference ID, secret, or recipient address.

## Provision, package, and validate

Enter:

```text
Run the team delivery gates in this exact order for dev:
1. Static validation
2. Provision the shared agent
3. Package the provisioned agent so environment values are resolved
4. Deep validation of the generated package

Stop on any validation error. Report skipped deep-validation providers
separately from passing providers, and show the Copilot launch URL on success.
```

**Checkpoint:** provisioning precedes packaging, the package has resolved
environment values, and no validation error is hidden.

## Share with a bounded audience

Enter:

```text
Share the dev agent with these authorized recipients:
<comma-separated user addresses or one mail-enabled security-group address>

Use users scope, not tenant scope. Report the exact share result and do not
broaden access beyond the addresses I supplied.
```

**Checkpoint:** the share command reports success for the supplied users or
group. Each recipient can open the launch URL after tenant propagation
completes.

## Update safely

For a later content or manifest change, keep the same Copilot session and enter:

```text
Validate this shared agent, apply the required shared-agent patch version bump,
re-provision dev, rebuild the package, and deep-validate it. Preserve the
existing audience unless I explicitly ask to change sharing.
```

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/lifecycle/team-delivery" />

---

Return to the [cookbook index](../../README.md).
