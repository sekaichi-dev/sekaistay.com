import { NextRequest, NextResponse } from "next/server";
import { buildRegisterManifest } from "@/lib/guest-register-manifest";

// 名簿ページ専用の manifest。?p=（施設）と lang を開き先に残す。個人情報は含まない
export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  return NextResponse.json(buildRegisterManifest(q.get("p"), q.get("lang")), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
