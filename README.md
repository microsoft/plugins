# Microsoft 365 Copilot plugin samples and cookbooks

This repository provides samples and guided cookbooks for building plugins and
their components for Microsoft 365 Copilot.

A plugin can combine connectors, skills, and agents into a complete Copilot
experience. Use the samples to explore working implementations, then follow the
WIQD cookbooks to build, test, improve, and deliver your own plugins.

## What's in this repository

| Content | Status | Explore |
|---------|--------|---------|
| Plugin samples | Two available | [Browse plugin samples](samples/plugins/) |
| Connector samples | Coming soon | Standalone connector samples will be added to `samples/connectors/` |
| Skill samples | Coming soon | Standalone skill samples will be added to `samples/skills/` |
| WIQD cookbooks | Available | [Browse WIQD cookbooks](tools/wiqd/cookbooks/README.md) |

## Plugin samples

| Sample | Components | What it demonstrates |
|--------|------------|----------------------|
| [Microsoft Learn Helper](samples/plugins/microsoft-learn-plugin/README.md) | Microsoft Learn MCP connector | A plugin that searches and reads current official Microsoft documentation and code samples through the public Microsoft Learn MCP server |
| [Retirement Radar](samples/plugins/retirement-radar-plugin/README.md) | Microsoft Learn MCP connector and Retirement Radar skill | A plugin that checks code, scripts, configuration, and architecture notes for deprecated or retired Microsoft technologies and recommends supported replacements |

More plugin samples are planned. Standalone connector and skill samples are
coming soon.

## WIQD cookbooks

The [WIQD cookbooks](tools/wiqd/cookbooks/README.md) are short, end-to-end
recipes for creating and improving plugins with the
[wiqd CLI](https://microsoft.github.io/wiqd/). They cover declarative agents,
MCP connectors, skills, grounding, evaluation, debugging, portability, and team
delivery.

You can follow the cookbooks with the GitHub Copilot app or GitHub Copilot CLI:

- **GitHub Copilot app:** open the **Default agent** selector and choose
  **wiqd**.
- **GitHub Copilot CLI:** install it with
  `npm install -g @github/copilot`, then run
  `copilot --agent wiqd:wiqd`.

See the [cookbook getting started guide](tools/wiqd/cookbooks/README.md#getting-started)
for Node.js, WIQD, Microsoft 365, authentication, and Azure requirements.

## Contributing

Contributions are welcome. Before opening an issue or pull request, read the
[contribution guidelines](CONTRIBUTING.md) for the CLA requirement, cookbook
standards, validation expectations, and review process. Contributions must be
submitted by pull request from a fork; do not push contribution branches directly
to this repository. Participation in this project is governed by the
[Microsoft Open Source Code of Conduct](CODE_OF_CONDUCT.md).

For help with these samples, see [SUPPORT.md](SUPPORT.md). Report suspected
security vulnerabilities privately according to [SECURITY.md](SECURITY.md).

## Disclaimers

> **wiqd is in preview.** Work IQ Dev Tools (wiqd) are currently in preview. Commands, APIs, and behaviors may change before the 1.0 release. See the [wiqd documentation](https://microsoft.github.io/wiqd/) for the latest information.

> **Sample purposes only.** The plugins, components, and recipes in this repository are provided as samples for learning and demonstration purposes. They are not intended for production use. AI-generated responses may be inaccurate, incomplete, or inappropriate. Always review and validate plugin behavior before sharing with end users.

## Trademarks

This project may contain trademarks or logos for projects, products, or
services. Authorized use of Microsoft trademarks or logos is subject to and must
follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must
not cause confusion or imply Microsoft sponsorship. Any use of third-party
trademarks or logos is subject to those third parties' policies.

<img src="https://m365-visitor-stats.azurewebsites.net/PluginCookbooks/README" />
