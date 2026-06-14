import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { JP } from '@/components/JP'
import {
  IconArrowRight,
  IconCheck,
  IconSparkles,
  IconShield,
  IconTrendingUp,
  IconStar,
  IconGlobe,
  IconChart,
} from '@/components/Icons'

const SITE_URL = 'https://sekaistay.com'

export const metadata: Metadata = {
  title: '私たちについて',
  description:
    'SEKAI STAYは、宿を管理するだけでなく、宿の価値そのものを伸ばす運用代行サービス。自社のインバウンド基盤・メディア基盤・約35名の運用体制で、稼働率・売上・レビュー評価まで一貫して改善します。',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: '私たちについて | SEKAI STAY',
    description:
      '宿を預かる会社ではなく、宿の価値を伸ばす会社。SEKAI STAYの考え方・創業背景・代表メッセージ・チーム体制をご紹介します。',
    type: 'website',
    locale: 'ja_JP',
    url: `${SITE_URL}/about`,
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: '私たちについて | SEKAI STAY',
    description: '宿を預かる会社ではなく、宿の価値を伸ばす会社。',
  },
}

/* ─── Structured Data ─────────────────────────────────────────── */
function AboutJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: 'SEKAI STAY',
      legalName: '株式会社セカイチ',
      url: SITE_URL,
      logo: `${SITE_URL}/sekai_stay_03_03.png`,
      description: '民泊・宿泊施設の運用代行サービス。手数料8%で一括運用。',
      founder: [
        { '@type': 'Person', name: '劉 添毅' },
        { '@type': 'Person', name: '明神 洸次郎' },
      ],
      areaServed: 'JP',
      slogan: '宿を管理するのではない。宿の価値を伸ばす。',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

/* ─── Founder card — editorial ─ */
function FounderCard({
  number,
  photo,
  name,
  kana,
  role,
  quote,
  bio,
}: {
  number: string
  photo: string
  name: string
  kana: string
  role: string
  quote: string
  bio: string[]
}) {
  return (
    <article className="bg-paper border border-switch-stone-border rounded-switch-lg shadow-switch-card overflow-hidden">
      {/* Portrait photo */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image
          src={photo}
          alt={`${name} — ${role}`}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          quality={85}
          className="object-cover object-top"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0) 55%, rgba(26,26,26,0.55) 100%)' }}
        />
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-ivory">
          <div>
            <p className="font-sans font-light text-[14px] text-ivory/80 mb-0.5">{kana}</p>
            <h3 className="font-sans font-medium text-[22px] md:text-[26px] leading-tight">{name}</h3>
          </div>
          <p className="eyebrow-mono !text-[9px] text-ivory/70">№ {number}</p>
        </div>
      </div>

      <div className="p-8 md:p-10">
      {/* Role strip */}
      <div className="flex items-center justify-between mb-7 pb-6 border-b border-rule">
        <p className="eyebrow text-sekai-teal">{role}</p>
      </div>

      {/* Pull quote */}
      <blockquote className="border-l-2 border-sekai-teal pl-5 md:pl-6 mb-8">
        <p className="font-sans font-light text-[20px] md:text-[24px] text-ink leading-[1.45]">
          「{quote}」
        </p>
      </blockquote>

      {/* Bio */}
      <div className="space-y-3">
        {bio.map((line, i) => (
          <p key={i} className="font-sans text-body-sm text-dark-gray leading-[1.95]">
            {line}
          </p>
        ))}
      </div>
      </div>
    </article>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function AboutPage() {
  const stats = [
    { icon: IconTrendingUp, value: '1.4', unit: '倍', label: '稼働率', sub: '運用改善と見せ方の最適化によって、稼働率の向上を実現（平均改善倍率）。' },
    { icon: IconChart,      value: '+57', unit: '%',  label: '月間売上', sub: '価格設計、導線改善、集客強化を通じて、売上成長を支援。' },
    { icon: IconStar,       value: '4.8', unit: '/5', label: 'レビュー評価', sub: '管理物件において、高い顧客満足度を維持。' },
    { icon: IconShield,     value: '5',   unit: '年+', label: '運用支援', sub: '現場に根ざした運用改善を継続。' },
    { icon: IconSparkles,   value: '20',  unit: '万人+', label: '自社YouTube', sub: '発信力と見せ方の知見を、宿泊運用にも活用。' },
    { icon: IconGlobe,      value: '7',   unit: '拠点', label: '全国展開', sub: '地域ごとの特性を踏まえた運用支援が可能。' },
  ]

  const credo = [
    {
      num: '01',
      title: '透明に向き合う。',
      body:
        '何をしているか分からない運用にはしません。料金も、判断も、改善の理由も、できる限りオーナーに見える形で共有します。大切なのは、任せやすさだけでなく、納得できることだから。',
    },
    {
      num: '02',
      title: 'オーナー目線で考える。',
      body:
        '大事なのは、管理件数ではなく1件1件の成果です。"こちらの都合"ではなく"オーナーにとって本当にいいか"を起点に判断します。短期の効率より、長く信頼される運用を。',
    },
    {
      num: '03',
      title: '管理で終わらせない。',
      body:
        '宿は、ただ回すだけでは伸びません。見せ方、伝え方、価格設計、集客導線まで整えて、価値そのものを育てます。宿を預かる会社ではなく、宿の価値を伸ばす会社でありたい。',
    },
  ]

  const pillars = ['もっとわかりやすく。', 'もっと綺麗に。', 'もっと透明に。', '最小限の手数料で。']
  const teamRoles = ['オペレーション', '清掃', 'ゲスト対応', '撮影・制作', '掲載改善']

  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '私たちについて' }]} />
      <AboutJsonLd />
      <FloatingCTA />

      <main className="bg-ivory">
        {/* ─────────── Chapter Ⅰ. Hero — dark editorial ─────────── */}
        <section className="relative bg-ink text-ivory overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(84,190,195,0.55), transparent 60%)' }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(22,123,129,0.6), transparent 60%)' }}
          />

          <div className="container-edit relative section-hero">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow text-bright-teal">About SEKAI STAY</p>
            </div>
            <h1 className="heading-display heading-mb-lg jp-keep">
              <JP>宿を管理するのではない。</JP>
              <span className="block text-bright-teal mt-2"><JP>宿の価値を伸ばす。</JP></span>
            </h1>
            <div className="section-grid items-start">
              <p className="font-sans text-[16px] md:text-[18px] text-bright-teal/90 leading-[1.9]">
                —&nbsp;Not a manager. A steward of value.
              </p>
              <p className="text-body text-ivory/80 leading-[1.95] max-w-2xl jp-break">
                SEKAI STAYは、ただ宿を預かるための会社ではありません。宿の魅力を正しく伝え、売上まで伸ばす。運用代行の枠を超えて、宿の価値そのものを育てることを目指しています。
              </p>
            </div>
          </div>
        </section>

        {/* ─────────── Chapter Ⅱ. Mission ─────────── */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Our Mission</p>
            </div>
            <h2 className="heading-section text-ink mb-12 max-w-3xl">
              まだ届いていない宿の価値を、
              <span className="block font-sans text-sekai-teal mt-2">きちんと世界に届ける。</span>
            </h2>

            <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
              <div>
                <p className="eyebrow-mono text-mid-gray mb-5">§ Prologue</p>
                <span className="block w-10 h-px bg-rule mb-5" />
                <p className="font-sans text-[17px] md:text-[19px] text-ink leading-[1.75]">
                  日本には、世界に届くべき宿がまだ数多くあります。
                </p>
              </div>
              <div className="space-y-6 font-sans text-body md:text-[17px] text-dark-gray leading-[2]">
                <p>
                  けれどこの業界では、宿を持つ人と、その価値を伝えられる人が分かれすぎている。本来伸びるはずの宿が、埋もれたままになっています。
                </p>
                <p>
                  SEKAI STAYは、宿を預かるだけの会社ではありません。魅力を磨き、伝え、売上まで伸ばす。その&ldquo;宿の価値を伸ばす運用&rdquo;を実装するために生まれました。
                </p>
              </div>
            </div>

            {/* Pillars — ledger */}
            <div className="bg-rule grid grid-cols-2 md:grid-cols-4 gap-px mt-16 border border-rule">
              {pillars.map((t, i) => (
                <div
                  key={t}
                  className="bg-paper p-8 md:p-10"
                >
                  <p className="eyebrow-mono text-mid-gray mb-3">№ {String(i + 1).padStart(2, '0')}</p>
                  <p className="font-sans font-medium text-[15px] md:text-[17px] text-ink leading-snug">{t}</p>
                  <span className="block w-6 h-px bg-sekai-teal mt-4" />
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <span className="block w-10 h-px bg-rule mx-auto mb-6" />
              <p className="font-sans font-light text-[22px] md:text-[30px] text-ink leading-[1.5] max-w-2xl mx-auto">
                宿泊運用のあり方そのものを、より健全で、より本質的なものへ。
              </p>
              <p className="eyebrow-mono text-sekai-teal mt-6">— It is our mission.</p>
            </div>
          </div>
        </section>

        {/* ─────────── Chapter Ⅲ. Origin ─────────── */}
        <section className="section-xl bg-bone border-y border-rule">
          <div className="container-narrow px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Origin Story</p>
            </div>
            <h2 className="heading-section text-ink mb-12 max-w-3xl">
              この業界を、
              <span className="block font-sans text-sekai-teal mt-2">もっと本質的にできるはずだと思った。</span>
            </h2>

            <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-12">
              <div className="md:pt-2">
                <p className="font-sans font-light text-[56px] md:text-[88px] text-sekai-teal leading-none tabular-nums">6</p>
                <p className="eyebrow-mono text-mid-gray mt-2">Years in the field</p>
              </div>
              <div className="space-y-7 font-sans text-body md:text-[17px] text-dark-gray leading-[2]">
                <p>
                  民泊事業を立ち上げてから6年間、現場で運用に向き合ってきました。その中で強く感じたのは、<span className="text-ink font-medium">この業界にはまだ非効率と不透明さが多く残っている</span>ということでした。
                </p>
                <p>
                  本来はもっと良くできるのに、業界の慣習の中で、オーナーが見えないコストや不透明な運用を受け入れている。伸びるはずの宿が、力を出しきれないまま終わっている。その現実に、何度も疑問を感じてきました。
                </p>
                <p>
                  だからこそ、<span className="text-ink font-medium">運用の中身を表に出し、オーナーが人に自慢できるくらい透明なサービス</span>をつくる。自動化と仕組み化で管理できる物件数を伸ばしつつ、対話の質はむしろ高める。そこに自社のインバウンド基盤とメディアの知見を掛け合わせ、単なる代行では終わらない運用にしています。
                </p>
                <div className="pt-6 border-t border-rule">
                  <p className="font-sans font-light text-[22px] md:text-[26px] text-ink leading-[1.55]">
                    SEKAI STAYは、宿を回すためだけの会社ではありません。
                    <span className="block text-sekai-teal mt-1">宿の価値を、正しく伸ばすための会社です。</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── Chapter Ⅳ. Founders ─────────── */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Founders</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <h2 className="heading-section text-ink max-w-2xl">
                現場を知る会社だから、
                <span className="block font-sans text-sekai-teal">つくれた仕組みがあります。</span>
              </h2>
              <p className="font-sans text-body-sm text-dark-gray max-w-md leading-[1.95]">
                運用を知る視点と、伝え方を知る視点。その両方があるからこそ、SEKAI STAYは&ldquo;ただの代行&rdquo;で終わりません。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FounderCard
                number="01"
                photo="/images/switch/founder-tenichi.png?v=2"
                name="劉 添毅"
                kana="Liu Tianyi"
                role="Co-Founder · Ops & Systems"
                quote="仕組みで支え、運用を強くする。"
                bio={[
                  '米国大学卒業後、Amazon本社に入社。',
                  'その後独立し、明神と共にSEKAI STAYを設立。',
                  '海外ネットワークやオペレーション設計、システム開発や事業基盤づくりを担う。',
                ]}
              />
              <FounderCard
                number="02"
                photo="/images/switch/founder-koji.png"
                name="明神 洸次郎"
                kana="Myojin Kojiro"
                role="Co-Founder · Brand & Media"
                quote="伝え方を変えれば、宿の価値はもっと伸びる。"
                bio={[
                  '米国留学後、メディア事業を立ち上げ、発信・集客・見せ方の設計を現場で実践。YouTube累計再生回数は6億再生を超える。',
                  '飲食・メディア・マーケティング領域で事業を展開し、ブランドづくりと集客導線の構築を経験。',
                  '現在はSEKAI STAYにて、ブランディング、マーケティング、発信・集客導線の設計を担当。',
                ]}
              />
            </div>
          </div>
        </section>

        {/* ─────────── Chapter Ⅴ. Numbers ─────────── */}
        <section className="relative bg-ink text-ivory overflow-hidden">
          <div
            aria-hidden
            className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(84,190,195,0.5), transparent 60%)' }}
          />

          <div className="container-edit relative px-5 md:px-8 section-xl">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow text-bright-teal">Numbers</p>
            </div>
            <h2 className="font-sans font-bold text-[28px] md:text-[42px] leading-[1.3] mb-14 max-w-3xl">
              数字で見る、
              <span className="block font-sans text-bright-teal">SEKAI STAYの現在地。</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 border border-ivory/10">
              {stats.map((s, i) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className={`relative p-6 md:p-8 ${
                      i % 3 !== 2 ? 'md:border-r' : ''
                    } ${
                      i % 2 !== 1 ? 'border-r md:border-r' : ''
                    } ${
                      i < stats.length - 2 ? 'border-b' : ''
                    } border-ivory/10`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <p className="eyebrow-mono text-bright-teal">№ {String(i + 1).padStart(2, '0')}</p>
                      <Icon size={16} color="#54BEC3" />
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="font-sans font-light text-[44px] md:text-[64px] text-ivory leading-none tabular-nums">
                        {s.value}
                      </span>
                      <span className="font-sans text-[14px] md:text-[16px] text-bright-teal">{s.unit}</span>
                    </div>
                    <p className="font-sans font-medium text-[13px] md:text-[15px] text-ivory mb-3 uppercase tracking-wider">
                      {s.label}
                    </p>
                    <p className="font-sans text-caption text-ivory/60 leading-[1.85]">
                      {s.sub}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─────────── Chapter Ⅵ. Team & Culture ─────────── */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Team &amp; Culture</p>
            </div>
            <h2 className="heading-section text-ink mb-12 max-w-3xl">
              宿の運用は、ひとりの力ではなく、
              <span className="block font-sans text-sekai-teal mt-2">チームの力でつくる。</span>
            </h2>

            <div className="space-y-7 font-sans text-body md:text-[17px] text-dark-gray leading-[2]">
              <p>
                SEKAI STAYの運用は、属人的な体制ではありません。分析を自動化し、各領域の実務者を当てこむことで、すべての物件を同じクオリティで運用します。オペレーション、清掃、ゲスト対応、撮影、掲載改善まで、業務委託を含む<span className="text-ink font-medium">約35名の体制</span>です。
              </p>
              <p>
                清潔さ、対応の速さ、写真の印象、ゲストとの対話。その一つひとつが、レビューになり、売上になる。<span className="text-ink font-medium">現場の質が、そのまま宿の価値になる。</span>そんな前提で、日々改善を重ねています。
              </p>
            </div>

            {/* Team roles — ledger band */}
            <div className="mt-14 bg-paper border border-rule">
              <div className="px-6 py-4 border-b border-rule flex items-center justify-between">
                <p className="eyebrow-mono text-mid-gray">Team Composition</p>
                <p className="font-sans font-light text-[22px] text-sekai-teal tabular-nums">35<span className="text-[14px] font-sans text-ink ml-1">名</span></p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 bg-rule gap-px">
                {teamRoles.map((t, i) => (
                  <div
                    key={t}
                    className="bg-paper px-4 py-6 text-center"
                  >
                    <p className="eyebrow-mono text-sekai-teal mb-2">{String(i + 1).padStart(2, '0')}</p>
                    <p className="font-sans text-body-sm text-ink">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-sans text-caption text-mid-gray mt-6 leading-[1.85]">
              属人的に回すのではなく、仕組みとチームで品質を支える。それが、安定した運用改善につながります。
            </p>
          </div>
        </section>

        {/* ─────────── Chapter Ⅶ. Credo ─────────── */}
        <section className="section-xl bg-bone border-y border-rule">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Credo</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <h2 className="heading-section text-ink max-w-2xl">
                私たちの、
                <span className="font-sans text-sekai-teal">3つの約束。</span>
              </h2>
              <p className="font-sans text-body-sm text-dark-gray max-w-md leading-[1.95]">
                SEKAI STAYが大切にしている運用哲学。すべての判断はここから始まります。
              </p>
            </div>

            <div className="bg-rule grid md:grid-cols-3 gap-px border border-rule">
              {credo.map(c => (
                <div
                  key={c.num}
                  className="bg-paper p-8 md:p-10"
                >
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="font-sans font-light text-[44px] md:text-[56px] text-sekai-teal leading-none tabular-nums">
                      {c.num}
                    </span>
                    <div className="flex-1 h-px bg-rule" />
                  </div>
                  <h3 className="font-sans font-medium text-[20px] md:text-[22px] text-ink mb-5 leading-snug">
                    {c.title}
                  </h3>
                  <p className="font-sans text-body-sm text-dark-gray leading-[2]">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── Chapter Ⅷ. Closing CTA ─────────── */}
        <section className="relative bg-ink text-ivory overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 20% 0%, rgba(84,190,195,0.4), transparent 50%), radial-gradient(circle at 80% 100%, rgba(22,123,129,0.35), transparent 55%)',
            }}
          />
          <div className="container-narrow relative px-5 md:px-8 section-xl">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow text-bright-teal">Begin</p>
            </div>
            <h2 className="font-sans font-bold text-[28px] md:text-[44px] leading-[1.3] mb-8 max-w-3xl">
              まずは、あなたの宿の
              <span className="block font-sans text-bright-teal mt-2">可能性を知るところから。</span>
            </h2>
            <p className="font-sans text-body md:text-[17px] text-ivory/80 leading-[1.95] mb-10 max-w-2xl">
              運用を見直したい。今の委託先に違和感がある。そんな方は、まずご相談ください。宿の現状から改善の余地まで、無料で見にいきます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-between gap-4 bg-ivory text-ink px-7 py-5 transition hover:bg-bright-teal"
              >
                <div>
                  <p className="eyebrow-mono text-mid-gray mb-1">Path A</p>
                  <p className="font-sans font-medium text-[15px]">無料で相談する</p>
                </div>
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/services#pricing"
                className="group inline-flex items-center justify-between gap-4 border border-ivory/30 text-ivory px-7 py-5 transition hover:bg-ivory/5 hover:border-bright-teal"
              >
                <div>
                  <p className="eyebrow-mono text-bright-teal mb-1">Path B</p>
                  <p className="font-sans font-medium text-[15px]">収益シミュレーション</p>
                </div>
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
            <div className="pt-6 border-t border-ivory/10 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-caption text-ivory/60">
              <span className="inline-flex items-center gap-2"><IconCheck size={12} color="#54BEC3" /> 基本料金 8%＋月1万円</span>
              <span className="inline-flex items-center gap-2"><IconCheck size={12} color="#54BEC3" /> 費用は事前見積もりで全提示</span>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
