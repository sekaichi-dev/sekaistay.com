import type { Metadata } from 'next'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og-image'

export const metadata: Metadata = {
  title: '採用情報',
  description:
    'SEKAI STAY（株式会社セカイチ）の採用情報。運営オペレーションと事業開発 / オーナーサクセスを募集しています。民泊運用を仕組みで変えるチームで働きませんか。',
  openGraph: {
    title: '採用情報 | SEKAI STAY',
    description:
      '民泊運用代行 SEKAI STAY の採用情報。運営オペレーション／事業開発を募集中。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/recruit',
    siteName: 'SEKAI STAY',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: '採用情報 | SEKAI STAY',
    description: '民泊運用を仕組みで変えるチームで、一緒に働く仲間を募集しています。',
    images: [OG_IMAGE_URL],
  },
  alternates: { canonical: 'https://sekaistay.com/recruit' },
}

export default function RecruitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
