// このページは /audit に統合されました。
// next.config.js の async redirects() で /diagnostic → /audit に 301 リダイレクトされますが、
// フォールバックとしてサーバーコンポーネントで permanent redirect します。

import { permanentRedirect } from 'next/navigation'

export default function DiagnosticPage() {
  permanentRedirect('/audit')
}
