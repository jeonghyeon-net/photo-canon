const assert = require("node:assert/strict");
const test = require("node:test");
const { readText } = require("./helpers");

const rulesTestCommand = "node --test 00_RULE/tests/*.test.js";

test("lefthook은 commit/push 전에 규칙 테스트를 실행한다", () => {
  const content = readText("lefthook.yml");
  for (const hook of ["pre-commit:", "pre-push:"]) {
    assert.ok(content.includes(hook), `lefthook.yml에 ${hook} 설정 누락`);
  }
  const count = content.split(rulesTestCommand).length - 1;
  assert.equal(count, 2, "규칙 테스트 명령은 pre-commit/pre-push에 각각 있어야 함");
});
