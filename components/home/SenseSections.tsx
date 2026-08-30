"use client";

/**
 * sense-trust 参考のセクション群（SEKAI独自コンテンツ）。
 * 巨大英語ラベル＋和文。白／ダーク(navy)を交互に。数字はグロテスク。スクロール演出は Reveal(GSAP)。
 */
import Reveal from "@/components/motion/Reveal";
import TextSlideUp from "@/components/motion/TextSlideUp";
import ScrambleText from "@/components/motion/ScrambleText";
import BusinessSlider from "@/components/home/BusinessSlider";
import { useAuditModal } from "@/components/audit/AuditModalProvider";

/* キネティック・マーキー帯 */
/* OTA は縦横比がばらばらなので、視覚的な大きさが揃うよう1点ずつ高さを指定 */
const OTA_PARTNERS = [
  { name: "Airbnb", img: "/images/ota/airbnb.png", h: "h-[1.5rem] sm:h-[1.75rem]" },
  { name: "Booking.com", img: "/images/ota/booking.png", h: "h-[0.8rem] sm:h-[0.95rem]" },
  { name: "Agoda", img: "/images/ota/agoda.png", h: "h-[1.6rem] sm:h-[1.9rem]" },
  { name: "Expedia", img: "/images/ota/expedia.png", h: "h-[1.15rem] sm:h-[1.35rem]" },
  { name: "Hotels.com", img: "/images/ota/hotels.png", h: "h-[0.95rem] sm:h-[1.1rem]" },
  { name: "Ctrip", img: "/images/ota/ctrip.png", h: "h-[1.45rem] sm:h-[1.7rem]" },
  { name: "Trip.com", img: "/images/ota/trip.png", h: "h-[1.05rem] sm:h-[1.2rem]" },
  { name: "楽天トラベル", img: "/images/ota/rakuten.png", h: "h-[0.9rem] sm:h-[1.05rem]" },
];

export function OtaChips() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className="inline-flex shrink-0 items-center">
          {OTA_PARTNERS.map((p) => (
            <img
              key={p.name}
              src={p.img}
              alt={p.name}
              loading="lazy"
              className={`mx-10 w-auto shrink-0 opacity-90 brightness-0 invert sm:mx-16 ${p.h}`}
            />
          ))}
        </span>
      ))}
    </>
  );
}

export function MarqueeBand() {
  return (
    <div className="overflow-hidden border-y border-rule bg-ivory py-5 sm:py-6">
      <div className="marquee w-max items-center">
        <OtaChips />
      </div>
    </div>
  );
}

/* セクション共通の見出し（小さい和ラベル＋巨大英語ラベル） */
function SectionLabel({ eyebrow, en, light = false }: { eyebrow: string; en: string; light?: boolean }) {
  return (
    <Reveal as="div">
      <h2 className={`label-giant text-[clamp(2.5rem,6vw,4.375rem)] ${light ? "text-white" : "text-ink"}`}>{en}</h2>
      <p className={`mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold ${light ? "text-white" : "text-ink"}`}>{eyebrow}</p>
    </Reveal>
  );
}

/* 共通: ナビ帯のキネティック・マーキー（SEKAI独自タグライン） */
function NavyMarquee() {
  return (
    <div className="overflow-hidden py-5 sm:py-6">
      <div className="marquee w-max items-center">
        <OtaChips />
      </div>
    </div>
  );
}

/* OUR BUSINESS — 上マーキー → スライダー → 見出し → 下マーキー → 4項目リスト */
const BIZ_ITEMS = [
  { ja: "民泊運用代行", desc: "予約サイトの掲載管理から価格調整、ゲスト対応、清掃手配まで。民泊運用のすべてを手数料8%でまるごと代行します。", img: "/images/service-marquee/e3.png", href: "/services", light: true },
  { ja: "民泊の開業支援", desc: "許認可の申請から物件づくり、初期の集客設計まで。これから始める民泊の立ち上げを一気通貫でサポートします。", img: "/images/included/INCLUDED7.png", href: "/services#more", light: false },
  { ja: "民泊アンバサダーコミュニティ", desc: "旅好きのアンバサダーやインフルエンサーと連携し、物件の魅力を発信。指名予約とファンを育てます。", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70&auto=format&fit=crop", href: "/services#more", light: true },
  { ja: "民泊向けオプション提供", desc: "サウナ・体験プログラム・備品アップグレードなど。宿泊体験に付加価値を加え、単価と満足度を引き上げます。", img: "/images/switch/property-niseko.jpg", href: "/services#more", light: false },
];

export function BusinessSense() {
  return (
    <section className="relative w-full overflow-hidden bg-navy text-white">
      <NavyMarquee />
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-0 sm:px-8 sm:pb-28">
        {/* スライダー（BUSINESS 見出しの上） */}
        <Reveal as="div">
          <BusinessSlider />
        </Reveal>

        {/* 見出し（事業内容＋BUSINESS＋lead） */}
        <Reveal as="div" className="mt-16 sm:mt-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="label-giant text-[clamp(2.75rem,7.2vw,5.25rem)] text-white">BUSINESS</h2>
              <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">事業内容</p>
            </div>
            <p className="max-w-md text-[14px] leading-[1.85] text-white/75 lg:text-right">
              SEKAI STAY はオーナー様の物件の「観光資産としての価値の最大化」を図ることを目的に、予約サイトの掲載管理からゲスト対応、清掃手配、価格調整まで。民泊運用に関する全てのことを、手数料8%＋月1万円の基本料金でまるごとお任せいただけます。
            </p>
          </div>
        </Reveal>
      </div>
      <NavyMarquee />

      {/* 事業リスト（4項目・幅50%・navy/#154a8c 交互） */}
      <div className="flex flex-wrap">
        {BIZ_ITEMS.map((it) => (
          <a
            key={it.ja}
            href={it.href}
            className={`group relative flex w-full justify-end overflow-hidden p-8 sm:p-12 md:w-1/2 ${it.light ? "bg-[#1F9CA2]" : "bg-navy"}`}
          >
            {/* 白パネルのワイプ（上 -100% → 下 +100% / .8s） */}
            <span aria-hidden className="pointer-events-none absolute inset-0 z-10 -translate-y-[101%] bg-white transition-transform duration-[800ms] ease-in-out group-hover:translate-y-[101%]" />
            <div className="flex w-full max-w-[39.375rem] justify-between gap-6">
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-[clamp(1.375rem,2vw,1.625rem)] font-bold leading-snug text-white">{it.ja}</h3>
                  <p className="text-[13px] leading-[1.8] text-[#b9dee0]">{it.desc}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-white">
                  詳しく見る
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
              <div className="relative z-20 w-[9.375rem] shrink-0 overflow-hidden rounded-lg sm:w-[12rem]" style={{ aspectRatio: "250 / 300" }}>
                <img src={it.img} alt="" aria-hidden loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ACHIEVEMENT — ダークティール・巨大数字 */
const STATS = [
  { v: "61", u: "%", l: "平均稼働率" },
  { v: "+57", u: "%", l: "月商改善（平均）" },
  { v: "4.8", u: "/5", l: "宿泊満足度" },
  { v: "97", u: "%", l: "継続率" },
];

export function AchievementSense() {
  return (
    <section className="relative w-full bg-navy py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionLabel eyebrow="実績" en="ACHIEVEMENT" light />
        <p className="mt-10 max-w-xl text-[15px] leading-[1.95] text-white/80">
          運用を任せた先で、数字はこう動きました。事例の偶然でないことの確かめ方として、全体の平均を置いておきます。
        </p>
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:mt-16 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="border-t border-white/20 pt-5">
              <div className="flex items-baseline gap-1">
                <span className="font-grotesk text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none tracking-tight text-white">{s.v}</span>
                <span className="font-grotesk text-2xl font-bold text-bright-teal">{s.u}</span>
              </div>
              <p className="mt-3 text-[13px] text-white/70">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[11px] text-white/45">※ 2026年4月時点／継続6ヶ月以上の管理物件平均。成果は物件の立地・条件により異なります。</p>
      </div>
    </section>
  );
}

/* ABOUT — sense-trust「ORIGINAL SYSTEM」トレース: 大見出し＋和サブ → 角丸パネル積層 */
const ABOUT_REASONS = [
  {
    no: "01",
    title: "透明性のある運用体制",
    body: "透明性のある運営を目指し、売上・予約・チャット・経費まで、必要な情報をすべてあなた専用のダッシュボードでリアルタイムに確認できます。物件の“いま”がひと目で見えて、まるでゲームのように売上の動きを追えます。",
    img: "/images/switch/dashboard-mockup.png",
  },
  {
    no: "02",
    title: "業界平均15〜25%に対し、手数料8%",
    body: "料金は売上の8% ＋ ¥10,000/物件/月。SEKAI STAYでは「オーナーファースト」を掲げ、業界平均を大きく下回る8%という水準を実現しています。",
  },
  {
    no: "03",
    title: "物件の収益最大化を図るサポート",
    body: "各種予約サイトの写真・文章の最適化、運用歴5年のビッグデータをもとにした価格設計、多言語対応など。稼働率・客室単価・宿泊満足度を指標に、高い収益性を生み出します。",
  },
];

export function AboutSense() {
  return (
    <section className="relative w-full overflow-hidden bg-ivory pb-16 pt-28 sm:pb-20 sm:pt-36">
      {/* 縦書きの巨大ゴーストテキスト（スクロールでスクランブル収束） */}
      <ScrambleText
        text="SEKAI STAY"
        className="label-giant pointer-events-none absolute right-2 top-[8%] z-0 select-none leading-none text-ink/[0.04]"
        style={{ writingMode: "vertical-rl", fontSize: "12vw", letterSpacing: "0.1em" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <h2 className="label-giant text-[clamp(2.5rem,7.5vw,6rem)] leading-[0.95] tracking-[-0.02em] text-ink">
          <TextSlideUp className="block">ABOUT SEKAI STAY</TextSlideUp>
        </h2>
        <p className="mt-4 text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-[1.4] text-ink">
          民泊運営代行で我々が選ばれる3つの理由
        </p>

        <Reveal as="div" stagger className="mt-0.5 flex flex-col gap-4 sm:mt-1 sm:gap-5">
          {/* 01: 画像付き・全幅 */}
          {(() => {
            const r = ABOUT_REASONS[0];
            return (
              <div className="relative reason-card rounded-[10px] px-7 py-11 sm:px-12 sm:py-14 lg:px-[60px] lg:py-[44px]">
                <div className="flex flex-col gap-8 lg:block lg:pr-[400px]">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="font-grotesk text-[18px] font-bold tracking-[0.12em] text-ink">{r.no}</span>
                      <p className="text-[clamp(1.25rem,2.2vw,1.5rem)] font-bold leading-[1.4] text-ink">{r.title}</p>
                    </div>
                    <p className="mt-6 max-w-3xl text-[15px] leading-[1.9] text-ink/75 sm:text-[16px]">{r.body}</p>
                  </div>
                  <div className="flex justify-center lg:block">
                    <img
                      src={r.img}
                      alt="オーナー専用ダッシュボード"
                      loading="eager"
                      className="block w-[70%] max-w-[300px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:w-[48%] lg:absolute lg:-top-12 lg:right-[40px] lg:w-[340px] lg:max-w-none"
                    />
                  </div>
                </div>
              </div>
            );
          })()}

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
        </Reveal>
      </div>
    </section>
  );
}

/* MESSAGE — 代表 */
const FOUNDERS = [
  { role: "代表取締役 CEO", name: "劉 添毅", body: "日米で民泊物件をオーナーとして運営。業界の不透明な手数料構造に当事者として向き合い、「自分が任せたかった代行」を形にしました。" },
  { role: "共同代表 Co-CEO", name: "明神 洸次郎", body: "クリエイティブの現場で人の感情を動かしてきた経験を、オーナーポータルと運用フローの設計に注いでいます。" },
];

export function MessageSense() {
  return (
    <section className="relative w-full bg-mist py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 sm:px-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
        {/* 代表写真 — 代表取締役 CEO 劉 添毅 */}
        <Reveal as="div" className="relative mx-auto aspect-[1055/1491] w-full max-w-[420px] overflow-hidden rounded-xl border border-rule bg-navy/5 lg:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/founders/tenichi.png"
            alt="代表取締役 CEO 劉 添毅"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </Reveal>

        <Reveal as="div">
          <h2 className="label-giant text-[clamp(2.5rem,7vw,5rem)] text-ink">MESSAGE</h2>
          <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">代表挨拶</p>
          <p className="mt-8 text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-[1.7] text-ink">
            民泊代行の常識を、数字と透明性で塗り替える。
          </p>
          <p className="mt-5 max-w-xl text-[14px] leading-[1.95] text-ink/70">
            私たちは民泊運用の常識にとらわれず、適正な価格と透明な運営で、オーナーと共に宿の価値を伸ばし続けます。一棟一棟を、地域とゲストに価値を生む観光資産へ。
          </p>
          <div className="mt-9 flex flex-wrap gap-x-12 gap-y-4">
            {FOUNDERS.map((f) => (
              <div key={f.name}>
                <p className="text-[11px] font-bold tracking-[0.16em] text-sekai-teal">{f.role}</p>
                <p className="mt-1 text-[1.25rem] font-bold text-ink">{f.name}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 丸ピンボタン（ラベル + 円形矢印） */
function PillLink({ href, label }: { href: string; label: string }) {
  const isAudit = href === "/audit";
  const { open } = useAuditModal();
  return (
    <a
      href={href}
      onClick={isAudit ? (e) => { e.preventDefault(); open(); } : undefined}
      className="group inline-flex items-center gap-3"
    >
      <span
        className={`inline-flex items-center rounded-full px-7 py-3.5 text-[14px] font-bold ${
          isAudit ? "btn-cta" : "bg-white text-navy"
        }`}
      >
        {label}
      </span>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 ${
          isAudit ? "bg-[#F2691B] text-white" : "bg-white text-navy"
        }`}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </a>
  );
}

/* CONTACT — navy 2分割（診断 / 相談） */
export function ContactSense() {
  return (
    <section className="w-full bg-navy text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
        <Reveal as="div" className="border-b border-white/15 px-6 py-20 sm:px-10 sm:py-24 md:border-b-0 md:border-r">
          <h2 className="label-giant text-[clamp(2.5rem,6vw,4.5rem)] text-white">REPORT</h2>
          <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">無料で診断レポートをもらう</p>
          <p className="mt-7 max-w-xs text-[14px] leading-[1.85] text-white/75">
            あなたの物件の収益ポテンシャルを無料で診断。3分・1営業日以内に個別レポートをお届けします。
          </p>
          <div className="mt-10">
            <PillLink href="/audit" label="無料収益診断" />
          </div>
        </Reveal>
        <Reveal as="div" className="px-6 py-20 sm:px-10 sm:py-24">
          <h2 className="label-giant text-[clamp(2.5rem,6vw,4.5rem)] text-white">CONTACT</h2>
          <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">お問い合わせ・ご相談</p>
          <p className="mt-7 max-w-xs text-[14px] leading-[1.85] text-white/75">
            乗り換えの段取りや、物件の向き不向きのご相談だけでも。お気軽にお問い合わせください。
          </p>
          <div className="mt-10">
            <PillLink href="/contact" label="お問い合わせ" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
