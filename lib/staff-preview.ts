// 運営プレビュー（ゲストと同じ画面を送信不可で見る）の判定。名簿フォームは ?preview=1 のときだけ。
// 値が "1" ちょうどのときだけ true（"true"・"0"・空・複数指定の 2 つ目などは通常の画面のまま）。

export function isStaffPreview(params: { get(name: string): string | null } | null | undefined): boolean {
  if (!params) return false;
  return params.get("preview") === "1";
}
