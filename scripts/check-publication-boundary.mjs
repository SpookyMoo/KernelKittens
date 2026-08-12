import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const patternPath = resolve(repoRoot, "src/data/publication-patterns.json");
const patterns = JSON.parse(await readFile(patternPath, "utf8")).map((item) => ({
  label: item.label,
  pattern: new RegExp(item.source, item.flags)
}));
const sourceOnly = process.argv.includes("--source-only");
const roots = [resolve(repoRoot, "src/content/writeups")];
const readableExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".txt", ".xml"]);
const violations = [];
let filesScanned = 0;

if (!sourceOnly) {
  roots.push(resolve(repoRoot, "dist"));
}

async function walk(target) {
  let targetStat;

  try {
    targetStat = await stat(target);
  } catch {
    violations.push({ path: relative(repoRoot, target), label: "required release directory missing" });
    return;
  }

  if (targetStat.isDirectory()) {
    const children = await readdir(target);
    for (const child of children) {
      await walk(resolve(target, child));
    }
    return;
  }

  if (!readableExtensions.has(extname(target).toLowerCase())) {
    return;
  }

  filesScanned += 1;
  const text = await readFile(target, "utf8");
  for (const item of patterns) {
    if (item.pattern.test(text)) {
      violations.push({ path: relative(repoRoot, target), label: item.label });
    }
  }
}

for (const root of roots) {
  await walk(root);
}

if (violations.length > 0) {
  for (const violation of violations) {
    console.error(`${violation.path}: ${violation.label}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Publication boundary passed (${filesScanned} files scanned).`);
}
