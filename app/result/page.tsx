// このページは廃止されました。診断は /audit に統合され、送信後は同ページ内でサンキュー画面を表示します。
// next.config.js の async redirects() で /result → /audit に 301 リダイレクトされますが、
// フォールバックとしてサーバーコンポーネントで permanent redirect します。

import { permanentRedirect } from 'next/navigation'

export default function ResultPage() {
  permanentRedirect('/audit')
}
