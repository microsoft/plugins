// Authentication (who are you?) + authorization helpers (what may you do?).
//
// AUTH_MODE=none  -> Exercise 2. No token. Identity = "x-demo-user" header or DEMO_USER env (employee id or UPN).
// AUTH_MODE=entra -> Exercise 3+. OAuth 2.0 bearer token issued by Microsoft Entra ID, validated locally with JWKS.
import { createRemoteJWKSet, jwtVerify } from "jose";
import { store } from "./store.js";

const cfg = () => ({
  mode: (process.env.AUTH_MODE || "none").toLowerCase(),
  tenantId: process.env.TENANT_ID,
  clientId: process.env.API_CLIENT_ID,
  scope: process.env.REQUIRED_SCOPE || "access_as_user",
  approverRole: process.env.APPROVER_ROLE || "Leave.Approve",
  baseUrl: (process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3001}`).replace(/\/$/, "")
});

let jwks;
function getJwks(tenantId) {
  jwks ??= createRemoteJWKSet(new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`));
  return jwks;
}

/** RFC 9728 protected resource metadata - tells MCP clients which authorization server to use. */
export function protectedResourceMetadata(resourcePath = "/mcp") {
  const c = cfg();
  return {
    resource: `${c.baseUrl}${resourcePath}`,
    authorization_servers: [`https://login.microsoftonline.com/${c.tenantId}/v2.0`],
    scopes_supported: [`api://${c.clientId}/${c.scope}`],
    bearer_methods_supported: ["header"],
    resource_name: "Fabrikam People Hub - Leave"
  };
}

function unauthorized(res, req, message) {
  const c = cfg();
  const metadataUrl = `${c.baseUrl}/.well-known/oauth-protected-resource${req.baseUrl || req.path}`;
  res.set("WWW-Authenticate", `Bearer error="invalid_token", error_description="${message}", resource_metadata="${metadataUrl}"`);
  res.status(401).json({ jsonrpc: "2.0", error: { code: -32001, message }, id: null });
}

/** Explicit opt-in for one-account workshops; never substitutes for token validation. */
export function singleAccountDemo() {
  const enabled = process.env.SINGLE_ACCOUNT_DEMO;
  if (!enabled || enabled === "false") return null;
  if (enabled !== "true") throw new Error("SINGLE_ACCOUNT_DEMO must be true or false.");
  if (process.env.NODE_ENV === "production") throw new Error("Single-account demo is not allowed in production.");
  if (cfg().mode !== "entra") throw new Error("Single-account demo requires AUTH_MODE=entra.");
  const upn = (process.env.TEST_USER_UPN || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+$/.test(upn)) throw new Error("Set TEST_USER_UPN to your own sign-in name.");
  const id = { user: "E1001", manager: "M2001" }[process.env.DEMO_PERSONA];
  if (!id) throw new Error("DEMO_PERSONA must be user or manager.");
  const employee = store.findEmployee(id);
  if (!employee) throw new Error(`Demo employee ${id} is missing from the HR data.`);
  return { upn, employee };
}

/** Resolve claims only after the middleware has verified the token and required scope. */
export function userFromToken(payload) {
  const c = cfg();
  const upn = String(payload.preferred_username || payload.upn || payload.email || "").trim().toLowerCase();
  const demo = singleAccountDemo();
  const simulated = demo?.upn === upn;
  const employee = simulated ? demo.employee : store.findEmployee(upn);
  if (!employee) return null;
  const roles = simulated
    ? (employee.role === "manager" ? [c.approverRole] : [])
    : (Array.isArray(payload.roles) ? payload.roles : []);
  return { employee, upn, roles, isManager: roles.includes(c.approverRole), authMode: "entra", isDemo: simulated };
}

/** Express middleware: sets req.user = { employee, upn, roles, isManager, authMode } */
export function authenticate() {
  singleAccountDemo();
  return async (req, res, next) => {
    const c = cfg();
    try {
      if (c.mode === "none") {
        const who = req.get("x-demo-user") || process.env.DEMO_USER || "E1001";
        const employee = store.findEmployee(who);
        if (!employee) return res.status(403).json({ error: `Unknown demo user "${who}". Use E1001, E1002 or M2001.` });
        req.user = { employee, upn: employee.upn, roles: employee.role === "manager" ? [c.approverRole] : [], authMode: "none" };
      } else {
        const header = req.get("authorization") || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;
        if (!token) return unauthorized(res, req, "Sign-in required");
        const { payload } = await jwtVerify(token, getJwks(c.tenantId), {
          issuer: `https://login.microsoftonline.com/${c.tenantId}/v2.0`,
          audience: [c.clientId, `api://${c.clientId}`]
        });
        const scopes = String(payload.scp || "").split(" ");
        if (!scopes.includes(c.scope)) return unauthorized(res, req, `Token is missing the ${c.scope} scope`);
        const user = userFromToken(payload);
        if (!user) {
          const upn = String(payload.preferred_username || payload.upn || payload.email || "");
          return res.status(403).json({ jsonrpc: "2.0", error: { code: -32003, message: `${upn} is not in the Fabrikam HR system.` }, id: null });
        }
        req.user = user;
      }
      req.user.isManager = req.user.roles.includes(c.approverRole);
      next();
    } catch (err) {
      return unauthorized(res, req, `Invalid token: ${err.code || err.message}`);
    }
  };
}

/** Authorization guard used inside tools. Throws a friendly error when the caller lacks the approver role. */
export function requireApprover(user) {
  if (!user.isManager) {
    const err = new Error(`Only managers can approve leave. ${user.employee.name} does not have the "${cfg().approverRole}" role.`);
    err.code = "FORBIDDEN";
    throw err;
  }
}
