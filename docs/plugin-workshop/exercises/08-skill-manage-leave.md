# Exercise 8: Skill for Connector 2, "manage-leave" (15 min)

**Goal:** A skill that drives the multi-step leave workflows safely: create via the form, delete via the list, and approve only for managers.

Continue in the **GitHub Copilot desktop app** with **wiqd** selected.

## 8.1 Scaffold

🗣️ **Say it in the app:** *"Add a skill called Manage Leave to my plugin."*

⌨️ **Optional terminal equivalent:** `wiqd plugin add skill --name "Manage Leave"`

## 8.2 Design principles to apply

| Principle | How the solution applies it |
|---|---|
| **Let the UI do the work** | If any field is missing, call `create_leave_request` with what you have. The form opens, so there's no 20-questions chat. |
| **Confirm before writes** | Read back the dates and day count before calling with all fields, and confirm the request id before deleting. |
| **Least privilege in language** | "Approve only the requests the manager names. Never bulk-approve unless asked." |
| **Respect server authz** | "If the tool returns an authorization error, explain it. Don't try other tools to get around it." |
| **Hand-offs** | Balance-only questions go to `leave-quick-answers`. |
| **Predictable output** | One-sentence outcome first, a table for 3 or more items, and one next step. |

## 8.3 Write it

Copy `plugin-solution/appPackage/skills/manage-leave/SKILL.md` and `references/leave-policy.md`, then:
- Add how to resolve "the week after next" and "Boxing Day week" into dates.
- Add a rule for managers booking their **own** leave (their requests route to HR in the sample data).

🗣️ **Say it in the app:** *"Copy the workshop's manage-leave skill and leave-policy reference into my plugin. Preserve the authorization and confirmation rules. Propose rules for relative dates and managers booking their own leave, and show the changes for review."*

## 8.4 Validate

🗣️ **Say it in the app:** *"Run WIQD source validation for dev, retaining the personal scope from Exercise 5, and show my plugin. Verify it has two connectors and two skills, and report any failures."*

⌨️ **Optional terminal equivalent:**
```bash
wiqd plugin validate --mode source --env dev
wiqd plugin show          # 2 connectors, 2 skills
```

## ✅ Checkpoint
- Both skill folders match their `name`, and the descriptions don't overlap (balance vs manage).
- The manage skill names all 3 tools and includes the authorization rule.
