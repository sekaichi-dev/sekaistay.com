import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import Reveal from '@/components/motion/Reveal'
import SectionHead from '@/components/ds/SectionHead'
import EditorialList from '@/components/ds/EditorialList'
import SlideCarousel from '@/components/ds/SlideCarousel'
import CountUp from '@/components/switch/deco/CountUp'
import GhostWordmark from '@/components/ds/GhostWordmark'
import SavingsSimulator from '@/components/services/SavingsSimulator'
import ServicesFaq from '@/components/services/ServicesFaq'
import RelatedLinks from '@/components/ds/RelatedLinks'
import AuditLink from '@/components/audit/AuditLink'
import { ContactSense } from '@/components/home/SenseSections'

export const metadata: Metadata = {
  title: '料金',
  description:
    'SEKAI STAYの料金体系。毎月の基本料金は売上の8%＋月額10,000円/物件。初期費用は乗り換え¥100,000/物件・新規立ち上げプラン¥300,000（プロ撮影込み）。かかりうる費用をすべて開示します。',
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
  { t: 'OTA掲載・リスティング最適化', img: '/images/included/INCLUDED1.png' },
  { t: 'リアルタイムダッシュボード（24時間・スマホ）', img: '/images/included/INCLUDED2.png' },
  { t: '24時間・4言語ゲスト対応', img: '/images/included/INCLUDED3.png' },
  { t: 'データに基づく価格調整', img: '/images/included/INCLUDED4.png' },
  { t: '清掃手配・品質管理', img: '/images/included/INCLUDED5.png' },
  { t: '自動返信・定型メッセージ設定', img: '/images/included/INCLUDED6.png' },
  { t: '法令対応サポート', img: '/images/included/INCLUDED7-2.png' },
  { t: 'レビュー管理・改善', img: '/images/included/INCLUDED8.png' },
  { t: '専任スタッフ（3ヶ月毎・オンライン定例）', img: '/images/included/INCLUDED9.png' },
  { t: '緊急時対応（24時間）', img: '/images/included/INCLUDED10.png' },
]

const EXTRAS = [
  { no: '01', title: '初期費用', body: '乗り換えは一律10万円、新規立ち上げは立ち上げプラン30万円（プロ撮影込み・全8工程）。2026年8月31日までのお問い合わせで、どちらも初期費用から10万円割引になります。' },
  { no: '02', title: '有料オプション（希望制）', body: '①物件撮影 ②インテリアコーディネート ③許認可申請代行 ④スマートロック導入 ⑤一休.com・じゃらん追加掲載 は、事前見積もりのうえ、物件のサイズなどに応じて承ります。' },
  { no: '03', title: '民泊保険・火災保険の加入', body: '我々は火災保険・民泊保険への加入をオーナー様にお願いしております。きちんと訴求しない民泊運用代行業者も一部ありますが、なにかあったときに大切な物件を守るためにも、弊社としては推奨いたします。（保険の紹介手数料などをいただくことは一切ございません。）' },
]

const SETUP_STEPS = [
  { no: '01', title: 'プロ写真撮影', body: 'プロカメラマンによる物件撮影を標準で内包。撮影が不要な場合は、初期費用から¥80,000を割引します。' },
  { no: '02', title: 'OTAリスティング初期設定', body: 'Airbnb・Booking.comなど主要予約サイトへの掲載と、カレンダー連携をセットアップします。' },
  { no: '03', title: 'Airbnb登録用 電話番号の代行取得・登録', body: '登録に必要な電話番号の取得・登録を代行。メールアドレスの発行にも対応します。' },
  { no: '04', title: '料金初期設定（ダイナミックプライシング）', body: '需要・競合・季節をふまえた価格設計で、開業初日から適正価格でスタートします。' },
  { no: '05', title: 'キーボックス・鍵設定／設備確認', body: 'ゲストが迷わず入室できる鍵まわりの設定と、開業前の設備チェックを行います。' },
  { no: '06', title: '消耗品・アメニティ初期管理', body: 'タオル・アメニティなど開業に必要な備品を初期セットアップ。※内容により一部実費が発生します。' },
  { no: '07', title: 'ハウスマニュアル作成', body: 'チェックイン手順・設備の使い方・ゴミ出し・ハウスルール・緊急連絡先・周辺情報を、多言語テンプレで整備します。' },
  { no: '08', title: '清掃会社の手配・初回設定／公開', body: '清掃パートナーの手配と初回設定まで整え、リスティングを公開。そのまま運用開始につなげます。' },
]

const TERMS_PANELS = [
  { no: '01', title: '最低契約期間が6ヶ月の理由', body: '価格調整と掲載最適化の効果が数字に表れるまで、季節をまたいだ運用期間が必要だからです。短期で判断せず、稼働率と単価を着実に伸ばすための期間として設けています。その上で任せられないと判断された場合には、いつでも解約が可能です。' },
  { no: '02', title: '解約の条件は最初に開示', body: '7ヶ月目以降の解約金は¥0、解約のご連絡は3ヶ月前まで。6ヶ月未満で途中解約する場合のみ解約手数料20万円をいただきます。この条件も契約前にすべてお伝えします。' },
]

const PRICING_FAQ = [
  {
    q: 'SEKAI STAYの民泊運営代行の料金は？',
    a: '毎月の基本料金は、変動運営委託費（売上の8%）＋固定管理費10,000円/物件/月です。初期費用は乗り換えが100,000円/物件、新規立ち上げが立ち上げプラン300,000円/物件（プロ撮影込み・全8工程）。このほかは消耗品などの実費（実費＋20%）と、ご希望のときだけの有料オプションのみで、かかりうる費用は契約前にすべて金額つきで提示します。※2026年8月31日までのお問い合わせは、初期費用10万円割引キャンペーンの対象です。',
  },
  {
    q: '他社からの乗り換えに費用はかかりますか？',
    a: '初期費用として100,000円/物件をいただきます。移行作業に加えて、リスティング最適化（多言語）まで含む金額です。OTAの引き継ぎは並走で進めるため収益の空白期間はなく、移行は最短2週間で完了します。※2026年8月31日までのお問い合わせは、キャンペーンにより乗り換え初期費用が¥0になります。',
  },
  {
    q: '新規立ち上げの初期費用には何が含まれますか？',
    a: '立ち上げプラン300,000円/物件（一括）に、プロ写真撮影・OTAリスティング初期設定（Airbnb・Booking）・Airbnb登録用電話番号の代行取得・料金初期設定（ダイナミックプライシング）・キーボックス設定と設備確認・消耗品/アメニティ初期管理・ハウスマニュアル作成（多言語）・清掃会社の手配と公開の全8工程を含みます。撮影が不要な場合は80,000円割引。2026年8月31日までのお問い合わせは、立ち上げ割引により200,000円になります。',
  },
  {
    q: '解約金はかかりますか？',
    a: '最低契約期間は6ヶ月です。7ヶ月目以降の解約金は¥0で、いつでも解約できます（解約のご連絡は3ヶ月前までにお願いします）。6ヶ月未満で途中解約する場合のみ、解約手数料20万円をいただきます。この条件も、最初にお伝えします。',
  },
  {
    q: '宿泊予約がない月も費用はかかりますか？',
    a: '固定管理費（10,000円/物件）のみ発生し、変動運営委託費（8%）は売上連動のため0円です。閑散期の固定費は1物件で月10,000円に収まります。',
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

export default function PricingPage() {
  return (
    <>
      <Header />
      <FloatingCTA />
      <main>
        {/* 1. Hero（ivory）— SectionHead(h1)＋GhostWordmark（他ページとサイズ統一） */}
        <section className="relative w-full overflow-hidden bg-ivory section-hero pt-28 sm:pt-32">
          <GhostWordmark />
          <div className="relative z-10 container-edit">
            <SectionHead
              as="h1"
              hero
              en="PRICING"
              sub="民泊運営代行の料金プラン"
              lead="毎月の基本料金は、売上の8%＋月1万円/物件。初期費用・実費・希望制の有料オプションまで、かかりうる費用をこのページですべて開示します。"
            />
          </div>
        </section>

        {/* 2. 料金プラン（navy）— /services PRICE と同型：巨大8%ロックアップ＋¥0内訳帯 */}
        <section className="w-full bg-navy section-2xl text-white">
          <div className="container-edit">
            <SectionHead light en="PLAN" sub="料金はたったひとつだけ" />

            {/* 価格ロックアップ：巨大8% を主役に、右に補足＋CTA を収める */}
            <div className="mt-12 flex flex-col gap-10 sm:mt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <Reveal as="div" className="flex flex-wrap items-end gap-x-6 gap-y-3">
                <CountUp
                  target={8}
                  suffix="%"
                  duration={1600}
                  className="font-grotesk text-[clamp(6rem,23vw,15rem)] font-bold leading-[0.72] tracking-[-0.05em] text-white tabular-nums"
                />
                <div className="mb-2 sm:mb-3">
                  <p className="text-[clamp(1.25rem,2.6vw,1.875rem)] font-bold text-white">＋ 月額 ¥10,000 ／ 物件</p>
                  <p className="mt-2 text-[14px] font-bold text-white/55">これ以外の費用は、いただきません。</p>
                </div>
              </Reveal>
              <Reveal as="div" className="shrink-0">
                <AuditLink
                  data-cta="audit"
                  data-cta-label="pricing-plan"
                  className="btn btn-cta group !rounded-full px-9"
                >
                  無料で収益診断を受ける
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </AuditLink>
              </Reveal>
            </div>

            <Reveal as="div">
              <p className="mt-10 max-w-3xl text-[15px] leading-[1.95] text-white/80 sm:text-[16px]">
                SEKAI STAYの料金は「売上の8% ＋ ¥10,000/物件/月」のみ。解約金・広告費・レポート作成費など、運営に関わる費用はすべて¥0です。清掃費は別途かかりますが、ゲストにご請求するため、オーナー様のご負担は一切発生しません。
              </p>
            </Reveal>
          </div>
        </section>

        {/* 3. 含まれるもの／外でかかる費用（paper）— EditorialList */}
        <section className="w-full bg-paper section-2xl">
          <div className="container-edit">
            <SectionHead
              en="INCLUDED"
              sub="基本料金で民泊運用の全てをまるっと対応"
              lead="各種予約サイトの写真・文章の最適化、ゲスト対応、清掃手配、急なトラブル対応まで。運営はすべてSEKAI STAYが引き受けます。オーナー様は何もしなくて大丈夫。お任せいただいた瞬間から、運営は私たちの仕事です。"
            />
          </div>

          {/* 含まれる業務 — 横スライドカルーセル（ACHIEVEMENT型） */}
          <div className="container-edit mt-12 sm:mt-16">
            <SlideCarousel
              fullBleed
              ariaLabel="基本料金に含まれる運用業務"
              items={INCLUDES.map((i) => ({ image: i.img, alt: i.t, title: i.t, tag: '標準で含まれる' }))}
            />
          </div>

          {/* 基本料金の外でかかりうる費用 — カード3枚（スライドなし） */}
          <div className="container-edit mt-20 sm:mt-24">
            <p className="text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">基本料金の外でかかりうる費用</p>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-3">
              {EXTRAS.map((x) => (
                <div key={x.no} className={`flex flex-col rounded-[12px] bg-white p-7 ${x.no === '01' ? 'ring-2 ring-[#F2691B]' : 'ring-1 ring-rule'}`}>
                  <span className={`font-grotesk text-[1.75rem] font-bold leading-none ${x.no === '01' ? 'text-[#F2691B]' : 'text-sekai-teal'}`}>{x.no}</span>
                  <h3 className="mt-4 text-[1.0625rem] font-bold leading-snug text-ink">{x.title}</h3>
                  <p className="mt-3 flex-1 text-[13.5px] leading-[1.9] text-ink/70">{x.body}</p>
                  {x.no === '01' && (
                    <AuditLink
                      data-cta="audit"
                      data-cta-label="pricing-campaign"
                      className="group mt-5 block overflow-hidden rounded-[12px] bg-[#F2691B] px-5 py-4 text-white animate-[cta-pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-transform hover:-translate-y-0.5 motion-reduce:animate-none"
                    >
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] text-white">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        8/31までのお問い合わせ限定キャンペーン
                      </span>
                      <p className="mt-2 flex items-baseline gap-2 font-bold text-white">
                        乗り換え初期費用
                        <span className="text-[14px] text-white/60 line-through">¥100,000</span>
                        <span className="font-grotesk text-[2rem] leading-none text-white">¥0</span>
                      </p>
                      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[13px] font-bold text-white/90">
                        新規立ち上げ
                        <span className="text-white/60 line-through">¥300,000</span>
                        <span className="font-grotesk text-[1.25rem] leading-none text-white">¥200,000</span>
                      </p>
                      <p className="mt-1.5 text-[12px] leading-[1.7] text-white/85">
                        2026年8月31日までのお問い合わせで、初期費用をどちらも10万円割引。
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-white">
                        このまま無料で収益診断を受ける
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </AuditLink>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-[14px] leading-[1.95] text-ink/60">
              見積もりにない名目の請求はしません。かかりうる費用は、すべて契約前に金額つきでお渡しします。
            </p>
          </div>
        </section>

        {/* 3.5 新規立ち上げプラン（navy）— SETUP：ゼロから始める方の初期構築 全8工程 */}
        <section className="w-full bg-navy section-2xl text-white">
          <div className="container-edit">
            <SectionHead
              light
              en="SETUP"
              sub="新規で始める方の立ち上げプラン"
              lead="これから民泊を始める方向けに、ゼロからの立ち上げ全8工程を一括で代行します。既存物件からの乗り換えの場合、この費用は不要です。"
            />

            {/* 価格ロックアップ：キャンペーン価格を主役に、通常価格は打ち消し */}
            <Reveal as="div" className="mt-12 sm:mt-16">
              <span className="inline-flex items-center rounded-md border border-bright-teal px-3 py-1 text-[12px] font-bold tracking-[0.08em] text-bright-teal">
                8/31までのお問い合わせ限定・立ち上げ割引
              </span>
              <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
                <span className="font-grotesk text-[clamp(3.25rem,11vw,7.5rem)] font-bold leading-[0.8] tracking-[-0.04em] text-white">
                  ¥200,000
                </span>
                <div className="mb-1 sm:mb-2">
                  <p className="text-[15px] font-bold text-white/60">
                    通常 <span className="line-through">¥300,000</span>（一括）
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-white">プロ写真撮影込み・初期費用から10万円割引</p>
                </div>
              </div>
            </Reveal>

            <div className="mt-12 sm:mt-14">
              <EditorialList light columns={2} items={SETUP_STEPS} />
            </div>
          </div>
        </section>

        {/* 4. HOW MUCH? — かんたん収益試算（ivory・/services と共通） */}
        <section className="w-full bg-ivory section-2xl">
          <div className="container-edit">
            <SectionHead
              en="HOW MUCH?"
              sub="30秒でかんたん収益試算"
              lead="スライダーを動かすと、今の手数料との差額が年間・累計でわかります。30秒で、手取りがどう変わるかの目安をご確認ください。"
            />
            <Reveal as="div" className="mt-12 sm:mt-14">
              <SavingsSimulator />
            </Reveal>
          </div>
        </section>

        {/* 4. 解約金・最低契約（navy）— ¥0 巨大数字 */}
        <section className="w-full bg-navy section-2xl text-white">
          <div className="container-edit">
            <SectionHead light en="TERMS" sub="解約金と最低契約期間" />
            <Reveal as="div" className="mt-12 sm:mt-16">
              <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                <span className="font-grotesk text-[clamp(5rem,20vw,12rem)] font-bold leading-[0.8] tracking-[-0.04em] text-white">
                  ¥0
                </span>
                <span className="mb-3 text-[clamp(1.125rem,2.4vw,1.625rem)] font-bold text-white">7ヶ月目以降の解約金</span>
              </div>
              <p className="mt-8 max-w-2xl text-[15px] leading-[1.95] text-white">
                最低契約期間は6ヶ月です。7ヶ月目以降は、解約金なしでいつでもご解約いただけます。民泊運用代行業界では、長期の契約期間や高額な解約金が設定されているケースも少なくありません。私たちは、オーナー様ご自身が納得したうえで、民泊運用を続けられることが何より大切だと考えています。そのため、契約期間を必要以上に縛らず、安心して始めていただける形にしています。
              </p>
              <p className="mt-4 max-w-2xl text-[13px] leading-[1.9] text-white/70">
                ※解約をご希望の場合は、解約希望日の3ヶ月前までにご連絡ください。
              </p>
            </Reveal>
            <div className="mt-12">
              <EditorialList light columns={2} items={TERMS_PANELS} />
            </div>
          </div>
        </section>

        {/* 料金FAQ */}
        <ServicesFaq items={PRICING_FAQ} sub="料金についてよくある質問" />

        {/* 関連ページ導線 */}
        <section className="w-full bg-paper">
          <div className="container-edit border-t border-rule py-14">
            <RelatedLinks items={[{ href: '/services', label: 'サービス内容を見る' }, { href: '/case-studies', label: '実績・オーナーの声' }]} />
          </div>
        </section>

        {/* 末尾CTA — 共通 ContactSense（無料診断／相談 2分割） */}
        <ContactSense />

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
              name: 'SEKAI STAY 民泊運営代行',
              description: '民泊運営代行サービス。OTA運用・ゲスト対応・清掃・プライシング最適化を一括代行。基本料金は売上の8%＋月額10,000円/物件。',
              brand: { '@type': 'Organization', name: 'SEKAI STAY' },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'JPY',
                lowPrice: '10000',
                highPrice: '300000',
                offerCount: '3',
                offers: [
                  { '@type': 'Offer', name: '初期費用（乗り換え）', price: '100000', priceCurrency: 'JPY', description: '1物件あたり。移行作業・リスティング最適化（多言語）を含む。', availability: 'https://schema.org/InStock' },
                  { '@type': 'Offer', name: '初期費用（新規立ち上げ・立ち上げプラン）', price: '300000', priceCurrency: 'JPY', description: '1物件あたり300,000円（プロ撮影込み）。OTA初期設定・ハウスマニュアル作成・清掃手配など立ち上げ全8工程を含む。', availability: 'https://schema.org/InStock' },
                  { '@type': 'Offer', name: '月額固定管理費', price: '10000', priceCurrency: 'JPY', description: '1物件あたり月額10,000円。変動運営委託費は売上の8%。', availability: 'https://schema.org/InStock' },
                ],
              },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  )
}
