// 写真1枚ぶんの Drive 直接アップロード先（再開可能セッション URL）を発行する。
// ブラウザはこの URL へ PUT するだけなので、Vercel 関数の 4.5MB 上限も枚数の合計も送信に関係しなくなる
// （2026-09-28 予約 93483531 の送信失敗の再発防止）。
import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_PHOTO_MIME, MAX_UPLOAD_BYTES, createPhotoUploadSession } from "@/lib/guest-register";
import { allowedOrigin, getClientIp, makeRateLimiter } from "@/lib/guest-register-request";

export const runtime = "nodejs";

// 最大 8 名 × 2 枚 + 撮り直し分
const checkRate = makeRateLimiter(60, 60 * 60 * 1000);

export async function POST(req: NextRequest) {
  const origin = allowedOrigin(req);
  if (!origin) return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  if (!checkRate(getClientIp(req))) {
    return NextResponse.json(
      { error: "送信回数の上限に達しました。時間をおいてお試しください / Too many requests. Please try again later." },
      { status: 429 },
    );
  }
  let body: { mime?: unknown; size?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です / Invalid request" }, { status: 400 });
  }
  const mime = typeof body.mime === "string" ? body.mime : "";
  const size = typeof body.size === "number" ? body.size : NaN;
  if (!ALLOWED_PHOTO_MIME.has(mime)) {
    return NextResponse.json({ error: "写真は JPEG / PNG / HEIC 形式で添付してください / Photo must be JPEG, PNG or HEIC" }, { status: 400 });
  }
  if (!Number.isInteger(size) || size <= 0 || size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "写真のサイズが大きすぎます（20MBまで）/ Photo too large (max 20MB)" }, { status: 400 });
  }
  try {
    const uploadUrl = await createPhotoUploadSession(mime, size, origin);
    return NextResponse.json({ uploadUrl });
  } catch (e) {
    console.error("[guest-register] photo session failed:", e);
    return NextResponse.json(
      { error: "写真のアップロード準備に失敗しました。時間をおいてお試しください / Could not prepare the upload. Please try again." },
      { status: 500 },
    );
  }
}
