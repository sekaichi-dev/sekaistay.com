import { getSupabaseAdmin } from "./supabase";
import type { LeadSubmissionRow } from "./lead-submissions";

const FORWARD_TIMEOUT_MS = 5000;

const SALES_PORTAL_URL = "https://sekaistay-sales-portal.vercel.app/api/public/inquiry";
// Sales Portal は public エンドポイント (認証なし・rate limit のみ) なので secret は不要。
// テスト送信が portal に流れないよう forwardLead と同じ kind="test" フィルタを適用。

export type ForwardOutcome = { ok: boolean; status?: number; error?: string };

function rowToPayload(row: LeadSubmissionRow): Record<string, unknown> {
  return {
    name: row.name,
    email: row.email,
    phone: row.phone,
    airbnbUrl: row.airbnb_url ?? undefined,
    totalProperties: row.total_properties ?? undefined,
    peakRevenue: row.peak_revenue ?? undefined,
    offpeakRevenue: row.offpeak_revenue ?? undefined,
    commissionRate: row.commission_rate ?? undefined,
    operatingYears: row.operating_years ?? undefined,
    complaints: row.complaints ?? undefined,
    companyName: row.company_name ?? undefined,
    utmSource: row.utm_source ?? undefined,
    utmMedium: row.utm_medium ?? undefined,
    utmCampaign: row.utm_campaign ?? undefined,
    utmContent: row.utm_content ?? undefined,
    utmTerm: row.utm_term ?? undefined,
    gclid: row.gclid ?? undefined,
    fbclid: row.fbclid ?? undefined,
    landingUrl: row.landing_url ?? undefined,
    referrer: row.referrer ?? undefined,
    lpVariant: row.lp_variant ?? undefined,
    formVariant: row.form_variant ?? undefined,
    submittedAt: row.created_at,
    tenichiLeadId: row.id,
  };
}

/**
 * Discord 通知: 新規リードを #sekai-stay チャンネルに即時投稿。
 *
 * 設計背景 (2026-05-14):
 * - 吉蔵 CRM (japanvillas.kss-cloud.com) と sekaistay-sales-portal は両方とも自動通知を持たない
 *   → リードが届いても小川/吉田は気づかない (ダッシュボード手動チェック頼み)。
 * - Discord 通知を3系統目として追加し、リアルタイムで担当者に届ける。
 *
 * 動作:
 * - kind="test" は skip (テストリードでチャンネルを汚さない)
 * - 環境変数:
 *   - DISCORD_LEAD_WEBHOOK_URL (必須・未設定なら no-op で成功扱い)
 *   - DISCORD_LEAD_MENTIONS (任意・"<@user_id_1> <@user_id_2>" 形式で小川/吉田を明示メンション)
 * - 失敗してもクライアント応答 200 を維持 (Promise.allSettled 内で実行)。
 */
export async function forwardLeadToDiscord(leadId: string): Promise<ForwardOutcome> {
  const webhookUrl = (process.env.DISCORD_LEAD_WEBHOOK_URL || "").trim();
  if (!webhookUrl) {
    return { ok: true, error: "DISCORD_LEAD_WEBHOOK_URL not configured (skipped)" };
  }

  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchErr } = await supabase
    .from("lead_submissions")
    .select("*")
    .eq("id", leadId)
    .single();
  if (fetchErr || !row) {
    return { ok: false, error: fetchErr?.message || "row not found" };
  }
  const r = row as LeadSubmissionRow;

  // テストリードは Discord 通知 skip (チャンネル汚染防止)
  if (r.kind === "test") return { ok: true };

  const mentions = (process.env.DISCORD_LEAD_MENTIONS || "").trim();
  const lpVariant = r.lp_variant || "(direct)";
  const utmInfo =
    r.utm_source || r.utm_campaign
      ? `${r.utm_source ?? "?"} / ${r.utm_campaign ?? "?"} / ${r.utm_content ?? "?"}`
      : "(なし)";

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    { name: "👤 名前", value: r.name || "(未入力)", inline: true },
    { name: "📧 Email", value: r.email || "(未入力)", inline: true },
    { name: "📞 電話", value: r.phone || "(未入力)", inline: true },
  ];
  if (r.airbnb_url) {
    fields.push({ name: "🏠 Airbnb URL", value: r.airbnb_url.slice(0, 1024), inline: false });
  }
  if (typeof r.total_properties === "number") {
    fields.push({ name: "物件数", value: `${r.total_properties} 棟`, inline: true });
  }
  if (r.commission_rate) {
    fields.push({ name: "現手数料", value: r.commission_rate, inline: true });
  }
  if (r.operating_years) {
    fields.push({ name: "運営年数", value: r.operating_years, inline: true });
  }
  if (r.peak_revenue || r.offpeak_revenue) {
    fields.push({
      name: "想定年商",
      value: `繁忙期: ${r.peak_revenue ?? "?"} / 閑散期: ${r.offpeak_revenue ?? "?"}`,
      inline: false,
    });
  }
  if (r.complaints) {
    fields.push({ name: "課題・要望", value: r.complaints.slice(0, 1024), inline: false });
  }
  fields.push({ name: "LP", value: lpVariant, inline: true });
  if (r.cta_source) {
    fields.push({ name: "流入元", value: r.cta_source, inline: true });
  }
  fields.push({ name: "計測", value: utmInfo, inline: true });

  const payload = {
    content: mentions ? `${mentions} 新規リードが届きました 🔔` : "新規リードが届きました 🔔",
    embeds: [
      {
        title: `🏡 新規リード: ${r.name}`,
        description: "sekaistay.com フォームから受信しました。担当営業はダッシュボードからアサインしてください。",
        color: 0x167b81, // SEKAI Deep Teal
        fields,
        footer: { text: `Lead ID: ${r.id}` },
        timestamp: r.created_at,
      },
    ],
    // Discord の allowed_mentions で意図しない @everyone をブロック
    allowed_mentions: { parse: ["users"] as const },
  };

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FORWARD_TIMEOUT_MS);
  try {
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      const errMsg = `HTTP ${resp.status}: ${text.slice(0, 500)}`;
      await supabase.from("lead_submissions").update({ discord_error: errMsg }).eq("id", leadId);
      return { ok: false, status: resp.status, error: errMsg };
    }
    // 配信観測: Slack の slack_notified_at と対になる Discord 側のタイムスタンプ。
    await supabase
      .from("lead_submissions")
      .update({ discord_notified_at: new Date().toISOString(), discord_error: null })
      .eq("id", leadId);
    return { ok: true, status: resp.status };
  } catch (err: any) {
    const errMsg =
      err?.name === "AbortError" ? `timeout after ${FORWARD_TIMEOUT_MS}ms` : err?.message || String(err);
    await supabase.from("lead_submissions").update({ discord_error: errMsg }).eq("id", leadId);
    return { ok: false, error: errMsg };
  } finally {
    clearTimeout(timer);
  }
}

export async function forwardLead(leadId: string): Promise<ForwardOutcome> {
  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchErr } = await supabase
    .from("lead_submissions")
    .select("*")
    .eq("id", leadId)
    .single();
  if (fetchErr || !row) {
    return { ok: false, error: fetchErr?.message || "row not found" };
  }
  if (row.forwarded_at) return { ok: true };

  // Don't pollute 吉蔵 prod endpoint with test/internal submissions
  if (row.kind === "test") {
    await supabase
      .from("lead_submissions")
      .update({ forwarded_at: new Date().toISOString() })
      .eq("id", leadId);
    return { ok: true };
  }

  const url = (process.env.LEAD_INTAKE_URL || "").trim();
  const secret = (process.env.LEAD_INTAKE_SECRET || "").trim();
  if (!url || !secret) {
    return { ok: false, error: "LEAD_INTAKE_URL / LEAD_INTAKE_SECRET not configured" };
  }

  const previousRetryCount = (row as LeadSubmissionRow).forward_retry_count ?? 0;

  // CAS claim: pre-increment retry_count atomically. Concurrent overlapping
  // invocations see the bumped value and lose the eq() check, so only one POSTs.
  // After this point retry_count = "attempts started" rather than "failures only";
  // on success forwarded_at is set and the row is filtered out of future scans.
  const { data: claimed, error: claimErr } = await supabase
    .from("lead_submissions")
    .update({ forward_retry_count: previousRetryCount + 1 })
    .eq("id", leadId)
    .eq("forward_retry_count", previousRetryCount)
    .is("forwarded_at", null)
    .select("id");
  if (claimErr) {
    return { ok: false, error: `claim failed: ${claimErr.message}` };
  }
  if (!claimed || claimed.length === 0) {
    return { ok: true, error: "already claimed or forwarded by another invocation" };
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FORWARD_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret,
      },
      body: JSON.stringify(rowToPayload(row as LeadSubmissionRow)),
      signal: ac.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      const errMsg = `HTTP ${resp.status}: ${text.slice(0, 500)}`;
      await supabase
        .from("lead_submissions")
        .update({ forward_error: errMsg })
        .eq("id", leadId);
      return { ok: false, status: resp.status, error: errMsg };
    }
    await supabase
      .from("lead_submissions")
      .update({
        forwarded_at: new Date().toISOString(),
        forward_error: null,
      })
      .eq("id", leadId);
    return { ok: true, status: resp.status };
  } catch (err: any) {
    const errMsg =
      err?.name === "AbortError"
        ? `timeout after ${FORWARD_TIMEOUT_MS}ms`
        : err?.message || String(err);
    await supabase
      .from("lead_submissions")
      .update({ forward_error: errMsg })
      .eq("id", leadId);
    return { ok: false, error: errMsg };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * SEKAI STAY 営業ポータル (sekaistay-sales-portal) への lead 転送。
 * 吉蔵の既存 forwardLead とは別経路。並行して 2 系統に送る運用。
 *
 * - public endpoint（認証なし）。本番ドメイン (sekaistay.com) からの POST は CORS 申請不要。
 * - kind === 'test' でも portal には送る（小川さんが CRM 受信確認できるよう）。
 *   識別のため source に `_test` suffix を付け、message 先頭に内部テスト旨を明記する。
 *   吉蔵 CRM / Meta CAPI 側は引き続き test skip。
 * - ガイド: https://sekaistay-sales-portal.vercel.app/integration-guide.html
 */
export async function forwardLeadToSalesPortal(leadId: string): Promise<ForwardOutcome> {
  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchErr } = await supabase
    .from("lead_submissions")
    .select("*")
    .eq("id", leadId)
    .single();
  if (fetchErr || !row) {
    return { ok: false, error: fetchErr?.message || "row not found" };
  }

  // ポータルが受け付けるフィールドにマッピング (name/email/phone/company/message/source)。
  // 詳細な物件情報・収益見込みは message に集約して営業担当が即座に把握できる形に。
  const r = row as LeadSubmissionRow;
  const isTest = r.kind === "test";
  const messageBody = [
    isTest ? "[内部テスト送信 — Supabase kind=test。本番リード対応は不要]" : undefined,
    r.complaints || undefined,
    r.airbnb_url ? `Airbnb URL: ${r.airbnb_url}` : undefined,
    typeof r.total_properties === "number" ? `物件数: ${r.total_properties} 棟` : undefined,
    r.peak_revenue ? `繁忙期想定年商: ${r.peak_revenue}` : undefined,
    r.offpeak_revenue ? `閑散期想定年商: ${r.offpeak_revenue}` : undefined,
    r.commission_rate ? `現手数料: ${r.commission_rate}` : undefined,
    r.operating_years ? `運営年数: ${r.operating_years}` : undefined,
    r.utm_source || r.utm_campaign
      ? `[計測] utm_source=${r.utm_source ?? ""} utm_campaign=${r.utm_campaign ?? ""}`
      : undefined,
  ]
    .filter(Boolean)
    .join("\n");
  const baseSource = `lp_${(r.lp_variant || "report-request").replace(/[^a-z0-9_-]/gi, "_")}`;
  const source = isTest ? `${baseSource}_test` : baseSource;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FORWARD_TIMEOUT_MS);
  try {
    const resp = await fetch(SALES_PORTAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: r.name,
        email: r.email,
        phone: r.phone || undefined,
        company: r.company_name || undefined,
        message: messageBody || undefined,
        source,
      }),
      signal: ac.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return { ok: false, status: resp.status, error: `HTTP ${resp.status}: ${text.slice(0, 500)}` };
    }
    return { ok: true, status: resp.status };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.name === "AbortError" ? `timeout after ${FORWARD_TIMEOUT_MS}ms` : err?.message || String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Slack 通知: 新規リードを #402-sekaistay面談申込 に投稿。
 *
 * 設計背景 (2026-05-22):
 * - Discord 通知 (forwardLeadToDiscord) と並行して Slack にも飛ばす。
 *   Slack 主体で動いている運営/営業メンバーが気づけるようにする。
 * - bot トークン (xoxb-) を使う chat.postMessage 経由。Incoming Webhook ではないので
 *   チャネル変更時に Slack 側で再発行が不要。事前に bot を該当チャネルに invite しておくこと。
 *
 * 動作:
 * - kind="test" は skip (テストリードでチャンネルを汚さない)
 * - 環境変数:
 *   - SLACK_BOT_TOKEN (必須・未設定なら no-op で成功扱い)
 *   - SLACK_LEAD_CHANNEL_ID (必須・未設定なら no-op で成功扱い)
 *     現状: C0AFH8LF3TK = #402-sekaistay面談申込
 * - 失敗してもクライアント応答 200 を維持 (Promise.allSettled 内で実行)。
 */
export async function forwardLeadToSlack(
  leadId: string,
  options: { headerNote?: string; threadTs?: string } = {},
): Promise<ForwardOutcome> {
  const token = (process.env.SLACK_BOT_TOKEN || "").trim();
  const channelId = (process.env.SLACK_LEAD_CHANNEL_ID || "").trim();
  if (!token || !channelId) {
    return { ok: true, error: "SLACK_BOT_TOKEN / SLACK_LEAD_CHANNEL_ID not configured (skipped)" };
  }

  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchErr } = await supabase
    .from("lead_submissions")
    .select("*")
    .eq("id", leadId)
    .single();
  if (fetchErr || !row) {
    return { ok: false, error: fetchErr?.message || "row not found" };
  }
  const r = row as LeadSubmissionRow;

  if (r.kind === "test") return { ok: true };

  const lpVariant = r.lp_variant || "(direct)";
  const utmInfo =
    r.utm_source || r.utm_campaign
      ? `${r.utm_source ?? "?"} / ${r.utm_campaign ?? "?"} / ${r.utm_content ?? "?"}`
      : "(なし)";

  const lines: string[] = [];
  lines.push(`*👤 名前:* ${r.name || "(未入力)"}`);
  lines.push(`*📧 Email:* ${r.email || "(未入力)"}`);
  lines.push(`*📞 電話:* ${r.phone || "(未入力)"}`);
  if (r.company_name) lines.push(`*🏢 会社:* ${r.company_name}`);
  if (r.airbnb_url) lines.push(`*🏠 Airbnb URL:* ${r.airbnb_url}`);
  if (typeof r.total_properties === "number") lines.push(`*物件数:* ${r.total_properties} 棟`);
  if (r.commission_rate) lines.push(`*現手数料:* ${r.commission_rate}`);
  if (r.operating_years) lines.push(`*運営年数:* ${r.operating_years}`);
  if (r.peak_revenue || r.offpeak_revenue) {
    lines.push(`*想定年商:* 繁忙期 ${r.peak_revenue ?? "?"} / 閑散期 ${r.offpeak_revenue ?? "?"}`);
  }
  if (r.complaints) lines.push(`*課題・要望:* ${r.complaints.slice(0, 1500)}`);
  lines.push(`*LP:* ${lpVariant}${r.cta_source ? `   *流入元:* ${r.cta_source}` : ""}   *計測:* ${utmInfo}`);

  const blocks: Array<Record<string, unknown>> = [
    {
      type: "header",
      text: { type: "plain_text", text: `🏡 新規リード: ${r.name || "(未入力)"}`, emoji: true },
    },
  ];
  if (options.headerNote) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: options.headerNote },
    });
  }
  blocks.push(
    { type: "section", text: { type: "mrkdwn", text: lines.join("\n") } },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: `Lead ID: \`${r.id}\` · ${r.created_at}` }],
    },
  );

  const payload: Record<string, unknown> = {
    channel: channelId,
    text: `🔔 新規リード: ${r.name}`,
    unfurl_links: false,
    unfurl_media: false,
    blocks,
  };
  if (options.threadTs) {
    payload.thread_ts = options.threadTs;
    // TimeRex 予約スレッドへの返信だが、reply_broadcast=true で #402 本流にも 1 件表示する。
    // これがないと予約済みリード（全体の約半数）はスレッドに埋もれ「Slack に通知が来ない」
    // ように見える（2026-06-29 ヨシト指摘で本流表示に方針変更）。
    payload.reply_broadcast = true;
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FORWARD_TIMEOUT_MS);
  try {
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return { ok: false, status: resp.status, error: `HTTP ${resp.status}: ${text.slice(0, 500)}` };
    }
    const json = (await resp.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!json?.ok) {
      return { ok: false, status: resp.status, error: `slack error: ${json?.error || "unknown"}` };
    }
    return { ok: true, status: resp.status };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.name === "AbortError" ? `timeout after ${FORWARD_TIMEOUT_MS}ms` : err?.message || String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}
