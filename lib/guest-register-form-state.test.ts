import { test } from "node:test";
import assert from "node:assert/strict";

const {
  emptyGuest, blankRegisterFields, hasEnteredData, idlePhase, kioskIdleTick, photoAgeSec, KIOSK_IDLE_MS, KIOSK_WARN_MS, PICKER_PAUSE_MAX_MS,
} = await import("./guest-register-form-state.ts");

test("blankRegisterFields: 空の状態は「入力なし」", () => {
  assert.equal(hasEnteredData(blankRegisterFields()), false);
  // 毎回新しい配列・オブジェクト（前の人の状態を共有しない）
  assert.notEqual(blankRegisterFields().guests, blankRegisterFields().guests);
});

test("hasEnteredData: どの項目を 1 つ入れても「入力あり」（初期化の対象漏れの検知）", () => {
  const filled: Record<string, unknown> = {
    name: "a", jaResident: true, address: "a", sameAddress: true, nationality: "日本", occupation: "a", contact: "a",
    sameContact: true, passportNo: "a", photoFileId: "x", photoName: "x", photoMethod: "camera", photoAgeSec: 3,
    facePhotoFileId: "x", facePhotoName: "x", facePhotoMethod: "file", facePhotoAgeSec: 3,
    gender: "男", age: "30", prevStay: "a", nextDest: "a",
  };
  const keys = Object.keys(emptyGuest()).filter((k) => k !== "isChild");
  // 宿泊者カードの項目を足したら、この表にも足すまで落ちる（足し忘れ＝初期化と判定の漏れ）
  assert.deepEqual([...keys].sort(), Object.keys(filled).sort());
  for (const k of keys) {
    const f = blankRegisterFields();
    f.guests = [{ ...emptyGuest(), [k]: filled[k] }];
    assert.equal(hasEnteredData(f), true, k);
  }
  const top: Record<string, unknown> = { checkin: "2026-11-11", checkout: "2026-11-12", checkinTime: "15:00", checkoutTime: "10:00", bookingRef: "123456", consent: true };
  assert.deepEqual(Object.keys(blankRegisterFields()).filter((k) => k !== "guests").sort(), Object.keys(top).sort());
  for (const [k, v] of Object.entries(top)) {
    assert.equal(hasEnteredData({ ...blankRegisterFields(), [k]: v }), true, k);
  }
  assert.equal(hasEnteredData({ ...blankRegisterFields(), guests: [emptyGuest(), emptyGuest()] }), true, "同行者カードの追加");
});

test("idlePhase: 3 分で確認・さらに 30 秒で初期化", () => {
  const t0 = 1_000_000;
  assert.deepEqual(idlePhase(t0 + KIOSK_IDLE_MS - 1, t0), { phase: "active" });
  assert.deepEqual(idlePhase(t0 + KIOSK_IDLE_MS, t0), { phase: "warn", secondsLeft: 30 });
  assert.deepEqual(idlePhase(t0 + KIOSK_IDLE_MS + 29_500, t0), { phase: "warn", secondsLeft: 1 });
  assert.deepEqual(idlePhase(t0 + KIOSK_IDLE_MS + KIOSK_WARN_MS, t0), { phase: "expired" });
  assert.equal(KIOSK_IDLE_MS, 180_000);
});

test("photoAgeSec: 撮影から選択までの秒数・不明や未来は -1", () => {
  assert.equal(photoAgeSec(10_000, 15_400), 5);
  assert.equal(photoAgeSec(0, 15_400), -1);
  assert.equal(photoAgeSec(20_000, 15_400), -1);
  assert.equal(photoAgeSec(undefined, 15_400), -1);
});

test("kioskIdleTick: 送信中・アップロード中・カメラを開いている間は初期化しない", () => {
  const t0 = 1_000_000;
  const later = t0 + KIOSK_IDLE_MS + KIOSK_WARN_MS + 5_000; // 普通なら初期化される時刻
  assert.equal(kioskIdleTick(later, { lastActivity: t0, pickerOpenedAt: 0, busy: false }).phase.phase, "expired");
  const busy = kioskIdleTick(later, { lastActivity: t0, pickerOpenedAt: 0, busy: true });
  assert.equal(busy.phase.phase, "active");
  assert.equal(busy.lastActivity, later); // 送信が終わってから数え直す
  const camera = kioskIdleTick(later, { lastActivity: t0, pickerOpenedAt: later - 60_000, busy: false });
  assert.equal(camera.phase.phase, "active");
  // カメラを開いたまま 10 分戻らなければ止めておかない
  const stale = kioskIdleTick(later, { lastActivity: t0, pickerOpenedAt: later - PICKER_PAUSE_MAX_MS, busy: false });
  assert.equal(stale.phase.phase, "expired");
});
