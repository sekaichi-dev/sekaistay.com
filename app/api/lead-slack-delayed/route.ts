/**
 * 遅延 Slack 通知 cron (2026-05-22 追加).
 *
 * 背景:
 *   フォーム送信時に即時 Slack 通知すると、TimeRex の予約完了通知も #402-sekaistay面談申込 に
 *   独立して流れるためダブル通知になる。実際に営業が拾いたいのは「フォームを送信したが
 *   TimeRex の予約には進まなかった離脱リード」なので、10 分遅延 + TimeRex 投稿の有無で抑制する。
 *
 * 動作 (1分毎の Vercel Cron で実行する想定):
 *   1. lead_submissions から slack_notified_at IS NULL かつ created_at < now - 10min の本番リードを取得
 *   2. Slack #402 の直近 25 分の会話を conversations.history で取得
 *   3. 各リードに対し:
 *        - 同期間に TimeRex bot の投稿（"よりご予約をいただきました" を含む）があり、本文に
 *          リード氏名が含まれていれば「予約済」と判定 → slack_suppressed_reason='timerex_booked' で確定
 *        - 一致しなければ forwardLeadToSlack(leadId) を呼んで Slack 通知 → slack_notified_at=now()
 *   4. 失敗時は slack_attempt_count++ / slack_last_error にメッセージ保存。
 *      attempt が 5 を超えた場合、強制的に「諦め通知」を投げて以後試行しない。
 *
 * セキュリティ: Vercel cron 経由でのみ呼ばれる前提で Authorization: Bearer CRON_SECRET を要求。
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { forwardLeadToSlack } from "@/lib/lead-forward";

export const runtime = "nodejs";
export const maxDuration = 60;

const DELAY_MS = 10 * 60_000; // フォーム送信から 10 分後に処理対象になる
const SLACK_LOOKBACK_MS = 25 * 60_000; // Slack #402 を直近 25 分まで遡って TimeRex 投稿をチェック
const PROCESS_LIMIT = 20;
const TIME_BUDGET_MS = 50_000;
const MAX_ATTEMPTS = 5;

type SlackBlockElement = {
  type?: string;
  text?: string | { text?: string };
  elements?: SlackBlockElement[];
  fields?: Array<{ text?: string }>;
};

type SlackMessage = {
  type: string;
  ts: string;
  user?: string;
  bot_id?: string;
  username?: string;
  bot_profile?: { name?: string };
  app_id?: string;
  text?: string;
  attachments?: Array<{ text?: string; fallback?: string; pretext?: string; title?: string }>;
  blocks?: SlackBlockElement[];
};

function extractBlockText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractBlockText).join(" ");
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const parts: string[] = [];
    for (const v of Object.values(obj)) {
      if (typeof v === "string") parts.push(v);
      else if (v && (Array.isArray(v) || typeof v === "object")) parts.push(extractBlockText(v));
    }
    return parts.join(" ");
  }
  return "";
}

async function fetchSlackHistory(token: string, channelId: string, sinceMs: number): Promise<SlackMessage[]> {
  const oldest = (sinceMs / 1000).toFixed(6);
  const url = `https://slack.com/api/conversations.history?channel=${encodeURIComponent(channelId)}&oldest=${oldest}&limit=200`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    throw new Error(`slack history HTTP ${resp.status}`);
  }
  const json = (await resp.json().catch(() => null)) as
    | { ok?: boolean; error?: string; messages?: SlackMessage[] }
    | null;
  if (!json?.ok) {
    throw new Error(`slack history error: ${json?.error || "unknown"}`);
  }
  return json.messages || [];
}

/**
 * TimeRex の予約完了投稿を判定。
 * 観測サンプル (2026-05-22 #402):
 *   - "○○さんよりご予約をいただきました。"
 *   - "○○さんが予定を追加しました。" (新形式 / blocks に格納)
 * Slack の bot 投稿は本文が `blocks` にしかないケースが多いので、
 * text / attachments / blocks / bot_profile.name の全てを haystack に集めて判定する。
 */
function messageHaystack(msg: SlackMessage): string {
  const parts: string[] = [
    msg.text || "",
    msg.username || "",
    msg.bot_profile?.name || "",
  ];
  for (const a of msg.attachments || []) {
    parts.push(a.text || "", a.fallback || "", a.pretext || "", a.title || "");
  }
  parts.push(extractBlockText(msg.blocks));
  return parts.join("\n");
}

function isTimerexBookingMessage(msg: SlackMessage): boolean {
  const haystack = messageHaystack(msg).toLowerCase();
  if (haystack.includes("timerex")) return true;
  // 文言ベースの fallback: 予約確定パターン
  if (haystack.includes("ご予約をいただきました")) return true;
  if (haystack.includes("予定を追加しました")) return true;
  return false;
}

/**
 * リード氏名が TimeRex 投稿に含まれているか判定。
 * 名前は「丸山」のような姓だけのケースもあるので、空白除去 + 部分一致でラフに照合する。
 * フォームの name 全体 / 空白を取り除いた version / 先頭2文字 のいずれかが match すれば一致扱い。
 */
function nameMatches(leadName: string | null | undefined, haystack: string): boolean {
  if (!leadName) return false;
  const cleaned = leadName.replace(/\s+/g, "");
  if (cleaned.length === 0) return false;
  if (haystack.includes(cleaned)) return true;
  // 姓+名で送ってきた場合、TimeRex 側は氏のみ入力されがちなので最初の2文字も試す
  if (cleaned.length >= 2 && haystack.includes(cleaned.slice(0, 2))) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const expected = (process.env.CRON_SECRET || "").trim();
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const slackToken = (process.env.SLACK_BOT_TOKEN || "").trim();
  const slackChannel = (process.env.SLACK_LEAD_CHANNEL_ID || "").trim();
  if (!slackToken || !slackChannel) {
    return NextResponse.json({ error: "SLACK_BOT_TOKEN / SLACK_LEAD_CHANNEL_ID not configured" }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const cutoffIso = new Date(Date.now() - DELAY_MS).toISOString();

  const { data, error } = await supabase
    .from("lead_submissions")
    .select("id, created_at, name, email, slack_attempt_count")
    .is("slack_notified_at", null)
    .neq("kind", "test")
    .lt("created_at", cutoffIso)
    .lt("slack_attempt_count", MAX_ATTEMPTS)
    .order("created_at", { ascending: true })
    .limit(PROCESS_LIMIT);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ scanned: 0, results: [] });
  }

  // Slack history を1回だけ取得して全リードで再利用（rate limit 抑制）
  let history: SlackMessage[] = [];
  try {
    history = await fetchSlackHistory(slackToken, slackChannel, Date.now() - SLACK_LOOKBACK_MS);
  } catch (err: any) {
    return NextResponse.json({ error: `slack history fetch failed: ${err?.message || err}` }, { status: 500 });
  }

  const timerexMessages = history.filter(isTimerexBookingMessage).map((m) => ({
    ts: m.ts,
    haystack: messageHaystack(m),
  }));

  const startedAt = Date.now();
  const results: Array<Record<string, unknown>> = [];

  for (const row of data) {
    if (Date.now() - startedAt > TIME_BUDGET_MS) {
      results.push({ id: row.id, skipped: "time-budget" });
      continue;
    }
    const lead = row as { id: string; created_at: string; name: string | null; email: string | null; slack_attempt_count: number };

    // Slack #402 に同名の TimeRex 投稿があるか
    const matched = timerexMessages.find((m) => nameMatches(lead.name, m.haystack));

    if (matched) {
      const { error: updErr } = await supabase
        .from("lead_submissions")
        .update({
          slack_notified_at: new Date().toISOString(),
          slack_suppressed_reason: "timerex_booked",
        })
        .eq("id", lead.id);
      results.push({ id: lead.id, action: "suppressed", reason: "timerex_booked", matchedTs: matched.ts, updErr: updErr?.message });
      continue;
    }

    // 通知実行 — フォーム送信から10分経過し TimeRex 予約も来ていない離脱リード
    const minutesElapsed = Math.round((Date.now() - new Date(lead.created_at).getTime()) / 60_000);
    const outcome = await forwardLeadToSlack(lead.id, {
      headerNote: `⚠️ *TimeRex予約なし* — フォーム送信から ${minutesElapsed} 分経過。営業フォローアップ推奨。`,
    });
    if (outcome.ok) {
      const { error: updErr } = await supabase
        .from("lead_submissions")
        .update({
          slack_notified_at: new Date().toISOString(),
          slack_attempt_count: lead.slack_attempt_count + 1,
        })
        .eq("id", lead.id);
      results.push({ id: lead.id, action: "notified", updErr: updErr?.message });
    } else {
      const nextAttempt = lead.slack_attempt_count + 1;
      const { error: updErr } = await supabase
        .from("lead_submissions")
        .update({
          slack_attempt_count: nextAttempt,
          slack_last_error: (outcome.error || "unknown").slice(0, 500),
        })
        .eq("id", lead.id);
      results.push({ id: lead.id, action: "failed", attempt: nextAttempt, error: outcome.error, updErr: updErr?.message });
    }
  }

  return NextResponse.json({ scanned: data.length, timerexFound: timerexMessages.length, results });
}
