import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { getCaseStudies, getAverageMetrics } from '@/lib/case-studies'
import { getAllAreas } from '@/lib/areas'
import JapanAreaMap from '@/components/area/JapanAreaMap'
import { IconArrowRight } from '@/components/Icons'

export const metadata: Metadata = {
  title: '実績・対応エリア | SEKAI STAY',
  description: '民泊運営代行の導入事例と全国対応エリア。京都古民家から高級ヴィラ、都心アパートまで、SEKAI STAYが実現した収益向上・稼働率改善の数字と、全国の運用実績をご確認ください。',
  openGraph: {
    title: '実績・対応エリア | SEKAI STAY',
    description: '数字で見るオーナーの成果と、全国の対応エリア。運営代行で実現した収益向上をご確認ください。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/case-studies',
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: '実績・対応エリア | SEKAI STAY',
    description: '数字で見るオーナーの成果と、全国の対応エリア。',
  },
  alternates: { canonical: 'https://sekaistay.com/case-studies' },
}

const FAQS = [
  {
    q: 'どの事例が自分の物件に近いですか？',
    a: '各事例は地域・物件タイプ・賃貸形態で分類されています。タグから自分の物件に最も近い事例を見つけ、改善の参考にしてください。ご不明な点は無料相談でお答えします。',
  },
  {
    q: 'これらの成果は何ヶ月で実現できますか？',
    a: '通常、運営改善は1〜3ヶ月で効果が出始めます。ただし物件の立地・シーズン・初期設定状況により異なります。詳細はお問い合わせください。',
  },
  {
    q: '費用はいくらかかりますか？',
    a: 'SEKAI STAYの手数料は、民泊運営代行で月額売上の8%です。詳細な料金設定・シミュレーションは、無料相談でご説明いたします。',
  },
  {
    q: '今すぐ成果が出ない物件でも大丈夫ですか？',
    a: 'はい。どの物件にも改善の余地があります。市場調査・競合分析・運営最適化を通じて、あなたの物件のポテンシャルを最大限引き出すご提案をいたします。',
  },
]

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies()
  const areas = getAllAreas()
  const metrics = getAverageMetrics()

  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '実績・対応エリア' }]} />

      <main className="bg-ivory">
        {/* Chapter Ⅰ — dark editorial masthead */}
        <section className="relative bg-switch-charcoal text-white overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -right-24 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
          />
          <div className="container-edit relative section-hero">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow !text-bright-teal">Proof &amp; Coverage</p>
            </div>
            <h1 className="heading-display heading-mb-lg jp-keep text-white">
              数字で見る、
              <span className="block text-bright-teal mt-2">オーナーの成果。</span>
            </h1>
            <p className="text-body text-white/70 leading-[1.8] max-w-xl jp-break">
              全国{areas.length}エリア・{metrics.totalProperties}件の運用実績。成果は、数字で。
            </p>

            {/* Stat band — fuses results (成果) + coverage (エリア) */}
            <div className="mt-12 pt-10 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-y-9 gap-x-6">
              <div>
                <p className="eyebrow-mono text-white/50 mb-2">Coverage</p>
                <p className="font-sans font-light text-[40px] md:text-[52px] text-bright-teal leading-none tabular-nums">
                  {areas.length}<span className="text-[24px] md:text-[30px] align-top">+</span>
                </p>
                <p className="font-sans text-caption text-white/60 mt-2">エリア対応</p>
              </div>
              <div>
                <p className="eyebrow-mono text-white/50 mb-2">Portfolio</p>
                <p className="font-sans font-light text-[40px] md:text-[52px] text-bright-teal leading-none tabular-nums">
                  {metrics.totalProperties}
                </p>
                <p className="font-sans text-caption text-white/60 mt-2">件の導入実績</p>
              </div>
              <div>
                <p className="eyebrow-mono text-white/50 mb-2">Occupancy</p>
                <p className="font-sans font-light text-[40px] md:text-[52px] text-bright-teal leading-none tabular-nums">
                  {metrics.averageOccupancyAfter}
                </p>
                <p className="font-sans text-caption text-white/60 mt-2">
                  平均稼働率 <span className="line-through text-white/40">{metrics.averageOccupancyBefore}</span> から
                </p>
              </div>
              <div>
                <p className="eyebrow-mono text-white/50 mb-2">Superhost</p>
                <p className="font-sans font-light text-[40px] md:text-[52px] text-bright-teal leading-none tabular-nums">
                  {metrics.superhostCount}
                </p>
                <p className="font-sans text-caption text-white/60 mt-2">件 獲得</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter Ⅱ — case studies grid */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 02</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Case Files · {caseStudies.length}</p>
            </div>

            <div className="bg-rule grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-rule">
              {caseStudies.map((caseStudy, i) => (
                <article
                  key={caseStudy.id}
                  className="bg-white border border-switch-stone-border rounded-switch-lg shadow-switch-card group"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-switch-lg bg-switch-cloud">
                    <Image
                      src={caseStudy.image}
                      alt={caseStudy.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Case № overlay */}
                    <div className="absolute top-4 left-4 bg-ivory/95 backdrop-blur-sm px-3 py-1 border border-rule">
                      <p className="eyebrow-mono text-ink">Case № {String(i + 1).padStart(3, '0')}</p>
                    </div>
                    {/* Tags overlay */}
                    {caseStudy.tags.length > 0 && (
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                        {caseStudy.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-ink/90 backdrop-blur-sm text-ivory font-sans text-[11px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-7 md:p-8">
                    {/* Header */}
                    <div className="mb-5 pb-4 border-b border-rule">
                      <p className="eyebrow text-sekai-teal mb-2">{caseStudy.type}</p>
                      <h3 className="font-sans font-medium text-[18px] md:text-[20px] text-ink leading-tight mb-1">
                        {caseStudy.name}
                      </h3>
                      <p className="font-sans text-caption text-mid-gray">{caseStudy.location}</p>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-body-sm text-dark-gray leading-[1.95] mb-6 line-clamp-3">
                      {caseStudy.description}
                    </p>

                    {/* Highlights — ledger */}
                    <ul className="space-y-2 mb-6">
                      {caseStudy.highlights.slice(0, 3).map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 font-sans text-caption text-ink leading-[1.85]"
                        >
                          <span className="font-sans text-[14px] text-sekai-teal leading-none tabular-nums flex-shrink-0 mt-[2px]">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Results Ledger */}
                    <div className="border-t border-rule pt-5 space-y-4">
                      {caseStudy.results.occupancyBefore && (
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="eyebrow-mono text-mid-gray">Occupancy</span>
                            <span className="font-sans font-light text-[18px] text-sekai-teal tabular-nums">
                              {caseStudy.results.occupancyBefore} → {caseStudy.results.occupancyAfter}
                            </span>
                          </div>
                          <div className="w-full bg-rule h-[2px]">
                            <div
                              className="bg-sekai-teal h-[2px]"
                              style={{ width: `${parseInt(caseStudy.results.occupancyAfter || '0')}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {caseStudy.results.revenueBefore && (
                        <div>
                          <p className="eyebrow-mono text-mid-gray mb-2">Monthly Revenue</p>
                          <div className="flex justify-between items-baseline">
                            <span className="font-sans text-caption text-mid-gray line-through">
                              {caseStudy.results.revenueBefore}
                            </span>
                            <span className="font-sans font-light text-[20px] text-ink tabular-nums">
                              {caseStudy.results.revenueAfter}
                            </span>
                          </div>
                        </div>
                      )}

                      {caseStudy.results.reviewScore !== undefined && (
                        <div className="flex justify-between items-baseline">
                          <span className="eyebrow-mono text-mid-gray">Avg Review</span>
                          <span className="font-sans text-[18px] text-ink tabular-nums">
                            {caseStudy.results.reviewScore}<span className="font-sans text-caption text-mid-gray ml-1">/5.0</span>
                          </span>
                        </div>
                      )}

                      {caseStudy.results.superhost && (
                        <div className="flex items-center gap-2 pt-3 border-t border-rule">
                          <svg className="w-3.5 h-3.5 text-sekai-teal" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="eyebrow text-sekai-teal">Superhost獲得</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅲ — nationwide coverage (folded in from /area) */}
        <section id="area" className="section-xl bg-switch-cloud border-t border-rule scroll-mt-24">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 03</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Coverage · {areas.length} Areas</p>
            </div>
            <h2 className="heading-section text-ink mb-4">
              実績は、
              <span className="font-sans text-sekai-teal">全国{areas.length}エリア</span>
              で。
            </h2>
            <p className="text-body text-dark-gray leading-[1.8] max-w-2xl mb-12 jp-break">
              京都の町家から沖縄のリゾートまで。気になるエリアの相場と運用のポイントは、各エリアページでご確認いただけます。
            </p>
            <JapanAreaMap areas={areas} />
          </div>
        </section>

        {/* Chapter Ⅳ — CTA */}
        <section className="relative bg-switch-charcoal text-white overflow-hidden">
          <div
            aria-hidden
            className="absolute -bottom-32 -left-24 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
          />
          <div className="container-narrow relative px-5 md:px-8 section-xl max-w-4xl">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow !text-bright-teal">Start Growing</p>
            </div>
            <h2 className="font-sans font-bold text-[28px] md:text-[44px] leading-[1.3] mb-8 text-white">
              あなたの物件も同じように
              <span className="block font-sans text-bright-teal mt-1">成長させませんか？</span>
            </h2>
            <p className="font-sans text-body md:text-[17px] text-white/75 leading-[1.95] mb-10 max-w-2xl">
              どんな物件にも、まだ伸びしろがあります。まずは無料で、あなたの宿の数字を見にきてください。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-between gap-4 bg-ivory text-ink px-7 py-5 transition hover:bg-bright-teal"
              >
                <div>
                  <p className="eyebrow-mono text-mid-gray mb-1">Path A</p>
                  <p className="font-sans font-medium text-[15px]">無料相談を申し込む</p>
                </div>
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center justify-between gap-4 border border-ivory/30 text-ivory px-7 py-5 transition hover:bg-ivory/5 hover:border-bright-teal"
              >
                <div>
                  <p className="eyebrow-mono text-bright-teal mb-1">Path B</p>
                  <p className="font-sans font-medium text-[15px]">サービスを詳しく見る</p>
                </div>
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </section>

        {/* Chapter Ⅴ — FAQ */}
        <section className="section-xl bg-switch-cloud border-t border-rule">
          <div className="container-narrow px-5 md:px-8 max-w-3xl">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">FAQ</p>
            </div>
            <h2 className="heading-section text-ink mb-12">
              導入事例について、
              <span className="font-sans text-sekai-teal">よくあるご質問。</span>
            </h2>

            <div className="border-t border-rule">
              {FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border-b border-rule py-6"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <div className="flex items-start gap-5 flex-1">
                      <span className="font-sans font-light text-[24px] md:text-[28px] text-sekai-teal leading-none tabular-nums flex-shrink-0 pt-1">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="eyebrow-mono text-mid-gray mb-1">Question № {String(idx + 1).padStart(2, '0')}</p>
                        <p className="font-sans font-medium text-[15px] md:text-[17px] text-ink leading-snug">{faq.q}</p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 w-8 h-8 border border-rule flex items-center justify-center text-mid-gray group-open:border-ink group-open:bg-ink group-open:text-ivory transition mt-1">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-open:rotate-180 transition-transform">
                        <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-5 pl-10 md:pl-14">
                    <blockquote className="border-l-2 border-sekai-teal pl-5">
                      <p className="font-sans text-body-sm md:text-body text-dark-gray leading-[2]">{faq.a}</p>
                    </blockquote>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCTA />
    </>
  )
}
