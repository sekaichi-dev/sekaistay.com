import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP, Archivo, Space_Mono, Yuji_Boku } from 'next/font/google'
import { Suspense } from 'react'
import AnalyticsRouteTracker from '@/components/AnalyticsRouteTracker'
import { AnalyticsHeadTags, MetaPixelNoscript } from '@/components/AnalyticsTags'
import AuditModalProvider from '@/components/audit/AuditModalProvider'
import './globals.css'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og-image'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF9F4' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
}

// SEKAI STAY ブランドガイドライン準拠:
//   日本語: Noto Sans JP / 英語: Helvetica Neue
// LP と HP のフォントウェイト整合のため 300/600 も読み込み
// （font-light/font-semibold が Helvetica Neue にフォールバックしないように）
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
  preload: true,
  adjustFontFallback: true,
})

// DESIGN.md 準拠の個性的ラテン書体:
//   Archivo    = 英見出し・数字・統計（“格”を出す洗練グロテスク。旧 Space Grotesk から変更）
//   Space Mono = 英ラベル・セクション番号（大文字トラッキングの編集タグ）
const grotesk = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-grotesk',
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-space-mono',
})
// 筆書道スローガン用（sense-trust 参考の導入スローガン）
const yujiBoku = Yuji_Boku({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-brush',
})

const SITE_URL = 'https://sekaistay.com'
const GA_MEASUREMENT_ID = 'G-B7M920RCGR'
const META_PIXEL_ID = '1658477098524563'

// 広告タグ（Vercel env 経由で本番稼働）
//   NEXT_PUBLIC_GOOGLE_ADS_ID:    AW-XXXXXXXXXX 形式（Google Ads コンバージョン ID）
//   NEXT_PUBLIC_CLARITY_PROJECT_ID: Microsoft Clarity プロジェクト ID（heatmap + セッション録画）
//   NEXT_PUBLIC_X_PIXEL_ID:       o1234 形式（X Ads Universal Website Tag Pixel ID）
// env 未設定時は対応スクリプトを emit せず、無害にフォールバック。
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || ''
// X Ads ピクセル/イベントは直値で固定（env 未設定でも本番稼働させるため）。
// X_PIXEL_ID と X_SITE_VISIT_EVENT_ID（tw-{pixel}-{event} 形式）は同一ピクセル rd63n に紐付く。
const X_PIXEL_ID = 'rd63n'
const X_SITE_VISIT_EVENT_ID = 'tw-rd63n-rd641'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SEKAI STAY | 成果で選ばれる民泊運用代行',
    template: '%s | SEKAI STAY',
  },
  description:
    '管理物件レビュー平均4.8・Airbnbスーパーホスト認定。SEKAI STAYは稼働率と収益を上げる民泊運用代行です。全国7拠点・手数料8%・24時間オーナーダッシュボード。最短2週間で切り替え可能。',
  keywords: [
    '民泊 運用代行',
    '民泊 管理代行',
    'Airbnb 管理代行',
    'Airbnb 運用代行',
    '民泊 代行 比較',
    '民泊 代行 費用',
    '民泊 稼働率 向上',
    '民泊 レビュー 改善',
    '民泊 運営 委託',
    'Booking.com 運用代行',
    'SEKAI STAY',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'SEKAI STAY | 成果で選ばれる民泊運用代行',
    description:
      '管理物件レビュー平均4.8。稼働率を上げ、収益を最大化する民泊運用代行サービス。全国7拠点・24時間オーナーダッシュボード。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'SEKAI STAY',
    url: SITE_URL,
    // og:image は app/opengraph-image.jpg（ファイル規約）が全ルートに効くのでここでは指定しない。
    // 重複した og:image を出すと SNS 側がどちらを拾うか不定になる。
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEKAI STAY | 成果で選ばれる民泊運用代行',
    description:
      '管理物件レビュー平均4.8・Airbnbスーパーホスト認定。稼働率と収益を上げる民泊運用代行。全国7拠点。',
    // twitter:image は app/twitter-image.jpg（ファイル規約）に任せる。
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: {
      'facebook-domain-verification': 'jkah949lw53nfc2j5nz05zzwj7njdp',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${grotesk.variable} ${spaceMono.variable} ${yujiBoku.variable}`}>
      <head>
        <AnalyticsHeadTags
          gaId={GA_MEASUREMENT_ID}
          googleAdsId={GOOGLE_ADS_ID}
          clarityId={CLARITY_PROJECT_ID}
          metaPixelId={META_PIXEL_ID}
          xPixelId={X_PIXEL_ID}
          xSiteVisitEventId={X_SITE_VISIT_EVENT_ID}
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'SEKAI STAY',
              alternateName: '株式会社セカイチ',
              url: SITE_URL,
              logo: `${SITE_URL}/sekai_stay_03_03.png`,
              description: '管理物件レビュー平均4.8・Airbnbスーパーホスト認定。稼働率と収益を上げる民泊運用代行サービス。全国7拠点。',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '青葉台2-20-7 KM中目黒ビル1F',
                addressLocality: '目黒区',
                addressRegion: '東京都',
                postalCode: '153-0042',
                addressCountry: 'JP',
              },
              areaServed: { '@type': 'Country', name: 'JP' },
              priceRange: '¥¥',
              hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: '住宅宿泊管理業',
                recognizedBy: { '@type': 'GovernmentOrganization', name: '国土交通省' },
                name: '国土交通大臣(01)第F05780号',
              },
              sameAs: [],
            }),
          }}
        />
        {/* UTM の永続化は lib/attribution.ts (90日クッキー ss_attr) に移行 (2026-07-08)。
            旧 sessionStorage 方式はタブを閉じると消える + 読み手が contact のみだったため削除。 */}
        {/* 解析・広告タグ本体は AnalyticsHeadTags（/lease 配下では描画しない） */}
      </head>
      <body>
        <MetaPixelNoscript metaPixelId={META_PIXEL_ID} />
        <Suspense fallback={null}>
          <AnalyticsRouteTracker />
        </Suspense>
        <AuditModalProvider>{children}</AuditModalProvider>
      </body>
    </html>
  )
}
