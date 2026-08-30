import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { forwardLead } from "@/lib/lead-forward";

export const runtime = "nodejs";
export const maxDuration = 60;

// retry_count semantics: total attempts started (initial submit kickoff = 1).
// Stop after MAX_TOTAL_ATTEMPTS = 5 (1 submit + up to 4 retries per spec).
const MAX_TOTAL_ATTEMPTS = 5;
// Wait minutes between attempt N and attempt N+1 (spec: 1m → 5m → 30m → 2h).
const BACKOFF_MIN = [1, 5, 30, 120];
const PROCESS_LIMIT = 10;
const TIME_BUDGET_MS = 50_000;

export async function GET(req: NextRequest) {
  const expected = (process.env.CRON_SECRET || "").trim();
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("lead_submissions")
    .select("id, created_at, forward_retry_count, kind")
    .is("forwarded_at", null)
    .lt("forward_retry_count", MAX_TOTAL_ATTEMPTS)
    .neq("kind", "test")
    .order("created_at", { ascending: true })
    .limit(PROCESS_LIMIT);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = Date.now();
  const startedAt = Date.now();
  const results: Array<Record<string, unknown>> = [];
  for (const row of data || []) {
    if (Date.now() - startedAt > TIME_BUDGET_MS) {
      results.push({ id: row.id, skipped: "time-budget" });
      continue;
    }
    const retry = (row as { forward_retry_count?: number }).forward_retry_count ?? 0;
    if (retry > 0) {
      // Eligible for next attempt at created_at + sum of waits between attempts 1..retry.
      // No forward_last_attempt_at column yet, so we use cumulative offset from created_at
      // as a coarse approximation. Real backoff fidelity requires that column.
      const offsetMin = BACKOFF_MIN.slice(0, retry).reduce((s, x) => s + x, 0);
      const eligibleAt = new Date(row.created_at as string).getTime() + offsetMin * 60_000;
      if (now < eligibleAt) {
        results.push({ id: row.id, skipped: "backoff", retry });
        continue;
      }
    }
    const result = await forwardLead(row.id as string);
    results.push({ id: row.id, ...result });
  }

  return NextResponse.json({ scanned: data?.length ?? 0, results });
}
