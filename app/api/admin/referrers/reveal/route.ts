import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decryptReferrerBank } from "@/lib/referrers";
import type { ReferrerRow } from "@/lib/referrers";
import { isValidAdminKey } from "@/lib/admin-auth";

export const runtime = "nodejs";

function authed(req: NextRequest, key?: string): boolean {
  return isValidAdminKey(key || req.headers.get("x-admin-key"));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authed(req, body.key)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = String(body.referrerId || "");
  if (!id) return NextResponse.json({ error: "referrerId required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("referrers").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "not found" }, { status: 404 });

  const bank = await decryptReferrerBank(data as ReferrerRow);
  return NextResponse.json({ ...bank });
}
