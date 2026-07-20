// pathname から GA4 page_view 等に付与する lp_variant を解決する。
//
// 背景: ダッシュボード(sekaichi-dashboard /lp-analytics)の variant 別比較は
// GA4 の page_view を customEvent:lp_variant で集計している。page_view に
// lp_variant が乗っていないと全件 "(not set)" になるため、ここで path から一意に解決する。
//
// LP(A/B テスト対象)は /switch 系の3つ。/audit・/contact は HP の無料診断/相談ページ。
// 返り値は各ページが EngagementTracker / PageViewTracker に渡すハードコード値と一致させること。
// /switch/_archive/* は Next.js の private folder(_ 始まり)で非ルーティングのため対象外。
//
// ⚠️ 同じ分岐が app/layout.tsx のインラインスクリプト sekaiLpVariant() にも複製されている
// (初回 page_view を config 時に発火させるため・import 不可)。片方を変えたら両方直すこと。
export function resolveLpVariant(pathname: string): string {
  const p = pathname.replace(/\/+$/, ""); // 末尾スラッシュ除去

  if (p === "/switch/founder") return "switch-founder";
  if (p === "/switch/portal") return "switch-portal";
  if (p === "/switch") return "switch";

  // HP の診断/相談ページ(LP ではないが lead 計測対象)
  if (p === "/audit") return "audit";
  if (p === "/contact") return "contact";

  // その他 HP(/, /blog, /about 等)。ダッシュボードは ^/(switch|audit) のみ集計するので
  // ここは計測上ノイズにならない。
  return "direct";
}
