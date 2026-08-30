import { NextRequest, NextResponse } from "next/server";
import { fetchMktStats } from "@/lib/mkt-stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// manage.kss-cloud.com の /marketing/lp ダッシュボード向け JSON。
// 認証は /switch/results・/mkt/board と同じ管理キー方式。
const ADMIN_KEY = "sekaichi2026";

const ALLOWED_DAYS = new Set(["7", "30", "90", "all"]);

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const daysParam = req.nextUrl.searchParams.get("days") || "30";
  if (!ALLOWED_DAYS.has(daysParam)) {
    return NextResponse.json({ error: "invalid days (7|30|90|all)" }, { status: 400 });
  }
  const days = daysParam === "all" ? null : parseInt(daysParam, 10);

  try {
    const stats = await fetchMktStats(days);
    return NextResponse.json({ ...stats, periodDays: daysParam, generatedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error("[mkt/stats]", err?.message || err);
    return NextResponse.json({ error: "stats failed" }, { status: 500 });
  }
}
