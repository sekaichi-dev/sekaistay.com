import { test } from "node:test";
import assert from "node:assert/strict";

const {
  opsLeaseApiBase, purposeTextRule, isImageDataUrl, dataUrlBytes, pickLabel, formatYen, formatJst, formatYmd,
  pendingKeys, pendingItems, parseLeaseView, classifySubmitResponse, leaseApiUrl, isLeaseBookingId, DEFAULT_OPS_PUBLIC_API_BASE,
  isLeasePreviewToken, leaseApiQuery,
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

const { isLeaseLinkKey, leaseEntryDecision, LEASE_KEY_COOKIE, LEASE_KEY_COOKIE_MAX_AGE } = await import("./lease-consent.ts");
const KEY = "0a".repeat(16); // 形だけの鍵（本物の鍵ではない）

test("isLeaseLinkKey: 小文字 16 進 32 桁だけ", () => {
  assert.equal(isLeaseLinkKey(KEY), true);
  assert.equal(isLeaseLinkKey(KEY.toUpperCase()), false);
  assert.equal(isLeaseLinkKey(KEY.slice(1)), false);
  assert.equal(isLeaseLinkKey(KEY + "0"), false);
  assert.equal(isLeaseLinkKey("g".repeat(32)), false);
  assert.equal(isLeaseLinkKey(""), false);
  assert.equal(isLeaseLinkKey(null), false);
});

test("leaseEntryDecision: 正しい形の鍵は予約のパスだけの httpOnly Cookie に入れ、鍵の無い consent へ", () => {
  const d = leaseEntryDecision({ bookingId: "84123456", key: KEY, secure: true });
  assert.equal(d.location, "/lease/84123456/consent");
  assert.deepEqual(d.set, {
    name: LEASE_KEY_COOKIE, value: KEY,
    options: { httpOnly: true, secure: true, sameSite: "lax", path: "/lease/84123456", maxAge: LEASE_KEY_COOKIE_MAX_AGE },
  });
  assert.equal(LEASE_KEY_COOKIE_MAX_AGE, 7 * 24 * 3600);
  assert.equal(d.clear, null);
  assert.ok(!d.location.includes(KEY));
  assert.equal(leaseEntryDecision({ bookingId: "84123456", key: ` ${KEY} `, secure: false }).set?.options.secure, false);
});

test("leaseEntryDecision: 形の違う鍵は Cookie を消して同じ転送先（正誤は区別しない）", () => {
  for (const key of ["abc", KEY.toUpperCase(), KEY + "00", "", "<script>"]) {
    const d = leaseEntryDecision({ bookingId: "84123456", key, secure: true });
    assert.equal(d.location, "/lease/84123456/consent");
    assert.equal(d.set, null);
    assert.deepEqual(d.clear, { name: LEASE_KEY_COOKIE, path: "/lease/84123456" });
  }
});

test("leaseEntryDecision: 鍵が無ければ Cookie は触らない・予約番号の形が違えば何も入れない", () => {
  assert.deepEqual(leaseEntryDecision({ bookingId: "84123456", key: null, secure: true }), { location: "/lease/84123456/consent", set: null, clear: null });
  const bad = leaseEntryDecision({ bookingId: "../x", key: KEY, secure: true });
  assert.equal(bad.set, null);
  assert.equal(bad.clear, null);
  assert.equal(bad.location, "/lease/..%2Fx/consent");
});

const SIG = "1c".repeat(16); // 形だけの署名
const LINK_KEY = "2d".repeat(16); // 形だけの鍵

test("isLeasePreviewToken: p.<失効>.<予約番号|sample>.<32 hex> だけ", () => {
  assert.equal(isLeasePreviewToken(`p.1762700000.123.${SIG}`), true);
  assert.equal(isLeasePreviewToken(`p.1762700000.sample.${SIG}`), true);
  assert.equal(isLeasePreviewToken(`p.1762700000.Sample.${SIG}`), false);
  assert.equal(isLeasePreviewToken(`p.1762700000.12a.${SIG}`), false);
  assert.equal(isLeasePreviewToken(`p.x.123.${SIG}`), false);
  assert.equal(isLeasePreviewToken(`p.1762700000.123.${SIG.toUpperCase()}`), false);
  assert.equal(isLeasePreviewToken(`p.1762700000.123.${SIG}0`), false);
  assert.equal(isLeasePreviewToken(`q.1762700000.123.${SIG}`), false);
  assert.equal(isLeasePreviewToken(SIG), false);
  assert.equal(isLeasePreviewToken(null), false);
  assert.equal(isLeasePreviewToken(undefined), false);
});

test("leaseApiQuery: 運営トークンがあれば b と t（k は付けない）", () => {
  const t = `p.1762700000.123.${SIG}`;
  assert.equal(leaseApiQuery({ bookingId: "123", previewToken: t }), `b=123&t=${t}`);
  assert.equal(leaseApiQuery({ bookingId: "123", key: LINK_KEY, previewToken: t }), `b=123&t=${t}`);
  const s = `p.1762700000.sample.${SIG}`;
  assert.equal(leaseApiQuery({ bookingId: "sample", previewToken: s }), `b=sample&t=${s}`);
});

test("leaseApiQuery: 運営トークンの形違い・対象違いは null（鍵へは落とさない）", () => {
  assert.equal(leaseApiQuery({ bookingId: "123", key: LINK_KEY, previewToken: "bad" }), null);
  assert.equal(leaseApiQuery({ bookingId: "124", previewToken: `p.1762700000.123.${SIG}` }), null);
  assert.equal(leaseApiQuery({ bookingId: "sample", previewToken: `p.1762700000.123.${SIG}` }), null);
  assert.equal(leaseApiQuery({ bookingId: "abc", previewToken: `p.1762700000.sample.${SIG}` }), null);
});

test("leaseApiQuery: 運営トークンが無ければ従来どおり b と k（sample は不可）", () => {
  assert.equal(leaseApiQuery({ bookingId: "123", key: LINK_KEY }), `b=123&k=${LINK_KEY}`);
  assert.equal(leaseApiQuery({ bookingId: "123", key: LINK_KEY, previewToken: "" }), `b=123&k=${LINK_KEY}`);
  assert.equal(leaseApiQuery({ bookingId: "sample", key: LINK_KEY }), null);
  assert.equal(leaseApiQuery({ bookingId: "123", key: "" }), null);
  assert.equal(leaseApiQuery({ bookingId: "123" }), null);
});

test("parseLeaseView: preview / previewStatus は preview: true のときだけ", () => {
  const p = parseLeaseView(view({ preview: true, previewStatus: "dry_planned" }));
  assert.ok(p);
  assert.equal(p.preview, true);
  assert.equal(p.previewStatus, "dry_planned");
  const n = parseLeaseView(view({ previewStatus: "dry_planned" }));
  assert.ok(n);
  assert.equal(n.preview, false);
  assert.equal(n.previewStatus, "");
  assert.equal(parseLeaseView(view({ preview: "true" }))?.preview, false);
  assert.equal(parseLeaseView(view({ preview: true, previewStatus: "x".repeat(100) }))?.previewStatus.length, 40);
});

test("pickBookingField: 英語モードは英語の欄を優先し、無ければ日本語の値", async () => {
  const { pickBookingField } = await import("./lease-consent.ts");
  const b = {
    bookingId: 0, guestName: "山田 太郎", propertyName: "オグラビル四谷 203（マンスリー）", propertyAddress: "東京都新宿区四谷三栄町15-6 203",
    guestNameEn: "Taro Yamada", propertyNameEn: "Ogura Bldg Yotsuya 203 (Monthly)",
    propertyAddressEn: "Ogura Bldg 203, 15-6 Yotsuya Saneicho, Shinjuku-ku, Tokyo 160-0008",
  };
  assert.equal(pickBookingField(b, "propertyName", "en"), "Ogura Bldg Yotsuya 203 (Monthly)");
  assert.equal(pickBookingField(b, "propertyAddress", "en"), "Ogura Bldg 203, 15-6 Yotsuya Saneicho, Shinjuku-ku, Tokyo 160-0008");
  assert.equal(pickBookingField(b, "guestName", "en"), "Taro Yamada");
  assert.equal(pickBookingField(b, "propertyName", "ja"), "オグラビル四谷 203（マンスリー）");
  assert.equal(pickBookingField(b, "guestName", "ja"), "山田 太郎");
  const noEn = { bookingId: 1, guestName: "John Smith", propertyName: "203 マンスリー", propertyAddress: "東京都" , propertyNameEn: "  " };
  assert.equal(pickBookingField(noEn, "propertyName", "en"), "203 マンスリー");
  assert.equal(pickBookingField(noEn, "propertyAddress", "en"), "東京都");
  assert.equal(pickBookingField(noEn, "guestName", "en"), "John Smith");
  assert.equal(pickBookingField({ bookingId: 2 }, "propertyName", "en"), "");
  assert.equal(pickBookingField(null, "guestName", "ja"), "");
});

test("parseLeaseView: 英語の欄を読み、無い・文字列でないものは省く", () => {
  const v = parseLeaseView(view({
    booking: { bookingId: 123, guestName: "山田 太郎", propertyName: "203", propertyNameEn: "Ogura 203 (Monthly)", propertyAddressEn: "15-6 Yotsuya", guestNameEn: "Taro Yamada" },
  }));
  assert.ok(v);
  assert.equal(v.booking.propertyNameEn, "Ogura 203 (Monthly)");
  assert.equal(v.booking.propertyAddressEn, "15-6 Yotsuya");
  assert.equal(v.booking.guestNameEn, "Taro Yamada");
  const w = parseLeaseView(view({ booking: { bookingId: 123, propertyName: "203", propertyNameEn: 5 } }));
  assert.ok(w);
  assert.equal(w.booking.propertyNameEn, undefined);
  assert.equal(w.booking.guestNameEn, undefined);
});
