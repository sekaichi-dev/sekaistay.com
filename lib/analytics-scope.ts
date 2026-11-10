// 解析・広告タグ（GA・Google Ads・Yahoo・Meta・X・Clarity）を載せないページ。
// /lease 配下はマンスリー契約の同意フォームで、氏名・住所・身分証を扱う（鍵つきリンクの入口もここ）ので、
// 外部のタグに URL・画面の録画・入力を渡さない。
// /guest-register（宿泊者名簿）も旅券・顔写真・住所を扱うので同じ扱い（2026-11-10 渋谷区保健所の再検査対応）。
const EXCLUDED_ROOTS = ["/lease", "/guest-register"];

export function isAnalyticsExcludedPath(pathname: string | null | undefined): boolean {
  const p = pathname || "";
  return EXCLUDED_ROOTS.some((root) => p === root || p.startsWith(`${root}/`));
}
