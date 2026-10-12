// チェックイン時の本人確認 — 室内 QR から送られた「顔＋身分証」の自撮りの受付。
// QR の URL は /c/<物件ID>?k=<鍵>。鍵を検証して httpOnly Cookie に移し、/checkin/<物件ID>（鍵なし URL）へ転送する。
// 鍵入りの URL ではページを描画しないので、解析・広告タグに鍵が渡らない（Codex P1・2026-10-12）。
// 保健所要件（Yugo 2026-10-12）: ①宿泊者全員分 ②顔と身分証が読める・外国人は旅券の顔写真ページも別に撮る
// ③物件で撮った証明（室内 QR からしか入れない・位置情報と日時・その場撮影のみ）④照合してから入室 ⑤3 年保存。
// 記録先: 名簿スプシの「本人確認」タブに 1 枚 1 行（A〜O 列・見出しは 1 行目・データは 2 行目から）。

import { createHmac, timingSafeEqual } from "node:crypto";
import { escapeCell } from "./guest-register.ts";

export const CHECKIN_SHEET_TAB = "本人確認";
export const CHECKIN_SHEET_RANGE = `${CHECKIN_SHEET_TAB}!A2:O`;
export const CHECKIN_SHEET_HEADER = [
  "受信日時", "物件ID", "物件名", "予約番号", "氏名", "到着日", "枚目/枚数",
  "位置情報", "緯度,経度", "精度m", "写真リンク", "判定", "判定者", "備考", "受付ID",
] as const;

export const MAX_CHECKIN_GUESTS = 8;
const KEY_LEN = 16;
const DRIVE_ID_RE = /^[A-Za-z0-9_-]{10,128}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Beds24 の予約番号（数字）のほか、Airbnb の確認コード（英数字）もそのまま受ける。突合は Phase 1 で ops 側が行う
const BOOKING_RE = /^[A-Za-z0-9]{1,20}$/;

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
  return `${baseUrl.replace(/\/+$/, "")}/c/${encodeURIComponent(propertyId)}?k=${roomKey(propertyId, secret)}`;
}

export const CHECKIN_COOKIE = "checkin_key";
export const CHECKIN_COOKIE_MAX_AGE = 24 * 60 * 60;

export function checkinCookieValue(propertyId: string, key: string): string {
  return `${propertyId}:${key}`;
}

/** Cookie の値が「この物件の正しい鍵」か。物件が違う・鍵が違う・秘密なしは false */
export function verifyCheckinCookie(value: string | undefined, propertyId: string, secret: string): boolean {
  if (!value) return false;
  const i = value.indexOf(":");
  if (i <= 0) return false;
  return value.slice(0, i) === propertyId && verifyRoomKey(propertyId, value.slice(i + 1), secret);
}

export type GeoStatus = "ok" | "denied" | "unavailable" | "skipped";

export interface GeoInput {
  status: GeoStatus;
  lat?: number;
  lng?: number;
  accuracy?: number;
}

/** 撮影の方法。camera = 画面内カメラでその場撮影（既定）。file = カメラが使えない端末でのファイル選択（カメラ直接起動を指定するが端末によってはカメラロールも選べる） */
export type CaptureMethod = "camera" | "file";

export interface CheckinGuestInput {
  /** 身分証どおりの氏名 */
  name: string;
  /** 日本国内に住所があるか。無ければ旅券の顔写真ページの撮影も必須（名簿フォームの needsPassport と同じ基準） */
  jaResident: boolean;
  /** 顔の横に身分証を持った自撮り */
  selfieFileId: string;
  /** 旅券の顔写真ページ（jaResident=false のとき必須） */
  passportFileId: string;
  method: CaptureMethod;
}

export interface CheckinInput {
  propertyId: string;
  bookingRef: string;
  lastName: string;
  arrivalDate: string;
  guests: CheckinGuestInput[];
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

function driveId(v: unknown): string {
  return typeof v === "string" && DRIVE_ID_RE.test(v) ? v : "";
}

/** 宿泊者 1 名ぶん。氏名・自撮りは必須、国内住所が無ければ旅券ページも必須 */
export function parseCheckinGuest(raw: unknown): { guest?: CheckinGuestInput; error?: string } {
  if (!raw || typeof raw !== "object") return { error: "guests" };
  const r = raw as Record<string, unknown>;
  const name = str(r.name, 100);
  if (!name) return { error: "name" };
  if (typeof r.jaResident !== "boolean") return { error: "residence" };
  const selfieFileId = driveId(r.selfieFileId);
  if (!selfieFileId) return { error: "selfie" };
  const passportFileId = driveId(r.passportFileId);
  if (!r.jaResident && !passportFileId) return { error: "passport" };
  if (r.passportFileId && !passportFileId) return { error: "passport" };
  const method: CaptureMethod = r.method === "file" ? "file" : "camera";
  return { guest: { name, jaResident: r.jaResident, selfieFileId, passportFileId, method } };
}

/** 予約番号、または「姓＋到着日」のどちらかが要る。宿泊者は 1〜MAX 名・全員分の写真が要る。 */
export function parseCheckinInput(raw: unknown): { input?: CheckinInput; error?: string } {
  if (!raw || typeof raw !== "object") return { error: "invalid payload" };
  const r = raw as Record<string, unknown>;
  const propertyId = str(r.propertyId, 20);
  if (!propertyId) return { error: "invalid qr" };
  const bookingRef = str(r.bookingRef, 21).toUpperCase(); // 21 文字目まで見て、長すぎれば切らずに拒否する
  if (bookingRef && !BOOKING_RE.test(bookingRef)) return { error: "booking" };
  const lastName = str(r.lastName, 100);
  const arrivalDate = str(r.arrivalDate, 10);
  if (arrivalDate && !DATE_RE.test(arrivalDate)) return { error: "arrival" };
  if (!bookingRef && !(lastName && arrivalDate)) return { error: "booking" };
  const rawGuests = Array.isArray(r.guests) ? r.guests : [];
  if (rawGuests.length < 1 || rawGuests.length > MAX_CHECKIN_GUESTS) return { error: "guests" };
  const guests: CheckinGuestInput[] = [];
  for (const g of rawGuests) {
    const { guest, error } = parseCheckinGuest(g);
    if (!guest) return { error };
    guests.push(guest);
  }
  return { input: { propertyId, bookingRef, lastName, arrivalDate, guests, geo: parseGeo(r.geo) } };
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

/** 数字だけ＝Beds24 予約番号は名簿の U 列と同じ `b:` 付き。英数字（Airbnb 確認コード等）はそのまま */
export function bookingCell(bookingRef: string): string {
  if (!bookingRef) return "";
  return /^\d+$/.test(bookingRef) ? `b:${bookingRef}` : bookingRef;
}

export type CheckinPhotoKind = "selfie" | "passport";

export interface CheckinPhotoRef {
  guestIndex: number;
  kind: CheckinPhotoKind;
  fileId: string;
}

/** 送信に含まれる写真を「宿泊者順・自撮り→旅券」の順に並べる（Drive のファイル名・シートの行順がこの順になる） */
export function listCheckinPhotos(input: Pick<CheckinInput, "guests">): CheckinPhotoRef[] {
  const out: CheckinPhotoRef[] = [];
  input.guests.forEach((g, i) => {
    out.push({ guestIndex: i, kind: "selfie", fileId: g.selfieFileId });
    if (g.passportFileId) out.push({ guestIndex: i, kind: "passport", fileId: g.passportFileId });
  });
  return out;
}

const KIND_LABEL: Record<CheckinPhotoKind, string> = { selfie: "顔+身分証", passport: "旅券ページ" };
const METHOD_LABEL: Record<CaptureMethod, string> = { camera: "画面内カメラ", file: "ファイル選択" };

/** 備考列: どの宿泊者の何の写真を、どの方法で撮ったか（Phase 1 の判定と保健所への説明に使う） */
export function photoNote(input: Pick<CheckinInput, "guests">, ref: CheckinPhotoRef): string {
  const g = input.guests[ref.guestIndex];
  return `宿泊者${ref.guestIndex + 1}/${input.guests.length} ${KIND_LABEL[ref.kind]}・${METHOD_LABEL[g.method]}・${g.jaResident ? "国内住所あり" : "国内住所なし"}`;
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
  const photos = listCheckinPhotos(input);
  return photos.map((ref, i) => [
    receivedAt,
    property.id,
    property.name,
    bookingCell(input.bookingRef),
    escapeCell(input.guests[ref.guestIndex].name), // ゲスト入力は数式として解釈させない
    input.arrivalDate,
    `${i + 1}/${photos.length}`,
    geoLabel(geo),
    latLng,
    accuracy,
    photoLinks[i] || "",
    "",
    "",
    photoNote(input, ref),
    receiptId,
  ]);
}

/** 写真ファイル名（Drive）。名簿の旅券写しと同じフォルダに並ぶので「本人確認_」で見分ける。 */
export function checkinPhotoBaseName(propertyId: string, receiptId: string, ref: CheckinPhotoRef): string {
  return `本人確認_${propertyId}_${receiptId}_${ref.guestIndex + 1}_${ref.kind === "selfie" ? "顔身分証" : "旅券"}`;
}
