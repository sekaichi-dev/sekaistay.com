import type { LeadSubmissionRow } from "./lead-submissions";

const SHEET_ID = (process.env.LEAD_BACKUP_SHEET_ID || "1CWTHJyHrjpfg6voaiAZabMkKv21or1BbrGF9e6aBKh4").trim();
const TAB = "leads";
const APPEND_TIMEOUT_MS = 5000;

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.token;
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN_SEKAICHI || "").trim();
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN_SEKAICHI not configured");
  }
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), APPEND_TIMEOUT_MS);
  try {
    const resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      signal: ac.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`token refresh ${resp.status}: ${text.slice(0, 200)}`);
    }
    const data = (await resp.json()) as { access_token: string; expires_in: number };
    tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
    return data.access_token;
  } finally {
    clearTimeout(timer);
  }
}

function rowToValues(r: LeadSubmissionRow): unknown[] {
  return [
    r.id,
    r.created_at,
    r.kind,
    r.name ?? "",
    r.email ?? "",
    r.phone ?? "",
    r.lp_variant ?? "",
    r.form_variant ?? "",
    r.airbnb_url ?? "",
    r.total_properties ?? "",
    r.peak_revenue ?? "",
    r.offpeak_revenue ?? "",
    r.commission_rate ?? "",
    r.operating_years ?? "",
    r.company_name ?? "",
    r.complaints ?? "",
    r.utm_source ?? "",
    r.utm_medium ?? "",
    r.utm_campaign ?? "",
    r.utm_content ?? "",
    r.utm_term ?? "",
    r.gclid ?? "",
    r.fbclid ?? "",
    r.landing_url ?? "",
    r.referrer ?? "",
    r.forwarded_at ?? "",
    r.forward_error ?? "",
    r.forward_retry_count ?? 0,
  ];
}

export async function appendLeadToSheet(row: LeadSubmissionRow): Promise<{ ok: boolean; error?: string }> {
  if (!SHEET_ID) return { ok: false, error: "LEAD_BACKUP_SHEET_ID not set" };
  let token: string;
  try {
    token = await getAccessToken();
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TAB}!A:AB`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), APPEND_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ values: [rowToValues(row)] }),
      signal: ac.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return { ok: false, error: `sheets append ${resp.status}: ${text.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.name === "AbortError" ? `timeout after ${APPEND_TIMEOUT_MS}ms` : err?.message || String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}
