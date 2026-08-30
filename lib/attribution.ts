/*
 * ファーストパーティ属性クッキー (2026-07-08)
 *
 * 目的: 「utm 付きで着地 → 別ページへ寄り道 or 後日再訪 → フォーム送信」でも
 * 参照元が lead_submissions に残るように、着地時の属性を 90 日クッキーに保存する。
 * (Meta の _fbp/_fbc と同じ 90 日。自前計測はクッキー期限に依存しないが、
 *  送信時に URL から消えている属性の復元用として保持する)
 *
 * ポリシー:
 * - last-touch 上書き: utm_* / gclid / fbclid のいずれかを持つ訪問が来るたび上書き
 * - 無属性の訪問では既存クッキーを消さない (直近の有属性タッチを保持)
 * - クッキーが無い状態の無属性着地では referrer / landingUrl だけの薄い記録を保存
 *   (オーガニック流入の参照元を最低限残す)
 * - 送信側は「現 URL のパラメータ優先 → 無い項目だけクッキーから復元」
 */

export type StoredAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingUrl?: string;
  referrer?: string;
  /** 保存時刻 (ISO)。デバッグ・将来の first/last 分析用 */
  ts?: string;
};

const COOKIE_NAME = "ss_attr";
const MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 日

function clip(v: string | null | undefined, max: number): string | undefined {
  if (!v) return undefined;
  const t = v.trim().slice(0, max);
  return t || undefined;
}

function readCookie(): StoredAttribution | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!m) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(m[1]));
    return parsed && typeof parsed === "object" ? (parsed as StoredAttribution) : null;
  } catch {
    return null;
  }
}

// encodeURIComponent 後のバイト長がブラウザ上限 (4KB) に近いと無言で破棄される。
// 超過時は landingUrl → referrer の順に落として utm/gclid を最優先で残す。
const COOKIE_VALUE_MAX = 3800;

function writeCookie(attr: StoredAttribution): void {
  if (typeof document === "undefined") return;
  try {
    let payload: StoredAttribution = attr;
    let value = encodeURIComponent(JSON.stringify(payload));
    if (value.length > COOKIE_VALUE_MAX) {
      payload = { ...payload, landingUrl: undefined };
      value = encodeURIComponent(JSON.stringify(payload));
    }
    if (value.length > COOKIE_VALUE_MAX) {
      payload = { ...payload, referrer: undefined };
      value = encodeURIComponent(JSON.stringify(payload));
    }
    if (value.length > COOKIE_VALUE_MAX) return; // それでも超過なら保存断念 (従来どおり URL のみ計測)
    document.cookie = `${COOKIE_NAME}=${value}; max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax; Secure`;
  } catch {
    // クッキー無効環境では静かに諦める (従来どおり現 URL のみの計測になる)
  }
}

/**
 * 着地/遷移時に呼ぶ。utm_* / gclid / fbclid があれば last-touch で上書き保存。
 * AnalyticsRouteTracker (全ページ常駐) から pathname 変化ごとに呼ばれる。
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => clip(params.get(k), 200);

  const touch: StoredAttribution = {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmContent: get("utm_content"),
    utmTerm: get("utm_term"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
  };
  const hasSignal = Object.values(touch).some(Boolean);

  if (hasSignal) {
    writeCookie({
      ...touch,
      landingUrl: clip(window.location.href, 1000),
      referrer: clip(document.referrer, 1000),
      ts: new Date().toISOString(),
    });
    return;
  }

  // 無属性着地: 既存タッチは保持。クッキーが全く無い時だけ referrer ベースの薄い記録
  if (!readCookie() && document.referrer) {
    try {
      const refHost = new URL(document.referrer).host;
      if (refHost && refHost !== window.location.host) {
        writeCookie({
          landingUrl: clip(window.location.href, 1000),
          referrer: clip(document.referrer, 1000),
          ts: new Date().toISOString(),
        });
      }
    } catch {
      // referrer が URL として壊れている場合は何もしない
    }
  }
}

/**
 * フォーム送信側で呼ぶ。「現 URL 優先 → 欠けた項目だけクッキーから復元」した属性を返す。
 * 返り値のキーは /api/report-requests/submit の payload キーに一致。
 */
export function resolveAttribution(): StoredAttribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => clip(params.get(k), 200);
  const stored = readCookie() || {};

  const fromUrl: StoredAttribution = {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmContent: get("utm_content"),
    utmTerm: get("utm_term"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
  };
  const urlHasSignal = Object.values(fromUrl).some(Boolean);

  return {
    // URL に何か 1 つでも属性があれば URL のセットを優先 (キャンペーン混線防止で項目単位に混ぜない)
    ...(urlHasSignal ? fromUrl : {
      utmSource: stored.utmSource,
      utmMedium: stored.utmMedium,
      utmCampaign: stored.utmCampaign,
      utmContent: stored.utmContent,
      utmTerm: stored.utmTerm,
      gclid: stored.gclid,
      fbclid: stored.fbclid,
    }),
    landingUrl:
      clip(params.get("landing_url"), 1000) ||
      (urlHasSignal ? clip(window.location.href, 1000) : stored.landingUrl) ||
      clip(window.location.href, 1000),
    // クッキー復元経路では保存時の referrer を優先 (現ページの referrer は内部遷移で上書きされているため)
    referrer: urlHasSignal
      ? clip(document.referrer, 1000) || stored.referrer
      : stored.referrer || clip(document.referrer, 1000),
  };
}
