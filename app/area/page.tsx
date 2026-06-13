import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import Breadcrumb from '@/components/Breadcrumb'
import { getAllAreas } from '@/lib/areas'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'
import JapanAreaMap from '@/components/area/JapanAreaMap'

const SITE_URL = 'https://sekaistay.com'
const AREA_COUNT = getAllAreas().length

export const metadata: Metadata = {
  title: `対応エリア（全国${AREA_COUNT}エリア以上）| SEKAI STAY`,
  description: `SEKAI STAYは全国${AREA_COUNT}エリア以上で民泊運用代行に対応。清掃パートナー確保済みエリアを順次拡大し、国内の民泊エリアの約85%をカバー。京都・大阪・東京など主要観光地から地方リゾートまで全国対応でご提案します。`,
  alternates: {
    canonical: `${SITE_URL}/area`,
  },
  openGraph: {
    title: `対応エリア（全国${AREA_COUNT}エリア以上）| SEKAI STAY`,
    description: `京都・大阪・東京・福岡など全国${AREA_COUNT}エリア以上で民泊運用代行に対応。清掃パートナー確保済みエリアで全国対応、各エリアの特性に合わせた最適な運営プランをご提案します。`,
    type: 'website',
    url: `${SITE_URL}/area`,
    siteName: 'SEKAI STAY',
    locale: 'ja_JP',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AreaPage() {
  const areas = getAllAreas()

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SEKAI STAY 対応エリア',
    numberOfItems: areas.length,
    itemListElement: areas.map((area, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${area.name}の民泊運用代行`,
      url: `${SITE_URL}/area/${area.slug}`,
    })),
  }

  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '対応エリア' }]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <main className="bg-ivory pb-20">
        {/* Chapter Ⅰ — masthead */}
        <section className="relative bg-switch-charcoal text-white overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -right-24 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
          />
          <div className="container-edit section-hero relative">
            <div className="chapter-marker">
              <span className="h-px w-6 bg-bright-teal" />
              <p className="eyebrow !text-bright-teal">Coverage</p>
            </div>
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-14 items-end">
              <h1 className="heading-display text-white jp-keep">
                全国
                <span className="font-sans text-bright-teal tabular-nums">{areas.length}</span>
                エリア<span className="font-sans text-bright-teal">以上</span>で
                <span className="block">民泊運用代行に対応。</span>
              </h1>
              <div className="md:text-right">
                <p className="eyebrow-mono text-white/60 mb-2">Regional Atlas · 2026</p>
                <p className="font-sans font-light text-[64px] md:text-[96px] text-bright-teal leading-none tabular-nums">
                  {areas.length}
                  <span className="text-[40px] md:text-[56px] align-top">+</span>
                </p>
                <p className="eyebrow-mono text-white/60 mt-1">Areas &amp; Growing</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-14 pt-10 border-t border-white/15">
              <p className="font-sans text-body md:text-[17px] text-white/75 leading-[2] jp-break">
                京都の町家から沖縄のリゾート、ニセコのスキーコンドミニアムまで。SEKAI
                STAYは各エリアの特性と市場動向に合わせた、最適な運営戦略をご提案します。
              </p>
              <div>
                <p className="font-sans text-body md:text-[17px] text-white/75 leading-[2] jp-break">
                  ここにないエリアも、清掃パートナーの確保でき次第対応します（現在、国内の民泊エリアの約85%をカバー）。まずはご相談ください。
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link href="/contact" className="group inline-flex items-center justify-center gap-2.5 bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-[15px] px-8 py-4 rounded-switch-md transition shadow-switch-card">
                    無料で相談する
                    <IconArrowRight size={14} />
                  </Link>
                  <span className="eyebrow-mono text-white/60">入力3分 · 無料 · 営業連絡なし</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter Ⅱ — interactive map + area atlas */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 02</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Atlas of Areas</p>
            </div>

            <JapanAreaMap areas={areas} />
          </div>
        </section>

        {/* Chapter Ⅲ — consultation CTA */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8 max-w-3xl">
            <div className="bg-switch-charcoal text-white rounded-switch-lg p-10 md:p-14 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
              />
              <div className="relative">
                <div className="chapter-marker">
                  <span className="h-px w-10 bg-bright-teal" />
                  <p className="eyebrow !text-bright-teal">Not Listed?</p>
                </div>
                <h2 className="font-sans font-medium text-[26px] md:text-[34px] leading-tight mb-6 jp-keep">
                  <JP>対応エリアにない場合も、</JP>
                  <span className="block font-sans text-bright-teal mt-1">
                    まずはご相談ください。
                  </span>
                </h2>
                <p className="font-sans text-body-sm text-ivory/80 leading-[1.95] mb-8 max-w-lg jp-break">
                  清掃パートナーの確保でき次第、新しいエリアにも順次対応しています。全国各地での対応実績をもとに、あなたの物件に最適なプランをご提案いたします。
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 bg-ivory text-ink px-7 py-4 transition hover:bg-bright-teal font-sans font-medium text-[14px]"
                  >
                    無料相談する
                    <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </Link>
                  <span className="eyebrow-mono !text-ivory/70">入力3分 · 無料 · 営業連絡なし</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FloatingCTA />
      <Footer />
    </>
  )
}
