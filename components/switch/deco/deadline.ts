/**
 * 72h カウントダウンの共通 deadline
 * Hero帯 / FinalCTA の2箇所で同じ値を参照し、バラつきを避ける。
 *
 * ページ初回マウント時刻から +72h を deadline とする。
 * SSR/CSR 間で値がズレないよう「各ユーザーのページロード時刻基準」で統一。
 */
export function getDeadline72h(now = Date.now()): number {
  return now + 72 * 60 * 60 * 1000;
}
