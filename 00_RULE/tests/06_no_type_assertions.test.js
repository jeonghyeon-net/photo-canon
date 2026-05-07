const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { root, walkFiles } = require("./helpers");

const skipDirs = new Set([".git", ".next", ".pi", ".turbo", "build", "coverage", "dist", "node_modules", "tmp"]);
const unsafeTypeAssertion = /\bas\s+(any|unknown|never)\b/;

test("TypeScript에서 as any, as unknown, as never를 쓰지 않는다", () => {
  for (const file of walkFiles(".", skipDirs)) {
    if (!file.endsWith(".ts")) continue;
    const rel = path.relative(root, file);
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      assert.ok(!unsafeTypeAssertion.test(line), `${rel}:${index + 1} 타입 단언 금지: ${line.trim()}`);
    });
  }
});
