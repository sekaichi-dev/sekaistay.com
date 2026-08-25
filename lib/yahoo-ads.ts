/* ─────────────────────────────────────────────────────────────
 * Yahoo!広告(検索広告) コンバージョン計測
 *
 * ベースとなるサイトジェネラルタグは app/layout.tsx の <head> 最上部で
 * 全ページに読み込み済み（window.ytag を同期定義 → ytag.js は async ロード）。
 *
 * 本サイトのお問い合わせ／資料請求フォームは送信成功後に外部の予約 URL
 * (timerex.net) へ遷移するため、自社ドメイン内に「送信完了ページ」が存在しない。
 * そのため gtag('generate_lead') / fbq('Lead') と同じ送信成功時点で
 * yss_conversion を発火させ、送信完了ページ設置と同等の計測を行う。
 * ───────────────────────────────────────────────────────────── */

const YAHOO_CONVERSION_ID = '1001409156'
const YAHOO_CONVERSION_LABEL = 'wI57CMjr_OYcEK2ukr9E'

export function fireYahooConversion(): void {
  if (typeof window === 'undefined') return
  try {
    // @ts-ignore — ytag はサイトジェネラルタグが定義
    window.ytag?.({
      type: 'yss_conversion',
      config: {
        yahoo_conversion_id: YAHOO_CONVERSION_ID,
        yahoo_conversion_label: YAHOO_CONVERSION_LABEL,
        yahoo_conversion_value: '0',
      },
    })
  } catch {}
}
