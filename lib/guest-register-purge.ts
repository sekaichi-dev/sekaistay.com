// テスト送信の後片付け（scripts/guest-register-purge.ts）の照合部分。受付 ID と完全一致する行だけを選ぶ。
import { reportPeriodLabel, sanitizeFolderName, MAX_GUESTS } from "./guest-register.ts";

/** makeGroupId() の形（G-YYMMDD-XXXX）だけを受け付ける。部分一致や前方一致で他人の行を消さないため */
export const RECEIPT_ID_RE = /^G-\d{6}-[A-Z0-9]{4}$/;

export type RegisterTab = "民泊用" | "旅館業用";

/** データ行は 6 行目から（A6:W）。sheetRow は 1 始まりのシート上の行番号 */
export const FIRST_DATA_ROW = 6;

export interface MatchedRow {
  tab: RegisterTab;
  sheetRow: number;
  /** yyyy-mm-dd（Drive の報告期間フォルダを決める） */
  checkin: string;
  propertyName: string;
  guestName: string;
}

function isoFromSlash(v: string | undefined): string {
  const m = (v || "").trim().match(/^(\d{4})\/(\d{2})\/(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

/** 民泊用: B 列が受付 ID / 旅館業用: P 列（備考）の末尾の項目が「受付ID: <ID>」（buildRyokanRows が最後に足す。
 *  前の項目はゲストの自由記述なので見ない） */
export function rowMatchesReceipt(tab: RegisterTab, row: readonly (string | undefined)[], receiptId: string): boolean {
  if (!RECEIPT_ID_RE.test(receiptId)) return false;
  if (tab === "民泊用") return (row[1] || "").trim() === receiptId;
  const parts = (row[15] || "").split("｜");
  return parts[parts.length - 1].trim() === `受付ID: ${receiptId}`;
}

export function matchReceiptRows(tab: RegisterTab, values: readonly (readonly (string | undefined)[])[], receiptId: string): MatchedRow[] {
  const out: MatchedRow[] = [];
  values.forEach((row, i) => {
    if (!rowMatchesReceipt(tab, row, receiptId)) return;
    out.push({
      tab,
      sheetRow: FIRST_DATA_ROW + i,
      checkin: isoFromSlash(tab === "民泊用" ? row[9] : row[1]),
      propertyName: (row[16] || "").trim(),
      guestName: (tab === "民泊用" ? row[3] : row[2]) || "",
    });
  });
  return out;
}

/** 1 回の送信は最大 MAX_GUESTS 行・1 つのタブにだけ入る。それを外れたら何かがおかしいので消さない */
export function planProblem(rows: readonly MatchedRow[]): string | null {
  if (rows.length === 0) return "該当する行がありません";
  if (rows.length > MAX_GUESTS) return `該当が ${rows.length} 行あります（1 回の送信は最大 ${MAX_GUESTS} 行）`;
  if (new Set(rows.map((r) => r.tab)).size > 1) return "民泊用と旅館業用の両方に該当があります";
  if (new Set(rows.map((r) => `${r.checkin}|${r.propertyName}`)).size > 1) return "該当行の宿泊日・物件がそろっていません";
  if (!rows[0].checkin || !rows[0].propertyName) return "該当行の宿泊日か物件名が読めません";
  return null;
}

/** 写真の保管フォルダの道筋: 名簿フォルダ / 報告期間 / 物件 / 「<受付ID>_<代表者>」 */
export function receiptFolderPath(row: Pick<MatchedRow, "checkin" | "propertyName">): [string, string] {
  return [reportPeriodLabel(row.checkin), sanitizeFolderName(row.propertyName)];
}

export function isReceiptFolderName(name: string, receiptId: string): boolean {
  return RECEIPT_ID_RE.test(receiptId) && name.startsWith(`${receiptId}_`);
}

/** フォルダを作れなかったとき名簿フォルダ直下に置かれる写真（…_<受付ID>.<拡張子>） */
export function isReceiptPhotoName(name: string, receiptId: string): boolean {
  return RECEIPT_ID_RE.test(receiptId) && new RegExp(`_${receiptId}\\.[a-z]{3,4}$`).test(name);
}
