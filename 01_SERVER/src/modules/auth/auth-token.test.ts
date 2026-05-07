/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import { AuthError, readBearerToken } from "./auth-token";

test("Bearer token parser accepts exactly one bearer token", () => {
  const request = new Request("https://api.test", { headers: { authorization: "bearer token-123" } });
  assert.equal(readBearerToken(request), "token-123");
});

test("Bearer token parser rejects missing or ambiguous credentials", () => {
  assert.throws(() => readBearerToken(new Request("https://api.test")), AuthError);
  assert.throws(
    () => readBearerToken(new Request("https://api.test", { headers: { authorization: "Bearer a b" } })),
    AuthError,
  );
});
