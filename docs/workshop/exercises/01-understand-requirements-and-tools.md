# Exercise 1: Understand the requirement and the toolchain (20 min)

**Goal:** Everyone agrees on *what* we're building for Fabrikam and *which tool does what*, and every laptop passes the health checks.

## 1.1 The business requirement

Fabrikam employees waste time in the HR portal. HR wants leave available inside Microsoft 365 Copilot:

| Persona | Needs | Tool |
|---|---|---|
| Alex, Priya (employees) | "How much annual leave do I have?" | `get_leave_balance` |
| | "How many days did I work in FY 2025-26? I'm doing my tax." | `get_working_days` |
| | "Book leave 2-6 Feb." (form) | `create_leave_request`, MCP App |
| | "Cancel my Christmas leave." (pick from a list) | `delete_leave_request`, MCP App |
| Jordan (manager) | "What's waiting for my approval? Approve Priya's." | `approve_leave_request`, **managers only** |

**Non-functional requirements**
- Every call runs **as the signed-in user** (OAuth 2.0). No shared service account.
- Only users with the `Leave.Approve` role can approve. The server enforces this, not just the prompt.
- Quick read-only answers and leave management are shipped as **two connectors**, each with its own **skill**.

## 1.2 Concepts in 5 minutes

| Term | What it means here |
|---|---|
| **Plugin** | The Microsoft 365 app package you ship. It holds skills, connectors and, optionally, a declarative agent. |
| **Connector (agent connector)** | An entry in the app manifest's `agentConnectors[]` that points Copilot at a remote MCP server, with an auth reference and a tool description file. |
| **Federated** | Data stays in Fabrikam's HR system and is fetched **live, per user** through MCP. Nothing is copied into Microsoft Graph. Admins can also register MCP servers as *custom federated connectors* in the Microsoft 365 admin center. In this workshop we package ours in a plugin. |
| **Skill** | A `SKILL.md` folder that teaches Copilot *when* and *how* to use tools. The frontmatter `description` holds the trigger phrases. |
| **MCP App** | An interactive HTML widget the MCP server returns for a tool (`_meta.ui.resourceUri` → `ui://...` resource, MIME `text/html;profile=mcp-app`). Copilot renders it in a sandboxed iframe, and the widget can call tools back. |
| **WIQD** | Work IQ Dev Tools: the CLI and GitHub Copilot plugin that handles the whole plugin lifecycle: create → add → validate → provision → package → share/publish. |

## 1.3 The tools on your bench

| Tool | Role in the workshop |
|---|---|
| **GitHub Copilot desktop app** + **WIQD plugin** | Main authoring path from Exercise 4. Select the wiqd agent, describe what you want, and review its proposed changes. |
| **WIQD CLI** | Used by the WIQD agent behind the app. Direct terminal commands are optional equivalents for repeatability and CI. |
| **Node.js** | Runs the MCP server and builds the MCP App widgets. |
| **Dev Tunnels** | Gives your laptop a public HTTPS URL that Copilot can reach. |
| **Microsoft 365 tenant** | Where you provision, test, share and publish. Your account is enough for local testing; the shared pilot needs distinct test users. |
| **Entra ID** | Issues OAuth 2.0 tokens and holds the `Leave.Approve` app role. |

## 1.4 Set up and health checks

1. Install the [GitHub Copilot desktop app](https://github.com/features/ai/github-app), open it and complete GitHub sign-in.
2. In the app sidebar, open **Customize**. Add the `microsoft/wiqd` GitHub repository using the marketplace settings control, find **wiqd**, and click **Install**. Reopen your session after installation. If WIQD is already installed, use that installation rather than adding another copy.
3. Install the WIQD CLI below if it is not already installed. The CLI and the app's WIQD plugin are separate prerequisites; CLI installation alone does not prove the plugin is available.

```powershell
# Windows - WIQD CLI setup
iex "& { $(irm 'https://aka.ms/wiqd/install.ps1') }"
```
```bash
# macOS / Linux
curl -fsSL https://aka.ms/wiqd/install.sh | bash
```
```bash
wiqd auth login --interactive     # sign in to your M365 tenant
wiqd doctor                       # all green?
node -v                           # 24.15 or later for current WIQD
devtunnel user login
az login --tenant <your-tenant>.onmicrosoft.com --allow-no-subscriptions
```

Review installation terms before accepting them. GitHub sign-in in the app is separate from WIQD's work/school sign-in to your Microsoft 365 tenant. The standalone GitHub Copilot CLI and `gh` CLI are not needed for this route. See [customizing the app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app) for marketplace setup.

## 1.5 Prepare the demo cast

For local testing with **one account**, use `TEST_USER_UPN` and the workshop persona switch described in [Exercise 9](09-provision-and-test-locally.md). The fictional employees and their separate leave records stay in the seed data.

For the shared pilot, create (or pick) **3 distinct test users** in your tenant with Microsoft 365 Copilot licences:

| Fictional employee | Seed id | Role | Your test account (fill in) |
|---|---|---|---|
| Alex Chen | E1001 | employee, reports to Jordan | `EMPLOYEE_UPN` |
| Priya Patel | E1002 | employee, reports to Jordan | `SECOND_EMPLOYEE_UPN` |
| Jordan Smith | M2001 | **manager** | `MANAGER_UPN` |

## ✅ Checkpoint
- `wiqd doctor` passes and `wiqd auth status` shows your tenant.
- You can explain the difference between a **plugin**, a **connector** and a **skill** to the person next to you.
