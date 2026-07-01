import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function authed(req: NextRequest, key?: string): boolean {
  const admin = (process.env.X_CONTENT_ADMIN_KEY || "").trim();
  return !!admin && (key || req.headers.get("x-admin-key") || "") === admin;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authed(req, body.key)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const leadId = String(body.leadId || "");
  const referrerId = String(body.referrerId || "");
  if (!leadId || !referrerId) return NextResponse.json({ error: "leadId and referrerId required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("lead_submissions")
    .update({ referrer_id: referrerId, referrer_match: "code" })
    .eq("id", leadId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
