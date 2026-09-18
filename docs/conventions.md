# Conventions

## Cookbook layout

- Place wiqd cookbooks under `tools/wiqd/cookbooks/` in the category that best
	matches the recipe: `declarative-agents`, `plugins`, or `lifecycle`.
- Use a lowercase, hyphen-separated directory name and keep the entry point in a
	`README.md` file.
- Add new cookbooks to the appropriate table in
	`tools/wiqd/cookbooks/README.md`.

## Writing recipes

- Start with a concrete outcome and keep the recipe focused on one end-to-end
	scenario.
- State prerequisites and supported tool versions before the steps that use
	them.
- Use fenced code blocks for commands and identify the shell where it matters.
- Explain placeholders and environment-specific values. Never commit working
	credentials, secrets, tenant identifiers, personal data, or confidential
	information.
- Include a way to verify the result. Include cleanup steps when a recipe creates
	cloud or Microsoft 365 resources.
- Prefer stable public documentation links and relative links for files in this
	repository.
- Use clear, inclusive language and write instructions directly to the reader.

## Before submitting

Run every command you changed in a suitable test environment, verify all links,
and review the rendered Markdown. Keep pull requests focused and describe any
steps that could not be validated.
