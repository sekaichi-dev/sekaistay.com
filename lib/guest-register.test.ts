import { test } from "node:test";
import assert from "node:assert/strict";

const {
  calcNights, needsPassport, parseRegisterInput, validateGuests,
  buildMinpakuRows, buildRyokanRows, makeGroupId, sanitizeFilePart, escapeCell,
} = await import("./guest-register.ts");

const guest = (over: Record<string, unknown> = {}) => ({
  name: "John Smith",
  jaResident: false,
  address: "1 Main St, London, UK",
  nationality: "英国",
  occupation: "会社員",
  contact: "+44-20-1234-5678",
  passportNo: "P1234567A",
  gender: "", age: "", prevStay: "", nextDest: "",
  ...over,
});

const input = (over: Record<string, unknown> = {}) => ({
  propertyId: "TEST-M",
  checkin: "2026-07-15",
  checkout: "2026-07-17",
  note: "",
  guests: [guest()],
  ...over,
});

const property = (over: Record<string, unknown> = {}) => ({
  id: "TEST-M", name: "テスト物件", nameEn: "Test Property",
  type: "民泊" as const, licenseNo: "M019999999", active: true,
  ...over,
});

test("calcNights: 2泊", () => {
  assert.equal(calcNights("2026-07-15", "2026-07-17"), 2);
});

test("calcNights: 月跨ぎ・不正値", () => {
  assert.equal(calcNights("2026-07-31", "2026-08-02"), 2);
  assert.ok(Number.isNaN(calcNights("bad", "2026-08-02")));
});

test("needsPassport: 国内住所なし外国籍のみ true", () => {
  assert.equal(needsPassport({ jaResident: false, nationality: "英国" }), true);
  assert.equal(needsPassport({ jaResident: true, nationality: "英国" }), false);
  assert.equal(needsPassport({ jaResident: false, nationality: "日本" }), false);
});

test("parseRegisterInput: 正常系", () => {
  const { input: parsed, error } = parseRegisterInput(input());
  assert.equal(error, undefined);
  assert.equal(parsed!.guests.length, 1);
  assert.equal(parsed!.guests[0].name, "John Smith");
});

test("parseRegisterInput: 日付不正・checkout<=checkin を拒否", () => {
  assert.ok(parseRegisterInput(input({ checkin: "2026/07/15" })).error);
  assert.ok(parseRegisterInput(input({ checkout: "2026-07-15" })).error);
  assert.ok(parseRegisterInput(input({ checkout: "2026-07-14" })).error);
});

test("parseRegisterInput: ゲスト0名・9名超を拒否", () => {
  assert.ok(parseRegisterInput(input({ guests: [] })).error);
  assert.ok(parseRegisterInput(input({ guests: Array.from({ length: 9 }, () => guest()) })).error);
});

test("validateGuests: 民泊は職業必須・旅館業は不要", () => {
  const noJob = { ...input(), guests: [guest({ occupation: "" })] };
  assert.match(validateGuests(noJob, "民泊")!, /職業/);
  assert.equal(validateGuests(noJob, "旅館業"), null);
});

test("validateGuests: 連絡先は両形態で必須", () => {
  const noContact = { ...input(), guests: [guest({ contact: "" })] };
  assert.match(validateGuests(noContact, "民泊")!, /連絡先/);
  assert.match(validateGuests(noContact, "旅館業")!, /連絡先/);
});

test("validateGuests: 国内住所なし外国籍は旅券番号必須", () => {
  const noPassport = { ...input(), guests: [guest({ passportNo: "" })] };
  assert.match(validateGuests(noPassport, "旅館業")!, /旅券番号/);
  const jaResident = { ...input(), guests: [guest({ passportNo: "", jaResident: true })] };
  assert.equal(validateGuests(jaResident, "旅館業"), null);
});

test("validateGuests: リスト外の国籍を拒否", () => {
  const bad = { ...input(), guests: [guest({ nationality: "UK" })] };
  assert.match(validateGuests(bad, "民泊")!, /国籍/);
});

test("buildMinpakuRows: 列マッピング A届出番号〜S受付日時", () => {
  const rows = buildMinpakuRows(
    input({ guests: [guest(), guest({ name: "Jane Smith" })] }) as never,
    property() as never,
    "G-260715-TEST",
    ["https://drive.google.com/x", null],
    "2026/07/03 14:00",
  );
  assert.equal(rows.length, 2);
  const [rep, comp] = rows;
  assert.equal(rep[0], "M019999999"); // A 届出番号
  assert.equal(rep[1], "G-260715-TEST"); // B グループID
  assert.equal(rep[2], "代表者"); // C 種別
  assert.equal(comp[2], "同行者");
  assert.equal(rep[7], "英国"); // H 国籍（定期報告の COUNTIFS が参照）
  assert.equal(rep[9], "2026/07/15"); // J 宿泊開始日
  assert.equal(rep[11], "2026/07/17"); // L 宿泊終了日
  assert.equal(rep[13], 2); // N 宿泊数
  assert.equal(rep[14], "有"); // O 旅券写し
  assert.equal(comp[14], "－");
  assert.equal(rep[17], "https://drive.google.com/x"); // R Driveリンク
  assert.equal(rep[18], "2026/07/03 14:00"); // S 受付日時
});

test("buildRyokanRows: No.は自動採番式・日本人は旅券－", () => {
  const rows = buildRyokanRows(
    input({ guests: [guest({ nationality: "日本", jaResident: true, passportNo: "" })] }) as never,
    property({ type: "旅館業", licenseNo: "" }) as never,
    "G-260715-TEST",
    [null],
    "2026/07/03 14:00",
  );
  const [row] = rows;
  assert.equal(row[0], "=ROW()-5"); // A No.
  assert.equal(row[1], "2026/07/15"); // B 宿泊日
  assert.equal(row[5], "（日本）"); // F 国籍
  assert.equal(row[6], "－"); // G 旅券番号
  assert.match(String(row[15]), /受付ID: G-260715-TEST/); // P 備考
});

test("makeGroupId: フォーマット", () => {
  assert.match(makeGroupId(), /^G-\d{6}-[A-Z2-9]{4}$/);
});

test("escapeCell: +始まりの国際電話番号を数式解釈させない", () => {
  assert.equal(escapeCell("+44-20-1234-5678"), "'+44-20-1234-5678");
  assert.equal(escapeCell("=1+2"), "'=1+2");
  assert.equal(escapeCell("090-1234-5678"), "090-1234-5678"); // ハイフン先頭以外はそのまま
  assert.equal(escapeCell("-note"), "'-note");
});

test("buildMinpakuRows: 連絡先の + がエスケープされる", () => {
  const rows = buildMinpakuRows(
    input() as never, property() as never, "G-1", [null], "2026/07/03 14:00",
  );
  assert.equal(rows[0][6], "'+44-20-1234-5678");
});

test("sanitizeFilePart: 記号・空白を除去", () => {
  assert.equal(sanitizeFilePart("John / Smith:*?"), "John_Smith_");
  assert.equal(sanitizeFilePart(""), "guest");
});
