"use client";

import { useState } from "react";
import Reveal from "@/components/motion/Reveal";
import SlideCarousel from "@/components/ds/SlideCarousel";
import CountUp from "@/components/switch/deco/CountUp";

/* 共通ラベル */
function SectionLabel({ eyebrow, en, light = false }: { eyebrow: string; en: string; light?: boolean }) {
  return (
    <Reveal as="div">
      <h2 className={`label-giant text-[clamp(2.5rem,6vw,4.375rem)] ${light ? "text-white" : "text-ink"}`}>{en}</h2>
      <p className={`mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold ${light ? "text-white" : "text-ink"}`}>{eyebrow}</p>
    </Reveal>
  );
}

/* PRICING — 他セクションと同じトンマナ（巨大英ラベル＋和サブ） */
export function ValueBand() {
  return (
    <section className="w-full border-b border-rule bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionLabel eyebrow="料金はたったひとつだけ" en="PRICING" />

        {/* 価格ロックアップ：巨大8%（0→8 カウントアップ）＋補足＋CTA（/pricing PLAN と同型） */}
        <div className="mt-12 flex flex-col gap-10 sm:mt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <Reveal as="div" className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <CountUp
              target={8}
              suffix="%"
              duration={1600}
              className="font-grotesk text-[clamp(5rem,20vw,13rem)] font-bold leading-[0.72] tracking-[-0.05em] text-ink tabular-nums"
            />
            <div className="mb-2 sm:mb-3">
              <p className="text-[clamp(1.25rem,2.6vw,1.875rem)] font-bold text-ink">＋ 月額 ¥10,000 ／ 物件</p>
              <p className="mt-2 text-[14px] font-bold text-ink">これ以外の費用は、いただきません。</p>
            </div>
          </Reveal>
          <Reveal as="div" className="shrink-0">
            <a
              href="/pricing"
              data-cta="pricing"
              data-cta-label="value-band"
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-9 py-4 text-[15px] font-bold text-white transition hover:bg-ink/85"
            >
              料金を詳しく見る
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </Reveal>
        </div>

        <Reveal as="div">
          <p className="mt-10 max-w-3xl text-[15px] leading-[1.95] text-ink sm:text-[16px]">
            SEKAI STAYの料金は「売上の8% ＋ ¥10,000/物件/月」のみ。解約金・広告費・レポート作成費など、運営に関わる費用はすべて¥0です。清掃費は別途かかりますが、ゲストにご請求するため、オーナー様のご負担は一切発生しません。
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* RESULTS — 民泊運営代行の実績（数字） */
const RESULT_STATS = [
  { v: "61", u: "%", l: "平均稼働率" },
  { v: "+37", u: "%", l: "月商改善（平均）" },
  { v: "4.8", u: "/5", l: "宿泊満足度" },
  { v: "97", u: "%", l: "継続率" },
];
export function ResultsSense() {
  return (
    <section className="w-full bg-navy py-24 text-white sm:py-32">
      <Reveal as="div" className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">CASE STUDIES</h2>
        <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">民泊運営代行の実績</p>
        <p className="mt-10 max-w-xl text-[15px] leading-[1.95] text-white/80">
          運用をお預かりした物件で、稼働率も評価も着実に伸びています。継続6ヶ月以上の管理物件の平均値を公開しています。
        </p>
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:mt-16 md:grid-cols-4">
          {RESULT_STATS.map((s) => (
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
        <a href="/case-studies" className="mt-9 inline-flex items-center gap-2 text-[14px] font-bold text-white transition-opacity hover:opacity-70">
          実績・オーナーの声を見る
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </Reveal>
    </section>
  );
}

/* FLOW — 運用開始までの流れ（/services FLOW と同型：見出し左固定＋巨大番号タイムライン） */
const FLOW_STEPS = [
  { no: "01", title: "無料収益診断", period: "最短 当日", body: "物件の情報をお送りください。今の収益と、これから伸ばせる余地を無料で診断してご提示します。" },
  { no: "02", title: "物件の確認とご提案", period: "3〜5日", body: "立地や稼働状況をふまえ、運用プランと収益の見込みを個別にご提案。ご納得いただいてから契約に進みます。" },
  { no: "03", title: "契約・運営スタート", period: "1〜2週間", body: "掲載・清掃・ゲスト対応の体制をこちらで整え、運用をスタート。あとはお任せいただくだけです。" },
];
export function OpeningFlowSense() {
  return (
    <section className="w-full bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="lg:grid lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          {/* 見出し（PCでは sticky） */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-ink">FLOW</h2>
            <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">最短2週間で運用を始められます</p>
          </div>
          {/* ステップ：巨大番号＋縦レールのタイムライン */}
          <ol className="relative mt-14 lg:mt-2">
            <span className="absolute left-9 top-7 bottom-12 w-px bg-ink/15 sm:left-11" aria-hidden />
            {FLOW_STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.no}
                delay={i * 0.1}
                className="group relative grid grid-cols-[4.5rem_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[5.5rem_1fr] sm:gap-x-9"
              >
                <div className="relative z-10 flex justify-center">
                  <span className="bg-mist py-2 font-grotesk text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-none tracking-[-0.04em] text-sekai-teal transition-transform duration-300 group-hover:-translate-y-0.5">
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
  );
}

/* NEWS — 先頭記事に大サムネ＋残りはリスト（sense-trust 準拠） */
const NEWS = [
  { date: "2026.07.29", cat: "キャンペーン", title: "新規立ち上げ・他社からの乗り換えを対象とした「初期費用10万円割引キャンペーン」を開始しました", img: "/images/switch/property-cabin.jpg" },
  { date: "2026.06.10", cat: "お知らせ", title: "対応エリアに沖縄を追加しました", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=70&auto=format&fit=crop" },
  { date: "2026.05.22", cat: "プロダクト", title: "SEKAI STAYとして新しい料金体系でのサービスをリリースしました" },
  { date: "2026.03.28", cat: "受賞", title: "管理物件が「BEST OF SAUNA STAY 2026」サウナ付き部門で第一位に輝きました" },
];
export function NewsSense() {
  const [first, ...rest] = NEWS;
  return (
    <section className="w-full bg-ivory">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <Reveal as="div">
          <span className="label-giant block text-[clamp(2.5rem,6vw,4.375rem)] text-ink">NEWS</span>
          <span className="mt-2 block text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">ニュースリリース</span>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10 sm:mt-12 lg:flex-row lg:items-start lg:gap-12">
          {/* 先頭記事（大サムネ）— リンクなし */}
          <div className="flex w-full gap-5 sm:gap-8 lg:w-1/2">
            <div className="aspect-[4/3] w-[9.375rem] shrink-0 overflow-hidden rounded-xl bg-rule sm:w-[18.75rem]">
              <img src={first.img} alt="" aria-hidden loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-grotesk text-[15px] font-bold text-ink/60">{first.date}</span>
              <span className="mt-2 w-fit rounded-md border border-sekai-teal px-2.5 py-0.5 text-[12px] font-bold text-sekai-teal">{first.cat}</span>
              <span className="mt-3 text-[15px] font-bold leading-snug text-ink sm:text-[16px]">{first.title}</span>
            </div>
          </div>

          {/* 残りはリスト — リンクなし */}
          <Reveal as="ul" stagger className="flex-1 divide-y divide-rule border-t border-rule">
            {rest.map((n, i) => (
              <li key={i}>
                <div className="flex flex-col gap-1.5 py-5 sm:flex-row sm:items-center sm:gap-5">
                  <span className="font-grotesk text-[14px] font-bold text-ink/50 sm:shrink-0">{n.date}</span>
                  <span className="w-fit rounded-md border border-sekai-teal px-2 py-0.5 text-[11px] font-bold text-sekai-teal sm:shrink-0">{n.cat}</span>
                  <span className="text-[14px] text-ink/80">{n.title}</span>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* 実績紹介 — teaser（数字はトップに出さず /case-studies へ誘導） */
export function AchievementTeaser() {
  return (
    <section className="w-full bg-navy py-24 text-white sm:py-32">
      <Reveal as="div" className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">ACHIEVEMENT</h2>
        <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">実績紹介</p>
        <p className="mt-10 max-w-xl text-[15px] leading-[1.95] text-white/80">
          運用を任せた先で、稼働も評価も、確かに動きました。物件タイプ別の事例と、その打ち手を紹介します。
        </p>
        <a href="/case-studies" className="mt-9 inline-flex items-center gap-2 text-[14px] font-bold text-white transition-opacity hover:opacity-70">
          実績・事例を見る
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </Reveal>
    </section>
  );
}

/* MAGAZINE — マガジン（記事カード → 個別記事 /blog/[slug]） */
const MAGAZINE_FALLBACK_IMG = "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&q=70&auto=format&fit=crop";
type MagazinePost = { slug: string; title: string; category?: string; image?: string };
export function MagazineSense({ posts = [] }: { posts?: MagazinePost[] }) {
  return (
    <section className="w-full bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal as="div" className="flex items-end justify-between">
          <div>
            <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-ink">MAGAZINE</h2>
            <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">マガジン</p>
          </div>
          <a href="/blog" className="hidden shrink-0 items-center gap-2 pb-3 text-[14px] font-bold text-sekai-teal transition-opacity hover:opacity-70 sm:inline-flex">
            一覧を見る
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </Reveal>
        <div className="mt-14 sm:mt-16">
          <SlideCarousel
            fullBleed
            showBadge={false}
            ariaLabel="マガジン記事"
            items={posts.map((p) => ({
              image: p.image || MAGAZINE_FALLBACK_IMG,
              alt: p.title,
              title: p.title,
              tag: p.category,
              href: `/blog/${p.slug}`,
            }))}
          />
        </div>
      </div>
    </section>
  );
}

/* COMPANY — 会社概要（/about の COMPANY_INFO から要点のみ精査） */
const COMPANY_ROWS = [
  { label: "社名", value: "株式会社セカイチ（SEKAI STAY事業）" },
  { label: "所在地", value: "〒153-0042 東京都目黒区青葉台2-20-7 KM中目黒ビル1F" },
  { label: "代表取締役", value: "劉 添毅（リュウ テンイチ）" },
  { label: "登録番号", value: "住宅宿泊管理業 国土交通大臣(01)第F05780号" },
  { label: "事業内容", value: "民泊運用代行・宿泊施設運営" },
];
export function CompanyTeaser() {
  return (
    <section className="w-full bg-mist py-24 sm:py-32">
      <Reveal as="div" className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-ink">COMPANY</h2>
        <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">会社概要</p>

        <dl className="mt-12 max-w-3xl border-t border-rule sm:mt-14">
          {COMPANY_ROWS.map((row) => (
            <div key={row.label} className="grid grid-cols-1 gap-1 border-b border-rule py-5 sm:grid-cols-[160px_1fr] sm:gap-8">
              <dt className="text-[13px] font-bold tracking-[0.04em] text-ink/50">{row.label}</dt>
              <dd className="text-[14px] leading-[1.85] text-ink sm:text-[15px]">{row.value}</dd>
            </div>
          ))}
        </dl>

        <a href="/about" className="mt-9 inline-flex items-center gap-2 text-[14px] font-bold text-sekai-teal transition-opacity hover:opacity-70">
          会社概要を見る
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </Reveal>
    </section>
  );
}

/* FLOW — 始め方3ステップ */
const STEPS = [
  { no: "01", en: "DIAGNOSIS", ja: "無料診断", body: "物件URL・運用状況から、改善余地と収益シミュレーションを個別レポートで。1営業日以内にお届け。" },
  { no: "02", en: "ONBOARDING", ja: "移行・立ち上げ", body: "乗り換えは移行作業を当社が対応し、予約は並走で引き継ぎ。営業が止まる日はゼロ。" },
  { no: "03", en: "OPERATION", ja: "運用開始", body: "価格調整・掲載改善・清掃・ゲスト対応はお任せ。ダッシュボードで確認、3ヶ月毎にMTG。" },
];
export function FlowSense() {
  return (
    <section className="w-full bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionLabel eyebrow="始め方" en="FLOW" />
        <div className="mt-16 grid gap-10 sm:mt-20 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.no}>
              <div className="flex items-baseline gap-3 border-t-2 border-sekai-teal pt-5">
                <span className="font-grotesk text-[2rem] font-bold leading-none text-sekai-teal">{s.no}</span>
                <span className="label-giant text-[13px] tracking-[0.06em] text-ink/40">{s.en}</span>
              </div>
              <h3 className="mt-5 text-[1.375rem] font-bold text-ink">{s.ja}</h3>
              <p className="mt-3 text-[14px] leading-[1.9] text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* WORKS — 事例 */
const CASES = [
  { img: "/images/switch/property-villa.jpg", t: "野尻湖の貸別荘", m: "稼働率 58% → 82% ／ 月商 85万 → 134万円（+57%）", note: "「BEST OF SAUNA STAY 2026」サウナ付き部門 全国1位。" },
  { img: "/images/switch/property-niseko.jpg", t: "ニセコの一棟貸し", m: "レビュー評価 4.95 ／ ピーク売上 +22%", note: "季節変動の大きい立地で、ピーク期の収益を最大化。" },
  { img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=70&auto=format&fit=crop", t: "湖畔のトレーラーハウス", m: "レビュー数 19件 → 61件（3倍）／ 評価 4.97", note: "グループ予約に特化した運用でレビューを大きく増加。" },
];
export function CaseSense() {
  return (
    <section className="w-full bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionLabel eyebrow="実績紹介" en="WORKS" />
        <div className="mt-16 grid gap-8 sm:mt-20 md:grid-cols-3">
          {CASES.map((c) => (
            <div key={c.t} className="group overflow-hidden rounded-lg border border-rule bg-paper">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.t} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" />
              </div>
              <div className="p-6">
                <h3 className="text-[1.125rem] font-bold text-ink">{c.t}</h3>
                <p className="font-grotesk mt-3 text-[14px] font-bold text-sekai-teal">{c.m}</p>
                <p className="mt-3 text-[13px] leading-[1.85] text-ink/65">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* PRICING — 料金 */
export function PricingSense() {
  return (
    <section className="w-full bg-navy py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionLabel eyebrow="料金" en="PRICING" light />
        <div className="mt-12 max-w-3xl sm:mt-16">
          <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-snug">
            基本料金は売上の <span className="font-grotesk text-bright-teal">8%</span> ＋ 月<span className="font-grotesk text-bright-teal">¥10,000</span>／物件。
          </p>
          <p className="mt-6 text-[15px] leading-[1.95] text-white/80">
            月商100万円なら <span className="font-grotesk font-bold text-white">9万円/月</span>。手数料20%の代行なら20万円/月——
            差額は<span className="font-grotesk font-bold text-bright-teal"> 月11万円・年132万円</span>。
          </p>
          <ul className="mt-8 space-y-2 text-[14px] text-white/75">
            <li>・初期費用：乗り換え ¥100,000 ／ 新規立ち上げ ¥200,000〜</li>
            <li>・7ヶ月目以降の解約金は ¥0（最低契約6ヶ月）</li>
            <li>・かかりうる費用は契約前にすべて金額つきで開示</li>
          </ul>
          <a href="/pricing" className="mt-9 inline-flex min-h-[52px] items-center gap-2 rounded-md bg-white px-7 text-[14px] font-bold text-navy transition-all hover:-translate-y-0.5">
            料金の詳細を見る
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* QUESTIONS — 契約前に聞いてほしい10の質問 */
const QS = [
  "本当に手数料以外、かかりませんか？",
  "途中で解約したくなったら？",
  "今の会社と契約が残っていても相談できますか？",
  "地方の物件でも対応できますか？",
];
export function QuestionsSense() {
  return (
    <section className="w-full bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionLabel eyebrow="会社選びのために" en="QUESTIONS" />
        <p className="mt-10 max-w-2xl text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold leading-[1.7] text-ink">
          契約前に、どの会社にも聞いてほしい10の質問。<span className="text-sekai-teal">——私たちの答えつきで。</span>
        </p>
        <ul className="mt-10 max-w-3xl divide-y divide-rule border-t border-rule">
          {QS.map((q, i) => (
            <li key={i} className="flex items-baseline gap-4 py-5">
              <span className="font-grotesk text-[15px] font-bold text-sekai-teal">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] text-ink/80">{q}</span>
            </li>
          ))}
        </ul>
        <a href="/faq" className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-sekai-teal transition-opacity hover:opacity-70">
          全10問と答えを見る
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </div>
    </section>
  );
}

/* FAQ — sense-trust トンマナのアコーディオン */
const FAQS = [
  { q: "本当に8%＋月1万円以外、かからないんですか？", a: "毎月の運用費はそれだけです。別途かかるのは初期費用、消耗品などの実費、ご希望時の有料オプションのみ。清掃費はゲストの宿泊料に含めて精算するため、月々の持ち出しはありません。" },
  { q: "最低契約期間6ヶ月の理由は？", a: "価格調整と掲載最適化の効果が数字に表れるまで、季節をまたいだ運用期間が必要だからです。7ヶ月目以降の解約金は¥0です。" },
  { q: "今の会社との契約が残っています。相談だけでもいいですか？", a: "もちろんです。乗り換えの段取りの整理だけでも、無料相談をお使いください。" },
  { q: "民泊が初めてでも大丈夫ですか？", a: "物件選定・許認可・立ち上げから伴走します。まずは30分の無料相談で、物件の条件から一緒に整理しましょう。" },
  { q: "地方の物件でも対応できますか？", a: "清掃パートナーを確保できているエリアで全国対応しています。まずは物件の所在地をお知らせください。" },
  { q: "診断を受けたら、営業の電話がかかってきますか？", a: "かかってきません。入力3分・無料で、1営業日以内に個別レポートをお送りします。" },
];
/* FAQ — Deep Teal 背景（トップ用） */
export function FaqTealSense() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="w-full bg-navy-deep py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:grid lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">FAQ</h2>
          <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">よくある質問</p>
        </div>
        <ul className="mt-10 border-t border-white/15 lg:mt-0">
          {FAQS.map((f, i) => (
            <li key={i} className="border-b border-white/15">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
                aria-expanded={open === i}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-grotesk text-[14px] font-bold text-bright-teal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-bold text-white sm:text-[16px]">{f.q}</span>
                </span>
                <span className={`shrink-0 text-bright-teal transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </span>
              </button>
              <div className={`grid overflow-hidden transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="pl-9 text-[14px] leading-[1.95] text-white/75">{f.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FaqSense() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="w-full bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionLabel eyebrow="よくある質問" en="FAQ" />
        <ul className="mt-14 max-w-3xl border-t border-rule sm:mt-16">
          {FAQS.map((f, i) => (
            <li key={i} className="border-b border-rule">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
                aria-expanded={open === i}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-grotesk text-[14px] font-bold text-sekai-teal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-bold text-ink sm:text-[16px]">{f.q}</span>
                </span>
                <span className={`shrink-0 text-sekai-teal transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </span>
              </button>
              <div className={`grid overflow-hidden transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="pl-9 text-[14px] leading-[1.95] text-ink/70">{f.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
