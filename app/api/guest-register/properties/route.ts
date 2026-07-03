import { NextResponse } from "next/server";
import { fetchProperties } from "@/lib/guest-register";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// フォームの施設ドロップダウン用。届出番号などの内部情報は返さない。
export async function GET() {
  try {
    const properties = await fetchProperties();
    return NextResponse.json({
      properties: properties
        .filter((p) => p.active)
        .map((p) => ({ id: p.id, name: p.name, nameEn: p.nameEn, type: p.type })),
    });
  } catch (e) {
    console.error("[guest-register] properties list failed:", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
