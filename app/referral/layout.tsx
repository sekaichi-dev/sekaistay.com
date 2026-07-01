import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '紹介者登録 | SEKAI STAY',
  description: 'SEKAI STAY に物件オーナーをご紹介いただける方の登録フォーム。紹介コードを発行します。',
  robots: { index: false, follow: false },
}

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
