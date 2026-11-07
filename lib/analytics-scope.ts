// 解析・広告タグ（GA・Google Ads・Yahoo・Meta・X・Clarity）を載せないページ。
// /lease 配下はマンスリー契約の同意フォームで、氏名・住所・身分証を扱う（鍵つきリンクの入口もここ）ので、
// 外部のタグに URL・画面の録画・入力を渡さない。
export function isAnalyticsExcludedPath(pathname: string | null | undefined): boolean {
  const p = pathname || "";
  return p === "/lease" || p.startsWith("/lease/");
}
