import { test } from "node:test";
import assert from "node:assert/strict";

const {
  roomKey, verifyRoomKey, checkinUrl, parseCheckinInput, parseCheckinGuest, parseGeo, buildCheckinRows, bookingCell,
  listCheckinPhotos, photoNote, makeCheckinReceiptId, checkinPhotoBaseName, checkinCookieValue, bookingCookieValue, readCheckinAccess,
  bookingKey, verifyBookingKey, bookingCheckinUrl, distanceM, geoDistance, checkGeoNear, GEO_NEAR_M,
  CHECKIN_SHEET_HEADER, MAX_CHECKIN_GUESTS,
} = await import("./checkin-verify.ts");

const SECRET = "test-secret";
const ID = "a1b2c3d4e5f6g7h8i9";
const ID2 = "z9y8x7w6v5u4t3s2r1";

function guest(over: Record<string, unknown> = {}) {
  return { name: "Kim Minsu", jaResident: true, selfieFileId: ID, passportFileId: "", method: "camera", ...over };
}

function payload(over: Record<string, unknown> = {}) {
  return { propertyId: "351180", bookingRef: "94204472", guests: [guest()], geo: { status: "denied" }, ...over };
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

const LINK = "link-secret";
const SECRETS = { room: SECRET, link: LINK };

test("readCheckinAccess: QR の印は物件と鍵が揃ったときだけ通す", () => {
  const v = checkinCookieValue("351180", roomKey("351180", SECRET));
  assert.deepEqual(readCheckinAccess(v, "351180", SECRETS), { via: "qr" });
  assert.equal(readCheckinAccess(v, "351183", SECRETS), null);
  assert.equal(readCheckinAccess(checkinCookieValue("351183", roomKey("351180", SECRET)), "351183", SECRETS), null);
  assert.equal(readCheckinAccess(undefined, "351180", SECRETS), null);
  assert.equal(readCheckinAccess("351180", "351180", SECRETS), null);
  assert.equal(readCheckinAccess(v, "351180", { room: "", link: LINK }), null);
});

test("bookingKey: ops と同じ式（固定値で照合）・予約ごと物件ごとに違う", () => {
  // ops（sekai-stay-ops の checkin-link）にも同じ値の検査がある。式を変えると両方落ちる
  assert.equal(bookingKey("351180", "94204472", "test-secret"), "2df351dbc4419bbb");
  assert.notEqual(bookingKey("351180", "94204472", LINK), bookingKey("351180", "94204473", LINK));
  assert.notEqual(bookingKey("351180", "94204472", LINK), bookingKey("351183", "94204472", LINK));
  // QR の鍵とは別物（QR の秘密と同じ値でも鍵は一致しない）
  assert.notEqual(bookingKey("351180", "94204472", SECRET), roomKey("351180", SECRET));
});

test("verifyBookingKey: 予約 ID は数字だけ・鍵と秘密が揃ったときだけ通す", () => {
  const k = bookingKey("351180", "94204472", LINK);
  assert.equal(verifyBookingKey("351180", "94204472", k, LINK), true);
  assert.equal(verifyBookingKey("351180", "94204473", k, LINK), false);
  assert.equal(verifyBookingKey("351183", "94204472", k, LINK), false);
  assert.equal(verifyBookingKey("351180", "94204472", k, ""), false);
  assert.equal(verifyBookingKey("351180", "HMABC", bookingKey("351180", "HMABC", LINK), LINK), false);
});

test("bookingCheckinUrl: /c/<物件ID>?b=<予約ID>&k=<予約鍵>", () => {
  assert.equal(bookingCheckinUrl("https://sekaistay.com/", "351180", "94204472", LINK), `https://sekaistay.com/c/351180?b=94204472&k=${bookingKey("351180", "94204472", LINK)}`);
});

test("readCheckinAccess: リンクの印は予約 ID を返す・QR の秘密では通らない・形が違えば null", () => {
  const v = bookingCookieValue("351180", "94204472", bookingKey("351180", "94204472", LINK));
  assert.deepEqual(readCheckinAccess(v, "351180", SECRETS), { via: "link", bookingId: "94204472" });
  assert.equal(readCheckinAccess(v, "351183", SECRETS), null);
  assert.equal(readCheckinAccess(v, "351180", { room: SECRET, link: "" }), null);
  assert.equal(readCheckinAccess(bookingCookieValue("351180", "94204472", bookingKey("351180", "94204472", SECRET)), "351180", SECRETS), null);
  assert.equal(readCheckinAccess(`${v}:x`, "351180", SECRETS), null);
});

const PLACE = { lat: 35.6833344, lng: 139.677536 };

test("distanceM: 緯度 0.001 度はおよそ 111m", () => {
  const d = distanceM(PLACE, { lat: PLACE.lat + 0.001, lng: PLACE.lng });
  assert.ok(d > 110 && d < 112, String(d));
});

test("checkGeoNear: 500m 以内・誤差 500m 以内だけ near", () => {
  const at = (dLat: number, accuracy?: number) => ({ status: "ok" as const, lat: PLACE.lat + dLat, lng: PLACE.lng, accuracy });
  assert.equal(GEO_NEAR_M, 500);
  assert.equal(checkGeoNear(at(0.001, 30), PLACE), "near");
  assert.equal(checkGeoNear(at(0.0044, 30), PLACE), "near"); // 約 489m
  assert.equal(checkGeoNear(at(0.0046, 30), PLACE), "far"); // 約 511m
  assert.equal(checkGeoNear(at(0.001, 800), PLACE), "coarse");
  assert.equal(checkGeoNear(at(0.001), PLACE), "coarse");
  assert.equal(checkGeoNear({ status: "denied" }, PLACE), "missing");
  assert.equal(checkGeoNear(at(0, 10), {}), "missing");
});

test("geoDistance: 位置情報か物件の位置が無ければ undefined", () => {
  assert.equal(geoDistance({ status: "ok", lat: PLACE.lat, lng: PLACE.lng, accuracy: 5 }, PLACE), 0);
  assert.equal(geoDistance({ status: "unavailable" }, PLACE), undefined);
  assert.equal(geoDistance({ status: "ok", lat: 1, lng: 1 }, {}), undefined);
});

test("parseCheckinInput: 予約番号ありの正常系", () => {
  const { input, error } = parseCheckinInput(payload());
  assert.equal(error, undefined);
  assert.equal(input!.bookingRef, "94204472");
  assert.equal(input!.guests.length, 1);
  assert.equal(input!.guests[0].selfieFileId, ID);
  assert.equal(input!.geo.status, "denied");
});

test("parseCheckinInput: 予約番号が無ければ姓＋到着日が必須", () => {
  assert.equal(parseCheckinInput(payload({ bookingRef: "" })).error, "booking");
  assert.equal(parseCheckinInput(payload({ bookingRef: "", lastName: "Kim" })).error, "booking");
  assert.equal(parseCheckinInput(payload({ bookingRef: "", lastName: "Kim", arrivalDate: "2026-10-12" })).error, undefined);
  assert.equal(parseCheckinInput(payload({ bookingRef: "", lastName: "Kim", arrivalDate: "12/10/2026" })).error, "arrival");
});

test("parseCheckinInput: 予約番号は英数字 20 文字まで（Airbnb 確認コードは大文字に揃える）", () => {
  assert.equal(parseCheckinInput(payload({ bookingRef: "AB-12" })).error, "booking");
  assert.equal(parseCheckinInput(payload({ bookingRef: "hmabc12345" })).input!.bookingRef, "HMABC12345");
  assert.equal(parseCheckinInput(payload({ bookingRef: "A".repeat(21) })).error, "booking");
  assert.equal(bookingCell("94204472"), "b:94204472");
  assert.equal(bookingCell("HMABC12345"), "HMABC12345");
  assert.equal(bookingCell(""), "");
  assert.equal(parseCheckinInput(payload({ propertyId: "" })).error, "invalid qr");
  assert.equal(parseCheckinInput(null).error, "invalid payload");
});

test("parseCheckinInput: 宿泊者は 1〜8 名・全員分の自撮りが要る", () => {
  assert.equal(parseCheckinInput(payload({ guests: [] })).error, "guests");
  assert.equal(parseCheckinInput(payload({ guests: Array(MAX_CHECKIN_GUESTS + 1).fill(guest()) })).error, "guests");
  assert.equal(parseCheckinInput(payload({ guests: [guest(), guest({ selfieFileId: "" })] })).error, "selfie");
  assert.equal(parseCheckinInput(payload({ guests: [guest(), guest({ name: "" })] })).error, "name");
  assert.equal(parseCheckinInput(payload({ guests: [guest(), guest()] })).input!.guests.length, 2);
});

test("parseCheckinGuest: 国内住所が無ければ旅券ページ必須・Drive ID 形式以外は拒否・撮影方法は camera 既定", () => {
  assert.equal(parseCheckinGuest(guest({ jaResident: false })).error, "passport");
  assert.equal(parseCheckinGuest(guest({ jaResident: false, passportFileId: ID2 })).guest!.passportFileId, ID2);
  assert.equal(parseCheckinGuest(guest({ jaResident: "yes" })).error, "residence");
  assert.equal(parseCheckinGuest(guest({ selfieFileId: "../etc" })).error, "selfie");
  assert.equal(parseCheckinGuest(guest({ passportFileId: "bad" })).error, "passport");
  assert.equal(parseCheckinGuest(guest({ method: "gallery" })).guest!.method, "camera");
  assert.equal(parseCheckinGuest(guest({ method: "file" })).guest!.method, "file");
});

test("parseGeo: ok は緯度経度が要る・範囲外は取得不可・不明な状態は未取得", () => {
  assert.deepEqual(parseGeo({ status: "ok", lat: 35.68, lng: 139.69, accuracy: 12.7 }), { status: "ok", lat: 35.68, lng: 139.69, accuracy: 13 });
  assert.deepEqual(parseGeo({ status: "ok", lat: 95, lng: 139 }), { status: "unavailable" });
  assert.deepEqual(parseGeo({ status: "ok" }), { status: "unavailable" });
  assert.deepEqual(parseGeo({ status: "denied", lat: 1, lng: 2 }), { status: "denied" });
  assert.deepEqual(parseGeo({ status: "weird" }), { status: "skipped" });
  assert.deepEqual(parseGeo(undefined), { status: "skipped" });
});

test("listCheckinPhotos / photoNote / checkinPhotoBaseName: 宿泊者順に自撮り→旅券の並び", () => {
  const { input } = parseCheckinInput(payload({ guests: [guest(), guest({ name: "Lee", jaResident: false, passportFileId: ID2, method: "file" })] }));
  const photos = listCheckinPhotos(input!);
  assert.deepEqual(photos.map((p) => [p.guestIndex, p.kind]), [[0, "selfie"], [1, "selfie"], [1, "passport"]]);
  assert.equal(photoNote(input!, photos[0]), "宿泊者1/2 顔+身分証・画面内カメラ・国内住所あり");
  assert.equal(photoNote(input!, photos[2]), "宿泊者2/2 旅券ページ・ファイル選択・国内住所なし");
  assert.equal(checkinPhotoBaseName("351180", "C1", photos[2]), "本人確認_351180_C1_2_旅券");
  assert.equal(checkinPhotoBaseName("351180", "C1", photos[0]), "本人確認_351180_C1_1_顔身分証");
});

test("buildCheckinRows: 1 枚 1 行・列順は見出しどおり・氏名は宿泊者ごと・予約番号は b: 付き", () => {
  const { input } = parseCheckinInput(payload({
    guests: [guest(), guest({ name: "Lee Jiwoo", jaResident: false, passportFileId: ID2 })],
    geo: { status: "ok", lat: 35.68, lng: 139.69, accuracy: 10 },
  }));
  const rows = buildCheckinRows(input!, { id: "351180", name: "FIKA渋谷本町 101", lat: 35.681, lng: 139.69 }, "C20261012-AB12", ["https://drive/1", "https://drive/2", "https://drive/3"], "2026/10/12 16:05", "qr");
  assert.equal(rows.length, 3);
  assert.equal(rows[0].length, CHECKIN_SHEET_HEADER.length);
  assert.deepEqual(rows[0], ["2026/10/12 16:05", "351180", "FIKA渋谷本町 101", "b:94204472", "Kim Minsu", "", "1/3", "取得", "35.68,139.69", "10", "https://drive/1", "", "", "宿泊者1/2 顔+身分証・画面内カメラ・国内住所あり", "C20261012-AB12", "室内QR", "111"]);
  assert.equal(rows[1][4], "Lee Jiwoo");
  assert.equal(rows[2][6], "3/3");
  assert.equal(rows[2][10], "https://drive/3");
  assert.equal(rows[2][13], "宿泊者2/2 旅券ページ・画面内カメラ・国内住所なし");
});

test("buildCheckinRows: 位置情報を拒否したら「拒否」で座標は空・氏名の先頭の = は数式として解釈させない", () => {
  const { input } = parseCheckinInput(payload({ bookingRef: "", lastName: "Kim", arrivalDate: "2026-10-12", guests: [guest({ name: "=HYPERLINK(1)" })] }));
  const [row] = buildCheckinRows(input!, { id: "351180", name: "x" }, "C1", ["l"], "t", "link");
  assert.equal(row[3], "");
  assert.equal(row[4], "'=HYPERLINK(1)");
  assert.equal(row[5], "2026-10-12");
  assert.equal(row[7], "拒否");
  assert.equal(row[8], "");
  assert.equal(row[9], "");
  assert.equal(row[13], "宿泊者1/1 顔+身分証・画面内カメラ・国内住所あり・予約の姓=Kim");
  assert.equal(row[15], "予約リンク");
  assert.equal(row[16], "");
});

test("makeCheckinReceiptId: 形式", () => {
  assert.match(makeCheckinReceiptId(new Date("2026-10-12T20:00:00Z")), /^C20261013-[A-Z0-9]{4}$/);
});
