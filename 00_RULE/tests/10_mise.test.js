const assert = require("node:assert/strict");
const test = require("node:test");
const { readText } = require("./helpers");

const requiredConfig = [
  'disable_tools = ["go"]',
  'node = "24.15.0"',
  'lefthook = "2.1.6"',
];

test("mise.toml은 필요한 도구를 정확한 버전으로 고정한다", () => {
  const content = readText("mise.toml");
  for (const value of requiredConfig) {
    assert.ok(content.includes(value), `mise.toml 설정 누락: ${value}`);
  }
  assert.ok(!content.includes('go ='), "mise.toml에 서버 스택 밖 도구를 두지 않는다");
  assert.ok(!content.includes('latest'), "mise.toml에서 latest를 쓰지 않는다");
  assert.ok(!content.includes('lts'), "mise.toml에서 lts를 쓰지 않는다");
});
