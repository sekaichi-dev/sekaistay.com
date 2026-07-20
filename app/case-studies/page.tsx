import type { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import SectionHead from '@/components/ds/SectionHead'
import SlideCarousel from '@/components/ds/SlideCarousel'
import RelatedLinks from '@/components/ds/RelatedLinks'
import GhostWordmark from '@/components/ds/GhostWordmark'
import InterviewChat from '@/components/case-studies/InterviewChat'
import { ContactSense } from '@/components/home/SenseSections'
import { getCaseStudies, getAverageMetrics } from '@/lib/case-studies'

export const metadata: Metadata = {
  title: '実績・オーナーの声 | SEKAI STAY',
  description: '民泊運営代行の実績と導入事例。湖畔ヴィラから山岳ロッジ、サウナ付きリゾートまで、SEKAI STAYが運用をお預かりした物件の稼働率・月商の動きと、オーナーの声をご確認いただけます。',
  openGraph: {
    title: '実績・オーナーの声 | SEKAI STAY',
    description: '数字で見るオーナーの成果と、運営代行で実現した収益の動き。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/case-studies',
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: '実績・オーナーの声 | SEKAI STAY',
    description: '数字で見るオーナーの成果と、運営代行で実現した収益の動き。',
  },
  alternates: { canonical: 'https://sekaistay.com/case-studies' },
}

/* 全体平均（継続6ヶ月以上の管理物件平均）— トップ ResultsSense と同型 */
const RESULT_STATS = [
  { v: '61', u: '%', l: '平均稼働率' },
  { v: '+37', u: '%', l: '月商改善（平均）' },
  { v: '4.8', u: '/5', l: '宿泊満足度' },
  { v: '97', u: '%', l: '継続率' },
]

/* WORKS 各事例の表示用メタ（現実的な改善指標・カードに収まる短い説明） */
const WORKS_META: Record<string, { body: string; result: string }> = {
  'lake-house-nojiriko': { body: '野尻湖畔の1日1組限定ヴィラ。サウナ・桟橋を備えた高級一棟貸し。', result: '稼働率 43% → 66%' },
  'lakeside-inn-nojiriko': { body: '野尻湖畔のトレーラーハウス4棟。グループ旅行・研修に強い複合施設。', result: '稼働率 40% → 63%' },
  'mountain-villa-niseko': { body: 'ゲレンデ近くの一棟貸し山岳ロッジ。冬のインバウンド需要を取り込む。', result: '稼働率 38% → 60%' },
  'atami-white-house': { body: '熱海の海を望むオーシャンビュー一棟貸し。サウナ・BBQ付きの人気物件。', result: '稼働率 45% → 64%' },
  'teshikaga-lodge': { body: '摩周湖・屈斜路湖に近い自然立地の一棟貸しロッジ。観光期の需要が高い。', result: '稼働率 41% → 62%' },
  'teshikaga-tower-sauna': { body: '温泉×タワーサウナのウェルネス一棟貸し。高付加価値層を獲得。', result: '稼働率 44% → 67%' },
}

/* オーナーの声（ペルソナ付き・リアルな声） */
const VOICES = [
  {
    initial: 'A',
    persona: '40代・会社員（副業で1棟運用）',
    meta: '長野県・一棟貸しヴィラ ／ 運用2年',
    quote:
      '正直、最初は「丸投げで本当に回るの？」と半信半疑でした。でも写真と説明文を直してもらってから問い合わせが増えて、今は月の収支をアプリで眺めるのが楽しみに。自分では絶対できなかった価格調整まで任せられて助かっています。',
  },
  {
    initial: 'K',
    persona: '50代・元ホテル勤務',
    meta: '北海道・一棟貸しロッジ ／ 他社から乗り換え',
    quote:
      '前の会社は「今月いくら入ったか」を聞かないと分からず、不信感が募っていました。乗り換えてからは費用も成果も全部見えるのでストレスがありません。レビューへの返信まで丁寧で、宿として一緒に育ててもらえている感覚があります。',
  },
  {
    initial: 'M',
    persona: '30代・共働き夫婦',
    meta: '山梨県・湖畔の宿 ／ 運用1年半',
    quote:
      '子育てと仕事で手が回らず、清掃やゲスト対応が限界でした。今こちらに来る連絡は月次レポートくらい。閑散期の価格まで細かく調整してもらえるので、以前より取りこぼしが減りました。預けて正解だったと思います。',
  },
]

/* オーナー × 代表 対談 */
const INTERVIEW = {
  image: '/images/switch/property-cabin.jpg',
  ownerName: 'K様',
  ownerProfile: '50代・会社経営（本業のかたわら1棟運用）',
  property: '東京・中目黒｜一棟貸し',
  meta: '運用1年8ヶ月 ・ 他社から乗り換え',
  hostName: '代表 劉 添毅',
  hostImg: '/images/founders/tenichi.png',
  // パンチライン（驚き）
  quote: 'この手数料で、この運営品質は、正直おどろきました。',
  intro:
    '知人の紹介で別の代行に任せていたものの、「見えない運用」に不安を募らせていた K様。SEKAI STAY への乗り換えから1年8ヶ月。何が変わったのかを、代表の劉 添毅とのやり取りで振り返ります。',
  dialogue: [
    { who: 'owner', text: '以前は知人の紹介で別の代行にお願いしていたんです。ただ毎月の明細がざっくりで、何にいくら使われているのか分からない。問い合わせの返事も2〜3日かかることがあって、だんだん任せきりにするのが怖くなってきて。' },
    { who: 'host', text: 'よくうかがうお悩みです。私たちはまず、売上・予約・レビュー・経費をオーナー様専用のダッシュボードに全部のせました。スマホからいつでも見られる状態にすることが、信頼の第一歩だと思っています。' },
    { who: 'owner', text: 'それが本当に大きくて。手元で数字がリアルタイムに見えるので、こちらから「今月どうですか？」と聞く必要がなくなりました。むしろ自分が見すぎてしまうくらいで（笑）。' },
    { who: 'host', text: '掲載写真と説明文は、需要を見ながら毎月手を入れています。価格も曜日・連休・近隣イベントに合わせて動かすので、繁忙期の取りこぼしが減ります。K様の物件はレビューも安定して伸びました。' },
    { who: 'owner', text: '正直に言うと、乗り換える前は「手数料8%なんて、その分どこか手を抜くんじゃないか」と疑っていたんです。でも蓋を開けたら逆で。この手数料で、この運営品質は、正直おどろきました。' },
    { who: 'host', text: 'ありがとうございます。運用をできる限り仕組みにしているので、品質を落とさずにコストを抑えられるんです。浮いた分はオーナー様にお返しする、という考え方でやっています。' },
    { who: 'owner', text: '清掃もゲスト対応も完全にこちらの手を離れたのに、評価はむしろ上がりました。おかげで本業に集中できています。' },
    { who: 'host', text: '物件は「預かる」のではなく、観光資産として一緒に育てたい。3ヶ月ごとに数字を振り返って、次の打ち手をご提案します。これからもその姿勢は変えません。' },
    { who: 'owner', text: '「丸投げ」なのに「一緒にやっている」感覚があるんですよね。だから安心して、2棟目も相談させてもらいました。' },
  ] as const,
}

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies()
  // データ取得は維持（件数・スーパーホスト数の参照に使用）
  const metrics = getAverageMetrics()

  return (
    <>
      <Header />

      <main>
        {/* Hero — RESULTS / 民泊運営代行の実績 */}
        <section className="relative w-full overflow-hidden bg-ivory section-hero pt-28 sm:pt-32">
          <GhostWordmark />
          <div className="relative z-10 container-edit">
            <SectionHead
              as="h1"
              hero
              en="CASE STUDIES"
              sub="民泊運営代行の実績"
              lead={`運用をお預かりした物件で、稼働率も評価も着実に伸びています。全${metrics.totalProperties}件の事例と、その打ち手を数字とあわせて公開しています。`}
            />
          </div>
        </section>

        {/* オーナーの声 — 代表との対談インタビュー */}
        <section className="w-full bg-paper section-2xl">
          <div className="container-edit">
            <SectionHead en="VOICE" sub="オーナーの声" />

            <div className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
              {/* 左：ビジュアル＋オーナー詳細（PCでは sticky） */}
              <div className="lg:sticky lg:top-28">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                  <Image src={INTERVIEW.image} alt={INTERVIEW.property} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                </div>
                <p className="mt-6 font-grotesk text-[12px] font-bold tracking-[0.16em] text-sekai-teal">INTERVIEW 01</p>
                <p className="mt-2 text-[1.125rem] font-bold leading-snug text-ink">{INTERVIEW.ownerName} × {INTERVIEW.hostName}</p>
                <dl className="mt-4 space-y-2 border-t border-rule pt-4 text-[13px]">
                  <div className="flex gap-3"><dt className="w-16 shrink-0 font-bold text-ink/45">オーナー</dt><dd className="text-ink/75">{INTERVIEW.ownerProfile}</dd></div>
                  <div className="flex gap-3"><dt className="w-16 shrink-0 font-bold text-ink/45">物件</dt><dd className="text-ink/75">{INTERVIEW.property}</dd></div>
                  <div className="flex gap-3"><dt className="w-16 shrink-0 font-bold text-ink/45">運用</dt><dd className="text-ink/75">{INTERVIEW.meta}</dd></div>
                </dl>
              </div>

              {/* 右：パンチライン＋チャット形式の対談 */}
              <div>
                <p className="text-[clamp(1.625rem,3.2vw,2.5rem)] font-bold leading-[1.45] tracking-[-0.01em] text-ink">「{INTERVIEW.quote}」</p>
                <p className="mt-8 text-[14px] leading-[1.95] text-ink/70 sm:text-[15px]">{INTERVIEW.intro}</p>
                <div className="mt-10 border-t border-rule pt-10">
                  <InterviewChat
                    turns={INTERVIEW.dialogue as unknown as { who: 'owner' | 'host'; text: string }[]}
                    hostName={INTERVIEW.hostName}
                    hostImg={INTERVIEW.hostImg}
                    ownerName={INTERVIEW.ownerName}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* その他のオーナー様の声 — カード */}
        <section className="w-full bg-ivory section-2xl">
          <div className="container-edit">
            <SectionHead en="VOICES" sub="その他のオーナー様の声" />
            <div className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-3">
              {VOICES.map((v) => (
                <figure key={v.initial} className="flex flex-col rounded-2xl border border-rule bg-paper p-7 transition hover:-translate-y-0.5">
                  <span className="font-grotesk text-[3rem] leading-[0.6] text-bright-teal">“</span>
                  <blockquote className="mt-4 flex-1 text-[14px] leading-[1.95] text-ink/85">{v.quote}</blockquote>
                  <figcaption className="mt-7 flex items-center gap-3 border-t border-rule pt-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy font-grotesk text-[16px] font-bold text-white">
                      {v.initial}
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold text-ink">{v.persona}</span>
                      <span className="mt-0.5 block text-[12px] text-ink/55">{v.meta}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 全体平均（navy）— ResultsSense と同型 */}
        <section className="w-full bg-navy section-2xl text-white">
          <div className="container-edit">
            <SectionHead
              light
              en="What changed?"
              sub="数字にもインパクトのある変化を"
              lead="運用を任せた前と後で、数字は確かに動きました。一棟の偶然ではなく、私たちが預かる物件全体で起きている変化です。継続6ヶ月以上の管理物件の平均値を、そのまま公開します。"
            />
            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:mt-16 md:grid-cols-4">
              {RESULT_STATS.map((s) => (
                <div key={s.l} className="border-t border-white/20 pt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="font-grotesk text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none tracking-tight text-white">
                      {s.v}
                    </span>
                    <span className="font-grotesk text-2xl font-bold text-bright-teal">{s.u}</span>
                  </div>
                  <p className="mt-3 text-[13px] text-white/70">{s.l}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-[11px] text-white/45">
              ※ 2026年4月時点／継続6ヶ月以上の管理物件平均。成果は物件の立地・条件により異なります。
            </p>
          </div>
        </section>

        {/* 事例紹介 — 横スライドカルーセル（/pricing INCLUDED 型） */}
        <section className="w-full bg-paper section-2xl">
          <div className="container-edit">
            <SectionHead en="WORKS" sub="事例紹介" />
          </div>
          <div className="container-edit mt-12 sm:mt-16">
            <SlideCarousel
              fullBleed
              ariaLabel="運用事例"
              items={caseStudies.map((c) => {
                const m = WORKS_META[c.id]
                return {
                  image: c.image,
                  alt: c.name,
                  tag: c.type,
                  title: `${c.name}（${c.location}）`,
                  body: m?.body ?? c.description,
                  result: m?.result ?? (c.results.reviewScore ? `レビュー ${c.results.reviewScore}` : c.type),
                }
              })}
            />
          </div>
        </section>

        {/* 関連ページ導線 */}
        <section className="w-full bg-ivory">
          <div className="container-edit border-t border-rule py-14">
            <RelatedLinks items={[{ href: '/pricing', label: '料金を見る' }, { href: '/services', label: 'サービス内容' }]} />
          </div>
        </section>

        {/* 末尾CTA — 共通 ContactSense（REPORT / CONTACT） */}
        <ContactSense />
      </main>

      <Footer />
      <FloatingCTA />
    </>
  )
}
