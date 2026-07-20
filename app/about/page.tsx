import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import SectionHead from '@/components/ds/SectionHead'
import GhostWordmark from '@/components/ds/GhostWordmark'
import RelatedLinks from '@/components/ds/RelatedLinks'
import Reveal from '@/components/motion/Reveal'
import { ContactSense } from '@/components/home/SenseSections'

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
      slogan: '物件の価値最大化×透明性のある民泊運用',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

/* ─── データ（トップの AboutSense / MessageSense と一致） ─────── */
const ABOUT_REASONS = [
  {
    no: '01',
    title: '透明性のある運用体制',
    body: '透明性のある運営を目指し、売上・予約・チャット・経費まで、必要な情報をすべてあなた専用のダッシュボードでリアルタイムに確認できます。物件の“いま”がひと目で見えて、まるでゲームのように売上の動きを追えます。',
    img: '/images/switch/dashboard-mockup.png',
  },
  {
    no: '02',
    title: '業界平均15〜25%に対し、手数料8%',
    body: '料金は売上の8% ＋ ¥10,000/物件/月。SEKAI STAYでは「オーナーファースト」を掲げ、業界平均を大きく下回る8%という水準を実現しています。',
  },
  {
    no: '03',
    title: '物件の収益最大化を図るサポート',
    body: '各種予約サイトの写真・文章の最適化、運用歴5年のビッグデータをもとにした価格設計、多言語対応など。稼働率・客室単価・宿泊満足度を指標に、高い収益性を生み出します。',
  },
]

const MVV = [
  {
    label: 'MISSION',
    ja: 'ミッション',
    title: '宿の価値を、正しく伸ばす。',
    body: '日本にはまだ世界に届くべき宿が数多くあります。魅力を磨き、伝え、売上まで伸ばす。宿を預かるだけでなく、その価値そのものを育てる運用を実装します。',
  },
  {
    label: 'VISION',
    ja: 'ビジョン',
    title: '民泊運用を、もっと健全で透明に。',
    body: '不透明な手数料や属人的な運用が残る業界を、適正な価格と見える運営へ。オーナーが人に自慢できるくらい透明なサービスを、当たり前にしていきます。',
  },
  {
    label: 'VALUE',
    ja: 'バリュー',
    title: 'オーナー目線で、再現性のある運用を。',
    body: '管理件数ではなく1件1件の成果を起点に判断します。仕組みとチームで品質を支え、短期の効率より長く信頼される運用を選びます。',
  },
]

const FOUNDERS = [
  {
    img: '/images/founders/tenichi.png',
    role: '代表取締役 CEO',
    name: '劉 添毅',
    romaji: 'Tenichi Liu',
    bio: 'Amazon 米国本社でオペレーション設計に従事し、データに基づく業務最適化を主導。その後、日米で複数の民泊物件をオーナーとして運営する中で、業界に根づく不透明な手数料構造と「見えない運用」に当事者として直面した。運営をすべて仕組み化し、透明にする——その構想を形にするため SEKAI STAY を創業。',
    comment:
      '民泊運用代行の相場である手数料15〜25%は、すべてを人の手で回す前提で組み上がった金額です。私たちは一つひとつの業務を分解して仕組みに落とし込み、手数料を抑えながら運営品質をむしろ高めることに挑んでいます。そして同じくらい大切にしているのが、運営の中身を「見える」状態にすること。何にいくらかかり、なぜその判断をしたのか——すべてをダッシュボードでお見せします。数字とプロセスを開示し、納得して長く任せていただける。そんな運用代行を、業界の新しい当たり前にしていきます。',
  },
  {
    img: '/images/founders/jiro.png',
    role: '共同代表 Co-CEO',
    name: '明神 洸次郎',
    romaji: 'Kojiro Myojin',
    bio: '登録者125万人超のYouTubeグループ「カリスマブラザーズ」を「ジロー」として10年以上牽引し、旅と宿の魅力を伝える発信で幅広い支持を集めてきた。その「伝える力」と現場感覚を、物件の見せ方・ゲスト体験・オーナーポータルの設計に注ぎ込んでいる。',
    comment:
      '民泊で成果を分けるのは、予約サイトに載せることではなく、その物件の魅力を正しく伝え、選ばれ続ける状態をつくり込めるかどうかです。写真一枚、料金の付け方、レビューへの一言、ゲストへの対応——その積み重ねが稼働率を大きく動かします。私たちは管理業務を代行するだけでなく、見せ方から価格設計、ゲスト満足度の向上まで踏み込み、物件ごとに「どうすれば伸びるか」を一緒に考え抜きます。預かるのではなく、共に育てる。大切な物件だからこそ、その可能性を最後まで引き出させてください。',
  },
]

/* ─── 会社概要（旧 /company から統合） ───────────────────────── */
const COMPANY_INFO = [
  { label: '社名', value: '株式会社セカイチ（SEKAI STAY事業）' },
  { label: '所在地', value: '〒153-0042\n東京都目黒区青葉台2-20-7 KM中目黒ビル1F' },
  { label: '代表取締役', value: '劉 添毅（リュウ テンイチ）' },
  { label: '設立', value: '株式会社セカイチ／SEKAI STAY事業' },
  { label: '資本金（資本準備金含む）', value: '1,650万円' },
  { label: '法人番号', value: '4011001162956' },
  { label: '登録番号', value: '住宅宿泊管理業 国土交通大臣(01)第F05780号' },
  { label: '事業内容', value: '民泊運用代行・宿泊施設運営' },
]

/* ─── Page ────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutJsonLd />
      <FloatingCTA />

      <main>
        {/* ─── Hero — ABOUT（SectionHead h1＋ゴーストワードマーク） ─── */}
        <section className="relative w-full overflow-hidden bg-ivory section-hero pt-28 sm:pt-32">
          <GhostWordmark />
          <div className="relative z-10 container-edit">
            <SectionHead as="h1" hero en="ABOUT" sub="私たち「SEKAI STAY」の考え方" />
          </div>
        </section>

        {/* ─── Statement（私たちの役割）— 濃紺ゾーン ─── */}
        <section className="w-full bg-navy section-2xl text-white">
          <div className="container-edit">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-16">
              <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.4] text-white">
                物件の価値最大化
                <span>×</span>
                <span className="block">透明性のある民泊運用</span>
              </h2>
              <div className="space-y-6 text-[15px] leading-[1.95] text-white/75 sm:text-[16px]">
                <p>
                  私たちSEKAI STAYは、オーナー様の大切な物件が持つ「観光資産としての価値」を最大化するための、民泊運営の共創パートナーです。物件ごとの魅力や立地特性、需要の変化を捉えながら、収益性と運営品質の両面から、長く選ばれる宿泊施設づくりを支援しています。
                </p>
                <p>
                  私たちが大切にしているのは、「適正な価格設計」と「運営の透明化」。日々の売上、稼働率、予約状況、未対応事項などをリアルタイムで確認できる専用ダッシュボードにより、オーナー様が運営状況をいつでも把握できる体制を整えています。
                </p>
                <p>
                  ただ貸し出す場所ではなく、選ばれ続ける観光資産へ。SEKAI STAYは、テクノロジーと現場運営の力で、物件の可能性を最大限に引き出します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 選ばれる3つの理由 ─── */}
        <section className="w-full bg-ivory section-2xl">
          <div className="container-edit">
            <SectionHead en="REASONS" sub="選ばれる3つの理由" />

            <div className="mt-12 flex flex-col gap-4 sm:mt-16 sm:gap-5">
              {/* 01: 画像付き・全幅 */}
              <div className="relative reason-card rounded-[10px] px-7 py-11 sm:px-12 sm:py-14 lg:px-[60px] lg:py-[44px]">
                <div className="flex flex-col gap-8 lg:block lg:pr-[400px]">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="font-grotesk text-[18px] font-bold tracking-[0.12em] text-ink">
                        {ABOUT_REASONS[0].no}
                      </span>
                      <p className="text-[clamp(1.25rem,2.2vw,1.5rem)] font-bold leading-[1.4] text-ink">
                        {ABOUT_REASONS[0].title}
                      </p>
                    </div>
                    <p className="mt-6 max-w-3xl text-[15px] leading-[1.9] text-ink/75 sm:text-[16px]">
                      {ABOUT_REASONS[0].body}
                    </p>
                  </div>
                  <div className="flex justify-center lg:block">
                    <img
                      src={ABOUT_REASONS[0].img}
                      alt="オーナー専用ダッシュボード"
                      loading="lazy"
                      className="block w-[70%] max-w-[300px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:w-[48%] lg:absolute lg:-top-12 lg:right-[40px] lg:w-[340px] lg:max-w-none"
                    />
                  </div>
                </div>
              </div>

              {/* 02・03: PCで横並び */}
              <div className="grid gap-5 lg:grid-cols-2">
                {ABOUT_REASONS.slice(1).map((r) => (
                  <div
                    key={r.no}
                    className="reason-card rounded-[10px] px-7 py-11 sm:px-12 sm:py-14 lg:px-[60px] lg:py-[60px]"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-grotesk text-[18px] font-bold tracking-[0.12em] text-ink">{r.no}</span>
                      <p className="text-[clamp(1.25rem,2.2vw,1.5rem)] font-bold leading-[1.4] text-ink">{r.title}</p>
                    </div>
                    <p className="mt-6 text-[15px] leading-[1.9] text-ink/75 sm:text-[16px]">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── ミッション / ビジョン / バリュー ─── */}
        <section className="w-full bg-navy section-2xl text-white">
          <div className="container-edit">
            <SectionHead light en="PHILOSOPHY" sub="ミッション / ビジョン / バリュー" />

            <div className="mt-12 grid gap-10 sm:mt-16 md:grid-cols-3 md:gap-8">
              {MVV.map((m) => (
                <div key={m.label} className="border-t border-white/20 pt-6">
                  <p className="font-grotesk text-[13px] font-bold tracking-[0.16em] text-bright-teal">{m.label}</p>
                  <p className="mt-1 text-[13px] font-bold text-white/70">{m.ja}</p>
                  <p className="mt-6 text-[clamp(1.25rem,2vw,1.5rem)] font-bold leading-[1.5] text-white">{m.title}</p>
                  <p className="mt-4 text-[14px] leading-[1.9] text-white/75">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 代表メッセージ（MESSAGE）— エディトリアル（sense-trust 基準） ─── */}
        <section className="w-full bg-paper section-2xl">
          <div className="container-edit">
            <SectionHead en="MESSAGE" sub="代表メッセージ" />

            {/* プルステートメント */}
            <Reveal as="p" className="mt-10 max-w-3xl text-[clamp(1.5rem,3.4vw,2.625rem)] font-bold leading-[1.5] tracking-[-0.01em] text-ink sm:mt-14">
              民泊代行の常識を、<br className="hidden sm:block" />数字と透明性で塗り替える。
            </Reveal>

            {/* CEO（劉 添毅）— 写真（元比率・左）｜ 役職・氏名・経歴・本文（右） */}
            <Reveal as="div" className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOUNDERS[0].img}
                alt={`${FOUNDERS[0].name} — ${FOUNDERS[0].role}`}
                loading="lazy"
                className="w-full max-w-[280px] rounded-2xl lg:sticky lg:top-28"
              />
              <div>
                <p className="text-[12px] font-bold tracking-[0.18em] text-sekai-teal">{FOUNDERS[0].role}</p>
                <div className="mt-3 flex items-baseline gap-3">
                  <p className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-none text-ink">{FOUNDERS[0].name}</p>
                  <span className="text-[13px] tracking-wide text-ink/45">{FOUNDERS[0].romaji}</span>
                </div>
                <p className="mt-4 text-[12.5px] leading-[1.9] text-ink/55">{FOUNDERS[0].bio}</p>
                <p className="mt-6 border-t border-rule pt-6 text-[clamp(1.0625rem,1.35vw,1.25rem)] leading-[2.05] text-ink">{FOUNDERS[0].comment}</p>
              </div>
            </Reveal>

            {/* Co-CEO（明神 洸次郎）— 写真（元比率）＋ メッセージ本文 */}
            <Reveal as="div" delay={0.05} className="mt-14 grid gap-8 border-t border-rule pt-12 sm:mt-16 sm:pt-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOUNDERS[1].img}
                alt={`${FOUNDERS[1].name} — ${FOUNDERS[1].role}`}
                loading="lazy"
                className="w-full max-w-[280px] rounded-2xl lg:sticky lg:top-28"
              />
              <div>
                <p className="text-[12px] font-bold tracking-[0.18em] text-sekai-teal">{FOUNDERS[1].role}</p>
                <div className="mt-3 flex items-baseline gap-3">
                  <p className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-none text-ink">{FOUNDERS[1].name}</p>
                  <span className="text-[13px] tracking-wide text-ink/45">{FOUNDERS[1].romaji}</span>
                </div>
                <p className="mt-4 text-[12.5px] leading-[1.9] text-ink/55">{FOUNDERS[1].bio}</p>
                <p className="mt-6 border-t border-rule pt-6 text-[clamp(1.0625rem,1.35vw,1.25rem)] leading-[2.05] text-ink">{FOUNDERS[1].comment}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── 会社概要（COMPANY）— 2分割エディトリアル（sense-trust 基準） ─── */}
        <section className="w-full bg-ivory section-2xl">
          <div className="container-edit lg:grid lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHead
                en="COMPANY"
                sub="会社概要"
                lead="住宅宿泊管理業 国土交通大臣(01)第F05780号。適正な体制のもと、民泊運用代行・宿泊施設運営を行っています。"
              />
            </div>
            <dl className="mt-10 border-t border-rule lg:mt-0">
              {COMPANY_INFO.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 gap-1.5 border-b border-rule py-7 sm:grid-cols-[200px_1fr] sm:gap-10 sm:py-8"
                >
                  <dt className="text-[13px] font-bold tracking-[0.04em] text-ink/50 sm:text-[14px]">{row.label}</dt>
                  <dd className="whitespace-pre-line text-[15px] leading-[1.9] text-ink sm:text-[16px]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 関連ページ導線 */}
        <section className="w-full bg-ivory">
          <div className="container-edit border-t border-rule py-14">
            <RelatedLinks items={[{ href: '/services', label: 'サービス内容' }, { href: '/case-studies', label: '実績・オーナーの声' }]} />
          </div>
        </section>

        {/* ─── 末尾CTA — 共通 ContactSense（REPORT / CONTACT） ─── */}
        <ContactSense />
      </main>
      <Footer />
    </>
  )
}
