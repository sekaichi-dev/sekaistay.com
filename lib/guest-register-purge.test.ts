import { test } from "node:test";
import assert from "node:assert/strict";

const { rowMatchesReceipt, matchReceiptRows, planProblem, receiptFolderPath, isReceiptFolderName, isReceiptPhotoName } =
  await import("./guest-register-purge.ts");

const ID = "G-261110-AB2C";

test("purge: 受付 ID の完全一致だけ（前方一致・部分一致・形の違う ID は対象外）", () => {
  assert.equal(rowMatchesReceipt("民泊用", ["M01", ID], ID), true);
  assert.equal(rowMatchesReceipt("民泊用", ["M01", `${ID}X`], ID), false);
  assert.equal(rowMatchesReceipt("民泊用", ["M01", "G-261110-AB2"], "G-261110-AB2"), false); // ID の形でない
  assert.equal(rowMatchesReceipt("民泊用", ["M01", ""], ""), false);
  const p = (note: string) => { const r = Array(23).fill(""); r[15] = note; return r; };
  assert.equal(rowMatchesReceipt("旅館業用", p(`受付ID: ${ID}`), ID), true);
  assert.equal(rowMatchesReceipt("旅館業用", p(`メモ｜受付ID: ${ID}`), ID), true);
  assert.equal(rowMatchesReceipt("旅館業用", p(`受付ID: ${ID}9`), ID), false);
  assert.equal(rowMatchesReceipt("旅館業用", p(`受付ID: G-261110-ZZZZ`), ID), false);
  // 備考（自由記述）に書かれた別の受付 ID には一致しない
  assert.equal(rowMatchesReceipt("旅館業用", p(`受付ID: ${ID}｜受付ID: G-261110-ZZZZ`), ID), false);
});

test("purge: シート上の行番号・宿泊日・物件名を取り出し、Drive の道筋を組む", () => {
  const ryokan = [
    ["=ROW()-5", "2026/11/09", "A", ...Array(12).fill(""), "受付ID: G-261109-ZZZZ", "西新宿"],
    ["=ROW()-5", "2026/11/11", "TEST TARO", ...Array(12).fill(""), `受付ID: ${ID}`, "西新宿access渋谷stay"],
    ["=ROW()-5", "2026/11/11", "TEST HANAKO", ...Array(12).fill(""), `受付ID: ${ID}`, "西新宿access渋谷stay"],
  ];
  const rows = matchReceiptRows("旅館業用", ryokan, ID);
  assert.deepEqual(rows.map((r) => r.sheetRow), [7, 8]);
  assert.equal(rows[0].checkin, "2026-11-11");
  assert.equal(rows[0].guestName, "TEST TARO");
  assert.equal(planProblem(rows), null);
  assert.deepEqual(receiptFolderPath(rows[0]), ["2026年10-11月", "西新宿access渋谷stay"]);
});

test("purge: おかしな一致は消さない", () => {
  const r = (over = {}) => ({ tab: "民泊用" as const, sheetRow: 6, checkin: "2026-11-11", propertyName: "X", guestName: "a", ...over });
  assert.match(planProblem([])!, /該当する行/);
  assert.match(planProblem(Array.from({ length: 9 }, (_, i) => r({ sheetRow: 6 + i })))!, /最大/);
  assert.match(planProblem([r(), r({ tab: "旅館業用" })])!, /両方/);
  assert.match(planProblem([r(), r({ propertyName: "Y" })])!, /そろって/);
  assert.match(planProblem([r({ checkin: "" })])!, /読めません/);
});

test("purge: 写真フォルダ・直下の写真の名前の照合", () => {
  assert.equal(isReceiptFolderName(`${ID}_TEST_TARO`, ID), true);
  assert.equal(isReceiptFolderName(`${ID}X_TEST`, ID), false);
  assert.equal(isReceiptFolderName(`x${ID}_TEST`, ID), false);
  assert.equal(isReceiptPhotoName(`顔写真_T422_20261111_TEST_${ID}.jpg`, ID), true);
  assert.equal(isReceiptPhotoName(`顔写真_T422_20261111_TEST_${ID}9.jpg`, ID), false);
});
