/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import { assertFirebaseClaims, firebaseJwtPayloadSchema } from "./firebase-token-policy";

const now = Math.floor(Date.now() / 1000);

function payload(overrides = {}) {
  return firebaseJwtPayloadSchema.parse({
    aud: "photo-canon",
    iss: "https://securetoken.google.com/photo-canon",
    exp: now + 3600,
    iat: now - 10,
    auth_time: now - 20,
    sub: "firebase-user-id",
    email: "rhea@example.com",
    email_verified: true,
    ...overrides,
  });
}

test("Firebase claims policy accepts expected project claims", () => {
  assert.doesNotThrow(() => assertFirebaseClaims(payload(), "photo-canon"));
});

test("Firebase claims policy rejects wrong project claims", () => {
  assert.throws(() => assertFirebaseClaims(payload({ aud: "other" }), "photo-canon"), "wrong project claims must fail");
});

test("Firebase claims policy rejects invalid time claims", () => {
  assert.throws(() => assertFirebaseClaims(payload({ exp: now - 120 }), "photo-canon"), "expired token must fail");
  assert.throws(() => assertFirebaseClaims(payload({ auth_time: now + 120 }), "photo-canon"), "future auth time must fail");
});

test("Firebase payload schema rejects malformed subjects", () => {
  assert.equal(firebaseJwtPayloadSchema.safeParse({ ...payload(), sub: "" }).success, false);
  assert.equal(firebaseJwtPayloadSchema.safeParse({ ...payload(), sub: "a".repeat(129) }).success, false);
});
