// マンスリー契約の同意フォームの入口（ops が Airbnb で送るリンク https://sekaistay.com/lease/<予約番号>?k=<鍵>）。
// 鍵を httpOnly Cookie（この予約のパスだけ）に移し、鍵の無い /lease/<予約番号>/consent へ 303 で転送する。
// この URL ではページを描画しないので、鍵入りの URL がブラウザの履歴以外に残らない（名簿の /c/<物件ID> と同じ作り）。
import { NextRequest, NextResponse } from "next/server";
import { leaseEntryDecision } from "@/lib/lease-consent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { bookingId: string } }) {
  const d = leaseEntryDecision({
    bookingId: (params.bookingId || "").trim().slice(0, 20),
    key: req.nextUrl.searchParams.get("k"),
    secure: process.env.NODE_ENV === "production",
  });
  const res = NextResponse.redirect(new URL(d.location, req.nextUrl.origin), 303);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "no-referrer");
  if (d.set) res.cookies.set(d.set.name, d.set.value, d.set.options);
  if (d.clear) res.cookies.set(d.clear.name, "", { path: d.clear.path, maxAge: 0, httpOnly: true, sameSite: "lax" });
  return res;
}
