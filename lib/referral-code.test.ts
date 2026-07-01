import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateReferralCode,
  isValidReferralCodeFormat,
  normalizeReferralCode,
} from "./referral-code.ts";

test("format: SS- prefix + 6 chars from safe alphabet", () => {
  const code = generateReferralCode(() => 0);
  assert.match(code, /^SS-[0-9A-Z]{6}$/);
  assert.ok(!/[OIL01U]/.test(code.slice(3)), "excludes ambiguous chars");
});

test("deterministic with injected rand", () => {
  assert.equal(generateReferralCode(() => 0), generateReferralCode(() => 0));
});

test("isValidReferralCodeFormat", () => {
  assert.equal(isValidReferralCodeFormat("SS-ABC234"), true);
  assert.equal(isValidReferralCodeFormat("ss-abc234"), false); // 大文字のみ
  assert.equal(isValidReferralCodeFormat("SS-ABCDEFG"), false); // 7 文字
  assert.equal(isValidReferralCodeFormat("XX-ABC234"), false);
});

test("normalizeReferralCode trims and uppercases", () => {
  assert.equal(normalizeReferralCode("  ss-abc234 "), "SS-ABC234");
});
