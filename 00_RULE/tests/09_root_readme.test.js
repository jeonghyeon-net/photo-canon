const assert = require("node:assert/strict");
const test = require("node:test");
const { readText } = require("./helpers");

const requiredText = [
  "photo-canon",
  "Cloudflare Workers",
  "Cloudflare D1",
  "Capacitor",
  "Android, iOS, Browser",
  "00_RULE",
  "01_SERVER",
  "02_APP",
  "99_DOCS",
  "node --test 00_RULE/tests/*.test.js",
  "mise exec -- lefthook run pre-commit --force",
  "Markdown 확장자 .md 파일은 만들지 않는다.",
];

test("루트 README는 현재 구조와 스택을 설명한다", () => {
  const content = readText("README");
  for (const text of requiredText) {
    assert.ok(content.includes(text), `README 필수 내용 누락: ${text}`);
  }
});
