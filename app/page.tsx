import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ── Above-fold: static imports (critical path) ── */
import HeroProduct from '@/components/home/HeroProduct'

/* ── Below-fold: dynamic imports (reduce initial JS bundle) ── */
const FloatingCTA = dynamic(() => import('@/components/FloatingCTA'), { ssr: false })
const ProductShowcase = dynamic(() => import('@/components/home/ProductShowcase'))
const HowItWorks = dynamic(() => import('@/components/home/HowItWorks'))
const ServiceBuckets = dynamic(() => import('@/components/home/ServiceBuckets'))
const PricingBand = dynamic(() => import('@/components/home/PricingBand'))
const ResultsProof = dynamic(() => import('@/components/home/ResultsProof'))
const PersonaPaths = dynamic(() => import('@/components/home/PersonaPaths'))
const TenQuestionsCompact = dynamic(() => import('@/components/home/TenQuestionsCompact'))
const TrustBase = dynamic(() => import('@/components/home/TrustBase'))
const FaqEleven = dynamic(() => import('@/components/home/FaqEleven'))
const FinalCtaLadder = dynamic(() => import('@/components/home/FinalCtaLadder'))

/* ─── SEO Meta ────────────────────────────────── */

export const metadata: Metadata = {
  title: 'SEKAI STAY | 民泊運営は、もう丸投げでいい。',
  description:
    'SEKAI STAYは、価格設計・OTA最適化・多言語対応・清掃・ゲスト対応まで一気通貫で支援する民泊運用代行サービス。運用中の物件の改善も、これから始める民泊の立ち上げも、まずは無料で物件の伸びしろを確認できます。',
  openGraph: {
    title: 'SEKAI STAY | 民泊運営は、もう丸投げでいい。',
    description:
      '運用中の物件の改善から、これから始める民泊の立ち上げまで。一気通貫で支援する民泊運用代行。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com',
    siteName: 'SEKAI STAY',
  },
  alternates: { canonical: 'https://sekaistay.com' },
}

/* ─── Page ────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Header />
      <FloatingCTA />
      <main>
        <HeroProduct />
        <ProductShowcase />
        <HowItWorks />
        <ServiceBuckets />
        <PricingBand />
        <ResultsProof />
        <PersonaPaths />
        <TenQuestionsCompact />
        <TrustBase />
        <FaqEleven />
        <FinalCtaLadder />
      </main>
      <Footer />
    </>
  )
}
