// ゲストの端末で起きた失敗（写真アップロード・送信）の記録。ゲストが OTA で知らせてくれない限り
// 誰にも見えなかった失敗を、Vercel ログと Slack（設定時）で見えるようにする。
import { NextRequest, NextResponse } from "next/server";
import { allowedOrigin, getClientIp, makeRateLimiter } from "@/lib/guest-register-request";
import { postToSlack } from "@/lib/slack-notify";

export const runtime = "nodejs";

const checkRate = makeRateLimiter(30, 60 * 60 * 1000);
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!checkRate(getClientIp(req))) return NextResponse.json({ ok: false }, { status: 429 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const line = [
    `stage=${clip(body.stage, 40)}`,
    `message=${clip(body.message, 300)}`,
    `detail=${clip(body.detail, 300)}`,
    `booking=${clip(body.bookingRef, 12)}`,
    `ua=${req.headers.get("user-agent") || ""}`,
  ].join(" | ");
  console.error("[guest-register] client failure:", line);
  const channel = (process.env.SLACK_GUEST_REGISTER_ALERT_CHANNEL_ID || "").trim();
  if (channel) {
    const r = await postToSlack(channel, { text: `宿泊者名簿フォームでゲスト側の失敗\n${line}` }).catch((e) => ({ ok: false, error: String(e) }));
    if (!r.ok) console.error("[guest-register] telemetry slack failed:", r.error);
  }
  return NextResponse.json({ ok: true });
}
