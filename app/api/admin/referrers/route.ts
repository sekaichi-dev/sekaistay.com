import { NextRequest, NextResponse } from "next/server";
import { listReferrers } from "@/lib/referrers";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function authed(req: NextRequest): boolean {
  const key = (process.env.X_CONTENT_ADMIN_KEY || "").trim();
  const given = req.nextUrl.searchParams.get("key") || req.headers.get("x-admin-key") || "";
  return !!key && given === key;
}

function mask(numberEnc: string): string {
  // 暗号化済み値は復号しない一覧では末尾表示しない。プレースホルダのみ。
  return "••••（reveal で表示）";
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const referrers = (await listReferrers()).map((r) => ({
    id: r.id, code: r.code, name: r.name, email: r.email, phone: r.phone,
    isOwner: r.is_owner, bankName: r.bank_name, branchName: r.branch_name,
    accountType: r.account_type, accountMasked: mask(r.account_number_enc),
    createdAt: r.created_at, status: r.status, kind: r.kind,
  }));

  const supabase = getSupabaseAdmin();
  const { data: leads } = await supabase
    .from("lead_submissions")
    .select("id, created_at, name, email, referrer_code, referrer_name, referrer_id, referrer_match")
    .not("referrer_match", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);

  return NextResponse.json({ referrers, leads: leads ?? [] });
}
