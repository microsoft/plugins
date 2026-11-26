# Exercise 7: Connector 2, "Leave Management" (15 min)

**Goal:** Add the second connector for the **write** operations: create (MCP App), delete (MCP App) and approve (managers only).

Continue in the **GitHub Copilot desktop app** with **wiqd** selected.

## 7.1 Look at the tool description first

Open `appPackage/tools/manage-tools.json` and find:
- `_meta.ui.resourceUri` on `create_leave_request` and `delete_leave_request`. This is what makes Copilot render the **MCP App** widgets.
- `destructiveHint: true` on `delete_leave_request`. Hosts can use this to ask for confirmation.
- "MANAGERS ONLY" in the description of `approve_leave_request`. It's a hint for the model; the server enforces the rule (Exercise 3).

## 7.2 Add the connector

🗣️ **Say it:**
> Add a second connector called "Leave Management" with URL ${{LEAVE_MCP_BASE_URL}}/manage, resolving to https://&lt;tunnel&gt;/mcp/manage, tool description tools/manage-tools.json, and the same OAuthPluginVault reference bound to LEAVE_OAUTH_REFERENCE_ID from Exercise 5. If WIQD rejects the environment expression as its authoring URL, use the resolved HTTPS URL, then retain the environment-bound URL in the manifest. Do not create another OAuth registration. Description: "Manage leave in the Fabrikam HR system: create a leave request (interactive form), delete a pending or future leave request (interactive list), and, for managers only, approve or reject their direct reports' leave."

⌨️ **Optional terminal equivalent:**
```bash
wiqd plugin add connector \
  --name "Leave Management" \
  --description "Manage leave in the Fabrikam HR system: create a leave request (interactive form), delete a pending or future leave request (interactive list), and, for managers only, approve or reject their direct reports' leave." \
  --url "https://<tunnel-host>/mcp/manage" \
  --tool-description tools/manage-tools.json \
  --auth-type oauth --auth-reference-id '${{LEAVE_OAUTH_REFERENCE_ID}}'
```

## 7.3 Discuss: one OAuth registration, two connectors

Both connectors point to the same API (`api://<client-id>`) on the same host, so they share one OAuth registration. Users sign in once per connector connection.
*When would you split them?* For example, when the write API lives in a different system with a different identity provider.

## 7.4 Check the widget security basics
- Widgets are **single-file HTML** with no external scripts or fonts. That avoids CSP failures.
- Widgets call tools only through `callServerTool`, so they inherit the **user's token**. There's no separate API key.
- The delete widget uses a **two-step confirm**.

## ✅ Checkpoint
🗣️ **Check in the app:** *"Show my plugin with WIQD. Verify two connectors with unique IDs, the shared OAuth reference, and the UI resource metadata on create and delete."*

- WIQD's plugin summary lists **2 connectors**.
- The manifest has two `agentConnectors[]` entries with unique ids (`leave-quick-info`, `leave-management`).
