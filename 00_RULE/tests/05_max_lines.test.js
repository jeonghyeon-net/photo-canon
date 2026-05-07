const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { root, walkFiles } = require("./helpers");

const maxLines = 200;
const skipDirs = new Set([
  ".git",
  ".next",
  ".pi",
  ".turbo",
  "99_DOCS",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "tmp",
]);
const skipFiles = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock"]);

function countLines(content) {
  if (content.length === 0) return 0;
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const newlines = (normalized.match(/\n/g) || []).length;
  return normalized.endsWith("\n") ? newlines : newlines + 1;
}

test("파일은 최대 200줄까지 허용한다", () => {
  for (const file of walkFiles(".", skipDirs)) {
    if (skipFiles.has(path.basename(file))) continue;
    const lines = countLines(fs.readFileSync(file, "utf8"));
    const rel = path.relative(root, file);
    assert.ok(lines <= maxLines, `${rel}: ${lines}줄 (최대 ${maxLines}줄)`);
  }
});
