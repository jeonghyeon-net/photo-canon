const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { root, walkFiles } = require("./helpers");

const skipDirs = new Set([".git", ".pi", "node_modules"]);

test("Markdown 확장자 .md 파일은 만들지 않는다", () => {
  for (const file of walkFiles(".", skipDirs)) {
    const rel = path.relative(root, file);
    assert.ok(!file.toLowerCase().endsWith(".md"), `Markdown 확장자 금지: ${rel}`);
  }
});
