import { test } from "node:test";
import assert from "node:assert/strict";

const {
  opsLeaseApiBase, purposeTextRule, isImageDataUrl, dataUrlBytes, pickLabel, formatYen, formatJst, formatYmd,
  pendingKeys, pendingItems, parseLeaseView, classifySubmitResponse, leaseApiUrl, isLeaseBookingId, DEFAULT_OPS_PUBLIC_API_BASE,
} = await import("./lease-consent.ts");

const IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
const PURPOSES = [
  { value: "A", ja: "出張・転勤", en: "Business trip", textRequired: false },
  { value: "E", ja: "その他", en: "Other", textRequired: true },
];

function form(over: Record<string, unknown> = {}) {
  return {
    purposeCategory: "A", purposeText: "", fullName: "山田 太郎", email: "taro@example.com", nationality: "日本",
    address: "東京都新宿区1-2-3", idType: "passport", idImage: IMG, agree: true, fullTextViewedAt: "2026-11-07T05:00:00.000Z",
    ...over,
  };
}

function view(over: Record<string, unknown> = {}) {
  return {
    ok: true, state: "open", lang: "ja",
    booking: { bookingId: 123, guestName: "Taro", propertyName: "203 マンスリー", arrival: "2026-12-01", departure: "2026-12-31", nights: 30, rentTotalJpy: 620000 },
    fingerprint: "a".repeat(64), version: "v2-2026-11",
    contract: { ja: "第1条", en: "Article 1" },
    summary: { ja: ["要点"], en: ["Point"] },
    purposes: PURPOSES,
    idTypes: [{ value: "passport", ja: "旅券", en: "Passport" }],
    ...over,
  };
}

test("opsLeaseApiBase: 省略・不正は本番 ops、末尾スラッシュは落とす", () => {
  assert.equal(opsLeaseApiBase({}), DEFAULT_OPS_PUBLIC_API_BASE);
  assert.equal(opsLeaseApiBase({ NEXT_PUBLIC_OPS_PUBLIC_API_BASE: "  " }), DEFAULT_OPS_PUBLIC_API_BASE);
  assert.equal(opsLeaseApiBase({ NEXT_PUBLIC_OPS_PUBLIC_API_BASE: "javascript:alert(1)" }), DEFAULT_OPS_PUBLIC_API_BASE);
  assert.equal(opsLeaseApiBase({ NEXT_PUBLIC_OPS_PUBLIC_API_BASE: "http://127.0.0.1:4010/" }), "http://127.0.0.1:4010");
});

test("leaseApiUrl / isLeaseBookingId", () => {
  assert.equal(leaseApiUrl("https://ops.sekaistay.com", "123", "a b&c"), "https://ops.sekaistay.com/api/public/lease?b=123&k=a%20b%26c");
  assert.equal(isLeaseBookingId("84123456"), true);
  assert.equal(isLeaseBookingId("84a"), false);
  assert.equal(isLeaseBookingId(""), false);
});

test("purposeTextRule: A〜D は任意・E は 2 文字以上（前後の空白は数えない）", () => {
  assert.deepEqual(purposeTextRule("A", ""), { required: false, ok: true });
  assert.deepEqual(purposeTextRule("D", "出張"), { required: false, ok: true });
  assert.deepEqual(purposeTextRule("E", ""), { required: true, ok: false });
  assert.deepEqual(purposeTextRule("E", " 出 "), { required: true, ok: false });
  assert.deepEqual(purposeTextRule("E", "出張"), { required: true, ok: true });
  assert.deepEqual(purposeTextRule("E", "🏠🏠"), { required: true, ok: true });
  // API の textRequired が優先
  assert.deepEqual(purposeTextRule("B", "", true), { required: true, ok: false });
  assert.deepEqual(purposeTextRule("E", "", false), { required: false, ok: true });
});

test("isImageDataUrl: jpeg/png/webp の base64 だけ", () => {
  assert.equal(isImageDataUrl(IMG), true);
  assert.equal(isImageDataUrl("data:image/png;base64,iVBORw0KGgo="), true);
  assert.equal(isImageDataUrl("data:image/heic;base64,AAAA"), false);
  assert.equal(isImageDataUrl("data:text/html;base64,PGI+"), false);
  assert.equal(isImageDataUrl(""), false);
  assert.equal(dataUrlBytes("data:image/jpeg;base64,AAAA"), 3);
  assert.equal(dataUrlBytes("data:image/jpeg;base64,AAA="), 2);
});

test("pickLabel / formatYen", () => {
  assert.equal(pickLabel(PURPOSES[0], "ja"), "出張・転勤");
  assert.equal(pickLabel(PURPOSES[0], "en"), "Business trip");
  assert.equal(pickLabel({ value: "X", ja: "日本語だけ", en: "" }, "en"), "日本語だけ");
  assert.equal(pickLabel(null, "ja"), "");
  assert.equal(formatYen(620000), "¥620,000");
  assert.equal(formatYen(0), "");
  assert.equal(formatYen(undefined), "");
});

test("formatJst / formatYmd: 端末のタイムゾーンに依らず JST", () => {
  assert.equal(formatJst("2026-11-07T05:00:00.000Z", "ja"), "2026年11月7日 14:00（JST）");
  assert.equal(formatJst("2026-11-07T20:05:00Z", "en"), "8 Nov 2026, 05:05 JST");
  assert.equal(formatJst("nope", "ja"), "");
  assert.equal(formatYmd("2026-12-01", "ja"), "2026年12月1日");
  assert.equal(formatYmd("2026-12-01", "en"), "1 Dec 2026");
  assert.equal(formatYmd(undefined, "en"), "");
});

test("pendingKeys: 全部そろえば空・欠けは画面の上から順", () => {
  assert.deepEqual(pendingKeys(form(), PURPOSES), []);
  assert.deepEqual(
    pendingKeys(form({ purposeCategory: "", fullName: " ", idImage: "", agree: false, fullTextViewedAt: "" }), PURPOSES),
    ["purposeCategory", "fullName", "idImage", "fullTextViewedAt", "agree"],
  );
  assert.deepEqual(pendingKeys(form({ purposeCategory: "E", purposeText: "x" }), PURPOSES), ["purposeText"]);
  assert.deepEqual(pendingKeys(form({ purposeCategory: "E", purposeText: "研修" }), PURPOSES), []);
  assert.deepEqual(pendingKeys(form({ purposeCategory: "Z" }), PURPOSES), ["purposeCategory"]);
  assert.deepEqual(pendingKeys(form({ email: "a@b" }), PURPOSES), ["email"]);
  assert.deepEqual(pendingKeys(form({ idImage: "data:image/heic;base64,AAAA" }), PURPOSES), ["idImage"]);
});

test("pendingItems: 言語に合わせた表示", () => {
  const f = form({ idImage: "", agree: false, fullTextViewedAt: "" });
  assert.deepEqual(pendingItems(f, "ja", PURPOSES), ["身分証の写真", "契約全文の表示", "同意のチェック"]);
  assert.deepEqual(pendingItems(f, "en", PURPOSES), ["Photo of your ID", "Opening the full agreement", "Ticking the consent box"]);
});

test("parseLeaseView: open は指紋・版・本文・選択肢がそろうときだけ", () => {
  const v = parseLeaseView(view());
  assert.ok(v);
  assert.equal(v.state, "open");
  assert.equal(v.booking.rentTotalJpy, 620000);
  assert.equal(v.purposes[1].textRequired, true);
  assert.equal(parseLeaseView(view({ fingerprint: "abc" })), null);
  assert.equal(parseLeaseView(view({ contract: null })), null);
  assert.equal(parseLeaseView(view({ purposes: [] })), null);
  assert.equal(parseLeaseView(view({ ok: false })), null);
  assert.equal(parseLeaseView(view({ state: "weird" })), null);
  assert.equal(parseLeaseView(null), null);
});

test("parseLeaseView: closed / agreed は個人情報なしでも通る・lang の既定は ja", () => {
  const closed = parseLeaseView({ ok: true, state: "closed", booking: { bookingId: 1, arrival: "2026-12-01", departure: "2026-12-31" } });
  assert.ok(closed);
  assert.equal(closed.lang, "ja");
  assert.equal(closed.contract, null);
  const agreed = parseLeaseView({ ok: true, state: "agreed", lang: "en", booking: { bookingId: 1 }, receiptHtml: "<p>r</p>" });
  assert.ok(agreed);
  assert.equal(agreed.lang, "en");
  assert.equal(agreed.receiptHtml, "<p>r</p>");
});

test("classifySubmitResponse: ops の応答の分岐", () => {
  assert.deepEqual(classifySubmitResponse(200, { ok: true, submissionId: "s", receiptHtml: "<p/>", submittedAt: "t", submittedAtJst: "j" }),
    { kind: "ok", receiptHtml: "<p/>", submittedAt: "t", submittedAtJst: "j" });
  assert.deepEqual(classifySubmitResponse(422, { ok: false, error: "invalid", fields: ["email", 3] }), { kind: "invalid", fields: ["email"] });
  assert.deepEqual(classifySubmitResponse(409, { error: "changed" }), { kind: "changed" });
  assert.deepEqual(classifySubmitResponse(409, { error: "after_arrival" }), { kind: "after_arrival" });
  assert.deepEqual(classifySubmitResponse(409, { error: "not_open" }), { kind: "not_open" });
  assert.deepEqual(classifySubmitResponse(413, {}), { kind: "too_large" });
  assert.deepEqual(classifySubmitResponse(429, {}), { kind: "too_many" });
  assert.deepEqual(classifySubmitResponse(404, {}), { kind: "not_found" });
  assert.deepEqual(classifySubmitResponse(500, {}), { kind: "error" });
  assert.deepEqual(classifySubmitResponse(200, { ok: false }), { kind: "error" });
});
