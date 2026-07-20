// このページは廃止されました。診断フォームは /audit に統合し、送信後はサンキュー画面を表示します。
// SEOへの影響を抑えるため、旧 /result 自体を /audit に 301 リダイレクトさせます。
// （next.config.js の async redirects() で実施）
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '診断結果（/audit に移動しました）',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://sekaistay.com/audit' },
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
