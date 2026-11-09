import { test } from "node:test";
import assert from "node:assert/strict";

const { isStaffPreview } = await import("./staff-preview.ts");

test("isStaffPreview: preview=1 のときだけ true", () => {
  assert.equal(isStaffPreview(new URLSearchParams("preview=1&p=338945&gn=Taro")), true);
  assert.equal(isStaffPreview(new URLSearchParams("p=338945&preview=1")), true);
});

test("isStaffPreview: それ以外は通常の画面", () => {
  for (const q of ["", "p=338945", "preview=0", "preview=true", "preview=", "preview=1 ", "preview=11", "Preview=1"]) {
    assert.equal(isStaffPreview(new URLSearchParams(q)), false, q);
  }
  // 最初の値で判定（URLSearchParams.get と同じ）
  assert.equal(isStaffPreview(new URLSearchParams("preview=0&preview=1")), false);
  assert.equal(isStaffPreview(null), false);
  assert.equal(isStaffPreview(undefined), false);
});
