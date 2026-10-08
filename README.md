# Copilot Plugin Cookbooks

Sample recipes for building plugins for Microsoft 365 Copilot using the [wiqd CLI](https://microsoft.github.io/wiqd/) and GitHub Copilot CLI.

Each plugin brings together components that shape a Copilot experience: skills,
connectors (including MCP connectors), and agents. A declarative agent is one
type of agent component. These cookbooks show how to build, combine, and
customize those components as complete plugins.

## Prerequisites

- **Node.js 24+** — [install via nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)
- **wiqd CLI** — `curl -fsSL https://aka.ms/wiqd/install.sh | bash`
- **GitHub Copilot CLI** — `npm install -g @github/copilot`
- **Microsoft 365 account** with access to Copilot
- **Azure subscription** for provisioning required resources

## Plugin cookbooks

Browse the full list of plugin recipes in the [wiqd Cookbooks](tools/wiqd/cookbooks/README.md).

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
