// 写真1枚を当サーバー経由で Drive の受付中フォルダへ置く迂回路。
// 既定はブラウザから /api/guest-register/photo-session の URL へ直接 PUT だが、ゲストの回線によっては
// Google に届かず「Failed to fetch / Load failed」で終わる（2026-10-03〜10-21 に 11 件）。その 2 回の失敗後にだけ使う。
// Vercel 関数の受信上限 4.5MB があるので MAX_PROXY_UPLOAD_BYTES までしか受けない（縮小済みの写真は必ず収まる）。
import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_PHOTO_MIME, MAX_PROXY_UPLOAD_BYTES, uploadStagedPhoto } from "@/lib/guest-register";
import { allowedOrigin, getClientIp, makeRateLimiter } from "@/lib/guest-register-request";

export const runtime = "nodejs";

// 直接 PUT が通らない端末だけが来る。最大 8 名 × 2 枚 + 撮り直し分
const checkRate = makeRateLimiter(60, 60 * 60 * 1000);

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  if (!checkRate(getClientIp(req))) {
    return NextResponse.json(
      { error: "送信回数の上限に達しました。時間をおいてお試しください / Too many requests. Please try again later." },
      { status: 429 },
    );
  }
  const mime = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_PHOTO_MIME.has(mime)) {
    return NextResponse.json({ error: "写真は JPEG / PNG / HEIC 形式で添付してください / Photo must be JPEG, PNG or HEIC" }, { status: 400 });
  }
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_PROXY_UPLOAD_BYTES) {
    return NextResponse.json({ error: "写真のサイズが大きすぎます（4MBまで）/ Photo too large (max 4MB)" }, { status: 413 });
  }
  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await req.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "写真を受け取れませんでした / Could not read the photo" }, { status: 400 });
  }
  if (bytes.byteLength === 0) return NextResponse.json({ error: "写真が空です / Empty photo" }, { status: 400 });
  if (bytes.byteLength > MAX_PROXY_UPLOAD_BYTES) {
    return NextResponse.json({ error: "写真のサイズが大きすぎます（4MBまで）/ Photo too large (max 4MB)" }, { status: 413 });
  }
  try {
    const id = await uploadStagedPhoto(mime, bytes);
    return NextResponse.json({ id });
  } catch (e) {
    console.error("[guest-register] proxy photo upload failed:", e);
    return NextResponse.json(
      { error: "写真の保存に失敗しました。時間をおいてお試しください / Could not save the photo. Please try again." },
      { status: 500 },
    );
  }
}
