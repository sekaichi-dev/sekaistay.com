// 室内 QR の入口（/c/<物件ID>?k=<鍵>）。鍵を検証して httpOnly Cookie に移し、鍵なしの /checkin/<物件ID> へ転送する。
// この URL ではページを描画しないので、root layout の解析・広告タグに鍵入り URL が渡らない。
// 鍵が合わなくても同じ場所へ転送し、/checkin 側が Cookie 無しとして「無効」を出す（鍵の正誤をここで区別しない）。
import { NextRequest, NextResponse } from "next/server";
import { CHECKIN_COOKIE, CHECKIN_COOKIE_MAX_AGE, checkinCookieValue, verifyRoomKey } from "@/lib/checkin-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { propertyId: string } }) {
  const propertyId = (params.propertyId || "").trim().slice(0, 20);
  const key = (req.nextUrl.searchParams.get("k") || "").trim();
  const secret = (process.env.CHECKIN_QR_SECRET || "").trim();
  const res = NextResponse.redirect(new URL(`/checkin/${encodeURIComponent(propertyId)}`, req.nextUrl.origin), 303);
  if (secret && verifyRoomKey(propertyId, key, secret)) {
    res.cookies.set(CHECKIN_COOKIE, checkinCookieValue(propertyId, key), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CHECKIN_COOKIE_MAX_AGE,
    });
  } else {
    res.cookies.delete(CHECKIN_COOKIE);
  }
  return res;
}
