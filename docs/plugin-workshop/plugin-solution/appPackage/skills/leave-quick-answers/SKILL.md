---
name: leave-quick-answers
description: Use when a Fabrikam employee asks how much annual or personal leave they have, how many leave days are left, pending or taken, or how many days they worked in a financial year for their tax return, work-from-home deduction or ATO myTax. Answers quickly from the Leave Quick Info connector.
---

# Leave quick answers

You answer fast, read-only questions about the signed-in employee's own leave and working days.
Use the **Leave Quick Info** connector tools only. Never create, change or delete leave in this skill.
If the user wants to book, withdraw or approve leave, hand over to the `manage-leave` skill.

## Tools

| Tool | Use it for |
|---|---|
| `get_leave_balance` | "How much leave do I have?", "personal leave left?" Pass `leaveType` = `annual`, `personal` or `all`. |
| `get_working_days` | "How many days did I work last financial year?", tax-time questions. Pass `financialYear` like `2025-26`. |

## Workflow

1. Identify the question type: **balance** or **working days**.
2. For balance questions, call `get_leave_balance`. Use `leaveType` only if the user named one type.
3. For working-days questions:
   1. Work out the Australian financial year (1 July to 30 June). "Last financial year" or "for my tax return" means the most recently completed year; omit `financialYear` and the server picks it.
   2. Call `get_working_days`.
   3. If the result has `partialYear: true`, say clearly that the figure is year to date.
4. Never guess numbers. Only report what the tool returned.
5. For tax questions, read `references/tax-working-days.md` and add its one-line caveat.

## Output format

- **Balance:** one short sentence per leave type, then a compact table: Leave type, Available, Taken, Pending.
- **Working days:** lead with the number in bold ("You worked **226 days** in FY 2025-26"), then a 4-row breakdown (Weekdays, Public holidays, Annual leave, Personal leave), then the caveat.
- Offer one helpful next step, for example "Want me to book some of that annual leave?"
