const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const { absolute } = require("./helpers");

const topDirs = ["00_RULE", "01_SERVER", "02_APP", "99_DOCS"];

test("각 최상위 작업 디렉터리는 README를 가진다", () => {
  for (const dir of topDirs) {
    assert.ok(fs.existsSync(absolute(`${dir}/README`)), `README 누락: ${dir}/README`);
  }
});
