#!/usr/bin/env bash
# Exercise 3 - Creates the Entra ID app registration that protects the Fabrikam Leave MCP server.
# Run in Bash (WSL, Git Bash, macOS, Linux or Azure Cloud Shell) after: az login --tenant <your-tenant> --allow-no-subscriptions
# Usage: MANAGER_UPN=jordan@contoso.onmicrosoft.com ./setup-entra.sh
# Single-account demo: ./setup-entra.sh (skip the real manager role assignment)
set -euo pipefail

APP_NAME="${APP_NAME:-Fabrikam Leave MCP}"
REDIRECT_URI="https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect"   # Microsoft 365 plugin OAuth callback
AZ_CLI_CLIENT_ID="04b07795-8ddb-461a-bbee-02f9e1bf7b46"                       # lets you test tokens with `az account get-access-token`

TENANT_ID=$(az account show --query tenantId -o tsv)
SCOPE_ID=$(python3 -c 'import uuid;print(uuid.uuid4())')
ROLE_ID=$(python3 -c 'import uuid;print(uuid.uuid4())')

echo "Creating app registration '$APP_NAME'..."
APP_ID=$(az ad app create --display-name "$APP_NAME" --sign-in-audience AzureADMyOrg \
  --web-redirect-uris "$REDIRECT_URI" --query appId -o tsv)
OBJ_ID=$(az ad app show --id "$APP_ID" --query id -o tsv)
az ad app update --id "$APP_ID" --identifier-uris "api://$APP_ID"

echo "Exposing scope access_as_user, app role Leave.Approve and v2 access tokens..."
az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/$OBJ_ID" \
  --headers "Content-Type=application/json" --body @- <<JSON
{
  "api": {
    "requestedAccessTokenVersion": 2,
    "oauth2PermissionScopes": [{
      "id": "$SCOPE_ID", "value": "access_as_user", "type": "User", "isEnabled": true,
      "adminConsentDisplayName": "Access Fabrikam leave as the signed-in user",
      "adminConsentDescription": "Allows Copilot to read and manage the signed-in user's Fabrikam leave.",
      "userConsentDisplayName": "Access your Fabrikam leave",
      "userConsentDescription": "Allows Copilot to read and manage your Fabrikam leave."
    }]
  },
  "appRoles": [{
    "id": "$ROLE_ID", "value": "Leave.Approve", "displayName": "Leave approver",
    "description": "Managers who can approve or reject leave requests.",
    "allowedMemberTypes": ["User"], "isEnabled": true
  }]
}
JSON

az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/$OBJ_ID" \
  --headers "Content-Type=application/json" --body @- <<JSON
{ "api": { "preAuthorizedApplications": [{ "appId": "$AZ_CLI_CLIENT_ID", "delegatedPermissionIds": ["$SCOPE_ID"] }] } }
JSON

echo "Creating service principal and granting admin consent for the scope..."
az ad sp create --id "$APP_ID" >/dev/null
az ad app permission add --id "$APP_ID" --api "$APP_ID" --api-permissions "$SCOPE_ID=Scope" >/dev/null 2>&1 || true
sleep 15
az ad app permission admin-consent --id "$APP_ID" || echo "Admin consent failed; grant it in the Entra admin center (API permissions > Grant admin consent)."

if [[ -n "${MANAGER_UPN:-}" ]]; then
  echo "Assigning the Leave.Approve role to $MANAGER_UPN..."
  SP_OID=$(az ad sp show --id "$APP_ID" --query id -o tsv)
  MANAGER_OID=$(az ad user show --id "$MANAGER_UPN" --query id -o tsv)
  az rest --method POST --uri "https://graph.microsoft.com/v1.0/servicePrincipals/$SP_OID/appRoleAssignedTo" \
    --headers "Content-Type=application/json" \
    --body "{\"principalId\":\"$MANAGER_OID\",\"resourceId\":\"$SP_OID\",\"appRoleId\":\"$ROLE_ID\"}" >/dev/null
else
  echo "No MANAGER_UPN set; skipping real manager role assignment. Use the single-account demo for workshop testing."
fi

echo "Creating a client secret (store it safely - you need it once, in the Teams Developer Portal)..."
SECRET=$(az ad app credential reset --id "$APP_ID" --display-name "copilot-oauth" --years 1 --query password -o tsv)

cat <<OUT

========================= Done =========================
Add to mcp-server/.env:
  AUTH_MODE=entra
  TENANT_ID=$TENANT_ID
  API_CLIENT_ID=$APP_ID

Teams Developer Portal > Tools > OAuth client registration (Exercise 4):
  Client ID          : $APP_ID
  Client secret      : $SECRET
  Authorization URL  : https://login.microsoftonline.com/$TENANT_ID/oauth2/v2.0/authorize
  Token URL          : https://login.microsoftonline.com/$TENANT_ID/oauth2/v2.0/token
  Refresh URL        : https://login.microsoftonline.com/$TENANT_ID/oauth2/v2.0/token
  Scope              : api://$APP_ID/access_as_user offline_access

Do NOT commit the secret. Close this terminal when you've copied it.
=========================================================
OUT
