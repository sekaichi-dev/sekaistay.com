import { NextRequest, NextResponse } from "next/server";
import { insertReferrer } from "@/lib/referrers";
import { notifyReferralRegistered } from "@/lib/slack-notify";
import { classifyKind } from "@/lib/test-classifier";

export const runtime = "nodejs";

const TERMS_VERSION = "2026-07-01";

const ALLOWED_HOSTS = new Set([
  "sekaistay.com",
  "www.sekaistay.com",
  "localhost:3000",
  "localhost",
]);

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

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

function trim(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function originHost(req: NextRequest): string | null {
  for (const h of [req.headers.get("origin"), req.headers.get("referer")]) {
    if (h) { try { return new URL(h).host.toLowerCase(); } catch {} }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const host = originHost(req);
  if (process.env.NODE_ENV === "production" && (!host || !ALLOWED_HOSTS.has(host))) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0].trim()) || "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "登録の上限に達しました。時間をおいてお試しください。" }, { status: 429 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  // honeypot: 隠しフィールド website が埋まっていたら bot として静かに成功扱い
  if (trim(body.website, 100)) {
    return NextResponse.json({ code: "SS-000000" }, { status: 201 });
  }

  const name = trim(body.name, 100);
  const email = trim(body.email, 200);
  const phone = trim(body.phone, 50);
  const bankName = trim(body.bankName, 100);
  const branchName = trim(body.branchName, 100);
  const accountType = trim(body.accountType, 10);
  const accountNumber = trim(body.accountNumber, 20);
  const accountHolder = trim(body.accountHolder, 100);
  const accountHolderKana = trim(body.accountHolderKana, 100);
  const termsAgreed = body.termsAgreed === true;

  if (!name) return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email))
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "電話番号を入力してください" }, { status: 400 });
  if (!bankName || !branchName || !accountNumber || !accountHolder || !accountHolderKana)
    return NextResponse.json({ error: "振込先情報をすべて入力してください" }, { status: 400 });
  if (accountType !== "普通" && accountType !== "当座")
    return NextResponse.json({ error: "口座種別を選択してください" }, { status: 400 });
  if (!/^[0-9]{1,10}$/.test(accountNumber))
    return NextResponse.json({ error: "口座番号は数字で入力してください" }, { status: 400 });
  if (!termsAgreed)
    return NextResponse.json({ error: "規約への同意が必要です" }, { status: 400 });

  const kind = classifyKind(name, email);
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) || undefined;

  try {
    const { row, created } = await insertReferrer({
      name, email, phone,
      isOwner: body.isOwner === true,
      bankName,
      bankCode: trim(body.bankCode, 10) || undefined,
      branchName,
      branchCode: trim(body.branchCode, 10) || undefined,
      accountType,
      accountNumber, accountHolder, accountHolderKana,
      termsVersion: TERMS_VERSION,
      kind,
      clientIp: ip,
      userAgent,
    });

    if (created && kind === "real") {
      await notifyReferralRegistered({
        code: row.code, name: row.name, email: row.email, phone: row.phone, isOwner: row.is_owner,
      }).catch(() => {});
    }
    return NextResponse.json({ code: row.code }, { status: 201 });
  } catch (err: any) {
    console.error("[referral/register] failed:", err?.message || err);
    return NextResponse.json({ error: "登録に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
  }
}
