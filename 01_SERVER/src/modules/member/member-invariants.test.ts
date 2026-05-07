/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const serverRoot = join(currentDir, "..", "..", "..");

function readMigration(name: string): string {
  return readFileSync(join(serverRoot, "migrations", name), "utf8");
}

test("member public contract exposes tag string but not internal tag number", () => {
  const contract = readFileSync(join(currentDir, "member-contract.ts"), "utf8");
  assert.match(contract, /nickname: string/);
  assert.match(contract, /tag: string/);
  assert.doesNotMatch(contract, /tagNumber/);
});

test("member storage rejects invalid member values at DB boundary", () => {
  const migration = readMigration("0005-member-invariant-triggers.sql");
  for (const text of ["invalid member nickname", "invalid member tag number", "invalid member role", "invalid member status"]) {
    assert.ok(migration.includes(text), text);
  }
});

test("member identity storage rejects invalid identity values at DB boundary", () => {
  const migration = readMigration("0006-identity-invariant-triggers.sql");
  assert.ok(migration.includes("invalid member identity"));
  assert.ok(migration.includes("NEW.provider NOT IN ('firebase')"));
  assert.ok(migration.includes("NEW.email_verified NOT IN (0, 1)"));
});
