# Hill-climb agent quality with evals

Create a focused evaluation suite, run it, diagnose the weakest behavior, fix
the agent rather than the test, and compare the next run. This recipe uses
WIQD's GitHub Copilot judge path, so Azure OpenAI credentials are not required
unless you deliberately select the Azure judge.

## Before you start

- Complete [Getting started](../../README.md#getting-started).
- Start in a declarative-agent project with non-empty instructions.
- Provision the agent before running live evals.
- Authenticate GitHub CLI if the GitHub Copilot judge cannot use an existing
  session: `gh auth login`.

## Initialize a focused suite

Start one interactive Copilot session from the agent project root:

```bash
copilot --agent wiqd:wiqd
```

Enter:

```text
Initialize WIQD evals for this provisioned agent. Inspect the manifest,
instructions, grounding sources, and actions. Propose a focused suite that
covers every applicable Perceive, Reason, and Act behavior plus boundaries and
failure handling. Show every proposed add or update as a diff and wait for my
approval before writing an eval file. Do not lower thresholds, remove
Groundedness or Citations, or delete a failing scenario to improve the score.
```

Review the proposed cases and approve only when they describe behavior the agent
should actually satisfy.

**Checkpoint:** `evals/prompts.json` contains approved, scenario-specific tests
rather than only generic starter prompts.

## Run and diagnose

Enter:

```text
Run the eval suite with WIQD using the GitHub Copilot judge and write a
timestamped HTML scorecard under .evals. Analyze failures by root cause:
instruction, grounding, citation, tool selection, capability gap, or a genuinely
incorrect eval. Report the weakest evaluator and the exact prompts that expose
the problem.
```

**Checkpoint:** the result includes a pass rate, per-evaluator scores, and a
root-cause diagnosis tied to specific prompts.

## Improve the agent, not the bar

Enter:

```text
Fix the highest-impact agent issue from the latest eval run. Preserve the eval
suite, evaluator coverage, and thresholds. Make the smallest instruction or
capability change that addresses the root cause, validate the project,
re-provision it, rerun the same eval suite, and compare the two scorecards.
Stop if the proposed fix would require weakening a test.
```

**Checkpoint:** the second report uses the same suite and shows whether the
targeted score improved. A regression remains visible instead of being hidden
by easier tests.

## Continue the hill climb

Repeat one root-cause fix at a time. Add a new regression case when a real gap is
discovered, but always review and approve the eval diff before it is written.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/wiqd/lifecycle/eval-hill-climb" />

---

Return to the [cookbook index](../../README.md).
