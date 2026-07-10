import { NextRequest, NextResponse } from "next/server";
import {
  parseRegisterInput, validateGuests, needsPassport, makeGroupId, nowJstString,
  buildMinpakuRows, buildRyokanRows, appendRows, uploadPassportPhoto, ensurePassportFolder,
  fetchProperties, sanitizeFilePart, MAX_PHOTO_BYTES,
} from "@/lib/guest-register";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_HOSTS = new Set(["sekaistay.com", "www.sekaistay.com", "localhost:3000", "localhost"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

function getOriginHost(req: NextRequest): string | null {
  for (const header of ["origin", "referer"]) {
    const value = req.headers.get(header);
    if (value) {
      try {
        return new URL(value).host.toLowerCase();
      } catch {}
    }
  }
  return null;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// In-memory rate limiter（インスタンス単位・低トラフィック用途には十分）
const rateMap = new Map<string, number[]>();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 10;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const recent = (rateMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateMap.set(ip, recent);
  return true;
}

export async function POST(req: NextRequest) {
  const host = getOriginHost(req);
  if (process.env.NODE_ENV === "production" && (!host || !ALLOWED_HOSTS.has(host))) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  if (!checkRate(getClientIp(req))) {
    return NextResponse.json(
      { error: "送信回数の上限に達しました。時間をおいてお試しください / Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です / Invalid request" }, { status: 400 });
  }

  // honeypot: bot が埋めたら成功を装って破棄
  if (typeof form.get("website") === "string" && (form.get("website") as string).length > 0) {
    return NextResponse.json({ ok: true, receiptId: makeGroupId() });
  }

  let payload: unknown;
  try {
    payload = JSON.parse((form.get("payload") as string) || "");
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です / Invalid request" }, { status: 400 });
  }

  const { input, error: parseError } = parseRegisterInput(payload);
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

  // 旅券写真の検証（国内住所なし外国籍ゲストは必須・その他のゲストも任意で添付可）
  const photos: ({ buffer: Buffer; mime: string } | null)[] = [];
  for (let i = 0; i < input.guests.length; i++) {
    const guest = input.guests[i];
    const file = form.get(`photo_${i}`);
    const who = `宿泊者${i + 1} / Guest ${i + 1}`;
    if (!(file instanceof File) || file.size === 0) {
      if (needsPassport(guest)) {
        return NextResponse.json(
          { error: `${who}: パスポート写真を添付してください / Passport photo is required` },
          { status: 400 },
        );
      }
      photos.push(null);
      continue;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: `${who}: 写真のサイズが大きすぎます（4MBまで）/ Photo too large (max 4MB)` },
        { status: 400 },
      );
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `${who}: 写真は JPEG / PNG 形式で添付してください / Photo must be JPEG or PNG` },
        { status: 400 },
      );
    }
    photos.push({ buffer: Buffer.from(await file.arrayBuffer()), mime: file.type });
  }

  const groupId = makeGroupId();
  const receivedAt = nowJstString();

  let photoLinks: (string | null)[];
  try {
    // 保管先: 報告期間（2ヶ月区切り）/ 物件 / 予約（受付ID_代表者）。フォルダ作成に失敗しても登録は止めない。
    let folderId: string | undefined;
    if (photos.some(Boolean)) {
      try {
        folderId = await ensurePassportFolder(input.checkin, property.name, `${groupId}_${sanitizeFilePart(input.guests[0].name)}`);
      } catch (e) {
        console.error("[guest-register] passport folder ensure failed (fallback to root):", e);
      }
    }
    photoLinks = await Promise.all(
      photos.map((photo, i) => {
        if (!photo) return Promise.resolve(null);
        const ext = { "image/png": "png", "image/webp": "webp", "image/heic": "heic", "image/heif": "heif" }[photo.mime] || "jpg";
        const filename = `${property.id}_${input.checkin.replaceAll("-", "")}_${sanitizeFilePart(input.guests[i].name)}_${groupId}.${ext}`;
        return uploadPassportPhoto(photo.buffer, photo.mime, filename, folderId);
      }),
    );
  } catch (e) {
    console.error("[guest-register] drive upload failed:", e);
    return NextResponse.json(
      { error: "写真のアップロードに失敗しました。時間をおいてお試しください / Photo upload failed. Please try again." },
      { status: 500 },
    );
  }

  try {
    const rows = property.type === "民泊"
      ? buildMinpakuRows(input, property, groupId, photoLinks, receivedAt)
      : buildRyokanRows(input, property, groupId, photoLinks, receivedAt);
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
