# Exercise 3: Add OAuth 2.0 authentication and manager-only authorization (35 min)

**Goal:** The server accepts only Entra ID bearer tokens for your API (**authentication**), maps the token to a Fabrikam employee, and allows `approve_leave_request` only when the token carries the `Leave.Approve` app role (**authorization**).

```
Copilot ──(OAuth 2.0 auth code + PKCE, via Teams token service)──► Entra ID
   │                                                              │ access token (aud = your API, scp = access_as_user, roles = [Leave.Approve]?)
   └──── POST /mcp/manage  Authorization: Bearer <token> ─────────► MCP server → verify signature/issuer/audience/scope → map UPN → check role
```

## 3.1 Register the API in Entra ID

**Option A: script (2 minutes)**
```bash
cd entra
MANAGER_UPN=<manager-upn> bash setup-entra.sh
```
Replace `<manager-upn>` with the real manager account's sign-in name. Use `bash setup-entra.sh` rather than `./setup-entra.sh` so the command works even if the script's executable permission was not preserved when downloading or copying the workshop.

With only your own account, run this from `entra`:
```bash
bash setup-entra.sh
```
Omit `MANAGER_UPN` to skip assigning the role to a real account. The script still creates the app and role. OAuth app setup still requires Entra app-registration permissions.

The script creates the app registration:
- Redirect URI `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect` (the Microsoft 365 plugin OAuth callback)
- Application ID URI `api://<client-id>`, delegated scope **`access_as_user`**, and v2 access tokens
- App role **`Leave.Approve`**, assigned to the account in `MANAGER_UPN` when supplied
- Pre-authorizes Azure CLI so you can test tokens from the terminal
- A client secret, printed **once**. Keep it for Exercise 4.

**Option B: Entra admin center (manual)**
1. **App registrations → New registration:** "Fabrikam Leave MCP", single tenant, Web redirect `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`.
2. **Expose an API:** set the Application ID URI to `api://<client-id>` and add the scope `access_as_user` (Admins and users).
3. **Manifest:** set `"requestedAccessTokenVersion": 2`.
4. **App roles → Create:** display name "Leave approver", value `Leave.Approve`, member type Users/Groups.
5. **Certificates & secrets:** create a new client secret and copy it.
6. **Enterprise applications → Fabrikam Leave MCP → Users and groups:** assign **Jordan** to *Leave approver*.

For the single-account demo, skip step 6. If the enterprise app requires user assignment, assign your account access to sign in; the persona switch does not bypass Entra sign-in restrictions.

## 3.2 Switch the server to Entra mode

Edit `mcp-server/.env`:
```
AUTH_MODE=entra
TENANT_ID=<tenant-id>
API_CLIENT_ID=<client-id>
EMPLOYEE_UPN=<employee-upn>
SECOND_EMPLOYEE_UPN=<second-employee-upn>
MANAGER_UPN=<manager-upn>
```
For **one-account testing**, leave those three mappings blank and set `TEST_USER_UPN` to your own sign-in name instead. From `mcp-server`, run `npm run demo:role -- user` and restart the server.

In single-account **user** mode, your logged-in account (matching `TEST_USER_UPN` in the validated token) is mapped to **E1001 (Alex Chen)**. Leave balance and request tools therefore return E1001's sample HR records, not your real workplace leave data. You do not need a separate account for Alex. Switching to `manager` maps the same logged-in account to **M2001 (Jordan Smith)** instead.

Restart `npm run dev`.

## 3.3 Walk through the code (`src/auth.js`)

| Concern | Implementation |
|---|---|
| No token → **401** + `WWW-Authenticate: Bearer ... resource_metadata="..."` | `unauthorized()` |
| Discovery for MCP clients (RFC 9728) | `GET /.well-known/oauth-protected-resource[/mcp/...]` → `protectedResourceMetadata()` |
| Signature, issuer, audience | `jwtVerify(token, JWKS, { issuer: .../{tenant}/v2.0, audience: [clientId, api://clientId] })` |
| Scope | `scp` must contain `access_as_user` |
| Identity → employee | `preferred_username` → `store.findEmployee(upn)`. Unknown users get **403**. |
| **Authorization** | `roles` claim → `req.user.isManager`. `approve_leave_request` calls `requireApprover(user)` **before** doing anything. It also checks that the request belongs to a **direct report**. |

**Single-account exception (opt-in):** `SINGLE_ACCOUNT_DEMO=true` maps only `TEST_USER_UPN` to the selected `DEMO_PERSONA` and simulates its role **after** all OAuth checks pass. Other accounts still use their normal mappings and token roles. This tests the tool authorization guards, not real Entra role assignment. Do not use it on a shared server; `NODE_ENV=production` rejects it.

> **Defense in depth:** the skill (Exercise 8) tells Copilot that only managers can approve, but the **server** is what enforces it. Never rely on the prompt for security.

## 3.4 Test as each user

```bash
# 1. No token -> 401 with resource_metadata
curl -i -X POST https://<tunnel>/mcp -H "content-type: application/json" -d '{}'

# 2. Discovery document
curl -s https://<tunnel>/.well-known/oauth-protected-resource/mcp

# 3. Sign in as Alex, get a token and call approve -> authorization error
az login --tenant <tenant> --allow-no-subscriptions        # sign in as alex@...
TOKEN=$(az account get-access-token --scope api://<client-id>/access_as_user --query accessToken -o tsv)
curl -s https://<tunnel>/mcp/manage -H "authorization: Bearer $TOKEN" -H "content-type: application/json" -H "accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"approve_leave_request","arguments":{}}}'
# -> "Only managers can approve leave. Alex Chen does not have the "Leave.Approve" role."

# 4. Repeat signed in as Jordan -> lists Alex's and Priya's pending requests
```
For one account, reuse your valid token, switch with `npm run demo:role -- user` or `npm run demo:role -- manager`, restart the MCP server, and repeat the approval call. In user mode it is denied; in manager mode it lists both employees' pending requests. The token's actual `roles` claim is unchanged. See [Exercise 9](09-provision-and-test-locally.md) for the full sequence.

## 3.5 Stretch
- Hide `approve_leave_request` from non-managers entirely: in `registerLeaveServer`, skip registration when `!user.isManager`. What's the trade-off with the packaged tool description file?
- In the enterprise application, turn on **Assignment required** and assign only the 3 demo users.

## ✅ Checkpoint
- Without a token you get **401**. Alex is **denied** approval, and Jordan can approve.
- You can explain why the **client secret** never goes in the plugin manifest. Only a *reference id* does (Exercise 4).
