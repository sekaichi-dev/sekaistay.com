import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import Breadcrumb from '@/components/Breadcrumb'
import { getAreaBySlug, getAllAreas } from '@/lib/areas'
import { getOfficeForArea, getHQOffice } from '@/lib/offices'
import { IconArrowRight } from '@/components/Icons'

const SITE_URL = 'https://sekaistay.com'
const OUR_RATE = 0.08
const COMPETITOR_RATE = 0.20
const SEKAI_FIXED_ANNUAL = 120000 // 月額固定費 ¥10,000 × 12

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const areas = getAllAreas()
  return areas.map(area => ({ slug: area.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = getAreaBySlug(params.slug)
  if (!area) return {}

  const title = `${area.name}の民泊運用代行 | SEKAI STAY`
  const description = `${area.name}（${area.prefecture}）での民泊運用代行はSEKAI STAYにお任せ。手数料8%でOTA掲載管理・ゲスト対応・清掃手配・プライシング最適化を一括代行します。`
  const url = `${SITE_URL}/area/${area.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'SEKAI STAY',
      locale: 'ja_JP',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

function LocalBusinessJsonLd({ area }: { area: { name: string; prefecture: string; slug: string } }) {
  const office = getOfficeForArea(area.slug) || getHQOffice()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `SEKAI STAY ${office.name}`,
    description: `${area.name}の民泊運用代行サービス`,
    url: `${SITE_URL}/area/${area.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressRegion: office.prefecture,
      addressLocality: office.addressShort,
      addressCountry: 'JP',
    },
    serviceArea: {
      '@type': 'AdministrativeArea',
      name: area.prefecture,
    },
    serviceType: '民泊運用代行',
    priceRange: '¥¥',
    telephone: office.phone,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: office.phone,
      availableLanguage: ['ja', 'en', 'zh', 'ko'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

function ServiceJsonLd({ area }: { area: { name: string; prefecture: string; slug: string } }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${area.name}の民泊運用代行`,
    description: `SEKAI STAYが${area.name}での民泊運営をサポートします`,
    provider: {
      '@type': 'Organization',
      name: 'SEKAI STAY',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: area.prefecture,
    },
    url: `${SITE_URL}/area/${area.slug}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function AreaDetailPage({ params }: Props) {
  const area = getAreaBySlug(params.slug)
  if (!area) notFound()

  const monthlyRevenue = area.avgRevenue
  const ourAnnualFee = monthlyRevenue * OUR_RATE * 12 + SEKAI_FIXED_ANNUAL
  const competitorAnnualFee = monthlyRevenue * COMPETITOR_RATE * 12
  const yearlyDiff = competitorAnnualFee - ourAnnualFee

  const faqs = [
    {
      question: `${area.name}での民泊運営、どの程度の収益が期待できますか？`,
      answer: `${area.name}での平均月間運営実績は約${(area.avgRevenue / 10000).toFixed(0)}万円です（立地・グレード・稼働率で変動）。手数料8%のSEKAI STAYなら、手元に残る利益を大きく増やせます。まずは無料診断で物件のポテンシャルを確認してください。`,
    },
    {
      question: `SEKAI STAYは${area.name}での実績がありますか？`,
      answer: `はい。${area.name}での民泊運営サポート実績が多数あります。地域の宿泊トレンド、季節変動、オーナー様の課題に対して、${area.name}に特化した最適な運営戦略をご提案できます。`,
    },
    {
      question: `${area.name}への移管手続きはどのように進みますか？`,
      answer: `現在ご利用中のOTA（Airbnb、Booking.com等）から弊社への管理移行は、最短2週間で完了します。既存ゲスト対応からの引継ぎまで、移行作業はすべて当社が対応し、移行中も営業が止まらないよう調整します（初期費用¥100,000/物件）。`,
    },
    {
      question: `${area.name}の民泊運用代行の料金はいくらですか？`,
      answer: `初期費用は乗り換え¥100,000/物件（移行作業・AI画像加工・リスティング最適化込み）・新規立ち上げ¥200,000〜、固定管理費10,000円/物件/月、変動運営委託費は売上の8%です。一般的な運用代行の15〜25%に対して大幅に低い水準で、解約金は7ヶ月目以降¥0（6ヶ月未満の途中解約は¥200,000）。${area.name}でも全国一律の料金でご利用いただけます。`,
    },
    {
      question: `${area.name}で民泊運営をする際の許認可はどうなりますか？`,
      answer: `物件条件や運用方針に応じて、住宅宿泊事業法（民泊新法）／旅館業法（簡易宿所）の最適な許認可をSEKAI STAYがご提案し、届出から運用まで一気通貫で代行します。`,
    },
  ]

  const services = [
    {
      title: 'OTA掲載管理',
      description:
        'Airbnb・Booking.com・楽天トラベル等、複数OTAへの掲載と最適化をまるごと代行。',
    },
    {
      title: '24時間多言語ゲスト対応',
      description:
        '日本語、英語、中国語(簡体字・繁体字)、韓国語での対応体制。ゲストの問い合わせに24時間以内に返信。',
    },
    {
      title: '清掃・メンテナンス手配',
      description:
        'チェックアウト後の清掃から、定期的なメンテナンスまで。全国のネットワークで対応します。',
    },
    {
      title: 'プライシング最適化',
      description:
        '季節・曜日・イベント・競合を加味した動的価格で、収益を最大化します。',
    },
  ]

  const office = getOfficeForArea(area.slug)

  return (
    <>
      <Header />
      <LocalBusinessJsonLd area={area} />
      <ServiceJsonLd area={area} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: '対応エリア', href: '/case-studies#area' },
          { label: `${area.name}の民泊運用代行` },
        ]}
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
              <p className="eyebrow !text-bright-teal">Area Guide · {area.prefecture}</p>
            </div>
            <h1 className="heading-display text-white mb-4">
              {area.name}
              <span className="block font-sans text-bright-teal text-[0.65em] mt-3">民泊運用代行ならSEKAI STAY</span>
            </h1>
            <p className="lead !text-white/75 mt-8 max-w-2xl">
              {area.prefecture}でのOTA運営・ゲスト対応・清掃手配・プライシング最適化を、手数料8%で一括代行します。
            </p>

            {/* Comparison pill — editorial */}
            <div className="mt-10 bg-white/5 border border-white/15 rounded-switch-md px-6 py-5 max-w-2xl">
              <p className="eyebrow-mono text-white/60 mb-2">Market Comparison</p>
              <p className="font-sans text-body-sm md:text-[15px] text-white/75 leading-[1.9]">
                一般的な運用代行の手数料 <span className="font-sans text-white/55">15〜25%</span> に対し、SEKAI STAYは
                <span className="font-sans text-bright-teal mx-1">8%＋月10,000円/物件</span>。
              </p>
            </div>
          </div>
        </section>

        {/* Chapter Ⅱ — Why this area */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Market Brief</p>
            </div>
            <h2 className="heading-section text-ink mb-12 max-w-3xl">
              {area.name}で民泊運営が
              <span className="font-sans text-sekai-teal">成功する理由。</span>
            </h2>

            <div className="bg-rule grid grid-cols-1 md:grid-cols-2 gap-px border border-rule">
              {area.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="bg-white p-7 md:p-9"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-sans font-light text-[44px] md:text-[56px] text-sekai-teal leading-none tabular-nums flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="eyebrow-mono text-mid-gray mb-2">Reason № {String(i + 1).padStart(2, '0')}</p>
                      <span className="block w-6 h-px bg-sekai-teal mb-4" />
                      <p className="font-sans text-body md:text-[16px] text-dark-gray leading-[1.95]">
                        {highlight}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅲ — Revenue simulation */}
        <section className="bg-switch-charcoal text-white relative overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 right-0 w-[36rem] h-[36rem] rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
          />
          <div className="container-edit px-5 md:px-8 section-xl relative">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow text-bright-teal">Ledger</p>
            </div>
            <h2 className="font-sans font-bold text-[26px] sm:text-[32px] md:text-[40px] leading-[1.3] mb-12 max-w-3xl">
              {area.name}での
              <span className="block font-sans text-bright-teal">収益シミュレーション</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
              <div className="bg-switch-charcoal p-7 md:p-9">
                <p className="eyebrow-mono text-bright-teal mb-3">Monthly Avg Revenue</p>
                <p className="font-sans font-light text-[44px] md:text-[56px] text-white leading-none tabular-nums">
                  ¥{(monthlyRevenue / 10000).toFixed(1)}
                  <span className="font-sans text-[20px] text-white/70 ml-2">万</span>
                </p>
              </div>
              <div className="bg-switch-charcoal p-7 md:p-9">
                <p className="eyebrow-mono text-white/55 mb-3">Industry 20% / Annual</p>
                <p className="font-sans font-light text-[36px] md:text-[44px] text-white/60 leading-none tabular-nums line-through">
                  ¥{(competitorAnnualFee / 10000).toFixed(1)}
                  <span className="font-sans text-[16px] ml-2">万</span>
                </p>
              </div>
              <div className="bg-bright-teal/10 p-7 md:p-9 border-l border-bright-teal/30">
                <p className="eyebrow-mono text-bright-teal mb-3">SEKAI STAY 8% / Annual</p>
                <p className="font-sans font-light text-[44px] md:text-[56px] text-bright-teal leading-none tabular-nums">
                  ¥{(ourAnnualFee / 10000).toFixed(1)}
                  <span className="font-sans text-[20px] ml-2">万</span>
                </p>
              </div>
            </div>

            {/* Savings Highlight */}
            <div className="mt-px bg-bright-teal text-ink p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="eyebrow-mono text-ink/70 mb-2">Annual Savings</p>
                  <p className="font-sans font-light text-[48px] md:text-[64px] leading-none tabular-nums">
                    ¥{(yearlyDiff / 10000).toFixed(1)}
                    <span className="font-sans text-[24px] ml-2">万</span>
                  </p>
                </div>
                <p className="font-sans text-body-sm text-ink/70 leading-[1.9] max-w-sm">
                  これはあくまで平均値です。物件の実績によってさらに大きな節約も可能です。
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/services#pricing"
                className="group inline-flex items-center gap-3 text-bright-teal hover:text-ivory transition font-sans text-body-sm"
              >
                詳細なシミュレーションを見る
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </section>

        {/* Chapter Ⅳ — Services */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Our Services</p>
            </div>
            <h2 className="heading-section text-ink mb-12 max-w-3xl">
              SEKAI STAYの
              <span className="font-sans text-sekai-teal">運用代行。</span>
            </h2>
            <div className="bg-rule grid grid-cols-1 md:grid-cols-2 gap-px border border-rule">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="bg-white p-7 md:p-9"
                >
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-rule">
                    <p className="eyebrow-mono text-mid-gray">Service № {String(i + 1).padStart(2, '0')}</p>
                    <span className="block w-6 h-px bg-sekai-teal" />
                  </div>
                  <h3 className="font-sans font-medium text-[18px] md:text-[21px] text-ink mb-4 leading-tight">{service.title}</h3>
                  <p className="font-sans text-body-sm text-dark-gray leading-[1.95]">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅴ — FAQ */}
        <section className="section-xl bg-switch-cloud border-y border-rule">
          <div className="container-narrow px-5 md:px-8 max-w-3xl">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">FAQ</p>
            </div>
            <h2 className="heading-section text-ink mb-10">
              {area.name}の民泊運用について、
              <span className="font-sans text-sekai-teal">よくあるご質問。</span>
            </h2>
            <div className="border-t border-rule">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-rule py-6"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <div className="flex items-start gap-5 flex-1">
                      <span className="font-sans font-light text-[24px] md:text-[28px] text-sekai-teal leading-none tabular-nums flex-shrink-0 pt-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="eyebrow-mono text-mid-gray mb-1">Question № {String(i + 1).padStart(2, '0')}</p>
                        <h3 className="font-sans font-medium text-[15px] md:text-[17px] text-ink leading-snug">{faq.question}</h3>
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
                      <p className="font-sans text-body-sm md:text-body text-dark-gray leading-[2]">{faq.answer}</p>
                    </blockquote>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅵ — Office */}
        {office && (
          <section className="section-xl">
            <div className="container-narrow px-5 md:px-8 max-w-3xl">
              <div className="bg-white border border-switch-stone-border rounded-switch-lg shadow-switch-card p-8 md:p-10">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-rule">
                  <p className="eyebrow-mono text-mid-gray">Local Office</p>
                  <p className="eyebrow text-sekai-teal"></p>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-switch-teal-deep text-white rounded-switch-md flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-sans font-medium text-[18px] md:text-[22px] text-ink mb-2 leading-snug">
                      {area.name}エリア担当：{office.name}
                    </h2>
                    <p className="font-sans text-body-sm text-dark-gray leading-[1.95] mb-3">{office.displayAddress}</p>
                    <p className="font-sans text-caption text-mid-gray">
                      地元スタッフが{area.name}の物件特性を熟知した運営をサポートします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Chapter Ⅶ — CTA */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8 max-w-4xl">
            <div className="bg-switch-charcoal text-white rounded-switch-lg p-10 md:p-14 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 10% 0%, rgba(84,190,195,0.4), transparent 50%), radial-gradient(circle at 90% 100%, rgba(22,123,129,0.35), transparent 55%)',
                }}
              />
              <div className="relative">
                <div className="chapter-marker">
                  <span className="h-px w-10 bg-bright-teal" />
                  <p className="eyebrow !text-bright-teal">Begin</p>
                </div>
                <h2 className="font-sans font-bold text-[28px] md:text-[40px] leading-[1.3] mb-8">
                  {area.name}での民泊運営を
                  <span className="block font-sans text-bright-teal mt-1">SEKAI STAYにお任せください。</span>
                </h2>
                <p className="font-sans text-body md:text-[17px] text-ivory/80 leading-[1.95] mb-10 max-w-2xl">
                  無料診断では、あなたの物件のポテンシャル、現在の手数料との比較、最適な運営プランをご提案します。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/audit"
                    className="group inline-flex items-center justify-between gap-4 bg-ivory text-ink px-7 py-5 transition hover:bg-bright-teal"
                  >
                    <div>
                      <p className="eyebrow-mono text-mid-gray mb-1">Path A</p>
                      <p className="font-sans font-medium text-[15px]">物件診断を受ける</p>
                    </div>
                    <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </Link>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-between gap-4 border border-ivory/30 text-ivory px-7 py-5 transition hover:bg-ivory/5 hover:border-bright-teal"
                  >
                    <div>
                      <p className="eyebrow-mono text-bright-teal mb-1">Path B</p>
                      <p className="font-sans font-medium text-[15px]">無料相談する</p>
                    </div>
                    <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </Link>
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
