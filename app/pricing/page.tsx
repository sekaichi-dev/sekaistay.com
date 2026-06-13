import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { IconArrowRight } from '@/components/Icons'

export const metadata: Metadata = {
  title: '料金',
  description:
    'SEKAI STAYの料金体系。毎月の基本料金は売上の8%＋月額10,000円/物件。初期費用は乗り換え¥100,000/物件・新規立ち上げ¥200,000〜。かかりうる費用をすべて開示します。',
  openGraph: {
    title: '料金 | SEKAI STAY',
    description:
      '毎月の基本料金は売上の8%＋月額10,000円/物件。初期費用・実費・有料オプションまで、かかりうる費用をすべて開示します。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/pricing',
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: '料金 | SEKAI STAY',
    description:
      '毎月の基本料金は売上の8%＋月額10,000円/物件。初期費用・実費・有料オプションまで、かかりうる費用をすべて開示します。',
  },
  alternates: { canonical: 'https://sekaistay.com/pricing' },
}

const INCLUDES = [
  'OTA掲載・リスティング最適化',
  'リアルタイムダッシュボード（24時間・スマホ）',
  '24時間・4言語ゲスト対応',
  'ダイナミックプライシング',
  '清掃手配・品質管理',
  '自動返信・定型メッセージ設定',
  '法令対応サポート',
  'レビュー管理・改善',
  '専任スタッフ（3ヶ月毎・オンライン定例ミーティング）',
  '緊急時対応（24時間）',
]

const PAID_OPTIONS = [
  'プロカメラマンによる物件撮影',
  '家具家電の購入・設置代行',
  '民泊・旅館業の許認可申請代行',
  'スマートロック導入',
  '一休.com・じゃらん 追加掲載',
  '直接予約サイト構築',
]

const PRICING_FAQ = [
  {
    q: 'SEKAI STAYの民泊運用代行の料金は？',
    a: '毎月の基本料金は、変動運営委託費（売上の8%）＋固定管理費10,000円/物件/月です。初期費用は乗り換えが100,000円/物件、新規立ち上げが200,000円〜。このほかは消耗品などの実費（実費＋20%）と、ご希望のときだけの有料オプションのみで、かかりうる費用は契約前にすべて金額つきで提示します。',
  },
  {
    q: '他社からの乗り換えに費用はかかりますか？',
    a: '初期費用として100,000円/物件をいただきます。移行作業に加えて、AI画像加工とリスティング最適化（多言語）まで含む金額です。Airbnb・Booking.com等のOTA引き継ぎは並走で進めるため収益の空白期間はなく、移行は最短2週間で完了します。',
  },
  {
    q: '他社は手数料15〜25%なのに、なぜ8%なのですか？',
    a: '自社運営のオペレーション基盤と、清掃パートナーネットワーク、多言語ゲスト対応センターを内製化することで、一般的な代行業者の運営コストを大幅に削減しているためです。その差分をオーナー様に還元しています。',
  },
  {
    q: '解約金はかかりますか？',
    a: '最低契約期間は6ヶ月です。7ヶ月目以降の解約金は¥0で、いつでも解約できます（解約のご連絡は3ヶ月前までにお願いします）。6ヶ月未満で途中解約する場合のみ、解約手数料200,000円をいただきます。この条件も、隠さず最初にお伝えします。',
  },
  {
    q: '宿泊予約がない月も費用はかかりますか？',
    a: '固定管理費（10,000円/物件）のみ発生し、変動運営委託費（8%）は売上連動のため0円です。閑散期の固定費は1物件で月10,000円に限定されます。',
  },
  {
    q: '清掃費や備品補充は別途請求されますか？',
    a: '清掃費はゲストの宿泊料に含めて精算するため、オーナー様の月々の持ち出しはありません。消耗品（アメニティ等）の補充は実費＋20%で精算します。清掃の手配と品質管理そのものは、運営代行サービスに含まれています。',
  },
  {
    q: '有料オプションにはどんなものがありますか？',
    a: 'プロカメラマンによる物件撮影、家具家電の購入・設置代行、民泊・旅館業の許認可申請代行、スマートロック導入、一休.com・じゃらんへの追加掲載、直接予約サイトの構築などを、ご希望に応じて承ります。いずれも事前にお見積もりを提示し、後出しの請求はしません。',
  },
]

const COMPARE = [
  { label: '手数料率', us: '8%', others: '15〜25%', highlight: true },
  { label: '月額固定費', us: '¥10,000/物件', others: '¥15,000〜30,000', highlight: false },
  { label: '初期費用', us: '¥100,000〜', others: '¥50,000〜200,000', highlight: false },
  { label: '解約金', us: '7ヶ月目以降 ¥0 ※', others: '¥30,000〜100,000', highlight: true },
  { label: '多言語対応', us: '4言語', others: '日英のみが多い', highlight: false },
  { label: '運営の見える化', us: 'リアルタイムダッシュボード', others: '月次レポート or なし', highlight: true },
  { label: 'OTA対応数', us: '主要5サイト+', others: 'Airbnbのみが多い', highlight: false },
  { label: 'ホストレビュー平均', us: '4.8 / 5.0 ※', others: '非公開が多い', highlight: true },
]

export default function PricingPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '料金' }]} />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* Hero */}
        <section className="relative bg-switch-charcoal text-white overflow-hidden">
          <div aria-hidden className="absolute -top-32 -right-24 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }} />
          <div className="relative container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-6 h-px bg-bright-teal" />
              <span className="eyebrow !text-bright-teal">Pricing · The Clean Math</span>
            </div>
            <div className="grid lg:grid-cols-[0.6fr_0.4fr] gap-10 lg:gap-20 items-end">
              <h1 className="heading-display text-white jp-keep">
                運営代行の料金、
                <br />
                <span className="font-sans font-light text-bright-teal">
                  ぜんぶ出します。
                </span>
              </h1>
              <p className="lead !text-white/75 jp-break">
                毎月の基本料金は、売上の8%＋月1万円/物件。初期費用・実費・希望制の有料オプションまで、かかりうる費用をこのページですべて開示します。
              </p>
            </div>

            {/* Summary strip */}
            <div className="mt-14 bg-white/5 border border-white/15 rounded-switch-lg px-8 py-6">
              <p className="text-body text-white/85 jp-break leading-relaxed">
                一般的な運用代行の手数料 <span className="font-sans text-[20px] text-white/60">15〜25%</span> に対し、
                SEKAI STAY は <span className="font-sans text-[24px] text-bright-teal">8%</span> ＋
                月 <span className="font-sans text-[20px] text-bright-teal">¥10,000/物件</span>。
                初期費用は乗り換え ¥100,000/物件・新規立ち上げ ¥200,000〜。
                解約金は7ヶ月目以降 ¥0（最低契約期間6ヶ月・解約のご連絡は3ヶ月前まで）。
              </p>
            </div>
          </div>
        </section>

        {/* Pricing panels — dark */}
        <section className="bg-ink text-ivory relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(22,123,129,0.5) 0%, transparent 70%)' }}
          />
          <div className="relative container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-6 h-px bg-bright-teal" />
              <span className="eyebrow !text-bright-teal">Cost Structure — Four Layers</span>
            </div>
            <h2 className="heading-hero !font-sans text-ivory jp-keep mb-6 max-w-3xl">
              かかりうる費用は、
              <span className="font-sans font-light text-bright-teal">この4層です。</span>
            </h2>
            <p className="text-body text-ivory/70 jp-break mb-14 max-w-2xl">
              毎月の基本料金・初期費用・実費・希望制の有料オプション。見積もりにない名目の請求はしません。
            </p>

            <div className="grid md:grid-cols-2 gap-px bg-ivory/10 border border-ivory/10">
              {/* 01 — Monthly base */}
              <div className="bg-ink p-10 md:p-12">
                <p className="eyebrow-mono text-ivory/50 mb-8">01 — 毎月の基本料金</p>

                <p className="eyebrow text-bright-teal mb-3">変動運営委託費</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-sans text-[14px] text-ivory">売上の</span>
                  <span className="font-sans font-light text-[64px] md:text-[88px] text-ivory leading-none tabular-nums">8</span>
                  <span className="font-sans font-light text-[36px] md:text-[44px] text-bright-teal">%</span>
                </div>
                <p className="font-sans text-[13px] text-ivory/60 mb-8">業界平均: 15〜25%</p>

                <div className="pt-8 border-t border-ivory/10">
                  <p className="eyebrow text-bright-teal mb-3">固定管理費</p>
                  <p className="font-sans text-[24px] text-ivory">
                    ¥10,000
                    <span className="text-[14px] text-ivory/60 font-sans ml-2">/ 1物件 / 月</span>
                  </p>
                </div>
              </div>

              {/* 02 — Initial */}
              <div className="bg-ink p-10 md:p-12">
                <div className="flex items-start justify-between mb-8">
                  <p className="eyebrow-mono text-ivory/50">02 — 初期費用（一度だけ）</p>
                  <span className="font-sans text-[14px] text-ivory/40">one-time</span>
                </div>

                <div className="pb-8 border-b border-ivory/10 mb-8">
                  <p className="eyebrow text-bright-teal mb-3">乗り換え（既存物件）</p>
                  <p className="font-sans text-[24px] text-ivory mb-3">
                    ¥100,000
                    <span className="text-[14px] text-ivory/60 font-sans ml-2">/ 物件</span>
                  </p>
                  <p className="text-body-sm text-ivory/70 jp-break">
                    移行作業・AI画像加工・リスティング最適化（多言語）まで含みます。移行中も予約は並走で引き継ぎ、収益の空白期間はありません。
                  </p>
                </div>

                <p className="eyebrow text-bright-teal mb-3">新規立ち上げ</p>
                <p className="font-sans text-[24px] text-ivory mb-3">
                  ¥200,000〜
                  <span className="text-[14px] text-ivory/60 font-sans ml-2">/ 物件</span>
                </p>
                <p className="text-body-sm text-ivory/70 jp-break">
                  リスティング作成・ハウスマニュアル・運用セットアップ等込み。Wi-Fi・消防設備・家具家電など物件側の設備実費は別途です。
                </p>
              </div>

              {/* 03 — Pass-through */}
              <div className="bg-ink p-10 md:p-12">
                <div className="flex items-start justify-between mb-8">
                  <p className="eyebrow-mono text-ivory/50">03 — 実費</p>
                  <span className="font-sans text-[14px] text-ivory/40">at cost</span>
                </div>

                <div className="pb-8 border-b border-ivory/10 mb-8">
                  <p className="eyebrow text-bright-teal mb-3">消耗品（アメニティ等）</p>
                  <p className="font-sans text-[20px] text-ivory mb-2">実費＋20% で精算</p>
                  <p className="text-body-sm text-ivory/70 jp-break">補充のたびに金額を明示して精算します。</p>
                </div>

                <p className="eyebrow text-bright-teal mb-3">清掃費</p>
                <p className="font-sans text-[20px] text-ivory mb-2">ゲストの宿泊料に含めて精算</p>
                <p className="text-body-sm text-ivory/70 jp-break">
                  オーナー様の月々の持ち出しはありません。清掃の手配・品質管理は基本料金に含まれます。
                </p>
              </div>

              {/* 04 — Optional add-ons */}
              <div className="bg-ink p-10 md:p-12">
                <div className="flex items-start justify-between mb-8">
                  <p className="eyebrow-mono text-ivory/50">04 — 有料オプション（希望制）</p>
                  <span className="font-sans text-[14px] text-ivory/40">optional</span>
                </div>

                <div className="grid grid-cols-1 gap-px bg-ivory/10 border border-ivory/10 mb-6">
                  {PAID_OPTIONS.map((item, i) => (
                    <div key={i} className="bg-ink/60 px-5 py-3 flex items-baseline gap-4">
                      <span className="eyebrow-mono text-ivory/50 !text-[9px]">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-body-sm text-ivory">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-body-sm text-ivory/70 jp-break">
                  ご希望のときだけ。すべて事前見積もり・後出しの請求はしません。
                </p>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/services#pricing"
                className="btn bg-ivory text-teal-ink hover:bg-bright-teal hover:text-ivory border-ivory"
              >
                収支シミュレーション
                <IconArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* Includes */}
        <section className="bg-switch-cloud">
          <div className="container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="rule-teal-sm" />
              <span className="eyebrow">What's Included</span>
            </div>
            <h2 className="heading-section text-ink jp-keep mb-14 max-w-2xl">
              基本料金に含まれる
              <span className="font-sans font-light text-sekai-teal">サービス。</span>
            </h2>

            <div className="grid sm:grid-cols-2 bg-switch-stone-border gap-px border border-switch-stone-border rounded-switch-lg overflow-hidden shadow-switch-card">
              {INCLUDES.map((item, i) => (
                <div key={i} className="bg-white px-6 py-7 flex items-baseline gap-5">
                  <span className="font-sans font-light text-[28px] text-sekai-teal leading-none tabular-nums flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-[15px] md:text-[16px] text-ink">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-switch-cloud">
          <div className="container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Side by Side</span>
            </div>
            <h2 className="heading-section text-ink jp-keep mb-14 max-w-2xl">
              他社との
              <span className="font-sans font-light text-sekai-teal">比較。</span>
            </h2>

            <div className="bg-white border border-switch-stone-border rounded-switch-lg overflow-hidden shadow-switch-card">
              <div className="grid grid-cols-3 border-b border-rule">
                <div className="p-5 bg-switch-cloud" />
                <div className="p-5 bg-switch-teal-deep text-center">
                  <p className="eyebrow !text-bright-teal">SEKAI STAY</p>
                </div>
                <div className="p-5 bg-switch-cloud text-center">
                  <p className="eyebrow text-mid-gray">業界平均</p>
                </div>
              </div>
              {COMPARE.map((row, i, arr) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 items-center ${i !== arr.length - 1 ? 'border-b border-rule' : ''}`}
                >
                  <div className="p-5 bg-switch-cloud">
                    <p className="font-sans text-[14px] text-ink">{row.label}</p>
                  </div>
                  <div className={`p-5 text-center ${row.highlight ? 'bg-[rgba(22,123,129,0.05)]' : ''}`}>
                    <p className="font-sans text-[16px] md:text-[20px] text-sekai-teal tabular-nums jp-keep">{row.us}</p>
                  </div>
                  <div className="p-5 text-center">
                    <p className="font-sans text-[13px] text-mid-gray">{row.others}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-caption text-mid-gray leading-relaxed jp-break max-w-3xl">
              ※ 解約金は最低契約期間6ヶ月の経過後（7ヶ月目以降）¥0。6ヶ月未満の途中解約は¥200,000、解約のご連絡は3ヶ月前までにお願いします。初期費用は乗り換え¥100,000/物件・新規立ち上げ¥200,000〜。ホストレビュー平均は SEKAI STAY 管理物件（Airbnb / Booking.com 掲載）の加重平均（2024-2025）。他社平均の料率・固定費・最低契約期間は各社公開情報からの一般的水準。実際の条件は契約形態により異なります。
            </p>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="bg-switch-cloud">
          <div className="container-narrow section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Pricing FAQ</span>
            </div>
            <h2 className="heading-section text-ink jp-keep mb-14 max-w-2xl">
              料金に関する、
              <span className="font-sans font-light text-sekai-teal">よくあるご質問。</span>
            </h2>

            <div>
              {PRICING_FAQ.map((f, i, arr) => (
                <div
                  key={i}
                  className={`py-8 grid grid-cols-[auto_1fr] gap-6 md:gap-10 ${
                    i !== arr.length - 1 ? 'border-b border-rule' : ''
                  }`}
                >
                  <span className="font-sans font-light text-[32px] text-sekai-teal leading-none tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-sans font-medium text-[17px] md:text-[19px] text-ink mb-4 leading-snug">
                      {f.q}
                    </h3>
                    <p className="text-body text-dark-gray jp-break max-w-prose-jp">{f.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-caption text-mid-gray text-center mt-10">
              さらに詳しいご質問は{' '}
              <Link href="/faq" className="text-sekai-teal border-b border-sekai-teal/40 hover:border-sekai-teal pb-0.5 font-sans">
                FAQページ
              </Link>{' '}
              をご覧ください。
            </p>
          </div>
        </section>

        {/* FAQPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: PRICING_FAQ.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'SEKAI STAY 民泊運用代行',
              description: '管理物件レビュー平均4.8の民泊運用代行サービス。OTA運用・ゲスト対応・清掃・プライシング最適化を一括代行。',
              brand: { '@type': 'Organization', name: 'SEKAI STAY' },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'JPY',
                lowPrice: '10000',
                highPrice: '200000',
                offerCount: '3',
                offers: [
                  { '@type': 'Offer', name: '初期費用（乗り換え）', price: '100000', priceCurrency: 'JPY', description: '1物件あたり。移行作業・AI画像加工・リスティング最適化（多言語）を含む。', availability: 'https://schema.org/InStock' },
                  { '@type': 'Offer', name: '初期費用（新規立ち上げ）', price: '200000', priceCurrency: 'JPY', description: '1物件あたり200,000円〜。リスティング作成・ハウスマニュアル・運用セットアップ等を含む。', availability: 'https://schema.org/InStock' },
                  { '@type': 'Offer', name: '月額固定管理費', price: '10000', priceCurrency: 'JPY', description: '1物件あたり月額10,000円。変動運営委託費は売上の8%。', availability: 'https://schema.org/InStock' },
                ],
              },
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '47', bestRating: '5' },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  )
}
