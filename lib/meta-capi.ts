import crypto from "node:crypto";

// Meta Graph API のバージョン。retired バージョンを掴まないよう env で上書き可能。
// 2026-05 時点の現行: v23.0 系。Meta は ~2年で旧版を deprecate するため定期的に更新が必要。
const DEFAULT_META_API_VERSION = "v23.0";
const TIMEOUT_MS = 5000;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashEmail(email: string): string | undefined {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return undefined;
  return sha256(normalized);
}

// 日本の電話番号を E.164 数字のみ (without +) に正規化してから SHA-256。
//   "090-1234-5678" → "819012345678"
//   "+81 90 1234 5678" → "819012345678"
function hashPhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  let e164: string;
  if (digits.startsWith("81")) {
    e164 = digits;
  } else if (digits.startsWith("0")) {
    e164 = `81${digits.slice(1)}`;
  } else {
    e164 = digits;
  }
  return sha256(e164);
}

// 「姓 名」または単一トークンを想定。スペースで分かれていれば最初を ln、残りを fn。
function hashName(fullName: string): { fn?: string; ln?: string } {
  const cleaned = fullName.trim().toLowerCase();
  if (!cleaned) return {};
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) {
    return { ln: sha256(parts[0]), fn: sha256(parts.slice(1).join(" ")) };
  }
  return { fn: sha256(cleaned) };
}

export type MetaCapiLeadInput = {
  eventId: string;
  eventTime?: number;
  email?: string;
  phone?: string;
  name?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
};

export type MetaCapiUserData = {
  em?: string[];
  ph?: string[];
  fn?: string[];
  ln?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
};

export type MetaCapiPayload = {
  data: Array<{
    event_name: "Lead";
    event_time: number;
    event_id: string;
    action_source: "website";
    event_source_url?: string;
    user_data: MetaCapiUserData;
    custom_data: Record<string, unknown>;
  }>;
  test_event_code?: string;
};

export function buildMetaCapiPayload(input: MetaCapiLeadInput, testEventCode?: string): MetaCapiPayload {
  const userData: MetaCapiUserData = {};
  const emailHash = input.email ? hashEmail(input.email) : undefined;
  const phoneHash = input.phone ? hashPhone(input.phone) : undefined;
  const nameHashes = input.name ? hashName(input.name) : {};

  if (emailHash) userData.em = [emailHash];
  if (phoneHash) userData.ph = [phoneHash];
  if (nameHashes.fn) userData.fn = [nameHashes.fn];
  if (nameHashes.ln) userData.ln = [nameHashes.ln];
  if (input.ip && input.ip !== "unknown") userData.client_ip_address = input.ip;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload: MetaCapiPayload = {
    data: [
      {
        event_name: "Lead",
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: input.customData ?? {},
      },
    ],
  };
  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }
  return payload;
}

export async function sendMetaCapiLead(input: MetaCapiLeadInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn(`[meta-capi] missing env, skipping (pixelId=${!!pixelId}, token=${!!accessToken})`);
    return;
  }

  const testCode = process.env.META_CAPI_TEST_EVENT_CODE;
  const apiVersion = process.env.META_CAPI_API_VERSION || DEFAULT_META_API_VERSION;
  const payload = buildMetaCapiPayload(input, testCode);
  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "<no body>");
      console.warn(`[meta-capi] non-2xx ${res.status} (eventId=${input.eventId}): ${text.slice(0, 500)}`);
      return;
    }
    if (testCode) {
      const json = await res.json().catch(() => null);
      console.warn(`[meta-capi] test event sent (eventId=${input.eventId}):`, JSON.stringify(json));
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[meta-capi] request failed (eventId=${input.eventId}): ${msg}`);
  } finally {
    clearTimeout(timer);
  }
}

// テスト・スモーク確認用に内部 helper も export しておく。
export const __testing = { hashEmail, hashPhone, hashName, sha256 };
