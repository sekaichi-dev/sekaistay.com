import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

const ALLOWED_VARIANTS = new Set([
  "switch",
  "switch-portal",
  "switch-founder",
  // legacy (archived but accept submissions if any preview links remain):
  "switch-simple",
  "switch-kotekote",
]);

const BOT_PATTERNS = /(bot|crawler|spider|preview|prerender|headless|lighthouse|gtmetrix|pagespeed|wget|curl|axios)/i;

function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v ? v.slice(0, max) : null;
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const variant = clip(body.lpVariant, 50);
  if (!variant || !ALLOWED_VARIANTS.has(variant)) {
    return NextResponse.json({ error: "invalid variant" }, { status: 400 });
  }

  const userAgent = req.headers.get("user-agent") || "";
  const isBot = BOT_PATTERNS.test(userAgent);

  // visitor_hash for dedup: ip + ua + variant + day → same visit on same day stays one row
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "0.0.0.0";
  const day = new Date().toISOString().slice(0, 10);
  const visitorHash = createHash("sha256").update(`${ip}|${userAgent}|${variant}|${day}`).digest("hex").slice(0, 32);

  const supabase = getSupabaseAdmin();

  // dedup: skip if already seen today
  const { data: existing } = await supabase
    .from("lp_page_views")
    .select("id")
    .eq("visitor_hash", visitorHash)
    .gte("created_at", `${day}T00:00:00Z`)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ status: "deduped" }, { status: 200 });
  }

  const { error } = await supabase.from("lp_page_views").insert({
    lp_variant: variant,
    visitor_hash: visitorHash,
    user_agent: userAgent.slice(0, 500),
    referrer: clip(body.referrer, 1000),
    utm_source: clip(body.utmSource, 200),
    utm_medium: clip(body.utmMedium, 200),
    utm_campaign: clip(body.utmCampaign, 200),
    utm_content: clip(body.utmContent, 200),
    bot: isBot,
  });

  if (error) {
    console.error("[page-view] insert failed:", error.message);
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  return NextResponse.json({ status: "tracked" }, { status: 200 });
}
