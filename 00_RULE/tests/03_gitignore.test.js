const assert = require("node:assert/strict");
const test = require("node:test");
const { readText } = require("./helpers");

const requiredGitignorePatterns = [
  ".DS_Store",
  ".env",
  ".env.*",
  "!.env.example",
  ".lefthook-local.yml",
  ".mise.local.toml",
  ".pi/",
  "*.db",
  "*.log",
  "*.out",
  "*.sqlite",
  "*.sqlite3",
  "*.test",
  "*.tsbuildinfo",
  "*.keystore",
  "*.jks",
  ".next/",
  ".turbo/",
  "build/",
  "coverage/",
  "dist/",
  "mise.local.toml",
  "node_modules/",
  "tmp/",
  "uploads/",
  "www/",
  ".netlify/",
  ".vercel/",
  "capacitor-build.log",
  "02_APP/android/app/src/main/assets/public/",
  "02_APP/android/app/src/main/assets/capacitor.config.json",
  "02_APP/android/app/src/main/assets/capacitor.plugins.json",
  "02_APP/ios/App/App/public/",
  "02_APP/ios/App/App/capacitor.config.json",
  "02_APP/ios/App/App/capacitor.plugins.json",
  ".gradle/",
  "local.properties",
  "*.iml",
  "02_APP/android/app/build/",
  "02_APP/android/app/release/",
  "02_APP/android/app/debug/",
  "Pods/",
  "xcuserdata/",
  "*.xcuserstate",
  "02_APP/ios/App/Pods/",
  "02_APP/ios/App/build/",
];

test(".gitignore는 필수 로컬/산출물 패턴을 가진다", () => {
  const lines = readText(".gitignore").split("\n");
  const seen = new Set(lines.map((line) => line.trim()).filter((line) => line && !line.startsWith("#")));
  for (const pattern of requiredGitignorePatterns) {
    assert.ok(seen.has(pattern), `.gitignore 필수 패턴 누락: ${pattern}`);
  }
});
