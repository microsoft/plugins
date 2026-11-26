# Exercise 5: Connector 1, "Leave Quick Info" (quick services only) (20 min)

**Goal:** Author the read-only connector, configure static Entra OAuth, provision with **personal scope in dev**, and verify the generated OAuth configuration ID in the actual deployment package.

Continue in the **GitHub Copilot desktop app** with **wiqd** selected. Paste the prompts below into the app, not a terminal. Review proposed changes and approve deployment separately.

**Two different surfaces:** GitHub Copilot authors and provisions the plugin. **Microsoft 365 Copilot Chat or Cowork** installs it, obtains user OAuth consent, and calls the live tools. Provisioning success does not verify those runtime steps.

## 5.1 Check prerequisites and create the standalone plugin

If Exercise 4 already created your plugin, use its project root and proceed to section 5.2; do not create a duplicate. Otherwise, open a working folder in the app and paste:

> Check my WIQD development environment. Verify Node.js 24.15 or later, the WIQD CLI, and my signed-in Microsoft 365 development account. Explain blocking issues without treating Partner Center or Work IQ status as requirements for local scaffolding.
>
> Create a standalone Microsoft 365 Copilot plugin called Fabrikam Leave in a new project folder. Publisher: Fabrikam IT. Website: https://www.fabrikam.example/people-hub, privacy: https://www.fabrikam.example/privacy, terms: https://www.fabrikam.example/terms.
>
> Show the generated project root and use that root for subsequent project operations. Summarize the generated files. Do not add components or provision yet.

**Expected result:** a bare plugin containing the app manifest, icons, lifecycle files, environment files, and development-support files, **not a declarative agent**.

The `.example` addresses are lab placeholders, not production publication URLs.

## 5.2 Verify the empty starting point

Paste into the app:

> Show my plugin with WIQD and confirm it has zero agents, zero skills, and zero connectors. Check project files, including hidden files, for literal client-secret values. Report matching paths only, never secret values. Distinguish environment-variable references from stored secrets. Do not provision.

**Reported result from the supplied run:** zero components; no stored client-secret values detected. Secret-variable references in YAML and documentation were not credentials. Run this check against your own project rather than assuming that result.

## 5.3 Add the provided tool-description files

Attach `quick-tools.json` and `manage-tools.json` from the workshop's `plugin-solution/appPackage/tools`, then paste:

> Copy both attachments unchanged into appPackage/tools. Verify that quick-tools.json contains exactly get_leave_balance and get_working_days, each with annotations.readOnlyHint: true. Confirm both copies match their attachments. Do not add connectors yet or change the MCP server's authentication settings.

**Expected result:** both files exist and match the attachments. Merely copying `manage-tools.json` does **not** create a management connector.

The server's `/mcp/quick` endpoint registers only the two read-only tools. Its packaged description is the tool contract; server-side scoping prevents write tools from being called through this endpoint.

## 5.4 Configure static Entra OAuth before adding the connector

Use the real values from Exercise 3. `LEAVE_OAUTH_REFERENCE_ID` is a **Teams OAuth auth configuration ID in Microsoft's token store**, not the Entra client ID, tenant ID, client secret ID, Teams app ID, or an access token.

Paste into the app:

> Configure static Entra OAuth using my existing confidential Web application. Ask for the real tenant ID, OAuth client ID, API scope, and tunnel URL if missing. Never ask me to paste the client secret into chat.
>
> Define LEAVE_MCP_BASE_URL in local and dev as my existing MCP endpoint, including /mcp. Leave LEAVE_OAUTH_REFERENCE_ID empty unless it contains a verified real Teams OAuth configuration ID, not a client ID.
>
> Update the existing oauth/register action, or add it if absent, in both m365agents.yml and m365agents.local.yml. Preserve all other steps. Place it after teamsApp/create and before package creation.
>
> Use applicableToApps: AnyApp, appId: ${{TEAMS_APP_ID}}, tenant-specific v2 authorization/token/refresh endpoints, the complete scope api://<API_APP_ID>/access_as_user offline_access, flow: authorizationCode, identityProvider: Custom, tokenExchangeMethodType: PostRequestBody, and isPKCEEnabled: false.
>
> Reference the client secret through a process environment variable only. Map configurationId directly to LEAVE_OAUTH_REFERENCE_ID. Show the non-secret configuration. Do not provision or create another Entra application.

**Important:** verify the existing Web application's redirect URI is:

```text
https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect
```

For this workshop, `LEAVE_MCP_BASE_URL` includes `/mcp` and has no trailing slash:

```dotenv
LEAVE_MCP_BASE_URL=https://<your-tunnel-host>/mcp
LEAVE_OAUTH_REFERENCE_ID=
```

These variables belong in the **generated plugin project's** `env/.env.local` and `env/.env.dev`, not `mcp-server/.env`. If upgrading the earlier host-only convention, append `/mcp` once and use `/quick` and `/manage` in the connector manifest, not `/mcp/quick` and `/mcp/manage`.

The relevant registration action should have this shape in both lifecycle files:

```yaml
  - uses: oauth/register
    with:
      name: fabrikam-leave-oauth
      appId: ${{TEAMS_APP_ID}}
      applicableToApps: AnyApp
      clientId: ${{LEAVE_MCP_CLIENT_ID}}
      clientSecret: ${{SECRET_LEAVE_MCP_CLIENT_SECRET}}
      authorizationUrl: https://login.microsoftonline.com/${{LEAVE_TENANT_ID}}/oauth2/v2.0/authorize
      tokenUrl: https://login.microsoftonline.com/${{LEAVE_TENANT_ID}}/oauth2/v2.0/token
      refreshUrl: https://login.microsoftonline.com/${{LEAVE_TENANT_ID}}/oauth2/v2.0/token
      scope: api://${{LEAVE_MCP_CLIENT_ID}}/access_as_user offline_access
      flow: authorizationCode
      identityProvider: Custom
      isPKCEEnabled: false
      tokenExchangeMethodType: PostRequestBody
      baseUrl: ${{LEAVE_MCP_BASE_URL}}
    writeToEnvironmentFile:
      configurationId: LEAVE_OAUTH_REFERENCE_ID
```

Set `LEAVE_TENANT_ID` and `LEAVE_MCP_CLIENT_ID` to the real tenant and OAuth client IDs in the plugin's environment files. The scope must identify the protected **API app**, even if the OAuth client and API app are different; the workshop script uses the same app for both.

Do not store the secret in any project file, including a gitignored user env file. Supply `SECRET_LEAVE_MCP_CLIENT_SECRET` only to the process that provisions in section 5.7.

Keep the output ID empty before first registration. Do not use a dummy UUID or `TODO`: `oauth/register` can skip creation when its output variable is populated. If a real registration already exists, verify it in the Teams Developer Portal and reuse it. Its app restriction must be **Any Teams app**, equivalent to `applicableToApps: AnyApp`; use **My organization only** for the workshop's organization restriction.

### Metadata discovery 404s are not registration failures

The supplied run encountered metadata-discovery **404s**, not an OAuth-registration failure. This server exposes protected-resource metadata; it does not implement every authorization-server discovery path. Entra also does not support dynamic client registration.

Use the existing Entra application's tenant-specific endpoints above rather than treating a missing discovery URL as proof that registration or provisioning failed. Verify the actual response and lifecycle result; do not dismiss unrelated 404s.

## 5.5 Add Leave Quick Info

Paste into the app:

> Add a connector called Leave Quick Info.
>
> Description: "Read-only quick answers from the Fabrikam HR system: the signed-in employee's annual and personal leave balance, and working days per Australian financial year for tax returns."
>
> Use ${{LEAVE_MCP_BASE_URL}}/quick, resolving to /mcp/quick, and tool description tools/quick-tools.json. Use OAuthPluginVault with referenceId set literally to ${{LEAVE_OAUTH_REFERENCE_ID}}, even while its value is empty.
>
> Do not invent a registration ID or create another OAuth registration. If WIQD rejects an environment expression as its URL input, use the resolved HTTPS URL for authoring, then preserve the environment-bound URL in the manifest. Do not provision.

**Expected result:** one connector, zero agents, zero skills. The existing registration action remains the sole registration action in each lifecycle.

The supplied run encountered a **connector-authoring URL validation error**. The authoring command may require a resolved HTTPS URL even though the source manifest supports environment expressions. For example, author with your real `https://<tunnel-host>/mcp/quick`, then retain this source-manifest fragment:

```json
"remoteMcpServer": {
  "mcpServerUrl": "${{LEAVE_MCP_BASE_URL}}/quick",
  "authorization": {
    "type": "OAuthPluginVault",
    "referenceId": "${{LEAVE_OAUTH_REFERENCE_ID}}"
  },
  "mcpToolDescription": { "file": "tools/quick-tools.json" }
}
```

The YAML output and manifest reference must use the **same variable name**. The description file path is relative to `appPackage`.

## 5.6 Validate and obtain deployment approval

Paste into the app:

> Validate this connector-only plugin for dev. Confirm the current Microsoft 365 account and tenant. Inspect effective deployment scope rather than assuming it from the environment name.
>
> This lab requires personal provisioning in dev. If dev is shared, explain the mismatch and request approval to change dev only to AGENT_SCOPE=personal.
>
> Verify OAuth registration precedes packaging, its output maps to LEAVE_OAUTH_REFERENCE_ID, and the connector retains that environment reference. Explain source-validation limitations.
>
> Explain the tenant changes and ask for approval before provisioning. Do not share or submit the plugin to the organization catalog.

Approval should cover creating the Teams app and **AnyApp OAuth vault registration**, uploading the package, and personal provisioning. It does **not** imply tenant-wide publication or changes to the MCP server.

Source validation does not prove that OAuth consent, live MCP calls, or all packaged skill/connector checks work. Review the actual validation result before approving deployment.

## 5.7 Secure secret entry, provisioning, and verification

After approval, paste:

> Guide me through hidden client-secret entry in a secure terminal panel within the app. Do not request it in chat, print it, or save it in project files. Run provisioning in the same process environment that holds the secret, then clear it, including on failure.
>
> Provision once in dev. Stop and report the actual error if registration or provisioning fails.
>
> On success, verify that env/.env.dev contains a nonempty service-generated LEAVE_OAUTH_REFERENCE_ID, distinct from the client ID, and that the actual generated ZIP's connector references that exact ID. Confirm the packaged quick-tool list contains exactly get_leave_balance and get_working_days.
>
> Report the actual result and the returned Cowork and Chat installation links. Never fabricate links or claim live MCP functionality has been tested.

The provisioning command is `wiqd plugin provision --env dev`, run in the **same process environment** as hidden secret entry. A secret entered in an unrelated terminal is not automatically available to the app's provisioning process. Do not automatically retry or recreate the registration after an error.

**App-flow caveat:** the supplied successful run still required hidden entry in the app's terminal panel. A completely chat-only secret-entry mechanism was **not demonstrated**.

## 5.8 Verified stopping point

**Reported final run supplied for this lab update:**
- Provisioning completed with **exit code 0** and **personal scope in dev**.
- The plugin contained **one connector**, zero agents, and zero skills.
- A service-generated OAuth configuration ID matched between `env/.env.dev` and the connector in the actual generated ZIP.
- Cowork and Chat installation links were returned.

**There was no observed OAuth-registration or provisioning failure in that final run.** The actual errors encountered were metadata-discovery 404s and the connector-authoring URL validation error.

**Installation, user OAuth consent, and live calls to the two tools were not verified.** Do not infer those outcomes from successful provisioning or returned links.

## 5.9 Separate follow-up: install, consent, and test live tools

These are subsequent lab steps, not verified results from section 5.8:

1. Open an **actual installation link returned by provisioning** in Microsoft 365 Copilot Chat or Cowork with the same work/school account and tenant. Install the plugin and enable it in a fresh session.
2. Keep the MCP server in `AUTH_MODE=entra` and the tunnel hosting. For single-account employee testing, set `TEST_USER_UPN`, run `npm run demo:role -- user` from `mcp-server`, and restart the server. Your authenticated account maps to **E1001**, not your real workplace HR records.
3. Run the following prompts in **Microsoft 365 Copilot**, not the GitHub Copilot authoring app:

| Prompt | Required evidence |
|---|---|
| "Use Fabrikam Leave to show my annual and personal leave balances." | Complete sign-in/consent when prompted; observe a successful `get_leave_balance` call and the mapped employee's two balances. |
| "Use Fabrikam Leave to count my working days for financial year 2025-26." | Observe a successful `get_working_days` call for that FY and inspect its count and breakdown. |

For unchanged seed data in FY 2026-27, E1001's annual available balance is **17.5 days**. If earlier tests changed requests, compare with current HR data instead. The skill added in Exercise 6 controls the final answer format; this follow-up checks actual authentication and tool use.

If installation, consent, or a live call fails, capture the actual error and return to WIQD for diagnosis. A plausible answer without a connector call does not pass.

## ✅ Checkpoint

- The intended account and tenant were confirmed, and effective **dev** scope is **personal**.
- Source validation and the approved provisioning run succeeded.
- The actual generated ZIP contains one quick connector, the correct two-tool description, and the exact service-generated OAuth reference from `env/.env.dev`.
- Installation links came from the provisioning result.
- Installation, consent and live-tool verification are recorded separately as pending until performed.

References: [Microsoft's OAuth auth configuration guide](https://learn.microsoft.com/en-us/plugins/plugin-authentication-oauth) and [WIQD's OAuth registration lifecycle guidance](https://github.com/microsoft/wiqd/blob/main/plugins/wiqd/skills/wiqd/references/wiqd-core/authentication.md).
