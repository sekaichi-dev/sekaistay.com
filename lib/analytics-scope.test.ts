import { test } from "node:test";
import assert from "node:assert/strict";

const { isAnalyticsExcludedPath } = await import("./analytics-scope.ts");

test("isAnalyticsExcludedPath: /lease と /guest-register 配下を外す", () => {
  assert.equal(isAnalyticsExcludedPath("/lease"), true);
  assert.equal(isAnalyticsExcludedPath("/lease/84123456"), true);
  assert.equal(isAnalyticsExcludedPath("/lease/84123456/consent"), true);
  assert.equal(isAnalyticsExcludedPath("/leases"), false);
  assert.equal(isAnalyticsExcludedPath("/guest-register"), true);
  assert.equal(isAnalyticsExcludedPath("/guest-register/x"), true);
  assert.equal(isAnalyticsExcludedPath("/guest-registers"), false);
  assert.equal(isAnalyticsExcludedPath("/"), false);
  assert.equal(isAnalyticsExcludedPath(null), false);
});
