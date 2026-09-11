import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(root, "README.md");
const recipeRoots = ["declarative-agents", "plugins", "lifecycle"];
const retiredRecipes = [
  "demo-planning-agent",
  "insurance-agent-mcp",
  "mind-your-language-agent",
  "photobooth-agent",
  "translator-agent",
];
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

if (recipeFiles.length !== 10) {
  failures.push(`Expected 10 recipes, found ${recipeFiles.length}.`);
}

const index = readFileSync(indexPath, "utf8");
const rows = [
  ...index.matchAll(
    /^\|\s*(\d+)\s*\|\s*\[[^\]]+\]\(([^)]+README\.md)\)\s*\|/gm,
  ),
];

if (rows.length !== 10) {
  failures.push(`Expected 10 indexed recipes, found ${rows.length}.`);
}

const indexedFiles = rows.map((match, position) => {
  const number = Number(match[1]);
  if (number !== position + 1) {
    failures.push(`Recipe table number ${number} should be ${position + 1}.`);
  }

  return match[2].replace(/^\.\//, "");
});

if (new Set(indexedFiles).size !== indexedFiles.length) {
  failures.push("Recipe table contains duplicate paths.");
}

for (const recipeFile of recipeFiles) {
  if (!indexedFiles.includes(recipeFile)) {
    failures.push(`Recipe is missing from the index: ${recipeFile}`);
  }
}

for (const indexedFile of indexedFiles) {
  if (!recipeFiles.includes(indexedFile)) {
    failures.push(`Indexed recipe does not exist: ${indexedFile}`);
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

  for (const line of content.split(/\r?\n/)) {
    const command = line.trim();
    if (
      command.startsWith("wiqd ") &&
      (!command.includes("--skill wiqd") || !command.includes("--workflow "))
    ) {
      failures.push(`${displayPath} has a Wiqd command without skill/workflow flags: ${command}`);
    }
  }

  for (const match of content.matchAll(/https:\/\/[^\s)<>"']+/g)) {
    externalUrls.add(match[0]);
    if (/[.,;:]$/.test(match[0])) {
      failures.push(`${displayPath} has trailing punctuation in a URL: ${match[0]}`);
      continue;
    }
    try {
      const url = new URL(match[0]);
      if (
        url.hostname.endsWith(".sharepoint.com") ||
        url.hostname.endsWith(".devtunnels.ms")
      ) {
        failures.push(`${displayPath} contains a tenant-specific or temporary URL: ${url}`);
      }
    } catch {
      failures.push(`${displayPath} contains an invalid HTTPS URL: ${match[0]}`);
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

for (const retiredRecipe of retiredRecipes) {
  if (recipeFiles.some((path) => path.includes(`/${retiredRecipe}/`))) {
    failures.push(`Retired recipe is still present: ${retiredRecipe}`);
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
  `Validated ${recipeFiles.length} cookbook recipes, ${markdownFiles.length} Markdown files, and ${externalUrls.size} external URLs.`,
);
