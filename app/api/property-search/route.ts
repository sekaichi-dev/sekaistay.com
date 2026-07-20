/* ─────────────────────────────────────────────────────────────
 * /api/property-search — Airbnb 物件検索（Brave Search API 経由）
 *
 * Brave Search の `site:airbnb.jp/rooms <query>` で Airbnb 物件 URL と
 * snippet タイトルを取得。Vercel から直接 Airbnb を叩くと anti-bot で
 * 弾かれる + 吉蔵側 proxy 依存を切るため、検索エンジンを経由する。
 *
 * 結果は同一インスタンスのみ有効な Map LRU で 1h キャッシュ
 * （debounce 込みでも同一クエリが頻発するため有効）。
 *
 * 失敗時は空配列で返却（UI は手動 URL 貼付けに fallback）。
 * ───────────────────────────────────────────────────────────── */

import { NextResponse } from "next/server";

const BRAVE_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";
const BRAVE_TIMEOUT_MS = 6_000;
const MAX_RESULTS = 8;
const CANDIDATE_POOL = 12; // validate up to N candidates to backfill 404 drops
const LISTING_VALIDATE_TIMEOUT_MS = 3_000;
const LISTING_FETCH_MAX_BYTES = 30_000; // stream until </title>; cap to be safe
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 200;
const LIVENESS_TTL_MS = 24 * 60 * 60 * 1000;
const LIVENESS_MAX_ENTRIES = 1_000;

export const runtime = "nodejs";

type Result = { source: "airbnb" | "other"; url: string; title?: string };
type CacheEntry = { results: Result[]; expiresAt: number };
const cache = new Map<string, CacheEntry>();

type LivenessEntry = { live: boolean; expiresAt: number };
const livenessCache = new Map<string, LivenessEntry>();

function cacheGet(key: string): Result[] | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  cache.delete(key);
  cache.set(key, hit);
  return hit.results;
}

function cacheSet(key: string, results: Result[]) {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { results, expiresAt: Date.now() + CACHE_TTL_MS });
}

function normalizeAirbnbUrl(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    const host = u.hostname.toLowerCase();
    const isAirbnb =
      /(^|\.)airbnb\.(com|jp|co\.jp)$/.test(host) ||
      host === "abnb.me" ||
      host.startsWith("m.airbnb.");
    if (!isAirbnb) return null;
    const m = u.pathname.match(/\/rooms\/(\d+)/);
    if (!m) return null;
    return `https://www.airbnb.jp/rooms/${m[1]}`;
  } catch {
    return null;
  }
}

function stripBraveHighlight(title: string): string {
  // Brave wraps matched terms in <strong>…</strong>; strip for plain title.
  return title.replace(/<\/?[a-zA-Z][^>]*>/g, "").trim();
}

function livenessGet(url: string): boolean | null {
  const hit = livenessCache.get(url);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    livenessCache.delete(url);
    return null;
  }
  return hit.live;
}

function livenessSet(url: string, live: boolean): void {
  if (livenessCache.size >= LIVENESS_MAX_ENTRIES) {
    const oldest = livenessCache.keys().next().value;
    if (oldest !== undefined) livenessCache.delete(oldest);
  }
  livenessCache.set(url, { live, expiresAt: Date.now() + LIVENESS_TTL_MS });
}

// Airbnb は削除済み listing でも HTTP 200 を返す SPA。HEAD/status では判別できないので
// 本文先頭〜<title>までストリーム読みし、タイトルに 404/Page Not Found 系の文言が
// 含まれる場合のみ "dead" 判定する。判別不能 (timeout・throw) は fail-open で live 扱い
// にして表示機会を逃さない（最悪、これまで通り 404 URL を保存するだけ・現状回帰）。
async function isLiveListing(url: string, timeoutMs: number): Promise<boolean> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html",
        "Accept-Language": "ja-JP,ja;q=0.9,en;q=0.8",
      },
      cache: "no-store",
      signal: ac.signal,
      redirect: "follow",
    });
    if (!res.ok) return false;
    if (!res.body) return true; // can't inspect body → don't filter
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let total = 0;
    try {
      while (total < LISTING_FETCH_MAX_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        buf += decoder.decode(value, { stream: true });
        if (buf.includes("</title>")) break;
      }
    } finally {
      try { await reader.cancel(); } catch {}
    }
    const m = buf.match(/<title>([^<]*)<\/title>/i);
    const title = (m ? m[1] : "").toLowerCase();
    if (!title) return true; // no title in chunk → fail-open
    if (title.includes("404")) return false;
    if (title.includes("page not found")) return false;
    if (title.includes("not found")) return false;
    if (title.includes("ページが見つかりません")) return false;
    return true;
  } catch {
    return true; // timeout / network error → fail-open
  } finally {
    clearTimeout(timer);
  }
}

async function searchBrave(query: string): Promise<Result[]> {
  const apiKey = (process.env.BRAVE_SEARCH_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("BRAVE_SEARCH_API_KEY not configured");
  }
  const params = new URLSearchParams({
    q: `site:airbnb.jp/rooms ${query}`,
    // Brave API の count 上限は 20。CANDIDATE_POOL=12 件 validate するための overfetch (上限張り付け)
    count: "20",
    country: "JP",
    search_lang: "jp",
    ui_lang: "ja-JP",
    safesearch: "off",
  });
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), BRAVE_TIMEOUT_MS);
  try {
    const res = await fetch(`${BRAVE_ENDPOINT}?${params.toString()}`, {
      headers: {
        "X-Subscription-Token": apiKey,
        Accept: "application/json",
        "Accept-Encoding": "gzip",
      },
      cache: "no-store",
      signal: ac.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Brave HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    const data = (await res.json()) as {
      web?: { results?: Array<{ url?: string; title?: string }> };
    };
    const seen = new Set<string>();
    const candidates: Result[] = [];
    for (const item of data.web?.results ?? []) {
      const normalized = item.url ? normalizeAirbnbUrl(item.url) : null;
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      candidates.push({
        source: "airbnb",
        url: normalized,
        title: item.title ? stripBraveHighlight(item.title) : undefined,
      });
      if (candidates.length >= CANDIDATE_POOL) break;
    }
    // Liveness validation を並列実行。Brave のインデックスは古い/削除済み listing も
    // 拾うため、保存される URL が 404 にならないようここで弾く（楊維倫 lead 2026-05-14）。
    const validations = await Promise.all(
      candidates.map(async (c) => {
        const cached = livenessGet(c.url);
        if (cached !== null) return { c, live: cached };
        const live = await isLiveListing(c.url, LISTING_VALIDATE_TIMEOUT_MS);
        livenessSet(c.url, live);
        return { c, live };
      }),
    );
    const out: Result[] = [];
    for (const { c, live } of validations) {
      if (!live) continue;
      out.push(c);
      if (out.length >= MAX_RESULTS) break;
    }
    return out;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return NextResponse.json({ ok: true, results: [] }, { status: 200 });
  }
  if (q.length > 100) {
    return NextResponse.json({ ok: false, error: "query too long" }, { status: 400 });
  }

  const cached = cacheGet(q);
  if (cached) {
    return NextResponse.json(
      { ok: true, results: cached, cached: true },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const results = await searchBrave(q);
    cacheSet(q, results);
    return NextResponse.json(
      { ok: true, results },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "search failed";
    console.error("[property-search] failed:", msg);
    return NextResponse.json(
      { ok: true, results: [], error: msg },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
}
