# Exercise 4: Create a plugin with WIQD, with authentication (20 min)

**Goal:** You have a new WIQD plugin project ("Fabrikam Leave") and the Entra OAuth settings needed to register its connector authentication in Exercise 5. You also know where every value lives.

## 4.1 Open the GitHub Copilot app and create the plugin

1. Open the **GitHub Copilot desktop app**. Use **Sessions → + → Open local folder** to connect a working folder for the new plugin, separate from `mcp-server`.
2. Start an **Interactive** session in that folder. Open the **Default agent** selector and choose **wiqd**.
3. If **wiqd** is missing, install the WIQD plugin through **Customize** as described in [Exercise 1](01-understand-requirements-and-tools.md), then start a new session. Installing the WIQD CLI alone is not enough.
4. Keep the same authoring session for Exercises 4–10. The prompts below go into the app, not into a terminal. Review proposed file changes and command approvals.

🗣️ **Say it in the app:**
> Check my WIQD development environment and explain any blocking issues. Verify Node.js 24.15 or later, the WIQD CLI, and my signed-in Microsoft 365 development tenant. Once ready, create a standalone Microsoft 365 Copilot plugin called Fabrikam Leave in a new project folder. Publisher Fabrikam IT, website https://www.fabrikam.example/people-hub, privacy https://www.fabrikam.example/privacy, terms https://www.fabrikam.example/terms. Show the generated project root and use it as the working directory for subsequent WIQD commands. Summarize the generated files. Do not provision yet.

The GitHub Copilot app is the **authoring surface**. Your finished plugin will run in **Microsoft 365 Copilot Chat or Cowork**. You do not need the standalone GitHub Copilot CLI or `gh` CLI; WIQD still runs its own CLI behind the app. Complete browser sign-in and consent yourself if prompted.

⌨️ **Optional terminal equivalent:**
```bash
wiqd auth login --interactive
wiqd plugin create --name "Fabrikam Leave"
cd fabrikam-leave          # use the folder name the command reports
wiqd plugin show
```

Take a look at what was generated:

| File | Purpose |
|---|---|
| `appPackage/manifest.json` | Root app manifest (pinned to `manifestVersion` **1.29**). This is where `agentConnectors[]` and `agentSkills[]` will go. |
| `appPackage/color.png`, `outline.png` | 192×192 and 32×32 icons. You can copy ours from `plugin-solution/appPackage`. |
| `m365agents.yml` | Lifecycle steps for provision, package and publish. |
| `env/` | Per-environment files. Inspect effective scope: Exercise 5 uses personal scope in `dev`; Exercise 10 explicitly changes it for the shared pilot. |

Edit `appPackage/manifest.json` and set `name`, `description` and `developer` to match `plugin-solution/appPackage/manifest.json`.

🗣️ **Say it in the app:** *"Set the generated manifest's name, description and developer fields to match the workshop's plugin-solution/appPackage/manifest.json. Ask me for the workshop repository path if it is not accessible. Show the changes."*

## 4.2 Prepare the OAuth settings (authentication for the plugin)

Copilot must get a token for **your API** on behalf of each user. The secret is stored in Microsoft's token vault, and the manifest only holds a **reference id** (`OAuthPluginVault`).

> Entra ID has **no dynamic client registration** (RFC 7591), so use a **static** registration with the app you created in Exercise 3.

The Entra app from Exercise 3 and the **OAuth auth configuration** used by Copilot are different records. `setup-entra.sh` creates the Entra app; it does **not** generate `LEAVE_OAUTH_REFERENCE_ID`. In Exercise 5, WIQD's `oauth/register` lifecycle action creates the auth configuration and writes its returned `configurationId` to that variable.

Keep these settings from Exercise 3 ready:

| Field | Value |
|---|---|
| Base URL | `https://<your-tunnel-host>/mcp` (the common MCP endpoint; connectors append `/quick` or `/manage`) |
| Client ID | The Entra `API_CLIENT_ID` from Exercise 3 |
| Client secret | The secret **value** from Exercise 3, not its secret ID; enter it securely, never in chat or the manifest |
| Authorization endpoint | `https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/authorize` |
| Token endpoint / Refresh endpoint | `https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token` |
| Scope | `api://<client-id>/access_as_user offline_access` |
| Client type | The workshop script creates a confidential **Web** app with the Teams OAuth callback and a client secret |

Do not silently switch this Web app to a secretless client. A secretless PKCE route requires a correctly configured public/SPA app and matching OAuth settings; it is a separate setup.

Use the WIQD registration flow in [Exercise 5](05-connector-quick-info.md). If you already created an OAuth configuration manually in the Teams Developer Portal, that exercise explains how to reuse its ID instead.

## 4.3 Keep environment-specific values out of the manifest

Add these to **both** `env/.env.local` and `env/.env.dev`. Leave the reference ID **empty** until registration succeeds:
```
LEAVE_MCP_BASE_URL=https://<your-tunnel-host>/mcp
LEAVE_OAUTH_REFERENCE_ID=
```
🗣️ **Say it in the app:** *"Add LEAVE_MCP_BASE_URL using my real MCP endpoint including /mcp, with no trailing slash, and an empty LEAVE_OAUTH_REFERENCE_ID to env/.env.local and env/.env.dev. Ask me for the URL if missing. Do not invent a reference ID or use the Entra client ID as one. We will register OAuth and provision in Exercise 5."*

These are **plugin project** environment files, not `mcp-server/.env`. Do not use `TODO`, a dummy UUID or a literal placeholder for the reference ID: a populated value can cause `oauth/register` to skip creation.

Packaging resolves `${{...}}` placeholders from the selected environment file. When you move from a tunnel to Azure later, you change one line, not the manifest.

## ✅ Checkpoint
🗣️ **Check in the app:** *"Show my plugin with WIQD and verify there are no components yet. Check that no client secret was written into the project; report file paths only, never secret values."*

- WIQD's plugin summary lists your plugin, with no components yet.
- You have the Entra client ID, tenant ID, callback and scope ready; `LEAVE_OAUTH_REFERENCE_ID` is empty unless you already have a real OAuth vault configuration.
- No secret values are in chat, the manifest or tracked project files.
