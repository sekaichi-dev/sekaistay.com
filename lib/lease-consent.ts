// マンスリー（30 泊以上）の建物一時使用賃貸借契約の同意フォーム（/lease/<予約番号>）の純関数。
// データの正本は ops（GET/POST https://ops.sekaistay.com/api/public/lease）。このサイトは画面だけで何も保存しない。
// 目的の規則・画像の形は ops の parseLeaseFormInput と同じにしてある（画面で通ってサーバーで落ちる、を作らない）。

export type LeaseLang = "ja" | "en";
export type LeaseViewState = "open" | "submitted" | "agreed" | "closed";

export interface LeaseOption {
  value: string;
  ja: string;
  en: string;
  textRequired?: boolean;
}

export interface LeaseBooking {
  bookingId: number;
  guestName?: string;
  propertyName?: string;
  propertyAddress?: string;
  arrival?: string;
  departure?: string;
  nights?: number;
  rentTotalJpy?: number;
  reservationId?: string;
}

export interface LeaseView {
  state: LeaseViewState;
  lang: LeaseLang;
  booking: LeaseBooking;
  fingerprint: string;
  version: string;
  contract: { ja: string; en: string } | null;
  summary: { ja: string[]; en: string[] };
  purposes: LeaseOption[];
  idTypes: LeaseOption[];
  receiptHtml: string;
  /** 運営プレビュー（運営トークン t で開いた）。送信はできない */
  preview: boolean;
  /** 運営プレビューのときの記録の状態（例 dry_planned）。表示だけに使う */
  previewStatus: string;
}

export interface LeaseFormValues {
  purposeCategory: string;
  purposeText: string;
  fullName: string;
  email: string;
  nationality: string;
  address: string;
  idType: string;
  idImage: string;
  agree: boolean;
  fullTextViewedAt: string;
}

export const DEFAULT_OPS_PUBLIC_API_BASE = "https://ops.sekaistay.com";
/** ops の LEASE_ID_IMAGE_MAX_BYTES と同じ（縮小後の身分証の画像の上限） */
export const LEASE_ID_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
/** ops の str(…, max) と同じ上限（入力欄の maxLength に使う） */
export const LEASE_FIELD_MAX = { purposeText: 300, fullName: 100, email: 200, nationality: 60, address: 300 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMAGE_DATA_URL_RE = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

/** ops の API の置き場所。省略・不正な値は本番の ops */
export function opsLeaseApiBase(env: { NEXT_PUBLIC_OPS_PUBLIC_API_BASE?: string | undefined }): string {
  const raw = (env.NEXT_PUBLIC_OPS_PUBLIC_API_BASE || "").trim().replace(/\/+$/, "");
  return /^https?:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(raw) ? raw : DEFAULT_OPS_PUBLIC_API_BASE;
}

/** 予約番号の形（ops の leaseFormPreAuth が受ける数字だけ） */
export function isLeaseBookingId(s: string): boolean {
  return /^\d{1,12}$/.test(s);
}

/** 鍵（ops の leaseLinkKey＝HMAC の先頭 32 桁の小文字 16 進）の形 */
export function isLeaseLinkKey(s: string | null | undefined): s is string {
  return typeof s === "string" && /^[0-9a-f]{32}$/.test(s);
}

/** 鍵を入れる Cookie（httpOnly・その予約のパスだけ）。URL に鍵を残さないため入口で移す */
export const LEASE_KEY_COOKIE = "lease_k";
export const LEASE_KEY_COOKIE_MAX_AGE = 7 * 24 * 3600;

export interface LeaseEntryCookie {
  name: string;
  value: string;
  options: { httpOnly: true; secure: boolean; sameSite: "lax"; path: string; maxAge: number };
}

/**
 * 入口 /lease/<予約番号>?k=<鍵> の振る舞い。転送先はいつも鍵の無い /lease/<予約番号>/consent。
 * 鍵の形が正しければ Cookie に入れ、形が違えば同じパスの Cookie を消す（鍵が無ければ Cookie は触らない＝再訪で使える）。
 * 鍵の正誤は ops が判断する（ここでは区別しない）。
 */
export function leaseEntryDecision(args: { bookingId: string; key: string | null | undefined; secure: boolean }): {
  location: string;
  set: LeaseEntryCookie | null;
  clear: { name: string; path: string } | null;
} {
  const id = args.bookingId || "";
  const location = `/lease/${encodeURIComponent(id)}/consent`;
  if (!isLeaseBookingId(id)) return { location, set: null, clear: null };
  const path = `/lease/${id}`;
  const key = (args.key ?? "").trim();
  if (isLeaseLinkKey(key)) {
    return {
      location,
      set: { name: LEASE_KEY_COOKIE, value: key, options: { httpOnly: true, secure: args.secure, sameSite: "lax", path, maxAge: LEASE_KEY_COOKIE_MAX_AGE } },
      clear: null,
    };
  }
  return { location, set: null, clear: args.key == null ? null : { name: LEASE_KEY_COOKIE, path } };
}

/** 運営プレビューの見本（記録の無い画面確認用）の予約番号の代わり。運営トークンのときだけ受ける */
export const LEASE_PREVIEW_SAMPLE_ID = "sample";

/** 運営トークン（ops が A 権限で発行・p.<失効 UNIX 秒>.<予約番号|sample>.<HMAC 先頭 32 hex>）の形。正誤・失効は ops が見る */
export function isLeasePreviewToken(s: string | null | undefined): s is string {
  return typeof s === "string" && /^p\.\d{1,12}\.(\d{1,12}|sample)\.[0-9a-f]{32}$/.test(s);
}

/**
 * ops の GET/POST に付ける問い合わせ文字列。運営トークンがあれば b と t（k は付けない）、無ければ b と k。
 * 運営トークンは対象（予約番号か sample）が画面の予約番号と一致するときだけ。sample は運営トークンのときだけ。
 * どちらも形が合わなければ null（画面は「利用できません」）。
 */
export function leaseApiQuery(args: { bookingId: string; key?: string | null; previewToken?: string | null }): string | null {
  const id = args.bookingId || "";
  if (args.previewToken != null && args.previewToken !== "") {
    const t = args.previewToken;
    if (!isLeasePreviewToken(t)) return null;
    if (!(isLeaseBookingId(id) || id === LEASE_PREVIEW_SAMPLE_ID)) return null;
    if (t.split(".")[2] !== id) return null;
    return `b=${encodeURIComponent(id)}&t=${encodeURIComponent(t)}`;
  }
  if (!isLeaseBookingId(id) || !isLeaseLinkKey(args.key)) return null;
  return `b=${encodeURIComponent(id)}&k=${encodeURIComponent(args.key)}`;
}

export function leaseApiUrl(base: string, bookingId: string, key: string): string {
  return `${base}/api/public/lease?b=${encodeURIComponent(bookingId)}&k=${encodeURIComponent(key)}`;
}

/**
 * 目的の内容欄の規則。区分 A〜D は任意（空でも区分名が目的になる）、E「その他」（textRequired）は 2 文字以上。
 * 文字数は ops と同じく前後の空白を除いたコードポイント数で数える。
 */
export function purposeTextRule(category: string, text: string, textRequired?: boolean): { required: boolean; ok: boolean } {
  const required = textRequired ?? category === "E";
  if (!required) return { required: false, ok: true };
  return { required: true, ok: Array.from(text.trim()).length >= 2 };
}

export function isImageDataUrl(s: string): boolean {
  return typeof s === "string" && IMAGE_DATA_URL_RE.test(s);
}

/** data URL が表すバイト数（base64 の長さから計算） */
export function dataUrlBytes(s: string): number {
  const i = s.indexOf(",");
  if (i < 0) return 0;
  const b64 = s.slice(i + 1);
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - pad);
}

export function pickLabel(opt: { value?: string; ja?: string; en?: string } | null | undefined, lang: LeaseLang): string {
  if (!opt) return "";
  return (lang === "en" ? opt.en || opt.ja : opt.ja || opt.en) || opt.value || "";
}

export function formatYen(n: unknown): string {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return "";
  return `¥${Math.round(n).toLocaleString("en-US")}`;
}

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad2 = (n: number) => String(n).padStart(2, "0");

/** ISO の時刻を JST で表示する（端末のタイムゾーンに依らない）。不正なら "" */
export function formatJst(iso: string, lang: LeaseLang): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t + 9 * 3600_000);
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
  const hm = `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
  return lang === "ja" ? `${y}年${m + 1}月${day}日 ${hm}（JST）` : `${day} ${EN_MONTHS[m]} ${y}, ${hm} JST`;
}

/** YYYY-MM-DD を表示用に。形が違えばそのまま返す */
export function formatYmd(ymd: string | undefined, lang: LeaseLang): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd || "");
  if (!m) return ymd || "";
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  return lang === "ja" ? `${y}年${mo}月${d}日` : `${d} ${EN_MONTHS[mo - 1] ?? m[2]} ${y}`;
}

const PENDING_LABELS: Record<string, { ja: string; en: string }> = {
  purposeCategory: { ja: "ご利用の目的", en: "Purpose of use" },
  purposeText: { ja: "目的の内容（2 文字以上）", en: "Details of the purpose (2+ characters)" },
  fullName: { ja: "氏名", en: "Full name" },
  email: { ja: "メールアドレス", en: "Email address" },
  nationality: { ja: "国籍", en: "Nationality" },
  address: { ja: "住所", en: "Address" },
  idType: { ja: "身分証の種類", en: "Type of ID" },
  idImage: { ja: "身分証の写真", en: "Photo of your ID" },
  fullTextViewedAt: { ja: "契約全文の表示", en: "Opening the full agreement" },
  agree: { ja: "同意のチェック", en: "Ticking the consent box" },
  fingerprint: { ja: "予約情報（再読み込みしてください）", en: "Booking details (please reload the page)" },
  version: { ja: "契約の版（再読み込みしてください）", en: "Agreement version (please reload the page)" },
};

/** ops が 422 で返す fields（と pendingItems の鍵）を画面の言葉に */
export function fieldLabel(field: string, lang: LeaseLang): string {
  return PENDING_LABELS[field]?.[lang] ?? field;
}

/** 送信できない理由の鍵を、画面の上から順に返す（空なら送信できる） */
export function pendingKeys(form: LeaseFormValues, purposes: LeaseOption[] = []): string[] {
  const out: string[] = [];
  const opt = purposes.find((p) => p.value === form.purposeCategory);
  if (!form.purposeCategory || (purposes.length > 0 && !opt)) out.push("purposeCategory");
  else if (!purposeTextRule(form.purposeCategory, form.purposeText, opt?.textRequired).ok) out.push("purposeText");
  if (!form.fullName.trim()) out.push("fullName");
  if (!EMAIL_RE.test(form.email.trim())) out.push("email");
  if (!form.nationality.trim()) out.push("nationality");
  if (!form.address.trim()) out.push("address");
  if (!form.idType) out.push("idType");
  if (!isImageDataUrl(form.idImage) || dataUrlBytes(form.idImage) > LEASE_ID_IMAGE_MAX_BYTES) out.push("idImage");
  if (!Number.isFinite(Date.parse(form.fullTextViewedAt))) out.push("fullTextViewedAt");
  if (form.agree !== true) out.push("agree");
  return out;
}

export function pendingItems(form: LeaseFormValues, lang: LeaseLang, purposes: LeaseOption[] = []): string[] {
  return pendingKeys(form, purposes).map((k) => fieldLabel(k, lang));
}

function asStr(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asOptions(v: unknown): LeaseOption[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((o): o is Record<string, unknown> => !!o && typeof o === "object" && typeof (o as Record<string, unknown>).value === "string")
    .map((o) => ({ value: o.value as string, ja: asStr(o.ja), en: asStr(o.en), textRequired: o.textRequired === true }));
}

/** ops の GET の応答を検める。形が崩れていれば null（画面は「利用できません」） */
export function parseLeaseView(json: unknown): LeaseView | null {
  if (!json || typeof json !== "object") return null;
  const j = json as Record<string, unknown>;
  if (j.ok !== true) return null;
  const state = j.state;
  if (state !== "open" && state !== "submitted" && state !== "agreed" && state !== "closed") return null;
  const b = (j.booking && typeof j.booking === "object" ? j.booking : {}) as Record<string, unknown>;
  const booking: LeaseBooking = {
    bookingId: typeof b.bookingId === "number" ? b.bookingId : 0,
    guestName: asStr(b.guestName) || undefined,
    propertyName: asStr(b.propertyName) || undefined,
    propertyAddress: asStr(b.propertyAddress) || undefined,
    arrival: asStr(b.arrival) || undefined,
    departure: asStr(b.departure) || undefined,
    nights: typeof b.nights === "number" && b.nights > 0 ? b.nights : undefined,
    rentTotalJpy: typeof b.rentTotalJpy === "number" && b.rentTotalJpy > 0 ? b.rentTotalJpy : undefined,
    reservationId: asStr(b.reservationId) || undefined,
  };
  const c = (j.contract && typeof j.contract === "object" ? j.contract : null) as Record<string, unknown> | null;
  const contract = c && asStr(c.ja) ? { ja: asStr(c.ja), en: asStr(c.en) } : null;
  const s = (j.summary && typeof j.summary === "object" ? j.summary : {}) as Record<string, unknown>;
  const lines = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  const view: LeaseView = {
    state,
    lang: j.lang === "en" ? "en" : "ja",
    booking,
    fingerprint: asStr(j.fingerprint),
    version: asStr(j.version),
    contract,
    summary: { ja: lines(s.ja), en: lines(s.en) },
    purposes: asOptions(j.purposes),
    idTypes: asOptions(j.idTypes),
    receiptHtml: asStr(j.receiptHtml),
    preview: j.preview === true,
    previewStatus: j.preview === true ? asStr(j.previewStatus).slice(0, 40) : "",
  };
  // 受付中なのに送信に要るもの（指紋・版・本文・選択肢）が欠けていたら受け付けない（fail-closed）
  if (state === "open" && (!/^[0-9a-f]{64}$/.test(view.fingerprint) || !view.version || !contract || !view.purposes.length || !view.idTypes.length)) {
    return null;
  }
  return view;
}

export type LeaseSubmitOutcome =
  | { kind: "ok"; receiptHtml: string; submittedAt: string; submittedAtJst: string }
  | { kind: "invalid"; fields: string[] }
  | { kind: "changed" | "after_arrival" | "not_open" | "too_large" | "too_many" | "not_found" | "error" };

/** ops の POST の応答を画面の分岐に */
export function classifySubmitResponse(status: number, json: unknown): LeaseSubmitOutcome {
  const j = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  if (status === 200 && j.ok === true) {
    return { kind: "ok", receiptHtml: asStr(j.receiptHtml), submittedAt: asStr(j.submittedAt), submittedAtJst: asStr(j.submittedAtJst) };
  }
  if (status === 422) return { kind: "invalid", fields: Array.isArray(j.fields) ? j.fields.filter((f): f is string => typeof f === "string") : [] };
  if (status === 409) {
    if (j.error === "changed" || j.error === "after_arrival") return { kind: j.error };
    return { kind: "not_open" };
  }
  if (status === 413) return { kind: "too_large" };
  if (status === 429) return { kind: "too_many" };
  if (status === 404) return { kind: "not_found" };
  return { kind: "error" };
}
