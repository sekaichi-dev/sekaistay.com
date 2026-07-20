import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllPostSummaries } from '@/lib/blog'

/* ── Above-fold: static imports (critical path) ── */
import HomeHero from '@/components/home/HomeHero'

/* ── Below-fold: dynamic imports (reduce initial JS bundle) ── */
const FloatingCTA = dynamic(() => import('@/components/FloatingCTA'), { ssr: false })
const BusinessSense = dynamic(() => import('@/components/home/SenseSections').then(m => m.BusinessSense))
const AboutSense = dynamic(() => import('@/components/home/SenseSections').then(m => m.AboutSense))
const ContactSense = dynamic(() => import('@/components/home/SenseSections').then(m => m.ContactSense))
const ValueBand = dynamic(() => import('@/components/home/SenseSections2').then(m => m.ValueBand))
const ResultsSense = dynamic(() => import('@/components/home/SenseSections2').then(m => m.ResultsSense))
const OpeningFlowSense = dynamic(() => import('@/components/home/SenseSections2').then(m => m.OpeningFlowSense))
const FaqTealSense = dynamic(() => import('@/components/home/SenseSections2').then(m => m.FaqTealSense))
const NewsSense = dynamic(() => import('@/components/home/SenseSections2').then(m => m.NewsSense))
const MagazineSense = dynamic(() => import('@/components/home/SenseSections2').then(m => m.MagazineSense))
const CompanyTeaser = dynamic(() => import('@/components/home/SenseSections2').then(m => m.CompanyTeaser))

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
  const magazinePosts = getAllPostSummaries().slice(0, 5)
  return (
    <>
      <Header />
      <FloatingCTA />
      <main>
        <HomeHero />
        <AboutSense />
        <NewsSense />
        <BusinessSense />
        <ValueBand />
        <ResultsSense />
        <OpeningFlowSense />
        <MagazineSense posts={magazinePosts} />
        <FaqTealSense />
        <CompanyTeaser />
        <ContactSense />
      </main>
      <Footer />
    </>
  )
}
