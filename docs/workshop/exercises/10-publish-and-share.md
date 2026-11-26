# Exercise 10: Publish to your organisation and share with users (25 min)

**Goal:** Deploy to the **shared `dev` environment**, validate the real package, **share** with Alex, Priya and Jordan for testing, then **submit to the organisation catalog** for admin approval.

Use your **GitHub Copilot desktop app** session with **wiqd** selected for deployment tasks. Run the acceptance-test prompts in **Microsoft 365 Copilot Chat or Cowork** instead.

> **Sharing ≠ publishing.** `share` grants named users (or the tenant) access to *your* deployment, which is right for a pilot. `publish` submits the plugin to the **org app catalog**, and users only see it after an **admin approves** it.

## 10.1 Restore the real persona mapping

If you used single-account testing, first run `npm run demo:role -- off` from `mcp-server`. In `mcp-server/.env`, map all 3 personas to distinct accounts using `EMPLOYEE_UPN`, `SECOND_EMPLOYEE_UPN`, and `MANAGER_UPN`, and restart. Verify `SINGLE_ACCOUNT_DEMO=false` and assign only the real manager the Entra `Leave.Approve` role. Never share or publish with simulated roles enabled.

Keep the tunnel hosting for the whole test window. For a longer pilot, deploy the server to Azure (Container Apps or App Service) and change `LEAVE_MCP_BASE_URL` plus the OAuth registration **Base URL**. With only one account you can finish the personal tests, but cannot complete the real three-user acceptance test below.

## 10.2 Provision, package and validate in `dev`

Earlier exercises used **personal scope in dev**. This shared-pilot exercise intentionally changes that scope: inspect the current configuration, explain the impact and obtain approval before changing dev to `AGENT_SCOPE=shared` and reprovisioning. The environment name is not evidence of shared scope.

🗣️ **Say it in the app:** *"Verify single-account simulation is disabled and dev uses shared scope. Validate my plugin for dev, confirm the target account and tenant, explain provisioning changes and ask for approval. Then provision, package and validate the resulting package. Report the actual results and ZIP path. Do not share or publish yet."*

⌨️ **Optional terminal equivalent:**
```bash
# dev must be a shared deployment: check AGENT_SCOPE=shared in env/.env.dev
wiqd plugin validate --mode source --env dev
wiqd plugin provision --env dev
wiqd plugin package --env dev                                         # prints the .zip path
wiqd plugin validate --mode package --env dev --package-file "<zip>"  # server-side checks: ASKILL-*, connector rules
```
Fix any findings (🗣️ *"Explain these validation findings and fix them"*) and repeat.

## 10.3 Share with the demo users

🗣️ **Say it in the app:** *"Share my validated dev plugin only with the three test accounts I specify. Ask for their real email addresses, confirm the recipients before sharing, and return the Cowork and Chat installation links. Do not publish to the organisation catalog yet."*

⌨️ **Optional terminal equivalent:**
```bash
wiqd plugin share --env dev --scope users --email alex@<tenant>.onmicrosoft.com
wiqd plugin share --env dev --scope users --email priya@<tenant>.onmicrosoft.com
wiqd plugin share --env dev --scope users --email jordan@<tenant>.onmicrosoft.com
```
Send each tester the **Cowork** and **Chat** links that `share` returns.

## 10.4 Three-user acceptance test (run it live)

| Step | Who | Prompt | Expect |
|---|---|---|---|
| 1 | Priya | "Book annual leave 1 to 5 March 2027 for a wedding" | Confirmation, request goes to Jordan |
| 2 | Alex | "Show my leave requests and delete the Christmas one" | List widget, LR-1002 deleted |
| 3 | Alex | "Approve Priya's March leave" | **Denied** (no `Leave.Approve` role) |
| 4 | Jordan | "What's waiting for my approval?" | Table with Priya's requests |
| 5 | Jordan | "Approve Priya's March leave, comment: congratulations!" | Approved |
| 6 | Priya | "What's my annual leave balance now?" | 5 days moved from pending to taken in the right FY |
| 7 | Jordan | "How many days did I work in FY 2025-26?" | Working days, with a tax caveat |

## 10.5 Publish to the organisation catalog

🗣️ **Say it in the app:** *"Check the dev publish lifecycle targets the tenant organisation catalog. Run a publish dry run and explain the results. Ask for my approval before submitting the plugin for administrator review, then report the actual submission result."*

The manual equivalent is:

1. Check that `m365agents.yml` has a `publish:` lifecycle for the `dev` environment that uses `copilotAgent/publish` with `scope: tenant`. Ask WIQD to add it if it's missing.
2. Dry run, then submit:
```bash
wiqd plugin publish --dry-run --env dev
wiqd plugin publish --env dev
```
3. A **Microsoft 365 admin** reviews and approves the request in the **Microsoft 365 admin center** (agent and app requests). After approval, users can find the plugin in the store and admins can deploy it to groups.
4. For later versions, bump `version` in `manifest.json`, then provision, package, validate and publish again.

## 10.6 Clean up (after the workshop)

🗣️ **Say it in the app:** *"Identify the local and dev deployments for this workshop and explain what deleting each would remove. Ask which deployments I want to keep and obtain confirmation before deleting anything."*

⌨️ **Optional terminal equivalent (only for deployments you have decided to remove):**
```bash
wiqd plugin delete --env local --yes
wiqd plugin delete --env dev --yes       # only if you are not keeping the pilot
devtunnel delete fabrikam-leave
```
Then delete the client secret (or the whole app registration) in Entra ID.

## 10.7 Stretch: the same server as a custom federated connector

An admin can register `https://<host>/mcp/quick` directly in **Microsoft 365 admin center → Copilot → Connectors → Gallery → Create a new connector**, using the same OAuth app. Compare the two routes: an **admin-managed connector** versus a **developer-packaged plugin with skills**. Which would Fabrikam IT prefer, and why?

## ✅ Workshop complete
You've built an MCP server with MCP Apps, secured it with OAuth 2.0 and role-based authorization, composed a plugin with two scoped connectors and two skills using WIQD, tested it locally, shared it with real users and submitted it to your organisation's catalog.
