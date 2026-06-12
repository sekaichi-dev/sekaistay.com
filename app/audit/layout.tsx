import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '無料物件診断｜SEKAI STAY',
  description:
    '3分で完了する民泊物件の無料診断レポート。現在のリスティング・売上・手数料を入力いただくだけで、稼働率と収益の改善余地をまとめた個別レポートをお届けします。移行作業は当社が対応します（初期費用¥100,000/物件）。',
  alternates: {
    canonical: 'https://sekaistay.com/audit',
  },
  openGraph: {
    title: '無料物件診断｜SEKAI STAY',
    description: '3分で完了する民泊物件の無料診断レポート。個別の改善提案をお届けします。',
    url: 'https://sekaistay.com/audit',
  },
}

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
