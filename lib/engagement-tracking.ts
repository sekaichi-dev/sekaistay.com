/**
 * Engagement tracking utilities
 *
 * LP 改善データ収集のため、GA4 にカスタムイベントを送信:
 * - scroll_depth: 25/50/75/100% スクロール時
 * - section_view: 各 LP セクションが viewport に入った時
 * - cta_click: CTA ボタン押下時
 *
 * すべてのイベントは `lp_variant` を含めて送信し、GA4 で variant 別分析を可能にする。
 *
 * dedupe: sessionStorage を使い、同一セッション内の重複送信を防ぐ。
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

/** GA4 + dataLayer に共通でイベント送信。fail-silent. */
export function trackEvent(name: string, params: EventParams): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {
    // fail silent
  }
}

/** sessionStorage ベースの一回限りフラグ. true を返したら未送信、false なら送信済み. */
export function checkAndMarkSent(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return false;
  }
}

/** スクロール深度の閾値（パーセント） */
export const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

/** 現在のスクロール深度を計算（0-100）. */
export function getScrollDepthPercent(): number {
  if (typeof window === "undefined" || typeof document === "undefined") return 0;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 100;
  const scrolled = window.scrollY;
  return Math.min(100, Math.round((scrolled / docHeight) * 100));
}
