// MCP tool + MCP App (UI resource) registration.
// One server, three "profiles" so each connector only sees the tools it needs:
//   all    -> /mcp         (Exercises 2-3: everything, handy for MCP Inspector)
//   quick  -> /mcp/quick   (Connector 1 "Leave Quick Info":   balance + working days)
//   manage -> /mcp/manage  (Connector 2 "Leave Management":   create, delete, approve)
import { z } from "zod";
import { store } from "./store.js";
import { requireApprover } from "./auth.js";
import { loadWidget } from "./widgets.js";
import {
  LEAVE_TYPES, leaveBalances, workingDaysForFy, validateNewRequest,
  businessDaysBetween, fyForDate, todayIso
} from "./leave-logic.js";

export const MCP_APP_MIME = "text/html;profile=mcp-app";
export const WIDGETS = {
  leaveRequest: { name: "leave-request", uri: "ui://fabrikam-leave/leave-request.html", title: "Leave request form" },
  manageRequests: { name: "manage-requests", uri: "ui://fabrikam-leave/manage-requests.html", title: "My leave requests" }
};

export const PROFILES = {
  all: ["get_leave_balance", "get_working_days", "create_leave_request", "delete_leave_request", "approve_leave_request"],
  quick: ["get_leave_balance", "get_working_days"],
  manage: ["create_leave_request", "delete_leave_request", "approve_leave_request"]
};

// ---------- helpers ----------
const ok = (text, structuredContent) => ({ content: [{ type: "text", text }], structuredContent });
const fail = (message) => ({ content: [{ type: "text", text: message }], isError: true });
const fmtDays = (n) => `${n} day${n === 1 ? "" : "s"}`;
const withDays = (r) => ({ ...r, days: businessDaysBetween(r.startDate, r.endDate) });
const nameOf = (id) => store.findEmployee(id)?.name ?? id;

function myOpenRequests(employee) {
  const today = todayIso();
  return store.requests()
    .filter((r) => r.employeeId === employee.id && (r.status === "pending" || (r.status === "approved" && r.startDate > today)))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map(withDays);
}

function guard(handler) {
  return async (args, extra) => {
    try { return await handler(args ?? {}, extra); }
    catch (err) { return fail(err.message); }
  };
}

// ---------- registration ----------
export function registerLeaveServer(server, user, profile = "all") {
  const enabled = new Set(PROFILES[profile] ?? PROFILES.all);
  const me = user.employee;
  const policy = () => store.policy();

  // MCP Apps: the HTML templates the host renders in a sandboxed iframe.
  const needsForm = enabled.has("create_leave_request");
  const needsList = enabled.has("delete_leave_request");
  for (const w of [needsForm && WIDGETS.leaveRequest, needsList && WIDGETS.manageRequests].filter(Boolean)) {
    server.registerResource(w.name, w.uri, { title: w.title, mimeType: MCP_APP_MIME, description: `Fabrikam ${w.title} widget` },
      async (uri) => ({ contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: loadWidget(w.name) }] }));
  }

  // 1) Leave balance --------------------------------------------------------
  if (enabled.has("get_leave_balance")) {
    server.registerTool("get_leave_balance", {
      title: "Get leave balance",
      description: "Returns the signed-in employee's current annual leave and personal leave balance for this financial year: opening balance, entitlement, days taken, days pending approval and days available.",
      inputSchema: {
        leaveType: z.enum(["annual", "personal", "all"]).optional().describe("Which balance to return. Defaults to all.")
      },
      annotations: { readOnlyHint: true, openWorldHint: false }
    }, guard(async ({ leaveType = "all" }) => {
      let balances = leaveBalances({ employee: me, requests: store.requests(), policy: policy() });
      if (leaveType !== "all") balances = balances.filter((b) => b.leaveType === leaveType);
      const text = `${me.name} - FY ${balances[0].financialYear}: ` +
        balances.map((b) => `${b.label} ${b.available} days available (${b.taken} taken, ${b.pending} pending)`).join("; ");
      return ok(text, { employee: { id: me.id, name: me.name }, balances });
    }));
  }

  // 2) Working days per financial year (tax time) ---------------------------
  if (enabled.has("get_working_days")) {
    server.registerTool("get_working_days", {
      title: "Get working days for a financial year",
      description: "Counts the signed-in employee's working days in an Australian financial year (1 July - 30 June) for tax purposes, e.g. to support a work-from-home deduction. Working days = weekdays - public holidays - approved leave. Current financial year is counted up to today.",
      inputSchema: {
        financialYear: z.string().regex(/^\d{4}-\d{2}$/).optional().describe("Financial year in the form 2025-26. Defaults to the most recently completed financial year.")
      },
      annotations: { readOnlyHint: true, openWorldHint: false }
    }, guard(async ({ financialYear }) => {
      const current = fyForDate(todayIso());
      const previous = `${Number(current.slice(0, 4)) - 1}-${current.slice(2, 4)}`;
      const fy = financialYear || previous;
      const result = workingDaysForFy({ employee: me, requests: store.requests(), fyLabel: fy });
      const text = `${me.name} worked ${result.workingDays} days in FY ${fy} (${result.periodStart} to ${result.periodEnd}${result.partialYear ? ", year to date" : ""}). ` +
        `Weekdays ${result.weekdays}, public holidays ${result.publicHolidays}, annual leave ${result.leaveDays.annual}, personal leave ${result.leaveDays.personal}.`;
      return ok(text, { employee: { id: me.id, name: me.name }, ...result });
    }));
  }

  // 3) Create leave request (MCP App: form) ---------------------------------
  if (enabled.has("create_leave_request")) {
    server.registerTool("create_leave_request", {
      title: "Create leave request",
      description: "Creates an annual or personal leave request for the signed-in employee and routes it to their manager. If any field is missing, opens an interactive leave request form (pre-filled with whatever is known) so the user can complete and submit it. Always confirm dates with the user before calling with all fields.",
      inputSchema: {
        leaveType: z.enum(LEAVE_TYPES).optional().describe("annual or personal"),
        startDate: z.string().optional().describe("First day of leave, YYYY-MM-DD"),
        endDate: z.string().optional().describe("Last day of leave, YYYY-MM-DD (inclusive)"),
        reason: z.string().max(200).optional().describe("Short reason shown to the approver")
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WIDGETS.leaveRequest.uri } }
    }, guard(async ({ leaveType, startDate, endDate, reason }) => {
      const balances = leaveBalances({ employee: me, requests: store.requests(), policy: policy() });
      const manager = me.managerId ? { id: me.managerId, name: nameOf(me.managerId) } : { id: "HR", name: "HR" };
      if (!leaveType || !startDate || !endDate) {
        return ok("Opened the leave request form. Ask the user to complete it, or collect leave type, start date and end date in chat.",
          { mode: "form", prefill: { leaveType, startDate, endDate, reason }, balances, approver: manager, today: todayIso() });
      }
      const { days, balanceAfter } = validateNewRequest({ employee: me, requests: store.requests(), policy: policy(), leaveType, startDate, endDate });
      const created = store.addRequest({ employeeId: me.id, leaveType, startDate, endDate, reason: reason || "", status: "pending", approverId: manager.id });
      const fresh = leaveBalances({ employee: me, requests: store.requests(), policy: policy() });
      return ok(`Created ${created.id}: ${fmtDays(days)} of ${leaveType} leave from ${startDate} to ${endDate}, sent to ${manager.name} for approval. ${balanceAfter} days will remain.`,
        { mode: "created", request: { ...created, days }, approver: manager, balances: fresh, today: todayIso() });
    }));
  }

  // 4) Delete leave request (MCP App: list with delete buttons) -------------
  if (enabled.has("delete_leave_request")) {
    server.registerTool("delete_leave_request", {
      title: "Delete leave request",
      description: "Deletes (withdraws) one of the signed-in employee's own leave requests that is pending, or approved but not yet started. Without a requestId, opens an interactive list of the employee's open requests so they can pick one to delete. Confirm with the user before deleting.",
      inputSchema: {
        requestId: z.string().regex(/^LR-\d+$/).optional().describe("Leave request id, e.g. LR-1002. Omit to show the list.")
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      _meta: { ui: { resourceUri: WIDGETS.manageRequests.uri } }
    }, guard(async ({ requestId }) => {
      if (!requestId) {
        const open = myOpenRequests(me);
        return ok(open.length ? `${me.name} has ${open.length} open request(s): ${open.map((r) => `${r.id} ${r.leaveType} ${r.startDate}..${r.endDate} (${r.status})`).join("; ")}.` : `${me.name} has no open leave requests.`,
          { mode: "list", requests: open, today: todayIso() });
      }
      const target = store.requests().find((r) => r.id === requestId);
      if (!target) return fail(`Leave request ${requestId} was not found.`);
      if (target.employeeId !== me.id) return fail(`You can only delete your own leave requests. ${requestId} belongs to someone else.`);
      if (!(target.status === "pending" || (target.status === "approved" && target.startDate > todayIso()))) {
        return fail(`${requestId} is ${target.status} and has already started or finished, so it can't be deleted. Contact HR.`);
      }
      store.deleteRequest(requestId);
      return ok(`Deleted ${requestId} (${target.leaveType} leave ${target.startDate} to ${target.endDate}). The days are back in the balance.`,
        { mode: "deleted", deleted: withDays(target), requests: myOpenRequests(me), today: todayIso() });
    }));
  }

  // 5) Approve leave (managers only) ----------------------------------------
  if (enabled.has("approve_leave_request")) {
    server.registerTool("approve_leave_request", {
      title: "Approve or reject leave (managers only)",
      description: "MANAGERS ONLY. Without a requestId, lists leave requests from the manager's direct reports that are waiting for a decision. With a requestId, approves (default) or rejects that request with an optional comment. Non-managers receive an authorization error.",
      inputSchema: {
        requestId: z.string().regex(/^LR-\d+$/).optional().describe("Leave request id to decide on. Omit to list pending approvals."),
        decision: z.enum(["approve", "reject"]).optional().describe("Defaults to approve"),
        comment: z.string().max(200).optional().describe("Note to the employee")
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false }
    }, guard(async ({ requestId, decision = "approve", comment }) => {
      requireApprover(user); // <-- authorization: role check from the OAuth token (or demo role)
      const reports = new Set(store.employees().filter((e) => e.managerId === me.id).map((e) => e.id));
      if (!requestId) {
        const pending = store.requests().filter((r) => r.status === "pending" && reports.has(r.employeeId))
          .map((r) => ({ ...withDays(r), employeeName: nameOf(r.employeeId) }));
        return ok(pending.length ? `${pending.length} request(s) awaiting your decision: ${pending.map((r) => `${r.id} ${r.employeeName} ${r.leaveType} ${r.startDate}..${r.endDate} (${fmtDays(r.days)})`).join("; ")}.` : "No leave requests are waiting for your approval.",
          { mode: "pending", requests: pending });
      }
      const target = store.requests().find((r) => r.id === requestId);
      if (!target) return fail(`Leave request ${requestId} was not found.`);
      if (!reports.has(target.employeeId)) return fail(`${requestId} is not from one of your direct reports.`);
      if (target.status !== "pending") return fail(`${requestId} is already ${target.status}.`);
      const updated = store.updateRequest(requestId, {
        status: decision === "approve" ? "approved" : "rejected",
        decidedBy: me.id, decidedAt: new Date().toISOString(), decisionComment: comment || ""
      });
      return ok(`${decision === "approve" ? "Approved" : "Rejected"} ${requestId} for ${nameOf(updated.employeeId)} (${updated.startDate} to ${updated.endDate}).`,
        { mode: "decided", request: { ...withDays(updated), employeeName: nameOf(updated.employeeId) } });
    }));
  }
}
