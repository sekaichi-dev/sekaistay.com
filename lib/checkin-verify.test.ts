import { test } from "node:test";
import assert from "node:assert/strict";

const {
  roomKey, verifyRoomKey, checkinUrl, parseCheckinInput, parseGeo, buildCheckinRows, bookingCell,
  makeCheckinReceiptId, checkinPhotoBaseName, checkinCookieValue, verifyCheckinCookie, CHECKIN_SHEET_HEADER, MAX_CHECKIN_PHOTOS,
} = await import("./checkin-verify.ts");

const SECRET = "test-secret";
const ID = "a1b2c3d4e5f6g7h8i9";

function payload(over: Record<string, unknown> = {}) {
  return { propertyId: "351180", bookingRef: "94204472", photoFileIds: [ID], geo: { status: "denied" }, ...over };
}

test("roomKey: 物件ごとに違う 16 文字・同じ入力なら同じ鍵", () => {
  const a = roomKey("351180", SECRET);
  assert.equal(a.length, 16);
  assert.equal(a, roomKey("351180", SECRET));
  assert.notEqual(a, roomKey("351183", SECRET));
  assert.notEqual(a, roomKey("351180", "other"));
});

test("verifyRoomKey: 正しい鍵だけ通す（別物件・長さ違い・秘密なしは拒否）", () => {
  const k = roomKey("351180", SECRET);
  assert.equal(verifyRoomKey("351180", k, SECRET), true);
  assert.equal(verifyRoomKey("351183", k, SECRET), false);
  assert.equal(verifyRoomKey("351180", k.slice(0, 15), SECRET), false);
  assert.equal(verifyRoomKey("351180", k + "0", SECRET), false);
  assert.equal(verifyRoomKey("351180", k, ""), false);
  assert.equal(verifyRoomKey("", k, SECRET), false);
});

test("checkinUrl: /c/<物件ID>?k=<鍵>（末尾スラッシュは重ねない）", () => {
  const u = checkinUrl("https://sekaistay.com/", "351180", SECRET);
  assert.equal(u, `https://sekaistay.com/c/351180?k=${roomKey("351180", SECRET)}`);
});

test("verifyCheckinCookie: 物件と鍵が揃ったときだけ通す", () => {
  const v = checkinCookieValue("351180", roomKey("351180", SECRET));
  assert.equal(verifyCheckinCookie(v, "351180", SECRET), true);
  assert.equal(verifyCheckinCookie(v, "351183", SECRET), false);
  assert.equal(verifyCheckinCookie(checkinCookieValue("351183", roomKey("351180", SECRET)), "351183", SECRET), false);
  assert.equal(verifyCheckinCookie(undefined, "351180", SECRET), false);
  assert.equal(verifyCheckinCookie("351180", "351180", SECRET), false);
  assert.equal(verifyCheckinCookie(v, "351180", ""), false);
});

test("parseCheckinInput: 予約番号ありの正常系", () => {
  const { input, error } = parseCheckinInput(payload());
  assert.equal(error, undefined);
  assert.equal(input!.bookingRef, "94204472");
  assert.deepEqual(input!.photoFileIds, [ID]);
  assert.equal(input!.geo.status, "denied");
});

test("parseCheckinInput: 予約番号が無ければ姓＋到着日が必須", () => {
  assert.equal(parseCheckinInput(payload({ bookingRef: "" })).error, "booking");
  assert.equal(parseCheckinInput(payload({ bookingRef: "", lastName: "Kim" })).error, "booking");
  assert.equal(parseCheckinInput(payload({ bookingRef: "", lastName: "Kim", arrivalDate: "2026-10-12" })).error, undefined);
  assert.equal(parseCheckinInput(payload({ bookingRef: "", lastName: "Kim", arrivalDate: "12/10/2026" })).error, "arrival");
});

test("parseCheckinInput: 予約番号は英数字 20 文字まで（Airbnb 確認コードは大文字に揃える）・写真は 1〜8 枚の Drive ID 形式だけ", () => {
  assert.equal(parseCheckinInput(payload({ bookingRef: "AB-12" })).error, "booking");
  assert.equal(parseCheckinInput(payload({ bookingRef: "hmabc12345" })).input!.bookingRef, "HMABC12345");
  assert.equal(parseCheckinInput(payload({ bookingRef: "A".repeat(21) })).error, "booking");
  assert.equal(bookingCell("94204472"), "b:94204472");
  assert.equal(bookingCell("HMABC12345"), "HMABC12345");
  assert.equal(bookingCell(""), "");
  assert.equal(parseCheckinInput(payload({ photoFileIds: [] })).error, "photos");
  assert.equal(parseCheckinInput(payload({ photoFileIds: ["../etc"] })).error, "photos");
  assert.equal(parseCheckinInput(payload({ photoFileIds: Array(MAX_CHECKIN_PHOTOS + 1).fill(ID) })).error, "photos");
  assert.equal(parseCheckinInput(payload({ propertyId: "" })).error, "invalid qr");
  assert.equal(parseCheckinInput(null).error, "invalid payload");
});

test("parseGeo: ok は緯度経度が要る・範囲外は取得不可・不明な状態は未取得", () => {
  assert.deepEqual(parseGeo({ status: "ok", lat: 35.68, lng: 139.69, accuracy: 12.7 }), { status: "ok", lat: 35.68, lng: 139.69, accuracy: 13 });
  assert.deepEqual(parseGeo({ status: "ok", lat: 95, lng: 139 }), { status: "unavailable" });
  assert.deepEqual(parseGeo({ status: "ok" }), { status: "unavailable" });
  assert.deepEqual(parseGeo({ status: "denied", lat: 1, lng: 2 }), { status: "denied" });
  assert.deepEqual(parseGeo({ status: "weird" }), { status: "skipped" });
  assert.deepEqual(parseGeo(undefined), { status: "skipped" });
});

test("buildCheckinRows: 1 枚 1 行・列順は見出しどおり・予約番号は b: 付き", () => {
  const { input } = parseCheckinInput(payload({ photoFileIds: [ID, ID], geo: { status: "ok", lat: 35.68, lng: 139.69, accuracy: 10 } }));
  const rows = buildCheckinRows(input!, { id: "351180", name: "FIKA渋谷本町 101" }, "C20261012-AB12", ["https://drive/1", "https://drive/2"], "2026/10/12 16:05");
  assert.equal(rows.length, 2);
  assert.equal(rows[0].length, CHECKIN_SHEET_HEADER.length);
  assert.deepEqual(rows[0], ["2026/10/12 16:05", "351180", "FIKA渋谷本町 101", "b:94204472", "", "", "1/2", "取得", "35.68,139.69", "10", "https://drive/1", "", "", "", "C20261012-AB12"]);
  assert.equal(rows[1][6], "2/2");
  assert.equal(rows[1][10], "https://drive/2");
});

test("buildCheckinRows: 位置情報を拒否したら「拒否」で座標は空", () => {
  const { input } = parseCheckinInput(payload({ bookingRef: "", lastName: "Kim", arrivalDate: "2026-10-12" }));
  const [row] = buildCheckinRows(input!, { id: "351180", name: "x" }, "C1", ["l"], "t");
  assert.equal(row[3], "");
  assert.equal(row[4], "Kim");
  assert.equal(row[5], "2026-10-12");
  assert.equal(row[7], "拒否");
  assert.equal(row[8], "");
  assert.equal(row[9], "");
});

test("buildCheckinRows: 姓の先頭の = + - @ は数式として解釈させない", () => {
  const { input } = parseCheckinInput(payload({ bookingRef: "", lastName: "=HYPERLINK(1)", arrivalDate: "2026-10-12" }));
  const [row] = buildCheckinRows(input!, { id: "351180", name: "x" }, "C1", ["l"], "t");
  assert.equal(row[4], "'=HYPERLINK(1)");
});

test("makeCheckinReceiptId / checkinPhotoBaseName: 形式", () => {
  assert.match(makeCheckinReceiptId(new Date("2026-10-12T20:00:00Z")), /^C20261013-[A-Z0-9]{4}$/);
  assert.equal(checkinPhotoBaseName("351180", "C20261012-AB12", 0), "本人確認_351180_C20261012-AB12_1");
});
