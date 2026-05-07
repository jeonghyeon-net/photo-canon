const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const { root } = require("./helpers");

const allowedRootEntries = new Set([
  ".git",
  ".github",
  ".gitignore",
  ".mise.local.toml",
  ".mise.toml",
  ".pi",
  "00_RULE",
  "01_SERVER",
  "02_APP",
  "99_DOCS",
  "LICENSE",
  "README",
  "bun.lock",
  "lefthook.yml",
  "mise.local.toml",
  "mise.toml",
  "package-lock.json",
  "package.json",
  "pnpm-lock.yaml",
  "yarn.lock",
]);

test("루트에는 허용된 항목만 둔다", () => {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    assert.ok(allowedRootEntries.has(entry.name), `허용되지 않은 루트 항목: ${entry.name}`);
  }
});
