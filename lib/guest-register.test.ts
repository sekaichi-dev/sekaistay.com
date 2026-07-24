import { test } from "node:test";
import assert from "node:assert/strict";

const {
  calcNights, needsPassport, parseRegisterInput, validateGuests,
  buildMinpakuRows, buildRyokanRows, makeGroupId, sanitizeFilePart, escapeCell,
  reportPeriodLabel, sanitizeFolderName, NATIONALITIES,
} = await import("./guest-register.ts");

test("NATIONALITIES: 網羅リスト（190超・重複なし・最後はその他）", () => {
  assert.ok(NATIONALITIES.length > 190, `length=${NATIONALITIES.length}`);
  assert.equal(new Set(NATIONALITIES).size, NATIONALITIES.length);
  for (const c of ["オーストリア", "チェコ", "ウクライナ", "南アフリカ", "無国籍"]) {
    assert.ok(NATIONALITIES.includes(c), c);
  }
  assert.equal(NATIONALITIES[NATIONALITIES.length - 1], "その他");
});

test("validateGuests: 新リストの国籍（オーストリア）を受理・リスト外は拒否", () => {
  const at = { ...input(), guests: [guest({ nationality: "オーストリア" })] };
  assert.equal(validateGuests(at, "民泊"), null);
  const bad = { ...input(), guests: [guest({ nationality: "イギリス" })] };
  assert.match(validateGuests(bad, "民泊")!, /国籍/);
});

test("parseRegisterInput: 予定時刻は HH:MM のみ受理・不正は空で通す", () => {
  const ok = parseRegisterInput(input({ checkinTime: "15:30", checkoutTime: "10:00" }));
  assert.equal(ok.input!.checkinTime, "15:30");
  assert.equal(ok.input!.checkoutTime, "10:00");
  const ng = parseRegisterInput(input({ checkinTime: "9:00", checkoutTime: "25:00" }));
  assert.equal(ng.error, undefined);
  assert.equal(ng.input!.checkinTime, "");
  assert.equal(ng.input!.checkoutTime, "");
});

test("buildMinpakuRows: 予定時刻が K/M 列に入る（未入力は空欄）", () => {
  const withTime = buildMinpakuRows(
    input({ checkinTime: "15:30", checkoutTime: "10:00" }) as never,
    property() as never, "G-1", [null], [null], "2026/07/03 14:00",
  );
  assert.equal(withTime[0][10], "15:30"); // K 開始時刻
  assert.equal(withTime[0][12], "10:00"); // M 終了時刻
  const noTime = buildMinpakuRows(input() as never, property() as never, "G-1", [null], [null], "2026/07/03 14:00");
  assert.equal(noTime[0][10], "");
  assert.equal(noTime[0][12], "");
});

test("buildRyokanRows: 予定時刻が 到着日時/出発日時 列に日付付きで入る", () => {
  const rows = buildRyokanRows(
    input({ checkinTime: "15:30", checkoutTime: "10:00" }) as never,
    property({ type: "旅館業", licenseNo: "" }) as never, "G-1", [null], [null], "2026/07/03 14:00",
  );
  assert.equal(rows[0][12], "2026/07/15 15:30"); // M 到着日時
  assert.equal(rows[0][13], "2026/07/17 10:00"); // N 出発日時
});

test("reportPeriodLabel: 民泊定期報告の2ヶ月区切り", () => {
  assert.equal(reportPeriodLabel("2026-07-14"), "2026年6-7月");
  assert.equal(reportPeriodLabel("2026-06-01"), "2026年6-7月");
  assert.equal(reportPeriodLabel("2026-04-30"), "2026年4-5月");
  assert.equal(reportPeriodLabel("2026-02-15"), "2026年2-3月");
  assert.equal(reportPeriodLabel("2026-12-31"), "2026年12月-2027年1月");
  assert.equal(reportPeriodLabel("2027-01-05"), "2026年12月-2027年1月");
  assert.equal(reportPeriodLabel("bad"), "期間不明");
});

test("sanitizeFolderName: 禁止文字のみ除去しスペース・ハイフンは保持", () => {
  assert.equal(sanitizeFolderName("オグラビル 203"), "オグラビル 203");
  assert.equal(sanitizeFolderName("G-260710-XXZF_Martin_Chroust"), "G-260710-XXZF_Martin_Chroust");
  assert.equal(sanitizeFolderName("a/b:c*d"), "a b c d");
  assert.equal(sanitizeFolderName(""), "不明");
});

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

test("needsPassport: 国内住所なしなら国籍を問わず true", () => {
  assert.equal(needsPassport({ jaResident: false, nationality: "英国" }), true);
  assert.equal(needsPassport({ jaResident: true, nationality: "英国" }), false);
  assert.equal(needsPassport({ jaResident: false, nationality: "日本" }), true); // 日本国籍でも国外居住は必須（運用上）
  assert.equal(needsPassport({ jaResident: true, nationality: "日本" }), false);
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

test("buildMinpakuRows: 列マッピング A届出番号〜T顔写真", () => {
  const rows = buildMinpakuRows(
    input({ guests: [guest(), guest({ name: "Jane Smith" })] }) as never,
    property() as never,
    "G-260715-TEST",
    ["https://drive.google.com/x", null],
    ["https://drive.google.com/face1", "https://drive.google.com/face2"],
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
  assert.equal(rep[19], "https://drive.google.com/face1"); // T 顔写真リンク
  assert.equal(comp[19], "https://drive.google.com/face2");
});

test("buildRyokanRows: No.は自動採番式・日本人は旅券－", () => {
  const rows = buildRyokanRows(
    input({ guests: [guest({ nationality: "日本", jaResident: true, passportNo: "" })] }) as never,
    property({ type: "旅館業", licenseNo: "" }) as never,
    "G-260715-TEST",
    [null],
    ["https://drive.google.com/face1"],
    "2026/07/03 14:00",
  );
  const [row] = rows;
  assert.equal(row[0], "=ROW()-5"); // A No.
  assert.equal(row[1], "2026/07/15"); // B 宿泊日
  assert.equal(row[5], "（日本）"); // F 国籍
  assert.equal(row[6], "－"); // G 旅券番号
  assert.match(String(row[15]), /受付ID: G-260715-TEST/); // P 備考
  assert.equal(row[19], "https://drive.google.com/face1"); // T 顔写真リンク
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
    input() as never, property() as never, "G-1", [null], [null], "2026/07/03 14:00",
  );
  assert.equal(rows[0][6], "'+44-20-1234-5678");
});

test("buildMinpakuRows: 任意提供の旅券番号・写しも記録される（国内住所あり）", () => {
  const rows = buildMinpakuRows(
    input({ guests: [guest({ jaResident: true, passportNo: "P7654321B" })] }) as never,
    property() as never,
    "G-1",
    ["https://drive.google.com/opt"],
    [null],
    "2026/07/03 14:00",
  );
  assert.equal(rows[0][8], "P7654321B"); // I 旅券番号（needsPassport でなくても提供があれば記録）
  assert.equal(rows[0][14], "有"); // O 旅券写し
  assert.equal(rows[0][17], "https://drive.google.com/opt"); // R Driveリンク
});

test("buildRyokanRows: 任意提供の旅券番号・写しも記録される（日本人ゲスト）", () => {
  const rows = buildRyokanRows(
    input({ guests: [guest({ nationality: "日本", jaResident: true, passportNo: "TK1234567" })] }) as never,
    property({ type: "旅館業", licenseNo: "" }) as never,
    "G-1",
    ["https://drive.google.com/opt"],
    [null],
    "2026/07/03 14:00",
  );
  assert.equal(rows[0][6], "TK1234567"); // G 旅券番号
  assert.equal(rows[0][7], "有"); // H 旅券写し
  assert.equal(rows[0][17], "https://drive.google.com/opt"); // R Driveリンク
});

test("sanitizeFilePart: 記号・空白を除去", () => {
  assert.equal(sanitizeFilePart("John / Smith:*?"), "John_Smith_");
  assert.equal(sanitizeFilePart(""), "guest");
});
