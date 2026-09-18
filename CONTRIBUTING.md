# Contributing

This project welcomes contributions and suggestions. Most contributions require
you to agree to a Contributor License Agreement (CLA) declaring that you have
the right to, and actually do, grant us the rights to use your contribution. For
details, visit the [Microsoft CLA](https://opensource.microsoft.com/cla/).

When you submit a pull request, a CLA bot will automatically determine whether
you need to provide a CLA and decorate the pull request appropriately (for
example, with a status check and comment). Follow the instructions provided by
the bot. You only need to do this once across all repositories using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any
additional questions or comments.

## Before you contribute

- Search [existing issues](https://github.com/microsoft/plugins/issues) and pull
  requests before starting work.
- Open an issue before making a substantial change so the approach can be
  discussed with the maintainers.
- Never include secrets, credentials, tenant data, personal data, or other
  confidential information in a recipe, example, screenshot, or test output.
- Report suspected security vulnerabilities privately as described in
  [SECURITY.md](SECURITY.md), not in a public issue.

## Make a contribution

1. Fork the repository, clone your fork, and create a branch from `main` in your
   fork. Do not create or push contribution branches directly to this repository.
2. Make a focused change that follows the existing cookbook structure and the
   guidance in [docs/conventions.md](docs/conventions.md).
3. For a new cookbook, include prerequisites, complete commands, expected
   outcomes, validation steps, cleanup guidance where resources are created,
   and links to authoritative documentation.
4. Test every command and link you changed. Remove generated files, local
   configuration, credentials, tenant-specific identifiers, and test output.
5. Update the relevant cookbook index or documentation when adding, moving, or
   renaming content.
6. Open a pull request from your fork to this repository's `main` branch with a
   concise description of the change, how it was validated, and any limitations
   or follow-up work.

AI-assisted contributions are welcome, but contributors remain responsible for
reviewing and validating their submissions for accuracy, security, licensing,
and compliance with the Code of Conduct.

## Pull request review

Maintainers may ask for changes before merging. A pull request must pass all
required checks and CLA validation. Approval does not guarantee that a change
will be merged; maintainers may decline changes that do not fit the repository's
scope or maintenance goals.

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).