/**
 * Discord リード通知 Webhook の疎通診断 (2026-06-29 追加).
 *
 * 背景: Discord 配信の成否を記録する列が無く「届いているか分からない」状態だった
 * （Slack の slack_notified_at に相当する列が Discord 側に欠落していた）。
 * このエンドポイントは DISCORD_LEAD_WEBHOOK_URL の設定状態と実際の配信可否を
 * 1 リクエストで確認するための運用ツール。本番リードには影響しない。
 *
 * 使い方 (管理者のみ):
 *   curl "https://sekaistay.com/api/lead-discord-test?key=<X_CONTENT_ADMIN_KEY>"
 *   → 「🔧 [診断]」と明記したテストメッセージを Discord チャンネルへ 1 件投稿し、
 *     configured / status / ok を JSON で返す。
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const expected = (process.env.X_CONTENT_ADMIN_KEY || "").trim();
  if (!expected) {
    return NextResponse.json({ error: "X_CONTENT_ADMIN_KEY not configured" }, { status: 500 });
  }
  const provided =
    req.nextUrl.searchParams.get("key") || req.headers.get("x-admin-key") || "";
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const webhookUrl = (process.env.DISCORD_LEAD_WEBHOOK_URL || "").trim();
  if (!webhookUrl) {
    return NextResponse.json({ configured: false, ok: false, note: "DISCORD_LEAD_WEBHOOK_URL is empty" });
  }

  try {
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          "🔧 [診断] Discord リード通知の疎通テストです。このメッセージは無視してください（実リードではありません）。",
        allowed_mentions: { parse: [] },
      }),
    });
    const text = await resp.text().catch(() => "");
    return NextResponse.json({
      configured: true,
      ok: resp.ok,
      status: resp.status,
      body: text.slice(0, 300),
    });
  } catch (err: any) {
    return NextResponse.json({ configured: true, ok: false, error: err?.message || String(err) });
  }
}
