// 受付中フォルダに残った写真（送信まで至らなかった分）を日次で消す。Vercel cron から呼ばれる。
import { NextRequest, NextResponse } from "next/server";
import { cleanupStagedPhotos } from "@/lib/guest-register";

export const runtime = "nodejs";
export const maxDuration = 60;

const STALE_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const expected = (process.env.CRON_SECRET || "").trim();
  if (!expected) return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const deleted = await cleanupStagedPhotos(STALE_MS);
    return NextResponse.json({ ok: true, deleted });
  } catch (e) {
    console.error("[guest-register] staging cleanup failed:", e);
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}
