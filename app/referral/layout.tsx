import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '紹介制度', // 親の template（%s | SEKAI STAY）で「紹介制度 | SEKAI STAY」になる
  description: '紹介制度の受付は終了しました。',
  robots: { index: false, follow: false },
}

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
