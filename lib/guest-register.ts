// 宿泊者名簿 (/guest-register) — Google Sheets/Drive 連携とレコード組み立て。
// 認証は lib/sheets-backup.ts と同じ env (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN_SEKAICHI) を使用。
// 書き込み先スプシ: 宿泊者名簿_旅館業_民泊（旅館業用/民泊用タブ・1名1行・A〜S列）
// 集計式は 民泊用!A6:A505 参照のため、追記行が505行を超えたら式レンジの拡張が必要。

const SHEET_ID = (process.env.GUEST_REGISTER_SHEET_ID || "1K-Lg7OVO_J4l1IKolJhGx1SsICIhBjK0XIPlQ0unU1Y").trim();
const DRIVE_FOLDER_ID = (process.env.GUEST_REGISTER_DRIVE_FOLDER_ID || "143iVqGvfRWIBjwfuqLsjV0_6G3h2ZnMG").trim();
const API_TIMEOUT_MS = 15_000;

export const NATIONALITIES = [
  "日本", "韓国", "台湾", "香港", "中国", "タイ", "シンガポール", "マレーシア",
  "インドネシア", "フィリピン", "ベトナム", "インド", "英国", "ドイツ", "フランス",
  "イタリア", "スペイン", "ロシア", "米国", "カナダ", "オーストラリア", "その他",
] as const;

export type PropertyType = "民泊" | "旅館業";

export interface Property {
  id: string;
  name: string;
  nameEn: string;
  type: PropertyType;
  licenseNo: string;
  active: boolean;
}

export interface GuestInput {
  name: string;
  jaResident: boolean;
  address: string;
  nationality: string;
  occupation: string;
  contact: string;
  passportNo: string;
  gender: string;
  age: string;
  prevStay: string;
  nextDest: string;
}

export interface RegisterInput {
  propertyId: string;
  checkin: string; // yyyy-mm-dd
  checkout: string; // yyyy-mm-dd
  note: string;
  guests: GuestInput[];
}

export const MAX_GUESTS = 8;
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const FIELD_MAX: Record<string, number> = {
  name: 100,
  address: 300,
  nationality: 20,
  occupation: 100,
  contact: 200,
  passportNo: 30,
  gender: 10,
  age: 10,
  prevStay: 100,
  nextDest: 100,
  note: 500,
};

export function needsPassport(guest: Pick<GuestInput, "jaResident" | "nationality">): boolean {
  return !guest.jaResident && guest.nationality !== "日本";
}

export function calcNights(checkin: string, checkout: string): number {
  const a = Date.parse(checkin + "T00:00:00Z");
  const b = Date.parse(checkout + "T00:00:00Z");
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  return Math.round((b - a) / 86_400_000);
}

function trimTo(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

// クライアント送信 JSON を検証済み RegisterInput に正規化。不正なら日英併記のエラー文字列を返す。
export function parseRegisterInput(raw: unknown): { input?: RegisterInput; error?: string } {
  if (!raw || typeof raw !== "object") return { error: "リクエストの形式が不正です / Invalid request" };
  const r = raw as Record<string, unknown>;
  const propertyId = trimTo(r.propertyId, 50);
  const checkin = trimTo(r.checkin, 10);
  const checkout = trimTo(r.checkout, 10);
  const note = trimTo(r.note, FIELD_MAX.note);
  if (!propertyId) return { error: "宿泊施設を選択してください / Please select the property" };
  if (!DATE_RE.test(checkin) || !DATE_RE.test(checkout)) {
    return { error: "宿泊日を入力してください / Please enter your stay dates" };
  }
  const nights = calcNights(checkin, checkout);
  if (!Number.isFinite(nights) || nights < 1 || nights > 90) {
    return { error: "宿泊日程が正しくありません / Invalid stay dates" };
  }
  if (!Array.isArray(r.guests) || r.guests.length < 1 || r.guests.length > MAX_GUESTS) {
    return { error: `宿泊者は1〜${MAX_GUESTS}名で入力してください / 1–${MAX_GUESTS} guests per submission` };
  }
  const guests: GuestInput[] = [];
  for (const g of r.guests as Record<string, unknown>[]) {
    if (!g || typeof g !== "object") return { error: "宿泊者情報が不正です / Invalid guest data" };
    guests.push({
      name: trimTo(g.name, FIELD_MAX.name),
      jaResident: g.jaResident === true,
      address: trimTo(g.address, FIELD_MAX.address),
      nationality: trimTo(g.nationality, FIELD_MAX.nationality),
      occupation: trimTo(g.occupation, FIELD_MAX.occupation),
      contact: trimTo(g.contact, FIELD_MAX.contact),
      passportNo: trimTo(g.passportNo, FIELD_MAX.passportNo),
      gender: trimTo(g.gender, FIELD_MAX.gender),
      age: trimTo(g.age, FIELD_MAX.age),
      prevStay: trimTo(g.prevStay, FIELD_MAX.prevStay),
      nextDest: trimTo(g.nextDest, FIELD_MAX.nextDest),
    });
  }
  return { input: { propertyId, checkin, checkout, note, guests } };
}

// 法定必須項目の充足チェック（民泊=職業必須 / 旅館業=連絡先必須・両方とも氏名住所連絡先は取る）
export function validateGuests(input: RegisterInput, type: PropertyType): string | null {
  for (let i = 0; i < input.guests.length; i++) {
    const g = input.guests[i];
    const who = `宿泊者${i + 1} / Guest ${i + 1}`;
    if (!g.name) return `${who}: 氏名を入力してください / Name is required`;
    if (!g.address) return `${who}: 住所を入力してください / Address is required`;
    if (!g.contact) return `${who}: 連絡先を入力してください / Contact is required`;
    if (!(NATIONALITIES as readonly string[]).includes(g.nationality)) {
      return `${who}: 国籍を選択してください / Nationality is required`;
    }
    if (type === "民泊" && !g.occupation) {
      return `${who}: 職業を入力してください / Occupation is required`;
    }
    if (needsPassport(g) && !g.passportNo) {
      return `${who}: 旅券番号を入力してください / Passport number is required`;
    }
  }
  return null;
}

function formatDateSlash(iso: string): string {
  return iso.replaceAll("-", "/");
}

// USER_ENTERED での数式解釈を防ぐ（例: "+44-20-1234-5678" が計算されて -6888 になる）。
// 先頭アポストロフィは Sheets 上ではテキスト指定として非表示。数式インジェクション対策を兼ねる。
export function escapeCell(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

export function nowJstString(): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date());
}

export function makeGroupId(): string {
  const now = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date()); // yyyy-mm-dd
  const rand = Array.from({ length: 4 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("");
  return `G-${now.slice(2, 4)}${now.slice(5, 7)}${now.slice(8, 10)}-${rand}`;
}

// 民泊用タブ A〜S列（1名1行）。定期報告の式が参照するのは A(届出番号) H(国籍) J(開始日) L(終了日)。
export function buildMinpakuRows(
  input: RegisterInput, property: Property, groupId: string,
  photoLinks: (string | null)[], receivedAt: string,
): unknown[][] {
  const nights = calcNights(input.checkin, input.checkout);
  return input.guests.map((g, i) => [
    property.licenseNo,
    groupId,
    i === 0 ? "代表者" : "同行者",
    escapeCell(g.name),
    escapeCell(g.address),
    escapeCell(g.occupation),
    escapeCell(g.contact),
    g.nationality,
    g.passportNo ? escapeCell(g.passportNo) : "－",
    formatDateSlash(input.checkin),
    "",
    formatDateSlash(input.checkout),
    "",
    nights,
    photoLinks[i] ? "有" : "－",
    escapeCell(input.note),
    property.name,
    photoLinks[i] || "",
    receivedAt,
  ]);
}

// 旅館業用タブ A〜S列（1名1行）。No.列は =ROW()-5 で自動採番（行削除にも追従）。
export function buildRyokanRows(
  input: RegisterInput, property: Property, groupId: string,
  photoLinks: (string | null)[], receivedAt: string,
): unknown[][] {
  return input.guests.map((g, i) => [
    "=ROW()-5",
    formatDateSlash(input.checkin),
    escapeCell(g.name),
    escapeCell(g.address),
    escapeCell(g.contact),
    g.nationality === "日本" ? "（日本）" : g.nationality,
    g.passportNo ? escapeCell(g.passportNo) : "－",
    photoLinks[i] ? "有" : "－",
    escapeCell(g.gender),
    escapeCell(g.age),
    escapeCell(g.prevStay),
    escapeCell(g.nextDest),
    "",
    "",
    "",
    escapeCell([input.note, `受付ID: ${groupId}`].filter(Boolean).join("｜")),
    property.name,
    photoLinks[i] || "",
    receivedAt,
  ]);
}

// ───────────────────────── Google API (fetch 直叩き・googleapis 非依存) ─────────────────────────

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.token;
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN_SEKAICHI || "").trim();
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN_SEKAICHI not configured");
  }
  const resp = await fetchWithTimeout("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`token refresh ${resp.status}: ${text.slice(0, 200)}`);
  }
  const data = (await resp.json()) as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), API_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function appendRows(tab: "旅館業用" | "民泊用", rows: unknown[][]): Promise<void> {
  const token = await getAccessToken();
  const range = encodeURIComponent(`${tab}!A6:S`);
  const resp = await fetchWithTimeout(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: rows }),
    },
  );
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`sheets append ${resp.status}: ${text.slice(0, 300)}`);
  }
}

export async function uploadPassportPhoto(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const token = await getAccessToken();
  const boundary = "gr_boundary_" + Math.random().toString(36).slice(2);
  const metadata = JSON.stringify({ name: filename, parents: [DRIVE_FOLDER_ID] });
  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
    `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`, "utf8");
  const tail = Buffer.from(`\r\n--${boundary}--`, "utf8");
  const body = Buffer.concat([head, buffer, tail]);
  const resp = await fetchWithTimeout(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}` },
      body: body as unknown as BodyInit,
    },
  );
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`drive upload ${resp.status}: ${text.slice(0, 300)}`);
  }
  const data = (await resp.json()) as { id: string; webViewLink?: string };
  return data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`;
}

// ───────────────────────── 物件マスタ ─────────────────────────

let propertyCache: { data: Property[]; fetchedAt: number } | null = null;
const PROPERTY_CACHE_MS = 5 * 60 * 1000;

export async function fetchProperties(): Promise<Property[]> {
  if (propertyCache && Date.now() - propertyCache.fetchedAt < PROPERTY_CACHE_MS) return propertyCache.data;
  const token = await getAccessToken();
  const range = encodeURIComponent("物件マスタ!A2:F200");
  const resp = await fetchWithTimeout(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!resp.ok) {
    if (propertyCache) return propertyCache.data; // stale-on-error
    const text = await resp.text().catch(() => "");
    throw new Error(`properties fetch ${resp.status}: ${text.slice(0, 200)}`);
  }
  const data = (await resp.json()) as { values?: string[][] };
  const props: Property[] = (data.values || [])
    .map((r) => ({
      id: (r[0] || "").trim(),
      name: (r[1] || "").trim(),
      nameEn: (r[2] || "").trim(),
      type: (r[3] || "").trim() as PropertyType,
      licenseNo: (r[4] || "").trim(),
      active: (r[5] || "").trim() === "有",
    }))
    .filter((p) => p.id && p.name && (p.type === "民泊" || p.type === "旅館業"));
  propertyCache = { data: props, fetchedAt: Date.now() };
  return props;
}

export function sanitizeFilePart(s: string): string {
  return s.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 40) || "guest";
}
