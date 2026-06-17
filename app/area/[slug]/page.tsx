import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { getAreaBySlug, getAllAreas } from '@/lib/areas'
import { getOfficeForArea, getHQOffice } from '@/lib/offices'
import { IconArrowRight } from '@/components/Icons'
import AuditLink from '@/components/audit/AuditLink'

const SITE_URL = 'https://sekaistay.com'

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
      answer: `初期費用は乗り換え¥100,000/物件（移行作業・プロ品質の画像最適化・リスティング最適化込み）・新規立ち上げ¥200,000〜、固定管理費10,000円/物件/月、変動運営委託費は売上の8%です。一般的な運用代行の15〜25%に対して低い水準で、解約金は7ヶ月目以降¥0（6ヶ月未満の途中解約は¥200,000）。${area.name}でも全国一律の料金でご利用いただけます。`,
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
  const monthly = (area.avgRevenue / 10000).toFixed(0)

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

      <main>
        {/* Hero — エリア見出し */}
        <section className="relative w-full overflow-hidden bg-ivory pb-16 pt-28 sm:pb-20 sm:pt-36">
          <span
            aria-hidden
            className="label-giant pointer-events-none absolute right-2 top-[10%] z-0 select-none leading-none text-ink/[0.04]"
            style={{ writingMode: 'vertical-rl', fontSize: '12vw', letterSpacing: '0.1em' }}
          >
            AREA
          </span>
          <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
            <p className="text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-sekai-teal">AREA / {area.prefecture}</p>
            <h1 className="mt-4 label-giant text-[clamp(2.5rem,7.5vw,6rem)] leading-[0.95] tracking-[-0.02em] text-ink">
              {area.name}の<br className="sm:hidden" />民泊運用代行
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.95] text-ink/75">
              {area.prefecture}での予約サイト掲載管理・ゲスト対応・清掃手配・プライシング最適化を、手数料8%＋月10,000円/物件でまるごと代行します。一般的な運用代行の15〜25%に対し、手元に残る利益を大きく増やせます。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AuditLink
                data-cta="audit"
                className="btn-cta group inline-flex min-h-[54px] items-center gap-2 rounded-md px-8 text-[15px] font-bold transition-colors"
              >
                無料で収益診断を受ける
                <IconArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </AuditLink>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-sekai-teal transition-opacity hover:opacity-70 sm:px-4"
              >
                まずは無料相談
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* エリア市場感 — teal */}
        <section className="w-full bg-navy py-24 text-white sm:py-32">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">MARKET</h2>
            <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">{area.name}の市場感</p>
            <p className="mt-10 max-w-2xl text-[15px] leading-[1.95] text-white/80">{area.description}</p>

            <div className="mt-12 flex items-end gap-5 sm:mt-16">
              <span className="pb-3 text-[14px] font-bold leading-tight text-white/70">
                {area.name}の<br />平均月間運営実績
              </span>
              <span className="flex items-baseline leading-none">
                <span className="font-grotesk text-[clamp(3rem,9vw,5.5rem)] font-bold tracking-[-0.04em] text-bright-teal">約{monthly}</span>
                <span className="font-grotesk ml-2 text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-bright-teal">万円</span>
              </span>
            </div>
            <p className="mt-4 text-[12px] text-white/45">※ 立地・グレード・稼働率により変動します。実際のポテンシャルは無料診断で個別に算出します。</p>

            <div className="mt-16 grid gap-10 md:grid-cols-2">
              {area.highlights.map((highlight, i) => (
                <div key={i} className="border-t border-white/20 pt-5">
                  <span className="font-grotesk block text-[2rem] font-bold leading-none text-bright-teal">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-4 text-[15px] leading-[1.9] text-white/80">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 対応状況・該当事例 — ivory */}
        <section className="w-full bg-ivory py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-ink">WORKS</h2>
            <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">{area.name}での対応状況・事例</p>
            <p className="mt-10 max-w-2xl text-[15px] leading-[1.95] text-ink/75">
              {area.name}での民泊運営サポート実績が多数あります。地域の宿泊トレンド・季節変動・オーナー様の課題に対して、{area.name}に特化した運営戦略をご提案します。
            </p>

            <div className="mt-14 grid gap-8 sm:mt-16 md:grid-cols-2">
              {services.map((service, i) => (
                <div key={i} className="rounded-[10px] bg-[#EAECEF] px-7 py-9 sm:px-9 sm:py-10">
                  <div className="flex items-baseline gap-4">
                    <span className="font-grotesk text-[18px] font-bold tracking-[0.12em] text-sekai-teal">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-[clamp(1.125rem,2vw,1.375rem)] font-bold leading-snug text-ink">{service.title}</h3>
                  </div>
                  <p className="mt-5 text-[14px] leading-[1.9] text-ink/75">{service.description}</p>
                </div>
              ))}
            </div>

            {office && (
              <div className="mt-12 rounded-[10px] bg-mist px-7 py-9 sm:px-10 sm:py-10">
                <p className="text-[12px] font-bold tracking-[0.16em] text-sekai-teal">対応エリア担当</p>
                <h3 className="mt-2 text-[clamp(1.25rem,2.2vw,1.5rem)] font-bold leading-snug text-ink">
                  {area.name}エリア担当：{office.name}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.9] text-ink/75">{office.displayAddress}</p>
                <p className="mt-2 text-[13px] leading-[1.85] text-ink/60">
                  地元スタッフが{area.name}の物件特性を熟知した運営をサポートします。
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 料金・サービス要点 — teal */}
        <section className="w-full bg-navy py-24 text-white sm:py-32">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">PRICE</h2>
            <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">料金・サービス要点</p>

            <div className="mt-12 max-w-3xl sm:mt-16">
              <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-snug">
                基本料金は売上の <span className="font-grotesk text-bright-teal">8%</span> ＋ 月<span className="font-grotesk text-bright-teal">¥10,000</span>／物件。
              </p>
              <p className="mt-6 text-[15px] leading-[1.95] text-white/80">
                一般的な運用代行の15〜25%に対して大幅に低い水準です。{area.name}でも全国一律の料金でご利用いただけます。
              </p>
              <ul className="mt-8 space-y-2 text-[14px] text-white/75">
                <li>・初期費用：乗り換え ¥100,000 ／ 新規立ち上げ ¥200,000〜</li>
                <li>・7ヶ月目以降の解約金は ¥0（最低契約6ヶ月）</li>
                <li>・かかりうる費用は契約前にすべて金額つきで開示</li>
              </ul>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-opacity hover:opacity-70">
                  料金の詳細を見る
                  <IconArrowRight size={14} />
                </Link>
                <Link href="/services" className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-opacity hover:opacity-70">
                  サービス内容を見る
                  <IconArrowRight size={14} />
                </Link>
                <Link href="/case-studies" className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-opacity hover:opacity-70">
                  運用実績を見る
                  <IconArrowRight size={14} />
                </Link>
                <Link href="/services#area" className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-opacity hover:opacity-70">
                  他の対応エリアを見る
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA帯 — teal */}
        <section className="w-full bg-navy-deep py-24 text-white sm:py-32">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">DIAGNOSIS</h2>
            <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">{area.name}での民泊運営、まずは無料診断から</p>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.95] text-white/80">
              無料診断では、あなたの物件のポテンシャル、現在の手数料との比較、最適な運営プランをご提案します。入力3分・1営業日以内に個別レポートをお届けします。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AuditLink
                data-cta="audit"
                className="btn-cta group inline-flex min-h-[54px] items-center gap-2 rounded-md px-8 text-[15px] font-bold transition-colors"
              >
                無料収益診断を受ける
                <IconArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </AuditLink>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-opacity hover:opacity-70 sm:px-4"
              >
                無料相談する
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FloatingCTA />
      <Footer />
    </>
  )
}
