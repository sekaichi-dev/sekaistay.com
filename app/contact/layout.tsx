import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    'SEKAI STAYへの民泊運営代行に関するご質問・無料相談のお問い合わせフォーム。手数料8%＋月額¥10,000/物件、初期費用は乗り換え¥100,000/物件・新規¥200,000〜。',
  openGraph: {
    title: 'お問い合わせ | SEKAI STAY',
    description: '民泊運営代行に関するご質問・無料相談はこちら。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/contact',
    siteName: 'SEKAI STAY',
  },
  alternates: { canonical: 'https://sekaistay.com/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
