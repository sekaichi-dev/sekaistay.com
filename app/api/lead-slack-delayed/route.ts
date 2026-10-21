/**
 * Slack リード通知 cron (2026-05-22 追加・2026-10-21 TimeRex 照合を廃止).
 *
 * 動作 (1分毎の Vercel Cron で実行):
 *   1. lead_submissions から slack_notified_at IS NULL かつ created_at < now - 1min の本番リードを取得
 *   2. 各リードを forwardLeadToSlack(leadId) で #402-sekaistay面談申込 に通知 → slack_notified_at=now()
 *   3. 失敗時は slack_attempt_count++ / slack_last_error にメッセージ保存。
 *      attempt が MAX_ATTEMPTS に達したら以後試行しない。
 *
 * 経緯: 以前は TimeRex の予約完了投稿と突き合わせるため 20 分遅延していたが、フォーム送信後の
 * TimeRex 遷移を廃止したので照合は不要になった。cron 経由のまま残すのは失敗時の再試行のため。
 *
 * セキュリティ: Vercel cron 経由でのみ呼ばれる前提で Authorization: Bearer CRON_SECRET を要求。
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { forwardLeadToSlack } from "@/lib/lead-forward";

export const runtime = "nodejs";
export const maxDuration = 60;

const DELAY_MS = 60_000; // submit の他系統転送（Supabase 書き込み含む）が落ち着いてから拾う
const PROCESS_LIMIT = 20;
const TIME_BUDGET_MS = 50_000;
const MAX_ATTEMPTS = 5;

export async function GET(req: NextRequest) {
  const expected = (process.env.CRON_SECRET || "").trim();
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // forwardLeadToSlack は未設定時に「スキップ」として ok:true を返すため、ここで止めないと
  // 未送信のまま slack_notified_at が付いて設定復旧後に再試行されなくなる
  const slackToken = (process.env.SLACK_BOT_TOKEN || "").trim();
  const slackChannel = (process.env.SLACK_LEAD_CHANNEL_ID || "").trim();
  if (!slackToken || !slackChannel) {
    return NextResponse.json({ error: "SLACK_BOT_TOKEN / SLACK_LEAD_CHANNEL_ID not configured" }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const cutoffIso = new Date(Date.now() - DELAY_MS).toISOString();

  const { data, error } = await supabase
    .from("lead_submissions")
    .select("id, created_at, slack_attempt_count")
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

  const startedAt = Date.now();
  const results: Array<Record<string, unknown>> = [];
  const leads = data as Array<{ id: string; created_at: string; slack_attempt_count: number }>;

  for (const lead of leads) {
    if (Date.now() - startedAt > TIME_BUDGET_MS) {
      results.push({ id: lead.id, skipped: "time-budget" });
      continue;
    }

    const outcome = await forwardLeadToSlack(lead.id, {
      headerNote: "📩 *面談申込フォームから送信* — 担当よりご連絡ください。",
    });
    if (outcome.ok) {
      const { error: updErr } = await supabase
        .from("lead_submissions")
        .update({
          slack_notified_at: new Date().toISOString(),
          slack_attempt_count: lead.slack_attempt_count + 1,
          slack_suppressed_reason: null,
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

  return NextResponse.json({ scanned: data.length, results });
}
