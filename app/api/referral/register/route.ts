import { NextResponse } from "next/server";

// 紹介者の登録（2026-10-10 吉田「紹介制度は展開しない」）: 受付は終了したので、どの呼び出しにも 410 を返す。
// 登録して紹介コードを発行していた旧版は git の履歴にある（lib/referrers.ts・lib/slack-notify.ts はそのまま残している）。
export const runtime = "nodejs";

function closed() {
  return NextResponse.json({ error: "紹介制度の受付は終了しました" }, { status: 410 });
}

export async function POST() {
  return closed();
}

export async function GET() {
  return closed();
}
