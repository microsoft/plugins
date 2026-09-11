import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(root, "README.md");
const recipeRoots = ["declarative-agents", "plugins", "lifecycle"];
const originalRecipes = [
  "demo-planning-agent",
  "insurance-agent-mcp",
  "mind-your-language-agent",
  "photobooth-agent",
  "translator-agent",
  "zero-to-agent",
  "microsoft-learn-mcp",
].map((name) =>
  name === "microsoft-learn-mcp"
    ? `plugins/${name}/README.md`
    : `declarative-agents/${name}/README.md`,
);
const newRecipes = [
  "declarative-agents/sharepoint-knowledge-agent/README.md",
  "declarative-agents/public-web-research-agent/README.md",
  "plugins/learn-tech-advisor/README.md",
  "lifecycle/eval-hill-climb/README.md",
  "lifecycle/devui-debugging/README.md",
  "lifecycle/team-delivery/README.md",
  "plugins/plugin-portability/README.md",
];
const expectedRecipes = [...originalRecipes, ...newRecipes].sort();
const failures = [];
const externalUrls = new Set();

function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const recipeFiles = recipeRoots
  .flatMap((directory) => walk(resolve(root, directory)))
  .filter((path) => path.endsWith("README.md"))
  .map((path) => relative(root, path).replaceAll("\\", "/"))
  .sort();

if (recipeFiles.length !== expectedRecipes.length) {
  failures.push(
    `Expected ${expectedRecipes.length} recipes, found ${recipeFiles.length}.`,
  );
}

const index = readFileSync(indexPath, "utf8");
const rowPattern = /^\|\s*(\d+)\s*\|\s*\[[^\]]+\]\(([^)]+README\.md)\)\s*\|/gm;
const indexedFiles = [...index.matchAll(rowPattern)].map((match) =>
  match[2].replace(/^\.\//, ""),
);

if (new Set(indexedFiles).size !== indexedFiles.length) {
  failures.push("Recipe table contains duplicate paths.");
}

function validateSection(heading, expectedPaths) {
  const start = index.indexOf(heading);
  if (start === -1) {
    failures.push(`Missing index section: ${heading}`);
    return;
  }

  const nextHeading = index.indexOf("\n## ", start + heading.length);
  const section = index.slice(start, nextHeading === -1 ? undefined : nextHeading);
  const rows = [...section.matchAll(rowPattern)];

  if (rows.length !== expectedPaths.length) {
    failures.push(
      `${heading} should contain ${expectedPaths.length} recipes, found ${rows.length}.`,
    );
    return;
  }

  rows.forEach((match, position) => {
    const number = Number(match[1]);
    const path = match[2].replace(/^\.\//, "");
    if (number !== position + 1) {
      failures.push(`${heading} number ${number} should be ${position + 1}.`);
    }
    if (path !== expectedPaths[position]) {
      failures.push(
        `${heading} item ${position + 1} should link to ${expectedPaths[position]}, found ${path}.`,
      );
    }
  });
}

validateSection("## Recipes", [
  "declarative-agents/zero-to-agent/README.md",
  "declarative-agents/translator-agent/README.md",
  "declarative-agents/photobooth-agent/README.md",
  "declarative-agents/mind-your-language-agent/README.md",
  "declarative-agents/insurance-agent-mcp/README.md",
  "declarative-agents/demo-planning-agent/README.md",
  "plugins/microsoft-learn-mcp/README.md",
]);
validateSection("## New highlight recipes", newRecipes);

if (indexedFiles.length !== expectedRecipes.length) {
  failures.push(
    `Expected ${expectedRecipes.length} indexed recipes, found ${indexedFiles.length}.`,
  );
}

for (const recipeFile of expectedRecipes) {
  if (!recipeFiles.includes(recipeFile)) {
    failures.push(`Expected recipe is missing: ${recipeFile}`);
  }
  if (!indexedFiles.includes(recipeFile)) {
    failures.push(`Recipe is missing from the index: ${recipeFile}`);
  }
}

const markdownFiles = [indexPath, ...recipeFiles.map((path) => resolve(root, path))];
const linkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;

for (const markdownPath of markdownFiles) {
  const content = readFileSync(markdownPath, "utf8");
  const displayPath = relative(root, markdownPath).replaceAll("\\", "/");

  if (markdownPath !== indexPath) {
    if (!content.includes("copilot --agent wiqd:wiqd")) {
      failures.push(`${displayPath} does not start the Wiqd Copilot agent.`);
    }
    if (!content.includes("**Checkpoint:**")) {
      failures.push(`${displayPath} has no checkpoint.`);
    }
    if (!content.includes("Return to the [cookbook index](../../README.md).")) {
      failures.push(`${displayPath} does not link back to the cookbook index.`);
    }
  }

  if (newRecipes.includes(displayPath)) {
    for (const line of content.split(/\r?\n/)) {
      const command = line.trim();
      if (
        command.startsWith("wiqd ") &&
        (!command.includes("--skill wiqd") || !command.includes("--workflow "))
      ) {
        failures.push(`${displayPath} has a Wiqd command without skill/workflow flags: ${command}`);
      }
    }
  }

  for (const match of content.matchAll(/https:\/\/[^\s)<>"'`]+/g)) {
    const rawUrl = match[0];
    const normalizedUrl = rawUrl.replace(/[.,;:]$/, "");
    externalUrls.add(normalizedUrl);
    if (newRecipes.includes(displayPath) && rawUrl !== normalizedUrl) {
      failures.push(`${displayPath} has trailing punctuation in a URL: ${rawUrl}`);
    }
    try {
      const url = new URL(normalizedUrl);
      if (
        url.hostname.endsWith(".sharepoint.com") ||
        url.hostname.endsWith(".devtunnels.ms")
      ) {
        failures.push(`${displayPath} contains a tenant-specific or temporary URL: ${url}`);
      }
    } catch {
      failures.push(`${displayPath} contains an invalid HTTPS URL: ${rawUrl}`);
    }
  }

  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(content)) {
    failures.push(`${displayPath} contains a concrete email address.`);
  }

  for (const match of content.matchAll(linkPattern)) {
    const target = match[1].trim();
    if (
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("mailto:") ||
      target.startsWith("#")
    ) {
      continue;
    }

    const path = target.split("#", 1)[0];
    if (path && !existsSync(resolve(dirname(markdownPath), path))) {
      failures.push(`${displayPath} has a broken relative link: ${target}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Cookbook validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${originalRecipes.length} original recipes, ${newRecipes.length} new highlights, ${markdownFiles.length} Markdown files, and ${externalUrls.size} external URLs.`,
);
