import { NextRequest, NextResponse } from "next/server";
import { createRequest, updateRequest } from "@/lib/report-requests";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { generateReportInBackground } from "@/lib/report-generator";
import {
  upsertContactByEmail,
  createDeal,
  associateContactToDeal,
  createNote,
  associateNoteToContact,
  associateNoteToDeal,
} from "@/lib/hubspot";
import { appendLead } from "@/lib/leads-sheet";

const HUBSPOT_PIPELINE_ID = "default";
const HUBSPOT_STAGE_RECEIVED = "3511869161"; // 「01 入力済み」stage. Post-report-send moves to HUBSPOT_STAGE_SENT.

// verify-url-gate のスモークテスト申請を識別するセンチネル。
// HubSpot連携と24h後Gmail送信をスキップするため、submit route と
// scheduled-sender の両方で同じ判定を使う。
function isVerifyGateRequest(name: string): boolean {
  return name === "VERIFY_DO_NOT_PROCESS";
}

// 申請を「テストデータ」として自動分類するヒューリスティック。
// 集計（lead-count.ts）から除外するため kind="test" を設定する。
// 1つでもマッチしたら test 扱い。曖昧なケースは real にして集計に乗せ、
// 必要なら吉田が後から手動で kind を上書きする運用とする。
const INTERNAL_TEST_EMAILS = new Set([
  "ksssshy@gmail.com",
  "hikaru@sekaichi.org",
  "tenichi@sekaichi.org",
  "kojiro@sekaichi.org",
  "yoshito@sekaichi.org",
  "ryosuke@sekaichi.org",
  "ona@sekaichi.org",
  "toyo@sekaichi.org",
]);
const TEST_EMAIL_DOMAINS = [
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "test.invalid",
  "verify-do-not-process.invalid",
  "japanvillas-e2e.invalid",
];
const TEST_NAME_PATTERNS =
  /^(test|tst|testy|verify_do_not_process|verify-?[\w-]*|あ|い|う|a|aa|aaa|x|xx)$/i;
function classifyKind(name: string, email: string): "real" | "test" {
  if (isVerifyGateRequest(name)) return "test";
  if (TEST_NAME_PATTERNS.test(name.trim())) return "test";
  if (/^test|テスト|TEST/i.test(name.trim())) return "test";
  const lower = email.toLowerCase();
  if (INTERNAL_TEST_EMAILS.has(lower)) return "test";
  const domain = lower.split("@")[1] ?? "";
  if (TEST_EMAIL_DOMAINS.includes(domain)) return "test";
  return "real";
}

// 許可するオリジンホスト
const ALLOWED_HOSTS = new Set(["localhost:3200", "japanvillas.kss-cloud.com"]);

function str(v: unknown, max = 500): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

/** Origin / Referer ヘッダ検証（CSRF保護） */
function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const { host } = new URL(origin);
      return ALLOWED_HOSTS.has(host);
    } catch {
      return false;
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const { host } = new URL(referer);
      return ALLOWED_HOSTS.has(host);
    } catch {
      return false;
    }
  }

  // どちらも存在しない場合は許可（curl等のテストツール対応）
  return true;
}

export async function POST(req: NextRequest) {
  // --- CSRF保護: Origin / Referer 検証 ---
  if (!validateOrigin(req)) {
    return NextResponse.json(
      { error: "不正なリクエスト元です" },
      { status: 403 },
    );
  }

  // --- IPベースレート制限: 10件/時 ---
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "申請の上限に達しました。しばらくお待ちください。" },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": "0" },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // フォーム入口種別。"lite" は /report-request-lite（メアド・電話・氏名先取り型）。
  // 物件URL/売上等は任意。空でも受付け、後追いで営業フォローまたは続行入力でレポ生成。
  const formVariantRaw = str(body.formVariant, 16);
  const formVariant: "default" | "lite" =
    formVariantRaw === "lite" ? "lite" : "default";

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  if (!name || !email) {
    return NextResponse.json(
      { error: "氏名とメールアドレスは必須です" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "メールアドレスの形式が正しくありません" },
      { status: 400 },
    );
  }

  if (/[<>]/.test(email)) {
    return NextResponse.json(
      { error: "メールアドレスに不正な文字が含まれています" },
      { status: 400 },
    );
  }

  // 2026-04-27〜: 申請プラットフォームを Airbnb 単一化（copy-rules.md ⑦原則）。
  // 既存 schema の bookingUrl は互換維持のため残置するが、新規申請では受付けない。
  // lite フォームでは airbnbUrl は任意（空可）。空のリードは営業フォロー対象。
  const airbnbUrl = str(body.airbnbUrl, 1000);
  if (formVariant === "default" && !airbnbUrl) {
    return NextResponse.json(
      { error: "Airbnb のURLを入力してください" },
      { status: 400 },
    );
  }
  // Airbnb URL バリデーション（入力された場合のみ）
  // - 国別ドメイン(airbnb.com / .jp / .co.jp / .com.au等)
  // - m./www./jp./ja./secure. サブドメイン
  // - 短縮 abnb.me
  if (airbnbUrl) {
    try {
      const u = new URL(airbnbUrl);
      const host = u.hostname.toLowerCase();
      const isAirbnbHost =
        /^(www\.|m\.|jp\.|ja\.|secure\.)?airbnb\.(com|jp|com\.[a-z]{2,3}|co\.[a-z]{2,3}|[a-z]{2,4})$/.test(host) ||
        /^abnb\.me$/.test(host);
      if (u.protocol !== "https:" || !isAirbnbHost) {
        throw new Error();
      }
    } catch {
      return NextResponse.json(
        { error: "Airbnb URLはhttps://www.airbnb.com/... / .jp / .co.jp / m.airbnb.* / abnb.me の形式で入力してください" },
        { status: 400 },
      );
    }
  }

  const phone = str(body.phone, 50);
  if (!phone) {
    return NextResponse.json(
      { error: "電話番号は必須です" },
      { status: 400 },
    );
  }
  const companyName = str(body.companyName, 200);
  const peakRevenue = str(body.peakRevenue, 50);
  const offpeakRevenue = str(body.offpeakRevenue, 50);
  const commissionRate = str(body.commissionRate, 50);
  const operatingYears = str(body.operatingYears, 50);
  const complaints = str(body.complaints, 2000);
  const totalPropertiesRaw = typeof body.totalProperties === "number" ? body.totalProperties : Number(body.totalProperties);
  const totalProperties = Number.isFinite(totalPropertiesRaw) && totalPropertiesRaw > 0 ? Math.min(Math.round(totalPropertiesRaw), 30) : undefined;

  // ── 広告経路トラッキング（クライアント側で URL から拾って送信）──
  const utmSource = str(body.utmSource, 100);
  const utmMedium = str(body.utmMedium, 100);
  const utmCampaign = str(body.utmCampaign, 200);
  const utmContent = str(body.utmContent, 200);
  const utmTerm = str(body.utmTerm, 200);
  const gclid = str(body.gclid, 200);
  const fbclid = str(body.fbclid, 200);
  const landingUrl = str(body.landingUrl, 1000);
  const referrer = str(body.referrer, 1000);

  // 集計から自動除外するため、name + email から「テストデータかどうか」を自動分類
  const kind = classifyKind(name, email);

  const created = await createRequest({
    name,
    email,
    phone,
    airbnbUrl,
    peakRevenue,
    offpeakRevenue,
    commissionRate,
    operatingYears,
    totalProperties,
    complaints,
    kind,
    formVariant,
    companyName: companyName || undefined,
    utmSource: utmSource || undefined,
    utmMedium: utmMedium || undefined,
    utmCampaign: utmCampaign || undefined,
    utmContent: utmContent || undefined,
    utmTerm: utmTerm || undefined,
    gclid: gclid || undefined,
    fbclid: fbclid || undefined,
    landingUrl: landingUrl || undefined,
    referrer: referrer || undefined,
  });

  const formSummary = [
    `氏名: ${name}`,
    `メール: ${email}`,
    phone ? `電話: ${phone}` : "",
    airbnbUrl ? `Airbnb URL: ${airbnbUrl}` : "",
    peakRevenue ? `繁忙期月売上: ${peakRevenue}` : "",
    offpeakRevenue ? `閑散期月売上: ${offpeakRevenue}` : "",
    commissionRate ? `現在の代行手数料: ${commissionRate}` : "",
    operatingYears ? `運用年数: ${operatingYears}` : "",
    totalProperties ? `管理物件数: ${totalProperties >= 30 ? "30棟以上" : totalProperties + "棟"}` : "",
    complaints ? `\n現在の運営会社への不満・要望:\n${complaints}` : "",
    `\n申請ID: ${created.id}`,
    `申請日時: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  // HubSpot Contact + Deal + Ticket creation (non-blocking — failure does not
  // fail the whole request; ids saved to report-request for later Stage update
  // by the scheduled-sender cron).
  // verify-url-gate のダミー申請は HubSpot側で INVALID_EMAIL 400 を返し続けるためスキップ
  if (!isVerifyGateRequest(name)) {
  upsertContactByEmail(email, {
    firstname: name,
    phone: phone || undefined,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
    jv_form_submitted_at: new Date().toISOString(),
    jv_lead_source: "report-request-form",
    jv_lp_url: airbnbUrl || undefined,
  })
    .then(async (contact) => {
      const deal = await createDeal({
        dealname: `[診断レポート] ${name}`.slice(0, 100),
        pipeline: HUBSPOT_PIPELINE_ID,
        dealstage: HUBSPOT_STAGE_RECEIVED,
        description: formSummary,
        jv_form_submitted_at: new Date().toISOString(),
        jv_lead_source: "report-request-form",
      } as unknown as Record<string, string>);
      await associateContactToDeal(contact.id, deal.id);

      // Note (engagement) pinned to Contact + Deal — holds the full form
      // details so CS/Ops can see the submission in HubSpot activity timeline.
      let noteId: string | undefined;
      try {
        const noteBody = [
          "<h3>物件診断レポート申請内容</h3>",
          `<pre style="white-space:pre-wrap;font-family:inherit;">${formSummary
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</pre>`,
        ].join("");
        const note = await createNote({ hs_note_body: noteBody });
        await associateNoteToContact(note.id, contact.id);
        await associateNoteToDeal(note.id, deal.id);
        noteId = note.id;
      } catch (err) {
        console.error(`[report-request/submit] Note create failed for ${created.id}:`, err);
      }

      await updateRequest(created.id, {
        hubspotContactId: contact.id,
        hubspotDealId: deal.id,
        ...(noteId ? { hubspotNoteId: noteId } : {}),
      });
    })
    .catch((err) => {
      console.error(`[report-request/submit] HubSpot sync failed for ${created.id}:`, err);
    });
  }

  // Forward lead to teammate's CRM via Google Sheets bridge (fire-and-forget).
  // verify-url-gate のダミー申請はシート汚染を避けるためスキップ
  if (!isVerifyGateRequest(name)) {
    appendLead(created).catch((err) => {
      console.error(`[report-request/submit] leads-sheet append failed for ${created.id}:`, err);
    });
  }

  // Auto-generate report in background (fire-and-forget)
  // 2026-04-27〜: Airbnb 単一化（copy-rules.md ⑦原則）。Booking.com URL は受付けない。
  // verify-url-gate のダミー申請は OTAスクレイピングを走らせる意味がないのでスキップ
  if (!isVerifyGateRequest(name) && airbnbUrl) {
    generateReportInBackground(created.id);
  }

  return NextResponse.json(
    { id: created.id, status: "received" },
    { headers: { "X-RateLimit-Remaining": String(remaining) } },
  );
}

