import { NextRequest, NextResponse } from "next/server";
import { fetchMktStats2 } from "@/lib/mkt-stats2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// manage.kss-cloud.com の /marketing/lp 刷新版ダッシュボード向け JSON（集計 v2）。
// 既存 /api/mkt/stats・/mkt/board とは独立（後方互換のため既存は不変更）。
// 認証は同じ管理キー方式。
const ADMIN_KEY = "sekaichi2026";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  if (from && !DATE_RE.test(from)) return NextResponse.json({ error: "invalid from (YYYY-MM-DD)" }, { status: 400 });
  if (to && !DATE_RE.test(to)) return NextResponse.json({ error: "invalid to (YYYY-MM-DD)" }, { status: 400 });

  try {
    const stats = await fetchMktStats2(from || null, to || null);
    return NextResponse.json({ ...stats, from: from || null, to: to || null, generatedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error("[mkt/stats2]", err?.message || err);
    return NextResponse.json({ error: "stats2 failed" }, { status: 500 });
  }
}
