import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import EditorialSimulator from '@/components/EditorialSimulator'
import ServiceBucketsInteractive from '@/components/services/ServiceBucketsInteractive'
import { IMG } from '@/lib/images'
import { IconArrowRight } from '@/components/Icons'

export const metadata: Metadata = {
  title: '民泊運営サービス',
  description: 'SEKAI STAYの民泊運用代行サービス。手数料8%で開業準備から運用管理・集客まで一括対応。運営実績・オーナー様の声・料金設計もご確認いただけます。',
  openGraph: {
    title: '民泊運営サービス | SEKAI STAY',
    description: '手数料8%で開業準備から運用管理・集客まで一括対応。9つのサービスをワンストップで提供。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/services',
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: '民泊運営サービス | SEKAI STAY',
    description: '手数料8%で開業準備から運用管理・集客まで一括対応。9つのサービスをワンストップで提供。',
  },
  alternates: { canonical: 'https://sekaistay.com/services' },
}

// 9 サービスを 3 バケットに整理 (Guesty 着想・効果ファースト分類)
const SERVICE_BUCKETS = [
  {
    id: 'demand',
    label: '集客・予約最大化',
    sublabel: 'Distribution & Demand',
    description: '物件を「見つけられる・選ばれる」状態にする。OTA戦略・写真・価格設計まで一気通貫で。',
    services: [
      { title: 'マルチOTA掲載', desc: 'エリアや物件特性を活かし、Airbnb・Booking.com・Vrbo・Expedia等の複数OTAに最適な形で掲載。1つのOTAに留まらず、集客チャネルを最大化します。', details: ['物件特性に合ったOTA選定', 'エリア別の最適掲載戦略', '複数OTA間の在庫同期', '掲載コンテンツの継続最適化'], image: IMG.svcOta },
      { title: '画像技術・掲載最適化', desc: 'プロカメラマン不要。お手持ちのスマホで撮影いただいた写真を、弊社の画像加工システムでトンマナを統一し、プロ品質のリスティングに仕上げます。', details: ['スマホ写真をプロ品質に加工', 'ブランドトンマナの自動統一', 'OTA最適サイズへのリサイズ', '掲載写真の継続的な改善提案'], image: IMG.svcPhoto },
      { title: 'ダイナミックプライシング', desc: '周辺の競合価格、季節変動、イベント情報、予約動向をリアルタイムに分析。最適な価格を自動設定し、稼働率と売上の最大化を図ります。', details: ['競合物件の価格モニタリング', '需要予測に基づく価格自動調整', '長期滞在・直前割引の最適化', '収益のリアルタイム確認'], image: IMG.svcPricing },
    ],
  },
  {
    id: 'operations',
    label: '運営・ゲスト対応',
    sublabel: 'Operations & Guest Care',
    description: '予約からチェックアウトまで、日々の現場をまるごと代行。オーナーは成果だけ見ればいい状態に。',
    services: [
      { title: '民泊運営代行', desc: '集客・インバウンド対応・清掃までワンストップ代行。AirbnbやBooking.comなどのOTA運用は専属チームが対応し、予約管理からゲスト対応まで一括で代行します。', details: ['複数OTAへの最適掲載', '24時間多言語ゲスト対応', '予約・売上管理', 'レビュー管理・改善'], image: IMG.svcManagement },
      { title: 'マンスリー運営', desc: '民泊新法の180日規制外も逃さず稼働。マンスリー賃貸と民泊を柔軟に組み合わせ、年間の収益を最大化する戦略をご提案します。', details: ['民泊＋マンスリー併用戦略', '法令遵守の稼働日数管理', 'マンスリー専用OTA掲載', '年間収益シミュレーション'], image: IMG.svcMonthly },
      { title: '清掃・メンテナンス', desc: 'ゲストの評価に直結するハイクオリティな清掃を徹底管理。専属スタッフがチェックリストに基づき品質を保証します。', details: ['チェックアウト後の清掃手配', 'リネン・アメニティ在庫管理', '設備の定期点検・修繕', '清掃品質チェックリスト検品'], image: IMG.svcCleaning },
    ],
  },
  {
    id: 'growth',
    label: '開業・成長支援',
    sublabel: 'Launch & Growth',
    description: '立ち上げから収益最大化まで、データと経験で伴走。リアルタイムダッシュボードと3ヶ月毎のオンライン定例ミーティング付き。',
    services: [
      { title: '開業支援', desc: '民泊開業に必要な集客戦略、インバウンド対応、オペレーション構築などを支援し最短で安定した運営を実現。初めての方でも安心してスタートできます。', details: ['事業計画・収益シミュレーション', 'オペレーション体制構築', 'OTA初期設定・掲載開始', '物件の差別化戦略立案'], image: IMG.svcStartup },
      { title: 'オーナーダッシュボード', desc: '24時間いつでもどこでもアクセス可能なオーナー専用ダッシュボード。リアルタイムで収益・稼働状況・レビューを確認。さらに3ヶ月毎のオンライン定例ミーティングで、データに基づいた改善提案を実施。', details: ['リアルタイム収支・稼働率表示', '24h / PC・スマホ対応', '3ヶ月毎のオンライン定例ミーティング', 'データに基づく改善提案'], image: IMG.svcDashboard },
      { title: 'コンサルティング', desc: '豊富な実績に基づき、開業前の事業コンセプトから成功を支援。物件の収益ポテンシャルを最大化するための戦略をご提案します。', details: ['物件診断・収益分析', '競合調査・エリア分析', '投資回収期間の試算', '運営改善提案'], image: IMG.svcConsulting },
    ],
  },
]

const REVENUE_CASES = [
  { area: '京都 / 町家ヴィラ', spec: '一棟貸し / 町家リノベーション / 最大8名', pctUp: '209', before: { monthly: '185,000', annual: '2,220,000' }, after: { monthly: '387,000', annual: '4,644,000' }, image: IMG.propKyoto },
  { area: '湖畔 / 高級ヴィラ', spec: '高級ヴィラ / 220㎡ / 1日1組限定', pctUp: '178', before: { monthly: '320,000', annual: '3,840,000' }, after: { monthly: '570,000', annual: '6,840,000' }, image: IMG.propVilla },
]

const TESTIMONIALS = [
  { name: 'S様', role: '湖畔ヴィラオーナー', text: '前の代行会社では手数料20%で月の手取りが少なく不満でした。SEKAI STAYに切り替えてから手数料8%で手取りが大幅アップ。ダッシュボードでいつでも収益が確認できるのも安心です。', rating: '4.9' },
  { name: 'T様', role: 'トレーラーハウスオーナー', text: '自主運営に限界を感じていたところ、SEKAI STAYに相談。手続きから掲載まで任せてすぐにスタートでき、スマホで撮った写真もプロ品質に仕上げてくれました。ダッシュボードで運用状況がいつでも見えるので信頼しています。', rating: '5.0' },
  { name: 'K様', role: '都心マンションオーナー', text: '他社から乗り換えました。移行作業を全部任せられて、OTAアカウントの引き継ぎ中も営業が止まりませんでした。ゲスト対応の質が上がりレビューも改善。8%の手数料は本当に革命的です。', rating: '4.8' },
]

export default function ServicesPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '民泊運営サービス' }]} />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* Hero — Editorial */}
        <section className="relative bg-switch-charcoal text-white overflow-hidden">
          <div aria-hidden className="absolute -top-32 -right-24 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }} />
          <div className="relative container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-6 h-px bg-bright-teal" />
              <span className="eyebrow !text-bright-teal">Services · Full Spectrum</span>
            </div>
            <div className="grid lg:grid-cols-[0.6fr_0.4fr] gap-10 lg:gap-20 items-end">
              <h1 className="heading-display text-white jp-keep">
                民泊運営を支える、
                <br />
                <span className="font-sans font-light text-bright-teal">
                  ワンストップの設計。
                </span>
              </h1>
              <p className="lead !text-white/75 jp-break">
                開業準備から運営代行、収益管理まで、すべてを一つの窓口で。
                <span className="text-bright-teal font-medium">手数料8%</span>で高品質な運営を実現します。
              </p>
            </div>
          </div>
        </section>

        {/* 8% Statement band */}
        <section className="bg-ink text-ivory relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(22,123,129,0.5) 0%, transparent 70%)' }}
          />
          <div className="relative container-edit section-lg">
            <div className="grid md:grid-cols-[auto_1fr_auto] gap-10 items-center">
              <div>
                <p className="eyebrow-mono text-bright-teal mb-4">Flat Fee — Industry Reset</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans font-light text-[64px] md:text-[88px] text-ivory leading-none tracking-tight tabular-nums">
                    8
                  </span>
                  <span className="font-sans font-light text-[36px] md:text-[48px] text-bright-teal leading-none">
                    %
                  </span>
                </div>
              </div>
              <div className="hidden md:block w-px self-stretch bg-ivory/15" />
              <div>
                <p className="font-sans text-[18px] md:text-[22px] text-ivory mb-3 leading-snug">
                  標準サービスは、すべてこの基本料金に含まれています。
                </p>
                <p className="text-body-sm text-ivory/90">
                  基本料金は 8%＋月額¥10,000/物件（他社平均 15〜25%）。オプションは事前見積もりです。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Buckets — 3 categories instead of flat list */}
        <section className="bg-paper">
          <div className="container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Service Catalog</span>
            </div>
            <h2 className="heading-section text-ink jp-keep mb-14 max-w-3xl">
              全機能を、3つの目的別に整理。
            </h2>

            <ServiceBucketsInteractive buckets={SERVICE_BUCKETS} />
          </div>
        </section>

        {/* Results */}
        <section className="bg-switch-cloud">
          <div className="container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Results · Before / After</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end heading-mb">
              <h2 className="heading-hero text-ink jp-keep">
                収益は、
                <span className="font-sans font-light text-sekai-teal">数字で、証明する。</span>
              </h2>
              <p className="lead text-dark-gray jp-break">
                SEKAI STAYに切り替えたオーナー様の、実際の収益改善データ。
                同じ売上でも、手取りが圧倒的に違います。
              </p>
            </div>

            {/* Quality stats — dark band (portfolio スタイル踏襲) */}
            <div className="bg-switch-teal-deep text-white rounded-switch-lg overflow-hidden border border-white/10 mb-10">
              <div className="grid grid-cols-2 gap-px bg-white/10">
                <div className="bg-switch-teal-deep px-6 py-6 md:px-8 md:py-7">
                  <p className="eyebrow-mono text-bright-teal mb-3 !text-[10px]">Airbnb — Host Rating</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-sans font-light text-[40px] md:text-[52px] text-white leading-none tabular-nums">4.7</span>
                    <span className="font-sans text-[14px] text-white/85">／5.0</span>
                  </div>
                </div>
                <div className="bg-switch-teal-deep px-6 py-6 md:px-8 md:py-7">
                  <p className="eyebrow-mono text-bright-teal mb-3 !text-[10px]">Booking.com — Review Score</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-sans font-light text-[40px] md:text-[52px] text-white leading-none tabular-nums">4.8</span>
                    <span className="font-sans text-[14px] text-white/85">／5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue cases — compact w/ property photo (grid for reliable image stretch) */}
            <div className="grid md:grid-cols-2 gap-6">
              {REVENUE_CASES.map((c, i) => (
                <article key={i} className="bg-white border border-switch-stone-border rounded-switch-lg shadow-switch-card overflow-hidden grid grid-cols-1 md:grid-cols-[2fr_3fr]">
                  {/* Property photo — absolute fill, always renders */}
                  <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.area}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0.1) 0%, rgba(26,26,26,0.65) 100%)' }}
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center bg-ivory/95 backdrop-blur-sm border border-rule text-ink px-3 py-1 eyebrow-mono !text-[10px] tracking-[0.18em]">
                      Case № {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="absolute bottom-3 left-4 right-4 text-ivory">
                      <h3 className="font-sans font-medium text-[15px] md:text-[16px] leading-tight jp-keep mb-0.5">
                        {c.area}
                      </h3>
                      <p className="text-[10.5px] text-ivory/90">{c.spec}</p>
                    </div>
                  </div>

                  {/* Compact stats */}
                  <div className="p-5 md:p-6 flex flex-col justify-center">
                    <p className="eyebrow-mono text-sekai-teal mb-1.5 !text-[9.5px]">Revenue Uplift</p>
                    <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-rule">
                      <span className="font-sans font-light text-[36px] md:text-[42px] text-ink leading-none tabular-nums">
                        {c.pctUp}
                      </span>
                      <span className="font-sans text-[16px] text-sekai-teal">%</span>
                    </div>

                    <div className="space-y-2 text-[12px]">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="eyebrow-mono text-dark-gray !text-[9px]">月次</span>
                        <div className="flex items-baseline gap-1.5 flex-wrap justify-end">
                          <span className="font-sans text-[11px] text-dark-gray line-through">¥{c.before.monthly}</span>
                          <span className="text-dark-gray text-[11px]">→</span>
                          <span className="font-sans font-medium text-ink tabular-nums">¥{c.after.monthly}</span>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="eyebrow-mono text-dark-gray !text-[9px]">年次</span>
                        <div className="flex items-baseline gap-1.5 flex-wrap justify-end">
                          <span className="font-sans text-[11px] text-dark-gray line-through">¥{c.before.annual}</span>
                          <span className="text-dark-gray text-[11px]">→</span>
                          <span className="font-sans font-medium text-ink tabular-nums">¥{c.after.annual}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link href="/portfolio" className="btn btn-ghost">
                実績をもっとみる
                <IconArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-switch-cloud">
          <div className="container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Owner Voices</span>
            </div>
            <h2 className="heading-section text-ink jp-keep mb-14 max-w-2xl">
              オーナー様からの
              <span className="font-sans font-light text-sekai-teal">声。</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <figure key={i} className="bg-white border border-switch-stone-border rounded-switch-lg shadow-switch-card p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-6 pb-5 border-b border-rule">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-mist border border-rule flex items-center justify-center">
                        <span className="font-sans text-[16px] text-sekai-teal">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-sans text-[14px] text-ink">{t.name}</p>
                        <p className="text-caption text-dark-gray">{t.role}</p>
                      </div>
                    </div>
                    <span className="font-sans text-[16px] text-sekai-teal tabular-nums">
                      ★ {t.rating}
                    </span>
                  </div>
                  <blockquote className="font-sans text-[14.5px] text-dark-gray leading-relaxed flex-1 jp-break">
                    「{t.text}」
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing — dark editorial with inline simulator */}
        <section id="pricing" className="bg-ink text-ivory relative overflow-hidden scroll-mt-24">
          <div
            aria-hidden
            className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(22,123,129,0.5) 0%, transparent 70%)' }}
          />
          <div className="relative container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-6 h-px bg-bright-teal" />
              <span className="eyebrow !text-bright-teal">Clear Pricing</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end heading-mb">
              <h2 className="heading-hero !font-sans text-ivory jp-keep">
                明確な、
                <span className="font-sans font-light text-bright-teal">料金設計。</span>
              </h2>
              <p className="text-body md:text-body-lg text-ivory font-normal jp-break leading-relaxed">
                民泊運営代行をご利用いただく際には、開業準備時の初期費用と、運営開始後の月額運営費用が発生します。<span className="text-bright-teal font-medium">下のシミュレーターで、あなたの物件での試算をご確認ください。</span>
              </p>
            </div>

            {/* Centered: compact cost strip on top, simulator below */}
            <div className="max-w-3xl mx-auto mb-10">
              {/* Compact cost summary — 3 cells above the simulator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ivory/10 border border-ivory/10 rounded-switch-lg overflow-hidden">
                <div className="bg-ink px-5 py-5 md:px-6">
                  <p className="eyebrow-mono text-bright-teal mb-2.5 !text-[9.5px]">01 — Initial Cost</p>
                  <p className="font-sans font-light text-ivory leading-none">
                    <span className="text-[34px] tabular-nums">10</span>
                    <span className="text-[15px] text-bright-teal ml-0.5">万円</span>
                  </p>
                  <p className="text-[11px] text-ivory/70 mt-2 leading-snug jp-keep">乗り換え1物件・新規は¥20万〜</p>
                </div>
                <div className="bg-ink px-5 py-5 md:px-6">
                  <p className="eyebrow-mono text-bright-teal mb-2.5 !text-[9.5px]">02 — Running Cost</p>
                  <p className="font-sans font-light text-ivory leading-none">
                    <span className="text-[34px] tabular-nums">¥10,000</span>
                  </p>
                  <p className="text-[11px] text-ivory/70 mt-2 leading-snug jp-keep">固定管理費 / 1部屋 / 月</p>
                </div>
                <div className="bg-ink px-5 py-5 md:px-6">
                  <p className="eyebrow-mono text-bright-teal mb-2.5 !text-[9.5px]">変動運営委託費</p>
                  <p className="font-sans font-light text-ivory leading-none">
                    <span className="text-[15px] text-ivory/80">売上の</span>
                    <span className="text-[34px] tabular-nums ml-0.5">8</span>
                    <span className="text-[18px] text-bright-teal">%</span>
                  </p>
                  <p className="text-[11px] text-ivory/70 mt-2 leading-snug jp-keep">他社平均 15〜25%</p>
                </div>
              </div>
              <p className="text-[11px] text-ivory/55 mt-3 leading-relaxed jp-break">
                ※ 初期費用には移行作業・AI画像加工・リスティング最適化まで含みます。消耗品などの実費・希望制の有料オプションは別途（事前見積もり）。
              </p>

              {/* Simulator (light panel inside dark section) */}
              <div className="bg-paper text-ink p-8 md:p-10 border border-ivory/10 mt-px">
                <div className="flex items-baseline justify-between mb-6">
                  <p className="eyebrow-mono text-sekai-teal">03 — Estimate</p>
                  <span className="font-sans text-[12px] text-dark-gray">10秒で完了</span>
                </div>
                <h3 className="font-sans font-medium text-[20px] md:text-[22px] text-ink leading-snug mb-6 jp-keep">
                  あなたの物件、SEKAI STAYで
                  <span className="text-sekai-teal">どう変わる？</span>
                </h3>
                <EditorialSimulator />
              </div>
            </div>

            {/* Comparison table — editorial ledger */}
            <div className="bg-paper text-ink border border-ivory/10">
              <div className="grid grid-cols-3 border-b border-rule">
                <div className="p-4 bg-mist" />
                <div className="p-4 bg-ink text-center">
                  <p className="eyebrow !text-bright-teal">SEKAI STAY</p>
                </div>
                <div className="p-4 bg-mist text-center">
                  <p className="eyebrow text-dark-gray">業界平均</p>
                </div>
              </div>
              {[
                ['運営手数料', '8%', '15〜25%'],
                ['初期費用', '10万円（乗り換え）', '10〜30万円'],
                ['解約金', '7ヶ月目以降 ¥0', '1〜3ヶ月分'],
                ['最低契約期間', '6ヶ月', '6〜12ヶ月'],
                ['オーナーダッシュボード', 'リアルタイム表示', '月次報告のみ'],
                ['定例ミーティング', '3ヶ月毎（オンライン）', 'なし〜不定期'],
                ['画像加工', 'スマホ写真OK', 'カメラマン手配別料金'],
                ['マルチOTA掲載', '標準対応', 'オプション料金'],
                ['清掃管理', '標準対応', '別途清掃費'],
              ].map(([label, sekai, other], i, arr) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 items-center ${i !== arr.length - 1 ? 'border-b border-rule' : ''}`}
                >
                  <div className="p-5 bg-mist">
                    <p className="font-sans text-[14px] text-ink">{label}</p>
                  </div>
                  <div className="p-5 text-center">
                    <p className="font-sans text-[18px] text-sekai-teal tabular-nums">{sekai}</p>
                  </div>
                  <div className="p-5 text-center">
                    <p className="font-sans text-[13px] text-dark-gray">{other}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-switch-cloud">
          <div className="container-edit section-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Process · From Inquiry to Launch</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end heading-mb">
              <h2 className="heading-hero text-ink jp-keep">
                開業から運営まで、
                <span className="font-sans font-light text-sekai-teal">最短二週間。</span>
              </h2>
              <p className="lead text-dark-gray jp-break">
                「契約締結」から「開業」まで、無駄のない5ステップで進行します。
              </p>
            </div>

            <ol className="relative">
              <div
                aria-hidden
                className="hidden md:block absolute left-[92px] top-6 bottom-6 w-px bg-rule"
              />
              {[
                { step: '01', title: 'ヒアリング・物件診断', desc: 'お客様のご希望と物件の詳細をお伺いし、収益ポテンシャルを分析。最適な運営方法をご提案します。' },
                { step: '02', title: '収支シミュレーション・ご提案', desc: '物件の立地や特徴に応じた収支シミュレーションを作成。事業計画を明確にします。' },
                { step: '03', title: '契約締結', desc: '運営委託契約を締結。民泊管理全般をお任せいただける体制が整います。' },
                { step: '04', title: '開業準備', desc: '画像加工、OTA開設、オペレーション体制の構築を同時並行で進めます。' },
                { step: '05', title: '運営開始', desc: '集客と運営を開始。運営代行チームがサポートし、収益化を加速させます。' },
              ].map((f, i, arr) => {
                const isLast = i === arr.length - 1
                return (
                  <li
                    key={i}
                    className={`relative grid md:grid-cols-[180px_1fr] gap-4 md:gap-12 items-start py-8 md:py-10 ${!isLast ? 'border-b border-rule' : ''}`}
                  >
                    <span className="font-sans font-light text-[44px] md:text-[56px] text-sekai-teal leading-none tabular-nums">
                      {f.step}
                    </span>
                    <div className="relative">
                      <span
                        aria-hidden
                        className="hidden md:block absolute -left-[88px] top-3 w-3 h-3 rounded-full bg-sekai-teal ring-4 ring-switch-cloud"
                      />
                      <h3 className="font-sans font-medium text-[22px] md:text-[26px] text-ink mb-4 leading-snug">
                        {f.title}
                      </h3>
                      <p className="text-body text-dark-gray jp-break max-w-prose-jp">{f.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <div className="mt-14 md:mt-16 pt-10 border-t border-rule flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div>
                <p className="eyebrow-mono text-dark-gray mb-3">Next Step</p>
                <p className="font-sans text-[20px] md:text-[22px] text-ink">
                  まずは、お話を聞かせてください。
                </p>
              </div>
              <Link href="/contact" className="group inline-flex items-center justify-center gap-2.5 bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-[15px] px-8 py-4 rounded-switch-md transition shadow-switch-card">
                無料で相談する
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
