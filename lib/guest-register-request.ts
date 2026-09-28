// /api/guest-register 配下で共通のリクエスト検査（許可オリジン・IP・簡易レート制限）。
import { NextRequest } from "next/server";

const ALLOWED_HOSTS = new Set(["sekaistay.com", "www.sekaistay.com", "localhost:3000", "localhost"]);

/** 許可されたオリジン（例 "https://sekaistay.com"）。本番で許可外なら null。開発中は何でも通す */
export function allowedOrigin(req: NextRequest): string | null {
  for (const header of ["origin", "referer"]) {
    const value = req.headers.get(header);
    if (!value) continue;
    try {
      const u = new URL(value);
      if (process.env.NODE_ENV !== "production" || ALLOWED_HOSTS.has(u.host.toLowerCase())) return u.origin;
      return null;
    } catch {}
  }
  return process.env.NODE_ENV !== "production" ? "http://localhost:3000" : null;
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// In-memory（インスタンス単位・低トラフィック用途には十分）
export function makeRateLimiter(limit: number, windowMs: number): (ip: string) => boolean {
  const hits = new Map<string, number[]>();
  return (ip) => {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) return false;
    recent.push(now);
    hits.set(ip, recent);
    return true;
  };
}
