const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const testFilePattern = /^\d{2}_.+\.test\.js$/;
const allowedSupportFiles = new Set(["helpers.js"]);

test("tests 디렉터리는 번호가 붙은 테스트와 헬퍼만 가진다", () => {
  for (const entry of fs.readdirSync(__dirname, { withFileTypes: true })) {
    assert.ok(!entry.isDirectory(), `허용되지 않은 디렉터리: ${entry.name}`);
    const allowed = allowedSupportFiles.has(entry.name) || testFilePattern.test(entry.name);
    assert.ok(allowed, `허용되지 않은 파일: ${entry.name}`);
  }
});
