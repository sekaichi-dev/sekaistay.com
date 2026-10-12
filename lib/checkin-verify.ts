// チェックイン時の本人確認（/checkin/<物件ID>?k=<鍵>）— 室内 QR から送られた「顔＋身分証」の自撮りの受付。
// 法令（住宅宿泊事業法ガイドライン）の「顔と旅券が鮮明に画像で確認できる」「住宅内またはその近傍から発信」に対応する。
// 「室内から」の一次証拠は QR に埋めた物件ごとの鍵（HMAC・室内掲示でしか配らない）。受信時刻と位置情報を添えて記録する。
// 写真は名簿フォームと同じ経路（photo-session で Drive 受付中フォルダへ直接 PUT → 送信で名簿フォルダへコピー）。
// 記録先: 名簿スプシの「本人確認」タブに 1 枚 1 行（A〜O 列・見出しは 1 行目・データは 2 行目から）。

import { createHmac, timingSafeEqual } from "node:crypto";
import { escapeCell } from "./guest-register.ts";

export const CHECKIN_SHEET_TAB = "本人確認";
export const CHECKIN_SHEET_RANGE = `${CHECKIN_SHEET_TAB}!A2:O`;
export const CHECKIN_SHEET_HEADER = [
  "受信日時", "物件ID", "物件名", "予約番号", "姓", "到着日", "枚目/枚数",
  "位置情報", "緯度,経度", "精度m", "写真リンク", "判定", "判定者", "備考", "受付ID",
] as const;

export const MAX_CHECKIN_PHOTOS = 8;
const KEY_LEN = 16;
const DRIVE_ID_RE = /^[A-Za-z0-9_-]{10,128}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BOOKING_RE = /^\d{1,12}$/;

/** 物件ごとの QR 鍵。秘密 1 本から導くので鍵の表を持たない（秘密を替えれば全物件の QR が無効になる＝刷り直し）。 */
export function roomKey(propertyId: string, secret: string): string {
  return createHmac("sha256", secret).update(`checkin:${propertyId}`).digest("hex").slice(0, KEY_LEN);
}

export function verifyRoomKey(propertyId: string, key: string, secret: string): boolean {
  if (!secret || !propertyId || typeof key !== "string" || key.length !== KEY_LEN) return false;
  const expected = Buffer.from(roomKey(propertyId, secret));
  const given = Buffer.from(key);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function checkinUrl(baseUrl: string, propertyId: string, secret: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/checkin/${encodeURIComponent(propertyId)}?k=${roomKey(propertyId, secret)}`;
}

export type GeoStatus = "ok" | "denied" | "unavailable" | "skipped";

export interface GeoInput {
  status: GeoStatus;
  lat?: number;
  lng?: number;
  accuracy?: number;
}

export interface CheckinInput {
  propertyId: string;
  key: string;
  bookingRef: string;
  lastName: string;
  arrivalDate: string;
  photoFileIds: string[];
  geo: GeoInput;
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

export function parseGeo(raw: unknown): GeoInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const status = r.status;
  if (status !== "ok" && status !== "denied" && status !== "unavailable") return { status: "skipped" };
  if (status !== "ok") return { status };
  const lat = num(r.lat);
  const lng = num(r.lng);
  if (lat === undefined || lng === undefined || Math.abs(lat) > 90 || Math.abs(lng) > 180) return { status: "unavailable" };
  const accuracy = num(r.accuracy);
  return { status: "ok", lat, lng, accuracy: accuracy !== undefined && accuracy >= 0 ? Math.round(accuracy) : undefined };
}

/** 予約番号、または「姓＋到着日」のどちらかが要る。写真は 1〜MAX 枚・Drive の ID 形式だけ受ける。 */
export function parseCheckinInput(raw: unknown): { input?: CheckinInput; error?: string } {
  if (!raw || typeof raw !== "object") return { error: "invalid payload" };
  const r = raw as Record<string, unknown>;
  const propertyId = str(r.propertyId, 20);
  const key = str(r.key, 64);
  if (!propertyId || !key) return { error: "invalid qr" };
  const bookingRef = str(r.bookingRef, 12);
  if (bookingRef && !BOOKING_RE.test(bookingRef)) return { error: "booking" };
  const lastName = str(r.lastName, 100);
  const arrivalDate = str(r.arrivalDate, 10);
  if (arrivalDate && !DATE_RE.test(arrivalDate)) return { error: "arrival" };
  if (!bookingRef && !(lastName && arrivalDate)) return { error: "booking" };
  const ids = Array.isArray(r.photoFileIds) ? r.photoFileIds : [];
  if (ids.length < 1 || ids.length > MAX_CHECKIN_PHOTOS) return { error: "photos" };
  const photoFileIds: string[] = [];
  for (const id of ids) {
    if (typeof id !== "string" || !DRIVE_ID_RE.test(id)) return { error: "photos" };
    photoFileIds.push(id);
  }
  return { input: { propertyId, key, bookingRef, lastName, arrivalDate, photoFileIds, geo: parseGeo(r.geo) } };
}

export function makeCheckinReceiptId(now: Date = new Date()): string {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const ymd = jst.toISOString().slice(0, 10).replaceAll("-", "");
  return `C${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** 位置情報の記録文。判定（物件からの距離）は Phase 1 で ops 側に置くので、ここでは取得結果だけを残す。 */
export function geoLabel(geo: GeoInput): string {
  switch (geo.status) {
    case "ok": return "取得";
    case "denied": return "拒否";
    case "unavailable": return "取得不可";
    default: return "未取得";
  }
}

export function buildCheckinRows(
  input: CheckinInput,
  property: { id: string; name: string },
  receiptId: string,
  photoLinks: string[],
  receivedAt: string,
): string[][] {
  const geo = input.geo;
  const latLng = geo.status === "ok" ? `${geo.lat},${geo.lng}` : "";
  const accuracy = geo.status === "ok" && geo.accuracy !== undefined ? String(geo.accuracy) : "";
  return photoLinks.map((link, i) => [
    receivedAt,
    property.id,
    property.name,
    input.bookingRef ? `b:${input.bookingRef}` : "",
    escapeCell(input.lastName), // ゲスト入力は数式として解釈させない
    input.arrivalDate,
    `${i + 1}/${photoLinks.length}`,
    geoLabel(geo),
    latLng,
    accuracy,
    link,
    "",
    "",
    "",
    receiptId,
  ]);
}

/** 写真ファイル名（Drive）。名簿の旅券写しと同じフォルダに並ぶので「本人確認_」で見分ける。 */
export function checkinPhotoBaseName(propertyId: string, receiptId: string, index: number): string {
  return `本人確認_${propertyId}_${receiptId}_${index + 1}`;
}
