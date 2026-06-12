'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { IconArrowRight } from '@/components/Icons'

/* ─── Data ─── */

const FAQ_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'fee', label: '料金・費用' },
  { id: 'contract', label: '契約・手続き' },
  { id: 'service', label: 'サービス内容' },
  { id: 'area', label: '対応エリア・物件' },
]

const FAQ_ITEMS: { q: string; a: string; category: string }[] = [
  // ── 料金・費用 ──
  {
    q: '民泊運営代行の費用はどのくらいかかりますか？',
    a: '初期費用は他社からの乗り換えで¥100,000/物件（移行作業・AI画像加工・リスティング最適化込み）、新規立ち上げで¥200,000〜。月額は固定管理費10,000円/物件と売上の8%です。収支シミュレーションを無料で作成いたしますので、お気軽にお問い合わせください。',
    category: 'fee',
  },
  {
    q: '宿泊がなかった月の費用はかかりますか？',
    a: '固定管理費（月額10,000円/物件）のみとなります。変動運営委託費（8%）は売上に連動するため、宿泊がなければ発生しません。',
    category: 'fee',
  },
  {
    q: '他社と比べて手数料が安いのはなぜですか？',
    a: 'SEKAI STAYでは独自の仕組みによりオペレーションコストを大幅に削減。その分をオーナー様に還元しています。8%の手数料でも高品質なサービスを維持できる体制を構築しています。',
    category: 'fee',
  },
  {
    q: '清掃費用は別途かかりますか？',
    a: '清掃費用はゲスト負担（宿泊料金に含む）が基本です。清掃手配・品質管理は運営代行サービスに含まれており、オーナー様への追加請求はございません。',
    category: 'fee',
  },
  // ── 契約・手続き ──
  {
    q: '解約金はかかりますか？',
    a: '契約から7ヶ月目以降の解約金は¥0です。6ヶ月未満の途中解約は¥200,000をいただきます。解約は3ヶ月前までにお申し出ください。',
    category: 'contract',
  },
  {
    q: '他社から乗り換える場合、移行コストはかかりますか？',
    a: '初期費用として¥100,000/物件をいただいています（移行作業・AI画像加工・リスティング最適化込み）。OTAアカウントの引き継ぎや掲載情報の最適化まで当社で対応し、移行中に運営の空白期間が出ないよう調整します。',
    category: 'contract',
  },
  {
    q: '解約のタイミングや手続きは？',
    a: '解約は3ヶ月前までにお申し出ください。解約金は7ヶ月目以降¥0（6ヶ月未満の途中解約は¥200,000）です。契約終了までの受注済みのご予約は弊社で最後まで対応します。',
    category: 'contract',
  },
  {
    q: '契約から開業までどのくらいかかりますか？',
    a: '最短2週間で開業可能です。物件の状況や必要な準備によりますが、通常1〜2ヶ月程度で運営を開始できます。',
    category: 'contract',
  },
  {
    q: '法人でも個人でも契約できますか？',
    a: 'はい、法人・個人どちらでもご契約いただけます。',
    category: 'contract',
  },
  // ── サービス内容 ──
  {
    q: 'プロカメラマンによる撮影は必要ですか？',
    a: 'いいえ、不要です。お手持ちのスマートフォンで撮影いただいた写真を、弊社の画像加工システムでプロ品質に仕上げます。トンマナの統一も自動で行います。',
    category: 'service',
  },
  {
    q: 'どのOTAに掲載されますか？',
    a: 'Airbnb、Booking.com、Vrbo、Expediaなど、物件の特性やエリアに合わせて最適なOTAを選定し複数掲載します。在庫の同期管理も行います。',
    category: 'service',
  },
  {
    q: 'ゲスト対応は何語に対応していますか？',
    a: '日本語・英語・中国語・韓国語など、主要な言語に24時間対応しています。',
    category: 'service',
  },
  {
    q: 'オーナーダッシュボードではどんな情報が見られますか？',
    a: 'リアルタイムの収益・稼働率・予約状況・レビュースコアなどを24時間いつでもPC・スマホから確認可能です。さらに3ヶ月毎のオンライン定例ミーティングで、データに基づいた改善のご提案も行います。',
    category: 'service',
  },
  {
    q: 'マンスリー賃貸と民泊の併用はできますか？',
    a: 'はい、可能です。民泊新法の180日規制に対応するため、マンスリー賃貸と民泊を柔軟に組み合わせ、年間の収益を最大化する戦略をご提案します。',
    category: 'service',
  },
  {
    q: '清掃の品質はどのように管理されていますか？',
    a: '専属の清掃スタッフがチェックリストに基づき作業を実施。写真付きの検品報告を行い、高いレビュースコアの維持に貢献しています。',
    category: 'service',
  },
  // ── 対応エリア・物件 ──
  {
    q: '遠方の物件でも対応可能ですか？',
    a: '清掃パートナー確保済みエリアで全国対応しています（国内民泊の約85%をカバー）。遠隔管理システムにより、どの地域でも同品質のサービスを提供します。',
    category: 'area',
  },
  {
    q: 'どんな物件タイプに対応していますか？',
    a: 'マンション一室、一棟アパート、戸建て、ヴィラ、トレーラーハウスなど、幅広い物件タイプに対応しています。物件ごとに最適な運営戦略をご提案します。',
    category: 'area',
  },
  {
    q: '複数物件をまとめて任せることはできますか？',
    a: 'はい、複数物件の一括管理も可能です。物件数に応じた効率的な運営体制をご提案いたします。',
    category: 'area',
  },
  {
    q: '民泊の届出や許認可は取得済みである必要がありますか？',
    a: '開業支援の一環として、届出・許認可に関するご相談やサポートも行っております。まだ取得されていない場合でもお気軽にご相談ください。',
    category: 'area',
  },
]

/* ─── Component ─── */

export default function FAQClient() {
  const [activeCat, setActiveCat] = useState('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const visibleItems = useMemo(() => {
    return FAQ_ITEMS
      .map((item, i) => ({ ...item, globalIndex: i }))
      .filter((item) => activeCat === 'all' || item.category === activeCat)
  }, [activeCat])

  const handleCategoryChange = (cat: string) => {
    setActiveCat(cat)
    setOpenIndex(null)
  }

  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: 'FAQ' }]} />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* Chapter Ⅰ — masthead */}
        <section className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Frequently Asked</p>
            </div>
            <h1 className="heading-display text-ink mb-5">
              よくあるご質問
              <span className="block font-sans font-light text-mid-gray text-[0.55em] mt-3">Questions &amp; Answers</span>
            </h1>
            <p className="lead text-dark-gray max-w-2xl">
              SEKAI STAYの民泊運営代行サービスに関して、オーナー様からよくいただくご質問をまとめました。
            </p>
          </div>
        </section>

        {/* Chapter Ⅱ — category rail + accordion */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8 max-w-3xl">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 02</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Tag Rail</p>
            </div>

            {/* Editorial tag rail */}
            <div className="flex gap-0 mb-10 overflow-x-auto pb-1 border-b border-rule">
              {FAQ_CATEGORIES.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? FAQ_ITEMS.length
                    : FAQ_ITEMS.filter((i) => i.category === cat.id).length
                const active = activeCat === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`relative inline-flex items-baseline gap-2 text-[13px] md:text-[14px] px-4 md:px-5 py-3 md:py-4 whitespace-nowrap flex-shrink-0 transition font-sans ${
                      active
                        ? 'text-ink'
                        : 'text-mid-gray hover:text-ink'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="eyebrow-mono text-mid-gray/80">{String(count).padStart(2, '0')}</span>
                    {active && (
                      <span className="absolute left-4 right-4 bottom-0 h-[2px] bg-sekai-teal" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Accordion list */}
            <div className="border-t border-rule">
              {visibleItems.map((item, i) => {
                const isOpen = openIndex === i
                return (
                  <div
                    key={item.globalIndex}
                    className="border-b border-rule"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-4 py-6 md:py-7 text-left cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-4 md:gap-6 flex-1 min-w-0">
                        <span className="font-sans font-light text-[24px] md:text-[28px] text-sekai-teal leading-none tabular-nums flex-shrink-0 pt-1">
                          {String(item.globalIndex + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <p className="eyebrow-mono text-mid-gray mb-1">Question № {String(item.globalIndex + 1).padStart(2, '0')}</p>
                          <p className="font-sans font-medium text-[15px] md:text-[17px] text-ink leading-snug group-hover:text-sekai-teal transition">
                            {item.q}
                          </p>
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className={`flex-shrink-0 w-8 h-8 border flex items-center justify-center transition mt-1 ${
                          isOpen
                            ? 'border-ink bg-ink text-ivory'
                            : 'border-rule text-mid-gray group-hover:border-ink group-hover:text-ink'
                        }`}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <path
                            d="M1 3l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {/* Animated answer panel */}
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pl-10 md:pl-14 pb-7 md:pb-8">
                          <blockquote className="border-l-2 border-sekai-teal pl-5 md:pl-6">
                            <p className="font-sans text-body-sm md:text-body text-dark-gray leading-[2]">
                              {item.a}
                            </p>
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {visibleItems.length === 0 && (
              <div className="text-center font-sans text-body-sm text-mid-gray py-16">
                該当する項目がありません。
              </div>
            )}
          </div>
        </section>

        {/* Chapter Ⅲ — CTA */}
        <section className="bg-ink relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-radial from-sekai-teal/20 to-transparent blur-3xl pointer-events-none" />
          <div className="container-narrow px-5 md:px-8 section-xl relative">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-bright-teal">Closing</p>
            </div>
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
              <div>
                <h2 className="font-sans font-bold text-[28px] md:text-[40px] leading-[1.3] text-ivory mb-6">
                  ご不明な点がございましたら、
                  <span className="block font-sans font-light text-bright-teal mt-2">お気軽にお問い合わせください。</span>
                </h2>
                <p className="font-sans text-body-sm text-ivory/70 leading-[1.9] max-w-lg">
                  FAQに掲載されていないご質問や、物件ごとの個別のご相談にも対応いたします。収支シミュレーションの作成も無料で承ります。
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="group w-full inline-flex items-center justify-between gap-4 bg-ivory text-ink px-7 py-5 transition hover:bg-bright-teal"
                >
                  <div>
                    <p className="eyebrow-mono text-mid-gray mb-1">Path A</p>
                    <p className="font-sans font-medium text-[15px]">無料で相談する</p>
                  </div>
                  <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  href="/services#pricing"
                  className="group w-full inline-flex items-center justify-between gap-4 border border-ivory/30 text-ivory px-7 py-5 transition hover:bg-ivory/5 hover:border-bright-teal"
                >
                  <div>
                    <p className="eyebrow-mono text-bright-teal mb-1">Path B</p>
                    <p className="font-sans font-medium text-[15px]">収支シミュレーション</p>
                  </div>
                  <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
