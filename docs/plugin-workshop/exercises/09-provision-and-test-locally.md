# Exercise 9: Provision and test locally (30 min)

**Goal:** Install the plugin for **yourself**, using the **personal dev deployment** from Exercise 5, connect with OAuth, and run the end-to-end scenarios, including the MCP App widgets.

## 9.1 Map yourself to a persona

Verify the plugin's effective dev scope is **personal** (`AGENT_SCOPE=personal`); the environment name alone does not determine who can use it. You do not need three real accounts. Configure Entra OAuth as in Exercise 3 and set this in `mcp-server/.env`:
```
AUTH_MODE=entra
TEST_USER_UPN=<your-upn>
```
Leave `EMPLOYEE_UPN`, `SECOND_EMPLOYEE_UPN`, and `MANAGER_UPN` blank for this test. From `mcp-server`:
```bash
npm run demo:role -- user
```
Restart the server. Make sure the dev tunnel is hosting and `AUTH_MODE=entra` is set.

Your valid OAuth sign-in now acts as employee **E1001**. Only `TEST_USER_UPN` gets a simulated role; other accounts do not. The server prints a warning when this workshop-only mode is enabled. Never share this server while it is enabled.

## 9.2 Validate and reprovision the completed plugin

Exercise 5 provisioned the quick connector with personal scope in dev and verified its packaged OAuth reference. Installation, consent and live calls were separate follow-up steps, not implied by that result. Now reprovision to install the skills and Leave Management connector added in Exercises 6–8. Keep the verified `LEAVE_OAUTH_REFERENCE_ID` in `env/.env.dev` so the existing OAuth configuration is reused. Supply any required secret only through the provisioning process environment, as in Exercise 5.

Return to your **GitHub Copilot desktop app** authoring session with **wiqd** selected.

🗣️ **Say it in the app:** *"Validate my plugin for dev. Before reprovisioning for personal testing, confirm the target Microsoft 365 account, tenant and effective personal scope, explain the tenant changes, and ask for my approval. Use secure process-only secret entry if needed, then provision in dev and report the actual result and returned installation links."*

⌨️ **Optional terminal equivalent:**
```bash
wiqd plugin validate --mode source --env dev
wiqd plugin provision --env dev
```
`provision` updates the plugin, writes `env/.env.dev` and returns installation links. Use the actual returned links; their forms may resemble:
- **Cowork:** `https://copilot.cloud.microsoft/plugins?pluginsTab=cowork&coworkPage=detail&coworkPluginId=<M365_TITLE_ID>`
- **Chat:** `https://copilot.cloud.microsoft/plugins?titleId=<M365_TITLE_ID>&pluginsTab=chat`

Open one of them in **Microsoft 365 Copilot Chat or Cowork** with your work/school account and install the plugin. These are runtime surfaces, separate from the GitHub Copilot desktop authoring app.

## 9.3 First run: sign in

In **Microsoft 365 Copilot Chat or Cowork**, not the GitHub Copilot app, ask: **"How much annual leave do I have?"**
1. Copilot shows a **sign-in / connect** prompt for *Leave Quick Info*. Sign in and consent.
2. Watch your server terminal. You'll see the request arrive with a bearer token.
3. You get a balance table (from the `leave-quick-answers` skill).

## 9.4 Test script (as Alex)

Run these prompts in **Microsoft 365 Copilot Chat or Cowork**. Use the GitHub Copilot app with WIQD only to diagnose, change, validate and reprovision the plugin if a test fails.

| # | Prompt | Expect |
|---|---|---|
| 1 | "How much annual and personal leave do I have?" | 2 rows. Annual: 6.5 + 20 − 5 taken − 4 pending = **17.5** |
| 2 | "How many days did I work last financial year? It's for my tax return." | `get_working_days` for FY 2025-26, bold number, breakdown and caveat |
| 3 | "I want to book some leave" | **Leave form widget** opens. Submit 2–6 Feb 2027. You get a confirmation card. |
| 4 | "Book personal leave tomorrow, I have a medical appointment" | Copilot reads back the dates, then creates the request (or opens the pre-filled form) |
| 5 | "Cancel one of my leave requests" | **List widget**. Delete → Confirm. The row disappears. |
| 6 | "Approve Priya's leave" | Polite **refusal**. The server returned the authorization error. |
| 7 | "Book 30 days of annual leave in March" | Validation message: not enough balance |

## 9.5 Switch your account to manager, then back to user

From `mcp-server`:
```bash
npm run demo:role -- manager
```
Restart the server, then ask in **Microsoft 365 Copilot Chat or Cowork**: *"What leave is waiting for my approval?"* → *"Approve LR-1004 with the comment 'Have a great trip'"*. You now act as **M2001**, the manager of E1001 and E1002.

For a complete create/approve loop, first create a request in user mode (step 3 above), note its `LR-...` id, switch to manager and approve that id, then switch back:
```bash
npm run demo:role -- user
```
Restart and ask for your requests/balance. The new request remains associated with E1001 and its decision is recorded as M2001. Ask to approve again: it must be denied, even if your real token happens to carry `Leave.Approve`.

No Entra app role changes or connector sign-in refresh are needed. A fresh chat can avoid Copilot reusing answers from the previous persona; close/reopen widgets after switching.

When finished:
```bash
npm run demo:role -- off
```
Restart. Normal UPN mappings and real Entra token roles now apply; an unmapped account gets 403. This mode simulates authorization for workshop testing; it does not verify Entra role assignment. For a real multi-account test, configure the three mappings, assign the manager's real app role, and sign in again to obtain fresh role claims.

## 9.6 Troubleshooting

| Symptom | Check |
|---|---|
| "Could not verify connection" | The tunnel is hosting, the URL in the env file matches, and `mcpToolDescription` is present. |
| Sign-in loops or fails | The redirect URI is exactly `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`, the scope is right, the Base URL host matches the tunnel, and the secret hasn't expired. |
| 401 `Invalid token: ERR_JWT_CLAIM_VALIDATION_FAILED` | `API_CLIENT_ID` and `TENANT_ID` in `.env`, and `requestedAccessTokenVersion: 2`. |
| 403 "not in the Fabrikam HR system" | Your UPN isn't mapped in `.env`, or `TEST_USER_UPN` doesn't match your token's sign-in name. Restart after switching personas. |
| Widget doesn't render | The tool has `_meta.ui.resourceUri`, the resource MIME is `text/html;profile=mcp-app`, and you ran `npm run build:widgets`. |
| Widget renders but is empty | The tool must return `structuredContent`. Check the browser dev tools for CSP errors. |
| Approval succeeds when it should be denied | Check `DEMO_PERSONA`: use `user` and restart to test denial. Outside demo mode, check real token role assignments. |

## ✅ Checkpoint
- All 7 prompts behave as expected, and both widgets render and call back to the server.
- You've seen an **authorization denial** coming from the server. In single-account mode the role is simulated; OAuth authentication is still real.
