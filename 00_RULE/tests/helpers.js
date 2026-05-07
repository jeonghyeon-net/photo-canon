const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");

function absolute(relPath) {
  return path.join(root, relPath);
}

function readText(relPath) {
  return fs.readFileSync(absolute(relPath), "utf8");
}

function walkFiles(startRelPath = ".", skipDirs = new Set()) {
  const files = [];

  function visit(absPath) {
    for (const entry of fs.readdirSync(absPath, { withFileTypes: true })) {
      if (entry.isDirectory() && skipDirs.has(entry.name)) {
        continue;
      }
      const child = path.join(absPath, entry.name);
      if (entry.isDirectory()) {
        visit(child);
        continue;
      }
      files.push(child);
    }
  }

  visit(absolute(startRelPath));
  return files;
}

module.exports = { absolute, readText, root, walkFiles };
