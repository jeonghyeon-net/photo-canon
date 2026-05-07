/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import { formatTagNumber, isValidTagNumber, randomTagNumber, tagMax, tagMin } from "./tag-policy";

test("tag policy only accepts configured 8-digit range", () => {
  assert.equal(isValidTagNumber(tagMin), true);
  assert.equal(isValidTagNumber(tagMax), true);
  assert.equal(isValidTagNumber(tagMin - 1), false);
  assert.equal(isValidTagNumber(tagMax + 1), false);
  assert.equal(isValidTagNumber(10.5), false);
});

test("tag policy formats tag without hiding invalid values", () => {
  assert.equal(formatTagNumber(tagMin), "10000000");
  assert.throws(() => formatTagNumber(1), /Invalid member tag number/);
});

test("tag policy generates valid random tags", () => {
  for (let index = 0; index < 100; index += 1) {
    assert.equal(isValidTagNumber(randomTagNumber()), true);
  }
});
