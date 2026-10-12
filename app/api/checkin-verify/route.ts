// チェックイン時の本人確認の受付。室内 QR の鍵が合う物件だけ受け、写真を名簿フォルダへ置き「本人確認」タブに記録する。
// 写真本体はここに来ない（名簿フォームと同じく /api/guest-register/photo-session の URL へ直接 PUT 済みの Drive ID を受ける）。
import { NextRequest, NextResponse } from "next/server";
import {
  appendSheetRows, claimStagedPhoto, ensurePassportFolder, fetchProperties, nowJstString, sanitizeFilePart, StagedPhotoError,
} from "@/lib/guest-register";
import {
  CHECKIN_SHEET_RANGE, buildCheckinRows, checkinPhotoBaseName, makeCheckinReceiptId, parseCheckinInput, verifyRoomKey,
} from "@/lib/checkin-verify";
import { allowedOrigin, getClientIp, makeRateLimiter } from "@/lib/guest-register-request";

export const runtime = "nodejs";
export const maxDuration = 60;

const checkRate = makeRateLimiter(10, 60 * 60 * 1000);

const ERR = {
  origin: "Forbidden origin",
  rate: "送信回数の上限に達しました。時間をおいてお試しください / Too many requests. Please try again later.",
  format: "リクエストの形式が不正です / Invalid request",
  qr: "このQRコードは無効です。お部屋に掲示のQRコードを読み取ってください / This QR code is not valid. Please scan the code posted in your room.",
  booking: "予約番号、または姓と到着日を入力してください / Enter your booking number, or your last name and arrival date.",
  photos: "写真を撮影してください / Please take the photo.",
  closed: "現在受付できません。運営までご連絡ください / Not accepting right now. Please contact us.",
  server: "サーバーエラーが発生しました。時間をおいてお試しください / Server error. Please try again later.",
  photoRead: "写真を読み込めませんでした。もう一度撮影してください / We could not read the photo. Please take it again.",
  photoUpload: "写真の保存に失敗しました。時間をおいてお試しください / Could not save the photo. Please try again.",
  record: "受付に失敗しました。時間をおいてお試しください / Could not complete. Please try again.",
};

function todayJstIso(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return NextResponse.json({ error: ERR.origin }, { status: 403 });
  if (!checkRate(getClientIp(req))) return NextResponse.json({ error: ERR.rate }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: ERR.format }, { status: 400 });
  }
  // honeypot: bot が埋めたら成功を装って破棄
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true, receiptId: makeCheckinReceiptId() });
  }

  const { input, error } = parseCheckinInput(body.payload);
  if (!input) {
    const status = error === "invalid qr" ? 403 : 400;
    const message = error === "invalid qr" ? ERR.qr : error === "photos" ? ERR.photos : error === "invalid payload" ? ERR.format : ERR.booking;
    return NextResponse.json({ error: message }, { status });
  }

  // 秘密が未設定なら何も受け付けない（fail-closed）
  const secret = (process.env.CHECKIN_QR_SECRET || "").trim();
  if (!secret) {
    console.error("[checkin-verify] CHECKIN_QR_SECRET not configured");
    return NextResponse.json({ error: ERR.closed }, { status: 503 });
  }
  if (!verifyRoomKey(input.propertyId, input.key, secret)) return NextResponse.json({ error: ERR.qr }, { status: 403 });

  let property;
  try {
    property = (await fetchProperties()).find((p) => p.id === input.propertyId && p.active);
  } catch (e) {
    console.error("[checkin-verify] properties fetch failed:", e);
    return NextResponse.json({ error: ERR.server }, { status: 500 });
  }
  if (!property) return NextResponse.json({ error: ERR.qr }, { status: 403 });

  const receiptId = makeCheckinReceiptId();
  const receivedAt = nowJstString();
  const periodDate = input.arrivalDate || todayJstIso();
  const bookingLabel = `本人確認_${input.bookingRef || sanitizeFilePart(input.lastName)}`;

  let photoLinks: string[];
  try {
    let folderId: string | undefined;
    try {
      folderId = await ensurePassportFolder(periodDate, property.name, bookingLabel);
    } catch (e) {
      console.error("[checkin-verify] folder ensure failed (fallback to root):", e);
    }
    photoLinks = await Promise.all(
      input.photoFileIds.map((id, i) => claimStagedPhoto(id, checkinPhotoBaseName(property.id, receiptId, i), folderId)),
    );
  } catch (e) {
    if (e instanceof StagedPhotoError) {
      console.error("[checkin-verify] staged photo rejected:", e.message);
      return NextResponse.json({ error: ERR.photoRead }, { status: 400 });
    }
    console.error("[checkin-verify] drive claim failed:", e);
    return NextResponse.json({ error: ERR.photoUpload }, { status: 500 });
  }

  try {
    await appendSheetRows(CHECKIN_SHEET_RANGE, buildCheckinRows(input, property, receiptId, photoLinks, receivedAt));
  } catch (e) {
    console.error("[checkin-verify] sheets append failed:", e);
    return NextResponse.json({ error: ERR.record }, { status: 500 });
  }

  return NextResponse.json({ ok: true, receiptId });
}
