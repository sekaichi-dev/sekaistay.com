// チェックイン時の本人確認の受付。室内 QR か予約ごとのリンクの鍵が合う物件だけ受け、写真を名簿フォルダへ置き「本人確認」タブに記録する。
// 予約ごとのリンクから来た送信は、位置情報が物件の近く（GEO_NEAR_M 以内）のときだけ受ける。予約番号はリンクの予約 ID で上書きする。
// 写真本体はここに来ない（名簿フォームと同じく /api/guest-register/photo-session の URL へ直接 PUT 済みの Drive ID を受ける）。
// QR の鍵は /c/<物件ID> が置いた httpOnly Cookie から読む（本文には入れない）。
import { NextRequest, NextResponse } from "next/server";
import {
  appendSheetRows, claimStagedPhoto, ensurePassportFolder, fetchProperties, nowJstString, sanitizeFilePart, StagedPhotoError,
} from "@/lib/guest-register";
import {
  CHECKIN_COOKIE, CHECKIN_SHEET_RANGE, buildCheckinRows, checkGeoNear, checkinPhotoBaseName, checkinSecretsFromEnv, geoDistance, listCheckinPhotos,
  makeCheckinReceiptId, parseCheckinInput, readCheckinAccess,
} from "@/lib/checkin-verify";
import { allowedOrigin, getClientIp, makeRateLimiter } from "@/lib/guest-register-request";

export const runtime = "nodejs";
export const maxDuration = 60;

const checkRate = makeRateLimiter(10, 60 * 60 * 1000);

const ERR = {
  origin: "Forbidden origin",
  rate: "送信回数の上限に達しました。時間をおいてお試しください / Too many requests. Please try again later.",
  format: "リクエストの形式が不正です / Invalid request",
  qr: "このQRコード・リンクは無効です。お部屋に掲示のQRコードを読み取ってください / This QR code or link is not valid. Please scan the code posted in your room.",
  geoMissing: "位置情報の利用を許可してから、もう一度送信してください（お宿にいることの確認に使います）。許可できない場合は、お部屋に掲示のQRコードからお送りください / Please allow location access and send again (we use it to confirm you are at the property). If you cannot, use the QR code posted in your room.",
  geoCoarse: "現在地を正確に取得できませんでした。窓際や屋外で、もう一度送信してください / We could not get an accurate location. Please move near a window or outside and send again.",
  stale: "別の予約のリンクが開かれたため、この画面からは送信できません。ご案内したリンクを開き直してください / Another booking's link was opened in this browser. Please open the link we sent you again.",
  geoFar: "現在地がお宿から離れています。お部屋、またはお宿のすぐ近くで送信してください / You appear to be away from the property. Please send from your room or right outside the property.",
  booking: "予約番号、または姓と到着日を入力してください / Enter your booking number, or your last name and arrival date.",
  photos: "宿泊者全員の写真を撮影してください / Please take the photos for every guest.",
  name: "宿泊者の氏名を入力してください / Please enter each guest's name.",
  passport: "国外にお住まいの方はパスポートの顔写真ページも撮影してください / Guests living outside Japan: please also photograph the passport photo page.",
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
    const message = error === "invalid qr" ? ERR.qr
      : error === "guests" || error === "selfie" ? ERR.photos
      : error === "name" || error === "residence" ? ERR.name
      : error === "passport" ? ERR.passport
      : error === "invalid payload" ? ERR.format : ERR.booking;
    return NextResponse.json({ error: message }, { status });
  }

  // 秘密が両方とも未設定なら何も受け付けない（fail-closed）。片方だけならその入口だけ readCheckinAccess が通す
  const secrets = checkinSecretsFromEnv();
  if (!secrets.room && !secrets.link) {
    console.error("[checkin-verify] CHECKIN_QR_SECRET / CHECKIN_LINK_SECRET not configured");
    return NextResponse.json({ error: ERR.closed }, { status: 503 });
  }
  const access = readCheckinAccess(req.cookies.get(CHECKIN_COOKIE)?.value, input.propertyId, secrets);
  if (!access) return NextResponse.json({ error: ERR.qr }, { status: 403 });
  // Cookie はブラウザで 1 つ。画面を開いた後に別の予約のリンク（や QR）を開くと入れ替わるので、
  // 画面の入口と予約が今の Cookie と同じときだけ受ける（違う予約に写真を付けない・Codex P2）
  const claimedVia = (body.payload as { via?: unknown } | undefined)?.via === "link" ? "link" : "qr";
  if (claimedVia !== access.via || (access.via === "link" && input.bookingRef !== access.bookingId)) {
    return NextResponse.json({ error: ERR.stale }, { status: 409 });
  }
  if (access.via === "link") {
    input.lastName = "";
    input.arrivalDate = "";
  }

  let property;
  try {
    property = (await fetchProperties()).find((p) => p.id === input.propertyId && p.active);
  } catch (e) {
    console.error("[checkin-verify] properties fetch failed:", e);
    return NextResponse.json({ error: ERR.server }, { status: 500 });
  }
  if (!property) return NextResponse.json({ error: ERR.qr }, { status: 403 });

  if (access.via === "link") {
    // 物件の位置が物件マスタに無いと距離を判定できない（撮影ページも出していない）
    if (property.lat === undefined || property.lng === undefined) return NextResponse.json({ error: ERR.qr }, { status: 403 });
    const near = checkGeoNear(input.geo, property);
    if (near !== "near") {
      // 物件の位置がずれている（郊外）・ゲストが本当に離れている、の切り分け用に距離と誤差を残す
      console.warn(`[checkin-verify] link geo rejected property=${property.id} booking=${access.bookingId} result=${near} distance=${geoDistance(input.geo, property) ?? "-"} accuracy=${input.geo.accuracy ?? "-"}`);
      const message = near === "missing" ? ERR.geoMissing : near === "coarse" ? ERR.geoCoarse : ERR.geoFar;
      return NextResponse.json({ error: message, geo: near }, { status: 422 });
    }
  }

  const receiptId = makeCheckinReceiptId();
  const receivedAt = nowJstString();
  const periodDate = input.arrivalDate || todayJstIso();
  const bookingLabel = `本人確認_${input.bookingRef || sanitizeFilePart(input.lastName || input.guests[0].name)}`;

  let photoLinks: string[];
  try {
    let folderId: string | undefined;
    try {
      folderId = await ensurePassportFolder(periodDate, property.name, bookingLabel);
    } catch (e) {
      console.error("[checkin-verify] folder ensure failed (fallback to root):", e);
    }
    photoLinks = await Promise.all(
      listCheckinPhotos(input).map((ref) => claimStagedPhoto(ref.fileId, checkinPhotoBaseName(property.id, receiptId, ref), folderId)),
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
    // RAW: ゲスト入力（姓）を含むので数式として解釈させない
    await appendSheetRows(CHECKIN_SHEET_RANGE, buildCheckinRows(input, property, receiptId, photoLinks, receivedAt, access.via), "RAW");
  } catch (e) {
    console.error("[checkin-verify] sheets append failed:", e);
    return NextResponse.json({ error: ERR.record }, { status: 500 });
  }

  return NextResponse.json({ ok: true, receiptId });
}
