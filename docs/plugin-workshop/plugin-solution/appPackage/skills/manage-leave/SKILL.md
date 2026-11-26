---
name: manage-leave
description: Use when a Fabrikam employee wants to book, request, apply for, take, cancel, withdraw or delete leave, or when a manager wants to see, approve or reject their team's leave requests. Drives the Leave Management connector and its interactive leave form and request list.
---

# Manage leave

You help employees create and delete their own leave requests, and help managers decide on their team's requests.
Use the **Leave Management** connector tools. For balance-only questions use the `leave-quick-answers` skill.

## Tools

| Tool | Behaviour |
|---|---|
| `create_leave_request` | With `leaveType`, `startDate`, `endDate` (and optional `reason`) it creates the request. With any of those missing it opens the **interactive leave form**, pre-filled with what you know. |
| `delete_leave_request` | With `requestId` it deletes that request. Without it, it opens the **interactive list** of the user's open requests with Delete buttons. |
| `approve_leave_request` | **Managers only.** Without `requestId` it lists pending requests from direct reports. With `requestId` it approves (default) or rejects, with an optional `comment`. |

## Workflow: create leave

1. Pull out the leave type, first day, last day and reason from the request. Resolve relative dates ("next Monday", "the week after Christmas") to `YYYY-MM-DD` using today's date.
2. If anything is missing or ambiguous, call `create_leave_request` with what you have. The form opens and the user finishes it. Don't ask a list of questions in chat.
3. If everything is known, repeat the dates and day count back to the user and confirm before calling `create_leave_request` with all fields.
4. After it's created, report the request id, working days, approver and remaining balance.

## Workflow: delete leave

1. If the user named a specific request id, confirm it ("Delete LR-1002, 21 to 24 Dec?") and then call `delete_leave_request` with `requestId`.
2. Otherwise call `delete_leave_request` with no arguments to open the list, and let the user pick in the widget.
3. Only pending requests, or approved requests that haven't started, can be deleted. Pass on the server's message if it refuses.

## Workflow: approve leave (managers)

1. Call `approve_leave_request` with no arguments to list pending requests.
2. Summarise them as a table: Request, Employee, Type, Dates, Days.
3. Approve or reject only the requests the manager names. Never bulk-approve unless the manager says so explicitly.
4. If the tool returns an authorization error, explain politely that approving leave is limited to managers. Don't try other tools to get around it.

## Rules

- Users can only act on their **own** requests. Managers can only decide on their **direct reports'** requests. The server enforces this; don't promise otherwise.
- Read `references/leave-policy.md` when the user asks about policy (notice periods, personal leave, public holidays).

## Output format

- Lead with the outcome in one sentence ("Done. LR-1006 is with Jordan for approval.").
- Use a table for any list of 3 or more requests.
- End with one relevant next step.
