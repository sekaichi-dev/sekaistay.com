import { NextRequest, NextResponse } from "next/server";
import {
  parseRegisterInput, validateGuests, needsPassport, makeGroupId, nowJstString,
  buildMinpakuRows, buildRyokanRows, appendRows, claimStagedPhoto, ensurePassportFolder,
  fetchProperties, sanitizeFilePart, StagedPhotoError,
} from "@/lib/guest-register";
import { allowedOrigin, getClientIp, makeRateLimiter } from "@/lib/guest-register-request";

// 写真はここには来ない。ブラウザが /photo-session の URL へ直接置いた Drive ファイル ID だけを受け取り、
// 検証して名簿フォルダへ移す（送信本体は小さな JSON なので Vercel の 4.5MB 上限に当たらない）。
export const runtime = "nodejs";
export const maxDuration = 60;

const checkRate = makeRateLimiter(10, 60 * 60 * 1000);

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  if (!checkRate(getClientIp(req))) {
    return NextResponse.json(
      { error: "送信回数の上限に達しました。時間をおいてお試しください / Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です / Invalid request" }, { status: 400 });
  }

  // honeypot: bot が埋めたら成功を装って破棄
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true, receiptId: makeGroupId() });
  }

  const { input, error: parseError } = parseRegisterInput(body.payload);
  if (!input) return NextResponse.json({ error: parseError }, { status: 400 });

  let property;
  try {
    const properties = await fetchProperties();
    property = properties.find((p) => p.id === input.propertyId && p.active);
  } catch (e) {
    console.error("[guest-register] properties fetch failed:", e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。時間をおいてお試しください / Server error. Please try again later." },
      { status: 500 },
    );
  }
  if (!property) {
    return NextResponse.json({ error: "宿泊施設を選択してください / Please select the property" }, { status: 400 });
  }
  if (property.type === "民泊" && !property.licenseNo) {
    console.error(`[guest-register] property ${property.id} is 民泊 but has no 届出番号`);
    return NextResponse.json(
      { error: "この施設は現在受付できません。運営までご連絡ください / This property is not accepting registrations." },
      { status: 400 },
    );
  }

  const guestError = validateGuests(input, property.type);
  if (guestError) return NextResponse.json({ error: guestError }, { status: 400 });

  // 写真の有無（旅券: 国内住所なしは必須・顔写真: 全員必須 2026-07-24）
  for (let i = 0; i < input.guests.length; i++) {
    const guest = input.guests[i];
    const who = `宿泊者${i + 1} / Guest ${i + 1}`;
    if (needsPassport(guest) && !guest.photoFileId) {
      return NextResponse.json({ error: `${who}: パスポート写真を添付してください / Passport photo is required` }, { status: 400 });
    }
    if (!guest.facePhotoFileId) {
      return NextResponse.json({ error: `${who}: 顔写真を添付してください / Face photo is required` }, { status: 400 });
    }
  }

  const groupId = makeGroupId();
  const receivedAt = nowJstString();
  const datePart = input.checkin.replaceAll("-", "");

  let photoLinks: (string | null)[];
  let facePhotoLinks: (string | null)[];
  try {
    // 保管先: 報告期間（2ヶ月区切り）/ 物件 / 予約（受付ID_代表者）。フォルダ作成に失敗しても登録は止めない。
    let folderId: string | undefined;
    try {
      folderId = await ensurePassportFolder(input.checkin, property.name, `${groupId}_${sanitizeFilePart(input.guests[0].name)}`);
    } catch (e) {
      console.error("[guest-register] passport folder ensure failed (fallback to root):", e);
    }
    [photoLinks, facePhotoLinks] = await Promise.all([
      Promise.all(input.guests.map((g, i) => {
        if (!needsPassport(g) || !g.photoFileId) return Promise.resolve(null);
        return claimStagedPhoto(g.photoFileId, `${property.id}_${datePart}_${sanitizeFilePart(g.name)}_${groupId}`, folderId);
      })),
      Promise.all(input.guests.map((g) =>
        claimStagedPhoto(g.facePhotoFileId, `顔写真_${property.id}_${datePart}_${sanitizeFilePart(g.name)}_${groupId}`, folderId),
      )),
    ]);
  } catch (e) {
    if (e instanceof StagedPhotoError) {
      console.error("[guest-register] staged photo rejected:", e.message);
      return NextResponse.json(
        { error: "写真を読み込めませんでした。写真をもう一度添付してください / We could not read a photo. Please attach it again." },
        { status: 400 },
      );
    }
    console.error("[guest-register] drive claim failed:", e);
    return NextResponse.json(
      { error: "写真のアップロードに失敗しました。時間をおいてお試しください / Photo upload failed. Please try again." },
      { status: 500 },
    );
  }

  try {
    const rows = property.type === "民泊"
      ? buildMinpakuRows(input, property, groupId, photoLinks, facePhotoLinks, receivedAt)
      : buildRyokanRows(input, property, groupId, photoLinks, facePhotoLinks, receivedAt);
    await appendRows(property.type === "民泊" ? "民泊用" : "旅館業用", rows);
  } catch (e) {
    console.error("[guest-register] sheets append failed:", e);
    return NextResponse.json(
      { error: "登録に失敗しました。時間をおいてお試しください / Registration failed. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, receiptId: groupId });
}
