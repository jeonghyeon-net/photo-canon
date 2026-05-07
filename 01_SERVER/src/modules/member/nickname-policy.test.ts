/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import type { AuthenticatedIdentity } from "../auth/auth-token";
import { updateMemberSchema } from "./member-contract";
import { initialNicknameFromIdentity, isValidNickname } from "./nickname-policy";

function identity(overrides: Partial<AuthenticatedIdentity>): AuthenticatedIdentity {
  return {
    provider: "firebase",
    subject: "firebase-user-id",
    emailVerified: true,
    ...overrides,
  };
}

test("nickname policy accepts Instagram-style usernames", () => {
  for (const nickname of ["a", "rhea", "rhea.kim", "rhea_kim", "rhea__kim", "rhea.01"]) {
    assert.equal(isValidNickname(nickname), true, nickname);
  }
});

test("nickname policy rejects non-username inputs", () => {
  for (const nickname of ["", ".rhea", "rhea.", "rhea..kim", "rhea-kim", "rhea kim", "정현", "a".repeat(31)]) {
    assert.equal(isValidNickname(nickname), false, nickname);
  }
});

test("nickname schema normalizes submitted username", () => {
  const result = updateMemberSchema.parse({ nickname: " Rhea.Kim_01 " });
  assert.equal(result.nickname, "rhea.kim_01");
});

test("initial nickname is normalized from identity", () => {
  assert.equal(initialNicknameFromIdentity(identity({ email: "Rhea.Kim@example.com" })), "rhea.kim");
  assert.equal(initialNicknameFromIdentity(identity({ displayName: "Rhea Kim" })), "rhea.kim");
  assert.equal(initialNicknameFromIdentity(identity({ displayName: "김정현" })), "user");
});
