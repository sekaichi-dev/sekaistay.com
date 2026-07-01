import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { insertLeadSubmission, type SubmitPayload } from "@/lib/lead-submissions";
import { forwardLead, forwardLeadToSalesPortal, forwardLeadToDiscord } from "@/lib/lead-forward";
import { sendMetaCapiLead } from "@/lib/meta-capi";
import { classifyKind } from "@/lib/test-classifier";
import { appendLeadToSheet } from "@/lib/sheets-backup";
import { resolveReferrerMatch } from "@/lib/referrer-match";
import { findReferrerByCode } from "@/lib/referrers";
import { notifyReferredLead } from "@/lib/slack-notify";

export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set([
  "sekaistay.com",
  "www.sekaistay.com",
  "localhost:3000",
  "localhost",
]);

const MAX_LENGTHS: Record<string, number> = {
  name: 100,
  email: 200,
  phone: 50,
  airbnbUrl: 1000,
  peakRevenue: 20,
  offpeakRevenue: 20,
  commissionRate: 20,
  operatingYears: 10,
  complaints: 2000,
  companyName: 200,
  utmSource: 200,
  utmMedium: 200,
  utmCampaign: 200,
  utmContent: 200,
  utmTerm: 200,
  gclid: 200,
  fbclid: 200,
  landingUrl: 1000,
  referrer: 1000,
  lpVariant: 100,
  ctaSource: 60,
  referrerCode: 20,
  referrerName: 100,
};

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function isValidAirbnbUrl(url: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return /(^|\.)airbnb\.(com|jp|co\.jp)$/.test(host) || host === "abnb.me" || host.startsWith("m.airbnb.");
  } catch {
    return false;
  }
}

function getOriginHost(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host.toLowerCase();
    } catch {}
  }
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host.toLowerCase();
    } catch {}
  }
  return null;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// In-memory rate limiter (per-instance; sufficient for low-volume LP)
const rateMap = new Map<string, number[]>();
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1h
const RATE_LIMIT = 10;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const arr = rateMap.get(ip) || [];
  const recent = arr.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateMap.set(ip, recent);
  return true;
}

function trim(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  // CSRF: Origin/Referer host check
  const host = getOriginHost(req);
  if (process.env.NODE_ENV === "production" && (!host || !ALLOWED_HOSTS.has(host))) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  // Rate limit
  const ip = getClientIp(req);
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "申請の上限に達しました。時間をおいてもう一度お試しください。" }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  // Required: name + email のみ (phone は /contact /audit からの送信を許容するため任意化・2026-05-14)
  const name = trim(body.name, MAX_LENGTHS.name);
  const email = trim(body.email, MAX_LENGTHS.email);
  const phone = trim(body.phone, MAX_LENGTHS.phone);
  if (!name) return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email))
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });

  // Airbnb URL (default form: required)
  const airbnbUrl = trim(body.airbnbUrl, MAX_LENGTHS.airbnbUrl);
  if (airbnbUrl && !isValidAirbnbUrl(airbnbUrl)) {
    return NextResponse.json({ error: "Airbnb の URL を入力してください" }, { status: 400 });
  }

  // totalProperties
  let totalProperties: number | undefined;
  if (typeof body.totalProperties === "number" && Number.isFinite(body.totalProperties)) {
    totalProperties = Math.max(1, Math.min(30, Math.floor(body.totalProperties)));
  }

  const referrerCodeIn = trim(body.referrerCode, MAX_LENGTHS.referrerCode);
  const referrerNameIn = trim(body.referrerName, MAX_LENGTHS.referrerName);
  const referrerMatch = await resolveReferrerMatch({
    code: referrerCodeIn || undefined,
    name: referrerNameIn || undefined,
    lookupByCode: findReferrerByCode,
  });

  const payload: SubmitPayload = {
    name,
    email,
    phone,
    airbnbUrl: airbnbUrl || undefined,
    totalProperties,
    peakRevenue: trim(body.peakRevenue, MAX_LENGTHS.peakRevenue) || undefined,
    offpeakRevenue: trim(body.offpeakRevenue, MAX_LENGTHS.offpeakRevenue) || undefined,
    commissionRate: trim(body.commissionRate, MAX_LENGTHS.commissionRate) || undefined,
    operatingYears: trim(body.operatingYears, MAX_LENGTHS.operatingYears) || undefined,
    complaints: trim(body.complaints, MAX_LENGTHS.complaints) || undefined,
    companyName: trim(body.companyName, MAX_LENGTHS.companyName) || undefined,
    utmSource: trim(body.utmSource, MAX_LENGTHS.utmSource) || undefined,
    utmMedium: trim(body.utmMedium, MAX_LENGTHS.utmMedium) || undefined,
    utmCampaign: trim(body.utmCampaign, MAX_LENGTHS.utmCampaign) || undefined,
    utmContent: trim(body.utmContent, MAX_LENGTHS.utmContent) || undefined,
    utmTerm: trim(body.utmTerm, MAX_LENGTHS.utmTerm) || undefined,
    gclid: trim(body.gclid, MAX_LENGTHS.gclid) || undefined,
    fbclid: trim(body.fbclid, MAX_LENGTHS.fbclid) || undefined,
    landingUrl: trim(body.landingUrl, MAX_LENGTHS.landingUrl) || undefined,
    referrer: trim(body.referrer, MAX_LENGTHS.referrer) || undefined,
    lpVariant: trim(body.lpVariant, MAX_LENGTHS.lpVariant) || undefined,
    formVariant: body.formVariant === "lite" ? "lite" : "default",
    ctaSource: trim(body.ctaSource, MAX_LENGTHS.ctaSource) || undefined,
    referrerCode: referrerCodeIn || undefined,
    referrerName: referrerNameIn || undefined,
    referrerId: referrerMatch.referrerId || undefined,
    referrerMatch: referrerMatch.match || undefined,
  };

  const kind = classifyKind(name, email);
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) || undefined;

  // Meta CAPI 用の dedup キー。Pixel 側にも同じ id を返してブラウザ↔サーバの二重計上を避ける。
  const eventId = crypto.randomUUID();
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value;
  const eventSourceUrl =
    payload.landingUrl ||
    req.headers.get("referer") ||
    (payload.lpVariant ? `https://sekaistay.com/${payload.lpVariant}` : "https://sekaistay.com/");

  try {
    const row = await insertLeadSubmission({ payload, kind, clientIp: ip, userAgent });
    if (kind === "real" && referrerMatch.match) {
      await notifyReferredLead({
        name, email,
        referrerCode: referrerCodeIn || undefined,
        referrerName: referrerNameIn || undefined,
        match: referrerMatch.match,
        leadId: row.id,
      }).catch(() => {});
    }
    // 3 系統並列で forward (吉蔵 CRM + sekaistay 営業ポータル + Meta CAPI)。
    // いずれかが失敗してもクライアントへの応答は 200 を返す（lead は Supabase に保存済み）。
    // test 振分けポリシー:
    //   - 吉蔵 CRM (forwardLead): test は skip（Hikaru 側ノイズ嫌うため・5/8 合意）
    //   - sales-portal (forwardLeadToSalesPortal): test も送る（小川さんが CRM 受信確認できるよう・source に _test suffix）
    //   - Meta CAPI: test は skip（本番広告レポート汚染防止）
    const capiPromise: Promise<void> =
      kind === "test"
        ? Promise.resolve()
        : sendMetaCapiLead({
            eventId,
            email,
            phone,
            name,
            ip,
            userAgent,
            fbp,
            fbc,
            eventSourceUrl,
            customData: {
              lp_variant: payload.lpVariant || "direct",
              content_name: "report_request",
              currency: "JPY",
              value: 0,
            },
          });
    // Slack 通知は同期で投げず、cron (/api/lead-slack-delayed) が created_at + 20 分後に処理する。
    // 理由: TimeRex の予約完了が #402-sekaistay面談申込 に独立して投稿されるため、即時にフォーム通知も
    // 流すとダブル通知になる。20 分遅延 → 同名の TimeRex bot 投稿があれば抑制 → なければ Slack 通知。
    const [yoshizoOutcome, salesPortalOutcome, capiOutcome, sheetOutcome, discordOutcome] = await Promise.allSettled([
      forwardLead(row.id),
      forwardLeadToSalesPortal(row.id),
      capiPromise,
      appendLeadToSheet(row),
      forwardLeadToDiscord(row.id),
    ]);
    if (yoshizoOutcome.status === "fulfilled" && !yoshizoOutcome.value.ok) {
      console.warn(`[submit] forward to 吉蔵 failed (lead=${row.id}): ${yoshizoOutcome.value.error}`);
    } else if (yoshizoOutcome.status === "rejected") {
      console.warn(`[submit] forward to 吉蔵 threw (lead=${row.id}): ${yoshizoOutcome.reason}`);
    }
    // TODO(sales-portal-retry): 失敗時の persistence + retry は別 PR で対応。
    // 現状ポータル outage 中の lead は Supabase に保存されるが portal 送信は失われる。
    // 実装方針: lead_submissions に sales_portal_forwarded_at / sales_portal_forward_error 列を
    // 追加 + lead-forward-retry/route.ts に portal の retry パスを追加。
    if (salesPortalOutcome.status === "fulfilled" && !salesPortalOutcome.value.ok) {
      console.warn(`[submit] forward to sales-portal failed (lead=${row.id}): ${salesPortalOutcome.value.error}`);
    } else if (salesPortalOutcome.status === "rejected") {
      console.warn(`[submit] forward to sales-portal threw (lead=${row.id}): ${salesPortalOutcome.reason}`);
    }
    if (capiOutcome.status === "rejected") {
      console.warn(`[submit] meta-capi threw (lead=${row.id}): ${capiOutcome.reason}`);
    }
    if (sheetOutcome.status === "fulfilled" && !sheetOutcome.value.ok) {
      console.warn(`[submit] sheet backup failed (lead=${row.id}): ${sheetOutcome.value.error}`);
    } else if (sheetOutcome.status === "rejected") {
      console.warn(`[submit] sheet backup threw (lead=${row.id}): ${sheetOutcome.reason}`);
    }
    if (discordOutcome.status === "fulfilled" && !discordOutcome.value.ok) {
      console.warn(`[submit] discord notification failed (lead=${row.id}): ${discordOutcome.value.error}`);
    } else if (discordOutcome.status === "rejected") {
      console.warn(`[submit] discord notification threw (lead=${row.id}): ${discordOutcome.reason}`);
    }
    console.warn(`[submit] done lead=${row.id} eventId=${eventId} kind=${kind} capiPath=${kind === "test" ? "skipped" : "attempted"} capiOutcome=${capiOutcome.status}`);
    return NextResponse.json({ id: row.id, status: "received", eventId }, { status: 200 });
  } catch (err: any) {
    console.error("[submit] insert failed:", err?.message || err);
    return NextResponse.json(
      { error: "送信処理に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }
}
