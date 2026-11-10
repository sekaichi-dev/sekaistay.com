import { test } from "node:test";
import assert from "node:assert/strict";

const { isKioskProperty, resolveLockedProperty } = await import("./guest-register-kiosk.ts");

test("isKioskProperty: T422 だけ", () => {
  assert.equal(isKioskProperty("T422"), true);
  assert.equal(isKioskProperty("t422"), false);
  assert.equal(isKioskProperty("351180"), false);
  assert.equal(isKioskProperty(""), false);
  assert.equal(isKioskProperty(null), false);
});

test("resolveLockedProperty: 一覧にある p だけ固定する", () => {
  const list = [{ id: "T422", name: "a" }, { id: "351180", name: "b" }];
  assert.deepEqual(resolveLockedProperty("T422", list), { id: "T422", name: "a" });
  assert.equal(resolveLockedProperty("999999", list), null);
  assert.equal(resolveLockedProperty("", list), null);
  assert.equal(resolveLockedProperty("T422", null), null);
});
