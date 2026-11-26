# Exercise 6: Skill for Connector 1, "leave-quick-answers" (15 min)

**Goal:** A skill that makes Copilot answer balance and tax-time questions reliably, in a consistent format, using only the Leave Quick Info tools.

Continue in the **GitHub Copilot desktop app** with **wiqd** selected.

## 6.1 Scaffold

🗣️ **Say it:** *"Add a skill called Leave Quick Answers to my plugin."*

⌨️ **Optional terminal equivalent:**
```bash
wiqd plugin add skill --name "Leave Quick Answers"
```
This creates `appPackage/skills/leave-quick-answers/SKILL.md` and registers it in `agentSkills[]`.

## 6.2 Know the rules

| Rule | Why |
|---|---|
| `name` is kebab-case and **must match the folder name** | It's the most common validation failure (`ASKILL-P006`). |
| `description` (1 to 1024 characters) holds the **trigger phrases** | It's the only part Copilot loads for unused skills. |
| Body = numbered workflow + tool names + output format | The body loads only when the skill triggers. |
| Put long material in `references/` | It loads on demand and keeps context small. |
| No secrets, ever | Auth lives in the connector. |

## 6.3 Write it

Replace the scaffold with the contents of `plugin-solution/appPackage/skills/leave-quick-answers/SKILL.md` and copy its `references/tax-working-days.md`. Then improve it yourself:
- Add 3 more trigger phrases your colleagues actually say, for example *"how many days off do I have"* or *"days worked for myTax"*.
- Decide how to answer *"Can I take next Friday off?"*. Should this skill check the balance and then hand over to `manage-leave`?

🗣️ **Say it in the app:** *"Copy the workshop's leave-quick-answers skill and tax-working-days reference into my plugin, preserving its folder name and frontmatter. Show the files and suggest three additional trigger phrases for me to review."*

🗣️ Or ask WIQD to draft it: *"Write the Leave Quick Answers skill. It must use get_leave_balance and get_working_days only, explain Australian financial years, include a tax caveat from a references file, and define an output format with a table."*

## 6.4 Validate offline

🗣️ **Say it in the app:** *"Run WIQD source validation for dev, the personal deployment environment used in Exercise 5. Report the actual result, explain any failures, and rerun after corrections. Do not provision yet."*

⌨️ **Optional terminal equivalent:**
```bash
wiqd plugin validate --mode source --env dev
```
> Source validation checks project structure and agent components. Skill content (`ASKILL-*` codes) and connector rules are checked by **package validation** in Exercise 10.

## ✅ Checkpoint
- The folder name and frontmatter `name` are both `leave-quick-answers`.
- The description includes at least 6 trigger phrases, and the body names both tools explicitly.
