// このページは /audit に統合済み。layout は残骸だが残しておいても動作に影響なし。
// canonicalは /audit に向ける。

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '物件診断（/audit へ移動しました）',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://sekaistay.com/audit' },
}

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
