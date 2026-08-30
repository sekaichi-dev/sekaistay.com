"use client";

import { usePathname } from "next/navigation";
import { useScrollFade } from "@/hooks/useScrollFade";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";
import SectionHead from "./deco/SectionHead";
import DashboardDemo from "./DashboardDemo";

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦"] as const;

const otherFeatures = [
  {
    no: "02",
    circled: CIRCLED[1],
    tag: "収益最大化",
    title: "数万件データによる自動価格調整",
    detail:
      "需要・競合・イベント・曜日別需要を毎日分析し、収益が最大になる価格を自動設定。「設置して終わり」の他社とは運用密度が違います。",
    effect: "平均稼働率 +11%",
    accent: "from-switch-teal to-switch-teal-deep",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />
      </svg>
    ),
  },
  {
    no: "03",
    circled: CIRCLED[2],
    tag: "集客最適化",
    title: "OTA掲載の最適化",
    detail:
      "Airbnb等の各種OTAのタイトル・説明文・写真の順番・色味補正まで、見直し。もっとも稼働率が上がる構成に作り変えます。",
    effect: "掲載順位の向上",
    accent: "from-[#d4a645] to-[#b8882f]",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    no: "04",
    circled: CIRCLED[3],
    tag: "ゲスト対応",
    title: "24時間 4言語 ゲスト対応",
    detail:
      "日・英・中・韓の4言語で24時間対応。チェックインの案内からトラブル対応まで、オーナー様が起こされることはありません。",
    effect: "オーナー対応 0件",
    accent: "from-switch-teal-deep to-[#0e5d62]",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
      </svg>
    ),
  },
  {
    no: "05",
    circled: CIRCLED[4],
    tag: "品質保証",
    title: "独自100項目チェックリストの清掃・点検",
    detail:
      "自社基準に基づく清掃・点検をマニュアル化して落とし込んでいます。次の宿泊者様にもより満足いただける体制を整えています。",
    effect: "レビュー 4.8/5",
    accent: "from-switch-teal to-switch-teal-bright",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    no: "06",
    circled: CIRCLED[5],
    tag: "雑務代行",
    title: "物件の雑務、全部代行",
    detail:
      "備品補充・設備トラブル・近隣対応・消耗品発注まで、物件に関わる雑務をすべて引き受けます。",
    effect: "オーナー工数 0h",
    accent: "from-[#b87a00] to-[#8a5a00]",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    no: "07",
    circled: CIRCLED[6],
    tag: "専任サポート",
    title: "3ヶ月に1回、専任スタッフとミーティング",
    detail:
      "収益レビュー・改善提案・オーナー様からのご要望反映を、3ヶ月ごとに専任担当とオンラインで。「放置されない」を仕組みで担保します。",
    effect: "オーナー満足度 97%",
    accent: "from-switch-teal-deep to-switch-teal",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const dashboardBullets = [
  { icon: "📊", text: "売上・稼働率をリアルタイムで確認" },
  { icon: "💬", text: "運営チームに直チャット" },
  { icon: "🎯", text: "3ヶ月ごと、専任スタッフと収益レビューMTG" },
  { icon: "📁", text: "freee / マネフォ互換CSVをワンタップ出力" },
];

const dashboardStats = [
  { label: "稼働率", value: "+11%" },
  { label: "満足度", value: "4.8" },
  { label: "返信", value: "<24h" },
  { label: "オーナー満足度", value: "97%" },
];

export default function SwitchServices() {
  const ref = useScrollFade();
  const pathname = usePathname();
  const { primary: ctaLabel } = useSwitchCtaLabels();
  const showCta = pathname !== "/switch";

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-switch-cloud/40 to-white relative overflow-hidden" ref={ref}>
      {/* Background decorative dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0e5d62 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden
      />

      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="fade-in mb-10">
          <SectionHead
            enLabel="サービス内容"
            jaTitle={
              <>
                「安い」だけじゃない。
                <br className="sm:hidden" />
                透明性のある
                <span className="relative inline-block mx-1">
                  <span className="relative z-10 text-switch-teal-deep">7つ</span>
                  <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-switch-teal-bright/30 -z-0" />
                </span>
                の仕組み。
              </>
            }
            subtitle="稼働率が上がり、オーナー様の手取りが自然に増えていくための、7つの仕組みがあります。"
          />
        </div>

        {/* 機能01：オーナー専用ダッシュボード — ヒーロー級 */}
        <div className="fade-in relative bg-gradient-to-br from-switch-teal-tint via-white to-switch-teal-tint rounded-xl p-6 sm:p-8 lg:p-10 mb-10 border-2 border-switch-teal/40 shadow-xl overflow-visible">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-switch-teal-bright via-switch-teal to-switch-teal-deep rounded-t-xl overflow-hidden" />

          <div className="grid md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 items-center">
            {/* Text column */}
            <div className="md:col-span-3">
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-switch-teal to-switch-teal-deep text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm mb-3">
                民泊オーナー向けに設計
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-switch-charcoal mb-2 leading-tight">
                オーナー専用ダッシュボード
              </h3>
              <p className="text-sm sm:text-base text-switch-gray-dark mb-5 leading-relaxed">
                売上・予約・チャット・経費まで、必要な情報をすべてあなた専用のダッシュボードでリアルタイムに確認できます。物件の&ldquo;いま&rdquo;がひと目で見えて、まるでゲームのように売上の動きを追えます。不要な項目は設定から非表示にもできます。
              </p>

              {/* スタッツ行 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {dashboardStats.map((s) => (
                  <div key={s.label} className="bg-white/70 backdrop-blur-sm border border-switch-teal/20 rounded-lg px-2 py-2 text-center">
                    <p className="text-[14px] sm:text-base font-bold text-switch-teal-deep tabular-nums leading-none">
                      {s.value}
                    </p>
                    <p className="text-[9px] text-switch-gray-mid mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* bullets 縦並び（絵文字アイコン） */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 bg-white/60 rounded-md px-2.5 py-1.5 border border-switch-teal/10">
                  <span className="flex-shrink-0 text-base leading-none">🔒</span>
                  <p className="text-[13px] sm:text-sm text-switch-charcoal font-bold leading-snug">
                    オーナー様、知人様のご予約を1タップでブロック可能
                  </p>
                </div>
                {dashboardBullets.map((item) => (
                  <div key={item.text} className="flex items-start gap-2.5 bg-white/60 rounded-md px-2.5 py-1.5 border border-switch-teal/10">
                    <span className="flex-shrink-0 text-base leading-none">{item.icon}</span>
                    <p className="text-[13px] sm:text-sm text-switch-charcoal font-bold leading-snug">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard demo */}
            <div className="md:col-span-2">
              <DashboardDemo />
            </div>
          </div>
        </div>

        {/* 機能02〜07：全ブレークポイント横スワイプ（mobile 1.5枚 / sm 2.3枚 / lg 3枚＋αが見える） */}
        <div className="flex gap-4 sm:gap-5 stagger overflow-x-auto overflow-y-hidden snap-x snap-mandatory -mx-6 px-6 pt-2 pb-3 scroll-pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {otherFeatures.map((f, i) => (
            <div
              key={f.no}
              className="fade-in group relative bg-white rounded-md border border-switch-gray-light shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col flex-shrink-0 w-[72%] sm:w-[42%] lg:w-[30%] snap-start"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* top accent stripe */}
              <div className={`h-1 bg-gradient-to-r ${f.accent}`} />

              {/* huge faded background number */}
              <span className="absolute top-1 right-2 text-[88px] font-bold text-switch-teal/[0.05] leading-none select-none pointer-events-none">
                {f.no}
              </span>

              <div className="relative p-5 pt-5 flex-1 flex flex-col">
                {/* header: tag */}
                <div className="flex items-center mb-3">
                  <span className="text-[10px] font-bold text-switch-teal-deep bg-switch-teal-tint px-2 py-0.5 rounded tracking-wider">
                    {f.tag}
                  </span>
                </div>

                {/* icon + title */}
                <div className="flex items-start gap-3 mb-2">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${f.accent} text-white flex items-center justify-center shadow-sm`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-switch-charcoal leading-tight pt-0.5">
                    {f.title}
                  </h3>
                </div>

                {/* desc */}
                <p className="text-[13px] text-switch-gray-dark leading-relaxed mb-4 flex-1">
                  {f.detail}
                </p>

                {/* effect pill */}
                <div className="pt-3 border-t border-dashed border-switch-gray-light flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-switch-teal-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-[10px] font-bold text-switch-gray-mid tracking-widest">効果</span>
                  <span className="ml-auto text-[13px] font-bold text-switch-teal-deep tabular-nums">
                    {f.effect}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* サマリーバナー */}
        <div className="fade-in mt-10 bg-switch-charcoal rounded-xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-switch-teal-bright/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative flex flex-col items-center text-center gap-1 w-full">
            <p className="text-lg sm:text-xl font-bold leading-tight text-center w-full">
              この<span className="text-switch-teal-bright">7つ</span>、すべてを
              <span className="text-switch-teal-bright">手数料8%</span>で。
            </p>
            <p className="text-xs text-white/70 text-center w-full">
              ＋ 物件あたり月額 ¥10,000
            </p>
          </div>
        </div>

        {/* CTA — バナー直下（/switch では非表示） */}
        {showCta && (
          <div className="fade-in mt-6 flex justify-center">
            <a
              href="#contact-form"
              className="group inline-flex items-center justify-center bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-4 rounded-md shadow-[0_0_32px_rgba(235,110,40,0.3)] hover:shadow-[0_0_48px_rgba(235,110,40,0.45)] hover:-translate-y-0.5 transition-all min-h-[48px]"
            >
              {ctaLabel}
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
