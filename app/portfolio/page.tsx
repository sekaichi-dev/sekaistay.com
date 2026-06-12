import type { Metadata } from 'next'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { IconStar, IconCheckCircle } from '@/components/Icons'

export const metadata: Metadata = {
  title: '運営実績',
  description: 'SEKAI STAYの運営実績。稼働率改善、レビュー評価向上、収益200%改善等の実績をご紹介。',
  openGraph: {
    title: '運営実績 | SEKAI STAY',
    description: '稼働率改善、レビュー評価向上、収益200%改善等の実績をご紹介。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/portfolio',
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: '運営実績 | SEKAI STAY',
    description: '稼働率改善、レビュー評価向上、収益200%改善等の実績をご紹介。',
  },
  alternates: { canonical: 'https://sekaistay.com/portfolio' },
}

const CASES = [
  {
    area: 'S様 — 湖畔の高級ヴィラ',
    spec: '高級ヴィラ / 220㎡ / 1日1組限定',
    tag: '高級ヴィラ',
    rating: '4.86',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop&q=80&auto=format',
    pctUp: '209',
    before: { occupancy: '32%', monthly: '185,000', annual: '2,220,000' },
    after: { occupancy: '67%', monthly: '387,000', annual: '4,644,000' },
    story: 'OTAのリスティング最適化と多言語対応により、海外富裕層の予約が大幅増加。ダイナミックプライシングで繁忙期の客単価を40%向上させ、年間収益を2倍以上に改善。',
  },
  {
    area: 'T様 — トレーラーハウス',
    spec: 'トレーラーハウス / 全4棟 / ペットOK',
    tag: 'トレーラーハウス',
    rating: '4.97',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=500&fit=crop&q=80&auto=format',
    pctUp: '178',
    before: { occupancy: '45%', monthly: '320,000', annual: '3,840,000' },
    after: { occupancy: '82%', monthly: '570,000', annual: '6,840,000' },
    story: 'ペット可物件として差別化を図り、ペット旅行需要を開拓。レビュー数を3倍に増やし、Airbnbホストレビュー4.9を獲得。稼働率は45%から82%に改善。',
  },
]

const BADGES = [
  'Airbnb ホストレビュー平均 4.7点',
  'Guest Favourite 物件あり',
  'Best of Minpaku 受賞',
  '住宅宿泊管理業 国土交通大臣(01)第F05780号',
]

const TESTIMONIALS = [
  {
    name: 'S様',
    property: '湖畔の高級ヴィラ（長野県）',
    text: '他社で稼働率30%台だった物件が、SEKAI STAYに切り替えてから67%まで改善しました。特に海外ゲストの取り込みが上手く、レビュー評価もみるみる上がっています。ダッシュボードで運用状況が細かく見える化されていて、安心してお任せしています。',
  },
  {
    name: 'T様',
    property: 'トレーラーハウス（千葉県）',
    text: 'レビュー数が3倍に増え、ホストレビュー4.9も獲得できました。ペット可物件としてのブランディングも提案してくれて、他の施設との差別化ができています。手数料も安いので、手取りが大幅に増えました。',
  },
]

const STATS = [
  { value: '4', unit: '年+', label: 'スタッフ平均運営歴' },
  { value: '4.7', unit: '', label: 'Airbnbレビュー平均' },
  { value: '95', unit: '%', label: '平均稼働率' },
  { value: '4.8', unit: '+', label: '平均ゲスト評価' },
]

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '運営実績' }]} />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* Chapter Ⅰ — masthead */}
        <section className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Track Record</p>
            </div>
            <h1 className="heading-display text-ink mb-5">
              民泊運営代行の実績
              <span className="block font-sans font-light text-mid-gray text-[0.6em] mt-3">Portfolio</span>
            </h1>
            <p className="lead text-dark-gray max-w-2xl">
              SEKAI STAYの運営代行で、収益が大幅に改善したオーナー様の実例をご紹介します。
            </p>
          </div>
        </section>

        {/* Chapter Ⅱ — Quality Stats dark band */}
        <section className="bg-ink text-ivory">
          <div className="container-edit px-5 md:px-8 section-lg">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow text-bright-teal">Quality Indicators</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ivory/10 border border-ivory/10">
              {STATS.map((s, i) => (
                <div key={i} className="bg-ink p-6 md:p-8">
                  <p className="eyebrow-mono text-bright-teal mb-3">№ {String(i + 1).padStart(2, '0')}</p>
                  <p className="font-sans font-light text-[44px] md:text-[64px] text-ivory leading-none tabular-nums">
                    {s.value}
                    <span className="font-sans text-[20px] text-bright-teal ml-1">{s.unit}</span>
                  </p>
                  <p className="font-sans text-caption text-ivory/70 mt-3">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅲ — Revenue Cases */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Revenue Results</p>
            </div>
            <h2 className="heading-section text-ink mb-14 max-w-3xl">
              民泊収益アップ
              <span className="font-sans text-sekai-teal">実績</span>
            </h2>

            <div className="space-y-10">
              {CASES.map((c, i) => (
                <article key={i} className="bg-paper border border-rule">
                  <div className="grid md:grid-cols-[1fr_1.2fr]">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto">
                      <img src={c.image} alt={c.area} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 bg-ivory/95 backdrop-blur-sm px-3 py-1 border border-rule">
                        <p className="eyebrow-mono text-ink">Case № {String(i + 1).padStart(2, '0')}</p>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-ink/90 backdrop-blur-sm text-ivory font-sans text-[12px] px-2.5 py-1">
                          <IconStar size={10} className="text-bright-teal" />
                          {c.rating}
                        </span>
                        <span className="bg-bright-teal/90 backdrop-blur-sm text-ink font-sans text-[11px] px-2.5 py-1">
                          {c.tag}
                        </span>
                      </div>
                    </div>

                    {/* Data */}
                    <div className="p-7 md:p-10">
                      <div className="mb-6 pb-5 border-b border-rule">
                        <p className="eyebrow-mono text-mid-gray mb-2">Case File</p>
                        <h3 className="font-sans font-medium text-[22px] md:text-[26px] text-ink leading-tight mb-2">{c.area}</h3>
                        <p className="font-sans text-caption text-mid-gray">{c.spec}</p>
                      </div>

                      {/* Big percentage — editorial feature */}
                      <div className="bg-ink text-ivory p-6 md:p-7 mb-8 flex items-baseline justify-between">
                        <p className="eyebrow-mono text-bright-teal">Revenue Uplift</p>
                        <p className="font-sans font-light text-[56px] md:text-[72px] leading-none tabular-nums">
                          {c.pctUp}<span className="text-bright-teal text-[28px] ml-1">%</span>
                        </p>
                      </div>

                      {/* Before/After ledger */}
                      <div className="border-t border-rule">
                        <div className="grid grid-cols-[1fr_1fr_1fr] py-3 border-b border-rule">
                          <span className="eyebrow-mono text-mid-gray">—</span>
                          <span className="eyebrow-mono text-mid-gray text-center">Before</span>
                          <span className="eyebrow text-sekai-teal text-center">SEKAI STAY</span>
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_1fr] py-3 border-b border-rule items-baseline">
                          <span className="font-sans text-body-sm text-dark-gray">稼働率</span>
                          <span className="font-sans text-body-sm text-mid-gray text-center line-through">{c.before.occupancy}</span>
                          <span className="font-sans text-[18px] text-ink text-center tabular-nums">{c.after.occupancy}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_1fr] py-3 border-b border-rule items-baseline">
                          <span className="font-sans text-body-sm text-dark-gray">粗利（月）</span>
                          <span className="font-sans text-body-sm text-mid-gray text-center line-through">¥{c.before.monthly}</span>
                          <span className="font-sans text-[18px] text-ink text-center tabular-nums">¥{c.after.monthly}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_1fr] py-3 items-baseline">
                          <span className="font-sans text-body-sm text-dark-gray">粗利（年）</span>
                          <span className="font-sans text-body-sm text-mid-gray text-center line-through">¥{c.before.annual}</span>
                          <span className="font-sans text-[18px] text-sekai-teal text-center tabular-nums">¥{c.after.annual}</span>
                        </div>
                      </div>

                      <p className="font-sans text-body-sm text-dark-gray leading-[1.95] mt-6 pt-6 border-t border-rule">
                        {c.story}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅳ — Credential badges */}
        <section className="bg-bone border-y border-rule section-lg">
          <div className="container-edit px-5 md:px-8">
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className="h-px w-10 bg-rule" />
              <p className="eyebrow text-sekai-teal">Credentials</p>
              <span className="h-px w-10 bg-rule" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {BADGES.map((text, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 bg-paper border border-rule px-5 py-3 font-sans text-[13px] text-ink"
                >
                  <IconCheckCircle size={13} className="text-sekai-teal" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅴ — Testimonials */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8 max-w-5xl">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Voice</p>
            </div>
            <h2 className="heading-section text-ink mb-14 max-w-3xl">
              お客様の
              <span className="font-sans text-sekai-teal">声</span>
            </h2>
            <div className="bg-rule grid md:grid-cols-2 gap-px border border-rule">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-paper p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6 pb-5 border-b border-rule">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ink text-ivory flex items-center justify-center font-sans font-medium text-[18px]">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-sans font-medium text-[15px] text-ink">{t.name}</p>
                        <p className="font-sans text-caption text-mid-gray mt-0.5">{t.property}</p>
                      </div>
                    </div>
                    <p className="eyebrow-mono text-sekai-teal">Voice № {String(i + 1).padStart(2, '0')}</p>
                  </div>
                  <blockquote className="border-l-2 border-sekai-teal pl-5">
                    <p className="font-sans text-body-sm text-dark-gray leading-[2]">{t.text}</p>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
