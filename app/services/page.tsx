import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import Reveal from '@/components/motion/Reveal'
import TextSlideUp from '@/components/motion/TextSlideUp'
import { ContactSense } from '@/components/home/SenseSections'
import ServicesFaq from '@/components/services/ServicesFaq'
import DashboardDemo from '@/components/switch/DashboardDemo'
import SectionHead from '@/components/ds/SectionHead'
import SlideCarousel from '@/components/ds/SlideCarousel'
import RelatedLinks from '@/components/ds/RelatedLinks'
import OverviewCards from '@/components/ds/OverviewCards'
import ImageMarquee from '@/components/ds/ImageMarquee'
import GhostWordmark from '@/components/ds/GhostWordmark'
import OtaMarquee from '@/components/ds/OtaMarquee'
import { getAllAreas } from '@/lib/areas'

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

/* SERVICES ロゴ帯直下の画像マーキー（1〜2万円レンジの民泊らしい宿泊空間＋清掃／他ページ未使用・全てUnsplash） */
const SERVICE_IMAGES = [
  { src: '/images/service-marquee/e1.png', alt: 'SEKAI STAY が運用する民泊の様子' },
  { src: '/images/service-marquee/e2.png' },
  { src: '/images/service-marquee/e3.png' },
  { src: '/images/service-marquee/e4.png' },
]

/* 含まれる7つの仕事（/switch SwitchServices の7機能を移植・図解グリッド用） */
/* 民泊運用代行の10業務（/pricing の INCLUDED と同じ並び・画像を流用） */
const FEATURES = [
  {
    img: '/images/included/INCLUDED1.png',
    title: 'OTA掲載・リスティング最適化',
    body: 'Airbnb など各予約サイトのタイトル・説明文・写真を毎月見直し。検索で見つかり、選ばれる掲載に整えます。',
    result: '掲載順位の向上',
  },
  {
    img: '/images/included/INCLUDED2.png',
    title: 'リアルタイムダッシュボード',
    body: '売上・予約・レビュー・経費を専用画面に集約。スマホでもPCでも、物件の状況がひと目でわかります。',
    result: '状況がひと目で',
  },
  {
    img: '/images/included/INCLUDED3.png',
    title: '24時間・4言語ゲスト対応',
    body: '日・英・中・韓の4言語で、予約前からチェックアウトまで24時間対応。オーナー様が連絡を受けることはありません。',
    result: 'オーナー対応 0件',
  },
  {
    img: '/images/included/INCLUDED4.png',
    title: 'データに基づく価格調整',
    body: '需要・競合・曜日・イベントを毎日見ながら価格を調整。空室を埋めつつ、単価もしっかり取りにいきます。',
    result: '平均稼働率 +11%',
  },
  {
    img: '/images/included/INCLUDED5.png',
    title: '清掃手配・品質管理',
    body: '独自100項目のチェックリストで清掃・点検を毎回標準化。次のゲストを、いつも同じ清潔さでお迎えします。',
    result: 'レビュー 4.8/5',
  },
  {
    img: '/images/included/INCLUDED6.png',
    title: '自動返信・定型メッセージ設定',
    body: 'よくある問い合わせは定型文と自動返信で即レスポンス。返信の速さと質を保ち、取りこぼしを防ぎます。',
    result: '返信スピード向上',
  },
  {
    img: '/images/included/INCLUDED7-2.png',
    title: '法令対応サポート',
    body: '住宅宿泊事業法など、必要な届出・運用ルールの順守をサポート。安心して運営を続けられる体制を整えます。',
    result: '法令順守を支援',
  },
  {
    img: '/images/included/INCLUDED8.png',
    title: 'レビュー管理・改善',
    body: '一件ずつ丁寧に返信し、低評価の要因は運用に反映。高評価を積み上げ、選ばれ続ける物件に育てます。',
    result: 'レビュー 4.8/5',
  },
  {
    img: '/images/included/INCLUDED9.png',
    title: '専任スタッフ（3ヶ月毎・オンライン定例）',
    body: '専任担当が3ヶ月ごとに収益を振り返り、次の打ち手をご提案。任せきりにせず、一緒に育てていきます。',
    result: '継続率 97%',
  },
  {
    img: '/images/included/INCLUDED10.png',
    title: '緊急時対応（24時間）',
    body: '設備トラブルやゲストの急なお困りごとも、24時間体制で対応。深夜・休日でも、まず私たちが動きます。',
    result: '24時間 即対応',
  },
]

/* ダッシュボードでできること（/switch のオーナーポータル機能に合わせる） */
const DASH_ITEMS = [
  {
    t: '売上・稼働率をリアルタイム確認',
    d: '今月の売上・稼働率・レビューを、スマホでもPCでもひと目で。',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />
      </svg>
    ),
  },
  {
    t: '運営チームへ直接チャット',
    d: 'ご要望や相談を、運営チームへその場で。やり取りも残ります。',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M21 12a8 8 0 01-11.5 7.2L4 20l.8-5.5A8 8 0 1121 12z" />
      </svg>
    ),
  },
  {
    t: '確定申告用レポートを出力',
    d: '収支データをワンタップで書き出し。確定申告の手間を軽減します。',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 2v6h6M8 13h8M8 17h6" />
      </svg>
    ),
  },
  {
    t: 'オーナー様ご自身の予約',
    d: 'ご自身・知人の利用は、ダッシュボードから¥0計上で予約。',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
      </svg>
    ),
  },
]

/* 開業までの流れ（/switch SwitchFlow の3ステップを移植） */
const FLOW_STEPS = [
  {
    no: '01',
    title: '無料収益診断',
    period: '最短 当日',
    body: '物件の情報をお送りください。今の収益と、これから伸ばせる余地を無料で診断してご提示します。',
  },
  {
    no: '02',
    title: '物件の確認とご提案',
    period: '3〜5日',
    body: '立地や稼働状況をふまえ、運用プランと収益の見込みを個別にご提案。ご納得いただいてから契約に進みます。',
  },
  {
    no: '03',
    title: '契約・運営スタート',
    period: '1〜2週間',
    body: '掲載・清掃・ゲスト対応の体制をこちらで整え、運用をスタート。あとはお任せいただくだけです。',
  },
]

/* 他社比較（/switch SwitchComparison の rows を移植・匿名） */
const COMPARE_ROWS = [
  { label: '手数料率', others: '15〜25%', sekai: '8%', hl: true },
  { label: '月額固定費', others: '別途 数万円', sekai: '¥10,000/物件 のみ' },
  { label: 'オーナー向けダッシュボード', others: 'なし〜月次PDF', sekai: 'リアルタイム統合型', hl: true },
  { label: 'オーナー自身の予約', others: '都度相談', sekai: 'ダッシュボードから1タップ' },
  { label: '税理士用データの書き出し', others: '手作業で数日', sekai: 'ワンタップで即時' },
  { label: '需要連動の価格調整', others: '手動 or なし', sekai: '毎日自動' },
  { label: 'OTA写真・文章の最適化', others: '担当者が最適化', sekai: 'プロが最適化' },
  { label: 'ゲスト対応の言語', others: '日本語のみが多い', sekai: '日・英・中・韓 24時間' },
  { label: '専任スタッフとの面談', others: 'なし', sekai: '3ヶ月ごと' },
  { label: '対応エリア', others: 'エリアが限られる', sekai: '全国対応', hl: true },
]

/* 運用代行FAQ */
const FAQ_ITEMS = [
  {
    q: '手数料8%には何が含まれますか？',
    a: '掲載最適化・価格調整・ゲスト対応・清掃手配・ダッシュボードなど、運用に必要な業務を標準で含みます。別途かかるのは初期費用、消耗品などの実費、ご希望時の有料オプションのみです。',
  },
  {
    q: '今は他社に運用を任せています。乗り換えられますか？',
    a: 'はい。現在の契約内容を確認し、引き継ぎの段取りまでサポートします。乗り換えで手数料や手取りがどう変わるかは、無料収益診断で具体的にお出しできます。',
  },
  {
    q: '物件が遠方にあっても対応できますか？',
    a: '対応エリアは順次拡大しています。まずは物件の所在地をお知らせください。対応可否と、そのエリアでの運用見込みをあわせてご案内します。',
  },
  {
    q: 'どれくらいの期間で始められますか？',
    a: '物件の状況によりますが、必要な準備が整っていれば数週間で運用を開始できます。開業前の物件は開業支援とあわせて立ち上げから伴走します。',
  },
  {
    q: '売上や運用状況はどこまで見えますか？',
    a: 'オーナー専用ダッシュボードで、売上・予約・ゲスト対応・経費の内訳をいつでも確認できます。「任せているけれど見えない」状態をつくりません。',
  },
  {
    q: 'なぜ手数料8%で運営できるのですか？',
    a: '掲載・価格調整・ゲスト対応などの運用を仕組み化し、無駄なコストを抑えているためです。費用を抑えつつ品質を保てるよう、運用の状況はダッシュボードで可視化しています。',
  },
  {
    q: '途中で解約はできますか？',
    a: '最低契約期間を過ぎれば、解約金はかかりません。詳しい条件は料金ページでご確認いただけます。合わないと感じたときに身動きが取れる契約にしています。',
  },
]

/* 補足3事業 */
const SUB_BIZ = [
  {
    no: '01',
    ja: '民泊の開業支援',
    lead: 'これから始めたい方へ。最初の一歩から伴走。',
    desc: '物件選びの相談から、旅館業・住宅宿泊事業の許認可、家具・設備の手配、開業初月の集客設計まで。「何から手をつければ?」の段階から、運用が軌道に乗るまで専任チームが並走します。はじめての方でも、つまずかずにスタートできます。',
    img: '/images/switch/property-cabin.jpg',
    status: '提供中',
    soon: false,
  },
  {
    no: '02',
    ja: 'SEKAI STAYアンバサダー',
    lead: '広告費ゼロで、ファンと指名予約を育てる。',
    desc: '旅好きのインフルエンサーやアンバサダーが実際に滞在し、物件の魅力をSNSで発信。OTAの表示順に左右されない「名前で選ばれる物件」へ。広告に頼らず、あなたの物件のファンと予約を増やす新しい集客のかたちを準備しています。',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70&auto=format&fit=crop',
    status: '2026年内',
    teaser: '乞うご期待',
    soon: true,
  },
  {
    no: '03',
    ja: '民泊向けオプション提供',
    lead: '宿泊料以外の、もうひとつの収益源を。',
    desc: '宿泊者へ、冷凍和食パッケージや特別な滞在体験などの追加オプションを販売。ゲストの満足度が上がり、宿泊料だけに頼らない収益が生まれます。オーナー様のアップセルにつながる施策をすでに準備中です。',
    img: '/images/switch/property-niseko.jpg',
    status: '2027年',
    teaser: 'お楽しみに',
    soon: true,
  },
]

export default function ServicesPage() {
  // 東京を先頭に
  const allAreas = getAllAreas()
  const areas = [...allAreas.filter((a) => a.slug === 'tokyo'), ...allAreas.filter((a) => a.slug !== 'tokyo')]
  return (
    <>
      <Header />
      <FloatingCTA />

      {/* 1. Hero — BUSINESS / 事業内容 */}
      <section className="relative w-full overflow-hidden bg-ivory section-hero pt-28 sm:pt-32">
        <GhostWordmark />
        <div className="relative z-10 container-edit">
          <TextSlideUp as="h1" className="label-giant text-[clamp(2.75rem,9vw,7rem)] leading-[0.85] tracking-[-0.03em] text-ink">
            SERVICE
          </TextSlideUp>
          <Reveal as="div" delay={0.08}>
            <p className="mt-5 text-[clamp(1.375rem,3vw,2.25rem)] font-bold leading-[1.45] text-ink">
              物件の、観光資産としての価値を、<br />
              オーナー様と共に育てる。
            </p>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.95] text-ink/75 sm:text-[16px]">
              SEKAI STAY は、民泊運用代行を主軸に、物件の「観光資産としての価値の最大化」を目的としたサービスを提供しています。掲載管理からゲスト対応、価格調整、清掃、駆け付け対応まで。運用のすべてをワンストップでお任せいただける体制を整えています。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. OTAマーキー（ロゴ）＋ 画像マーキー（同速で左へ連続スクロール・余白なしで連結） */}
      <OtaMarquee className="bg-navy" />
      <ImageMarquee images={SERVICE_IMAGES} durationSec={61.6} />

      {/* 4. 含まれる10の仕事（teal・INCLUDED型カルーセル） */}
      <section className="w-full bg-navy section-2xl text-white">
        <div className="container-edit">
          <SectionHead
            light
            leadSolid
            enClass="text-[clamp(2rem,5vw,3.25rem)]"
            en="民泊運用代行事業"
            sub="10の業務でまるっと民泊運用を丸投げ"
            lead="各種予約サイトの写真・文章の最適化、ゲスト対応、清掃手配、急なトラブル対応まで。運営はすべてSEKAI STAYが引き受けます。オーナー様は何もしなくて大丈夫。お任せいただいた瞬間から、運営は私たちの仕事です。"
          />
          <div className="mt-10 sm:mt-14">
            <SlideCarousel
              onDark
              fullBleed
              ariaLabel="民泊運用代行に含まれる10の業務"
              items={FEATURES.map((f) => ({ image: f.img, alt: f.title, title: f.title, body: f.body, result: f.result }))}
            />
          </div>
        </div>
      </section>

      {/* 5. DASHBOARD 見える化体験（#1F9CA2 ベース・不規則アニメグラデ＋浮遊デバイス） */}
      <section className="relative w-full overflow-hidden bg-[#1F9CA2] section-2xl text-white">
        {/* 動的グラデ背景（同系ティールの blob mesh） */}
        <div className="tech-mesh" aria-hidden>
          <div className="tech-blob tech-blob-1" />
          <div className="tech-blob tech-blob-2" />
          <div className="tech-blob tech-blob-3" />
        </div>
        <div className="container-edit relative z-10">
          <SectionHead light en="DASHBOARD" sub="民泊運用のすべてが、いつでも見える化" />
          <Reveal as="div" delay={0.08}>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.95] text-white sm:text-[16px]">
              今月の売上、稼働率、ゲストからのレビューまで、スマホでもPCでもひと目で確認。代行会社へわざわざ確認をする手間は、もうありません。さらに日本初<sup className="text-[10px]">※</sup>となる「確定申告用レポートの取得機能」や「オーナー様ご自身の予約機能」まで、これ1つで完結します。
            </p>
            <p className="mt-3 text-[11px] text-white">※2026年5月時点、自社調べ</p>
          </Reveal>

          {/* ショーケース：実機デモを主役に、4機能を端末を指す注釈として配置 */}
          {/* PC：左右にアノテーション（端末を中心に） */}
          <div className="mt-16 hidden items-center justify-center gap-0 lg:mt-24 lg:flex">
            <div className="flex flex-1 flex-col items-end gap-16 pr-12">
              {DASH_ITEMS.slice(0, 2).map((d) => (
                <Reveal as="div" key={d.t} className="flex items-center justify-end gap-4">
                  <div className="text-right">
                    <p className="text-[15px] font-bold text-white">{d.t}</p>
                    <p className="ml-auto mt-1.5 max-w-[230px] text-[13px] leading-[1.75] text-white">{d.d}</p>
                  </div>
                  <span className="flex shrink-0 items-center">
                    <span className="h-px w-10 bg-white/45" />
                    <span className="-ml-px h-2 w-2 rounded-full bg-white" />
                  </span>
                </Reveal>
              ))}
            </div>
            <Reveal as="div" className="shrink-0">
              <div className="float-device drop-shadow-[0_45px_80px_rgba(0,0,0,0.35)]">
                <DashboardDemo noteClass="text-white/80" />
              </div>
            </Reveal>
            <div className="flex flex-1 flex-col items-start gap-16 pl-12">
              {DASH_ITEMS.slice(2, 4).map((d) => (
                <Reveal as="div" key={d.t} className="flex items-center gap-4">
                  <span className="flex shrink-0 items-center">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    <span className="-mr-px h-px w-10 bg-white/45" />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-white">{d.t}</p>
                    <p className="mt-1.5 max-w-[230px] text-[13px] leading-[1.75] text-white">{d.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* モバイル/タブレット：端末を中央に、4機能は罫線区切りの2カラム（カード化しない） */}
          <div className="mt-14 flex flex-col items-center lg:hidden">
            <Reveal as="div">
              <div className="float-device drop-shadow-[0_30px_55px_rgba(0,0,0,0.32)]">
                <DashboardDemo noteClass="text-white/80" />
              </div>
            </Reveal>
            <Reveal as="div" stagger className="mt-14 grid w-full gap-x-10 gap-y-9 sm:grid-cols-2">
              {DASH_ITEMS.map((d) => (
                <div key={d.t} className="border-t border-white/25 pt-4">
                  <p className="text-[14px] font-bold text-white">{d.t}</p>
                  <p className="mt-1.5 text-[13px] leading-[1.85] text-white">{d.d}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. FLOW 運用開始までの流れ（paper・PC=見出し左固定＋右に巨大番号タイムライン） */}
      <section className="w-full bg-paper section-2xl">
        <div className="container-edit">
          <div className="lg:grid lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            {/* 見出し（PCでは sticky） */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHead en="FLOW" sub="最短2週間で運用を始められます" />
            </div>
            {/* ステップ：巨大番号＋縦レールのタイムライン */}
            <ol className="relative mt-14 lg:mt-2">
              {/* 縦レール（番号の中心を通す） */}
              <span className="absolute left-9 top-7 bottom-12 w-px bg-ink/15 sm:left-11" aria-hidden />
              {FLOW_STEPS.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.no}
                  delay={i * 0.1}
                  className="group relative grid grid-cols-[4.5rem_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[5.5rem_1fr] sm:gap-x-9"
                >
                  <div className="relative z-10 flex justify-center">
                    <span className="bg-paper py-2 font-grotesk text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-none tracking-[-0.04em] text-sekai-teal transition-transform duration-300 group-hover:-translate-y-0.5">
                      {s.no}
                    </span>
                  </div>
                  <div className="border-t border-rule pt-5">
                    <span className="inline-block rounded-full bg-sekai-teal/10 px-3 py-1 text-[12px] font-bold text-sekai-teal transition-colors duration-300 group-hover:bg-sekai-teal group-hover:text-white">
                      {s.period}
                    </span>
                    <h3 className="mt-4 text-[clamp(1.25rem,1.8vw,1.625rem)] font-bold text-ink">
                      <span className="relative inline-block pb-1">
                        {s.title}
                        <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-sekai-teal transition-transform duration-500 group-hover:scale-x-100" />
                      </span>
                    </h3>
                    <p className="mt-3 max-w-xl text-[14px] leading-[1.95] text-ink/70 sm:text-[15px]">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 7a. 料金（ivory・価格ロックアップ＋¥0 stat帯＋節約訴求） */}
      <section className="w-full bg-ivory section-2xl">
        <div className="container-edit">
          <SectionHead en="PRICE" sub="料金はたったひとつだけ" />

          {/* 価格ロックアップ：巨大8% を主役に、右に補足＋CTA を収める */}
          <div className="mt-12 flex flex-col gap-10 sm:mt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <Reveal as="div" className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <span className="font-grotesk text-[clamp(6rem,23vw,15rem)] font-bold leading-[0.72] tracking-[-0.05em] text-ink">
                8%
              </span>
              <div className="mb-2 sm:mb-3">
                <p className="text-[clamp(1.25rem,2.6vw,1.875rem)] font-bold text-ink">＋ 月額 ¥10,000 ／ 物件</p>
                <p className="mt-2 text-[14px] font-bold text-ink/55">これ以外の費用は、いただきません。</p>
              </div>
            </Reveal>
            <Reveal as="div" className="shrink-0">
              <Link href="/pricing" className="btn btn-teal w-full !rounded-full px-9 shadow-lg shadow-sekai-teal/20 sm:w-auto">
                料金プランの詳細を見る
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Reveal>
          </div>

          <Reveal as="div">
            <p className="mt-10 max-w-3xl text-[15px] leading-[1.95] text-ink/75 sm:text-[16px]">
              SEKAI STAYの料金は「売上の8% ＋ ¥10,000/物件/月」のみ。解約金・広告費・レポート作成費など、運営に関わる費用はすべて¥0です。清掃費は別途かかりますが、ゲストにご請求するため、オーナー様のご負担は一切発生しません。
            </p>
          </Reveal>

          {/* ¥0 stat帯：追加でかからない費用を横並びで提示 */}
          <Reveal as="div" className="mt-12 grid grid-cols-2 gap-y-10 border-y border-rule py-10 sm:mt-14 lg:grid-cols-4 lg:divide-x lg:divide-rule">
            {['解約金', '広告費', 'レポート作成費', 'オーナー様の清掃費負担'].map((label) => (
              <div key={label} className="lg:px-8 lg:first:pl-0">
                <p className="text-[13px] font-bold text-ink/60">{label}</p>
                <p className="mt-3 font-grotesk text-[clamp(1.875rem,3.6vw,2.75rem)] font-bold leading-none text-sekai-teal">¥0</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 7c. COMPARISON 他社とSEKAI STAYの比較（paper・SEKAI列を強調パネルに） */}
      <section className="w-full bg-paper section-2xl">
        <div className="container-edit">
          <SectionHead
            en="Which is better?"
            sub="他社とSEKAI STAY、どう違う？"
            lead="同じ「民泊運用代行」でも、料金も中身も差があります。運用に含まれる範囲で比べてみてください。"
          />

          {/* モバイル：項目ヘッダー＋2分割（SEKAI STAY 側をnavy＋チェックで強調） */}
          <Reveal as="div" stagger className="mt-12 space-y-3.5 sm:hidden">
            {COMPARE_ROWS.map((row) => (
              <div key={row.label} className="overflow-hidden rounded-2xl shadow-lg shadow-ink/[0.06] ring-1 ring-rule">
                <div className="bg-ink/[0.04] px-4 py-3">
                  <p className="text-[13px] font-bold leading-snug text-ink">{row.label}</p>
                </div>
                <div className="grid grid-cols-[1fr_1.1fr]">
                  <div className="bg-paper px-4 py-4">
                    <p className="text-[10px] font-bold tracking-[0.08em] text-ink/40">一般的な代行</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink/50">{row.others}</p>
                  </div>
                  <div className="bg-navy px-4 py-4">
                    <p className="text-[10px] font-bold tracking-[0.08em] text-bright-teal">SEKAI STAY</p>
                    <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-bold leading-snug text-white">
                      <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bright-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{row.sekai}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>

          {/* PC：3カラム表。SEKAI STAY 列を浮遊する強調パネルに */}
          <Reveal as="div" className="mt-14 hidden sm:block lg:mt-16">
            <div className="relative grid grid-cols-[1.35fr_0.95fr_1.1fr]">
              {/* SEKAI STAY 強調パネル（絶対配置で列の背面に浮かせる） */}
              <div
                className="absolute inset-y-0 right-0 rounded-2xl bg-navy shadow-2xl shadow-navy/30"
                style={{ width: '32.35%' }}
                aria-hidden
              />
              {/* ヘッダー */}
              <div />
              <div className="self-end px-5 pb-4 text-center text-[12px] font-bold tracking-[0.06em] text-ink/45">
                一般的な代行
              </div>
              <div className="relative z-10 px-5 pb-5 pt-7 text-center">
                <p className="text-[11px] font-bold tracking-[0.18em] text-bright-teal">RECOMMENDED</p>
                <p className="mt-1.5 text-[17px] font-bold text-white">SEKAI STAY</p>
              </div>
              {/* 行 */}
              {COMPARE_ROWS.map((row, i) => (
                <div key={row.label} className="contents">
                  <div className="flex items-center border-b border-rule py-5 pr-4 text-[14px] font-bold text-ink">
                    {row.label}
                  </div>
                  <div className="flex items-center justify-center border-b border-rule px-3 py-5 text-center text-[13px] leading-tight text-ink/50">
                    {row.others}
                  </div>
                  <div
                    className={`relative z-10 flex items-center justify-center gap-2 px-4 py-5 text-center text-[14px] font-bold leading-tight text-white ${i > 0 ? 'border-t border-white/12' : ''}`}
                  >
                    <svg className="h-4 w-4 shrink-0 text-bright-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{row.sekai}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <p className="mt-8 text-[11px] text-ink/45">※ 他社の相場は当社調べ。契約内容により異なります。</p>
        </div>
      </section>

      {/* 7d. 対応エリア（ivory）— case-studies より移設 */}
      <section id="area" className="w-full bg-ivory section-2xl">
        <div className="container-edit">
          <SectionHead
            en="AREA"
            sub="対応エリア"
            lead="都心のマンションの一室から京都の町家、沖縄のリゾートまで。清掃パートナーを確保できている全国30以上のエリアで対応しています。下記はエリアの一例です。一度ご自身の物件が対応しているかはお問い合わせいただきますようお願いいたします。"
          />
          <div className="mt-12 flex flex-wrap gap-3">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/area/${a.slug}`}
                className="inline-flex items-center rounded-md border border-rule bg-paper px-4 py-2 text-[14px] font-bold text-ink transition-colors hover:border-sekai-teal hover:text-sekai-teal"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. 補足3事業（sense-trust BUSINESS OVERVIEW 忠実再現・二段ティール・フルブリード） */}
      <section id="more" className="w-full scroll-mt-24 overflow-hidden bg-navy-deep pb-0 pt-[clamp(4rem,10vw,9.5rem)] text-white">
        <div className="container-edit">
          <SectionHead
            light
            en="MORE"
            sub="運用代行を、さらに広げる"
            lead="運用代行を軸に、開業の立ち上げから集客、宿泊体験の付加価値づくりまで。物件のフェーズに合わせて、サービスは広がっていきます。"
          />
        </div>

        {/* キネティック・ステートメント帯（カードの上） */}
        <div className="mt-12 w-full overflow-hidden sm:mt-14" aria-hidden>
          <div className="marquee marquee-fast w-max">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="inline-flex shrink-0 items-center">
                {Array.from({ length: 3 }).map((__, j) => (
                  <span
                    key={`${i}-${j}`}
                    className="flex items-center text-[clamp(1.75rem,4vw,3rem)] font-bold leading-none tracking-tight text-white"
                  >
                    物件を、観光資産に。
                    <span className="mx-6 text-[0.45em] text-bright-teal sm:mx-10">●</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* 事業カード帯 — フルブリード（隙間なし3カラム・角丸なし） */}
        <div className="mt-6 w-full sm:mt-8">
          <OverviewCards
            items={SUB_BIZ.map((it) => ({
              no: it.no,
              title: it.ja,
              lead: it.lead,
              desc: it.desc,
              image: it.img,
              alt: it.ja,
              status: it.soon ? `${it.status} 公開予定 — ${it.teaser}` : it.status,
              soon: it.soon,
              dark: it.ja === 'SEKAI STAYアンバサダー',
            }))}
          />
        </div>
      </section>

      {/* 運用代行FAQ（deep teal） */}
      <ServicesFaq items={FAQ_ITEMS} />

      {/* 関連ページ導線 */}
      <section className="w-full bg-ivory">
        <div className="container-edit border-t border-rule py-14">
          <RelatedLinks items={[{ href: '/case-studies', label: '実績・オーナーの声' }, { href: '/pricing', label: '料金を見る' }]} />
        </div>
      </section>

      {/* 末尾CTA — トップページと共通の ContactSense（無料診断／相談 2分割） */}
      <ContactSense />

      <Footer />
    </>
  )
}
