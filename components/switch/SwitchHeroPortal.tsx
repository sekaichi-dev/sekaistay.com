"use client";

/* /switch/portal Hero — ポータル主導訴求。
 * 仮説: オーナーの本質的な苦痛は「不透明さ」。可視化が動機。
 * 8% は副題に格下げ。ダッシュボードを画面の主役に。
 */

import { useEffect, useState } from "react";
import DotPattern from "./deco/DotPattern";

export default function SwitchHeroPortal({
  hideCta = false,
}: {
  hideCta?: boolean;
} = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  return (
    <section className="relative">
      <div className="bg-switch-charcoal text-white relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-15%] w-[70%] h-[75%] bg-switch-teal-bright/22 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[55%] h-[60%] bg-switch-teal/14 blur-[140px] rounded-full pointer-events-none" />
        <DotPattern opacity={0.04} />

        <div className="relative max-w-7xl mx-auto px-6 py-5 sm:py-8 lg:py-6 min-h-[calc(100svh-100px)] lg:min-h-[calc(100vh-100px)] flex items-center">
          <div
            className={`w-full transition-all duration-1000 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* ===== Desktop layout (lg以上): 既存の 2列グリッド ===== */}
            <div className="hidden lg:block">
              <div className="grid lg:grid-cols-[0.85fr_1.3fr] gap-8 lg:gap-12 items-center">
                {/* 左: コピー（ポータル主導） */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/8 border border-switch-teal-bright/40 rounded-full px-3 py-1 mb-4 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-switch-teal-bright rounded-full" aria-hidden />
                    <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-switch-teal-bright uppercase">
                      SEKAI STAY アプリ
                    </span>
                  </div>

                  <h1 className="font-bold leading-[1.18] mb-5 sm:mb-6 tracking-tight">
                    <span className="block text-[30px] sm:text-[40px] lg:text-[48px]">
                      あなたの物件、
                    </span>
                    <span className="block text-[30px] sm:text-[40px] lg:text-[48px] mt-1.5">
                      <span
                        className="gradient-highlight-box"
                        style={{ display: "inline-block", lineHeight: "1.0", paddingBottom: 0 }}
                      >
                        リアルタイム
                      </span>
                      でぜんぶみえる
                    </span>
                  </h1>

                  <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-white/85 leading-relaxed mb-6 font-medium">
                    民泊代行に、
                    <span className="text-switch-teal-bright font-bold">透明性</span>を。
                  </p>

                  <p className="text-[13px] sm:text-[14px] text-white/60 leading-relaxed mb-5">
                    予約・売上・経費・清掃 — 数字はぜんぶ、手元で動いてる。
                  </p>

                  {/* 8% ブロック — コンパクト版（8%だけ光る） */}
                  <div className="relative inline-flex items-baseline gap-2 mb-6 px-4 py-2.5 rounded-md bg-white/5 border border-white/10 overflow-visible">
                    <span
                      className="absolute -inset-2 bg-switch-teal-bright/25 blur-[24px] rounded-full pointer-events-none"
                      style={{ left: "38%", right: "32%" }}
                      aria-hidden
                    />
                    <span className="relative text-[11px] text-white/55 tracking-wider">しかも手数料は業界最安の</span>
                    <span className="relative gradient-text-mega text-[24px] sm:text-[28px] font-bold tabular-nums leading-none">8%</span>
                    <span className="relative text-[11px] text-white/55">+ ¥10,000/月</span>
                  </div>

                  {!hideCta && (
                  <div className="flex flex-col lg:items-start items-center">
                    <a
                      href="#contact-form"
                      data-cta="contact-form"
                      data-cta-label="portal-primary"
                      className="group w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap bg-switch-accent text-white font-bold text-[15px] sm:text-lg px-4 sm:px-9 py-3.5 sm:py-4 rounded-md hover:bg-switch-accent-hover transition-all shadow hover:-translate-y-0.5 min-h-[48px]"
                    >
                      SEKAI STAYアプリのデモ
                      <svg className="ml-2.5 w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <p className="text-[12px] text-white/55 mt-3 leading-relaxed">
                      入力60秒でアプリのデモ予約完了
                    </p>
                  </div>
                  )}
                </div>

                {/* 右: ダッシュボード画像 */}
                <div className="flex flex-col items-center w-full">
                  <div className="relative flex justify-center items-center w-full min-h-[320px] sm:min-h-[440px] lg:min-h-[520px]">
                    <div
                      className="absolute inset-0 bg-switch-teal-bright/25 blur-[120px] rounded-full scale-95 pointer-events-none"
                      aria-hidden
                    />
                    {/* chip → iPhone のフロー点線（control の SwitchHero と同じ表現） */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      viewBox="0 0 600 600"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <defs>
                        <linearGradient id="portalFlowLine" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#54bec3" stopOpacity="0" />
                          <stop offset="50%" stopColor="#54bec3" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#54bec3" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 70 110 Q 200 220 300 300" stroke="url(#portalFlowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                        <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3s" repeatCount="indefinite" />
                      </path>
                      <path d="M 530 80 Q 400 200 310 300" stroke="url(#portalFlowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                        <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M 60 540 Q 200 420 295 340" stroke="url(#portalFlowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                        <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="4s" repeatCount="indefinite" />
                      </path>
                      <path d="M 510 510 Q 400 420 320 340" stroke="url(#portalFlowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                        <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3.2s" repeatCount="indefinite" />
                      </path>
                    </svg>
                    <img
                      src="/images/switch/dashboard-mockup.png?v=v4"
                      alt="SEKAI STAY オーナーポータル ダッシュボード"
                      className="relative w-[88%] max-w-[420px] sm:max-w-[560px] lg:max-w-[680px] select-none pointer-events-none drop-shadow-2xl z-10"
                    />
                    <FloatingDataChip className="absolute top-4 left-2 sm:top-8 sm:left-[6%] lg:top-12 lg:left-[10%] z-20" label="新規予約" value="2件" trend="up" />
                    <FloatingDataChip className="absolute top-1 right-0 sm:top-2 sm:right-[-1%] lg:top-3 lg:right-[-3%] z-20" label="清掃完了" value="3/3" trend="ok" />
                    <FloatingDataChip className="absolute bottom-1 left-0 sm:bottom-4 sm:left-[-1%] lg:bottom-6 lg:left-[-3%] z-20" label="稼働率" value="74%" trend="up" />
                    <FloatingDataChip className="absolute bottom-6 right-2 sm:bottom-14 sm:right-[8%] lg:bottom-20 lg:right-[12%] z-20" label="ピーク売上" value="+18%" trend="up" />
                  </div>

                  <div className="mt-3 sm:mt-4 flex flex-col items-center gap-1.5 sm:gap-2 relative z-20">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-sm shadow-[0_0_14px_rgba(251,191,36,0.4)] tracking-[0.15em]">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      日本初
                    </span>
                    <p className="text-[11px] sm:text-sm text-white/80 tracking-wide font-semibold leading-relaxed text-center">
                      <span className="block">あなたの物件を、<span className="text-switch-teal-bright">リアルタイム</span>でみえる「専用ダッシュボード」で、</span>
                      <span className="block">透明性の高い民泊運用を</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust ライン */}
              <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 pt-5 mt-6 border-t border-white/10">
                <Metric value="97" unit="%" label="継続率" />
                <Divider />
                <Metric value="4.8" unit="/5" label="満足度" />
                <Divider />
                <Metric value="61" unit="%" label="稼働率" />
                <Divider />
                <span className="text-[11px] text-white/75 font-bold tracking-wide">
                  住宅宿泊管理業 <span className="text-switch-teal-bright">第F05780号</span>
                </span>
              </div>
              <p className="text-[10px] text-white/50 text-center mt-2 leading-normal">
                ※ 2026年4月時点 ｜ 継続6ヶ月以上の平均
              </p>
            </div>

            {/* ===== Mobile layout (lg未満): 並び替え版 =====
                順序: Pill → 画像+chips+tagline → Trust → 60秒+ボタン+8% → 見出し+sub+desc */}
            <div className="lg:hidden flex flex-col items-center gap-6 text-center">
              {/* 1. OWNER PORTAL pill */}
              <div className="inline-flex items-center gap-2 bg-white/8 border border-switch-teal-bright/40 rounded-full px-3 py-1 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-switch-teal-bright rounded-full" aria-hidden />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-switch-teal-bright uppercase">
                  SEKAI STAY アプリ
                </span>
              </div>

              {/* 2. 見出し + サブヘッド + 予約・売上 tagline */}
              <div className="w-full">
                <h1 className="font-bold leading-[1.18] mb-4 tracking-tight">
                  <span className="block text-[30px] sm:text-[40px]">
                    あなたの物件、
                  </span>
                  <span className="block text-[30px] sm:text-[40px] mt-1.5">
                    <span
                      className="gradient-highlight-box"
                      style={{ display: "inline-block", lineHeight: "1.0", paddingBottom: 0 }}
                    >
                      リアルタイム
                    </span>
                    でぜんぶみえる
                  </span>
                </h1>
                <p className="text-[16px] sm:text-[18px] text-white/85 leading-relaxed mb-3 font-medium">
                  民泊代行に、
                  <span className="text-switch-teal-bright font-bold">透明性</span>を。
                </p>
                <p className="text-[11px] sm:text-[12px] text-white/55 mt-3 sm:mt-4 max-w-md tracking-wide leading-relaxed text-center">
                  予約・売上・経費・清掃 — <span className="text-switch-teal-bright font-semibold">数字は全部、手元で動いてる。</span>
                </p>
              </div>

              {/* 3. ダッシュボード画像 + chips + tagline */}
              <div className="flex flex-col items-center w-full">
                <div className="relative flex justify-center items-center w-full min-h-[320px] sm:min-h-[440px]">
                  <div
                    className="absolute inset-0 bg-switch-teal-bright/25 blur-[120px] rounded-full scale-95 pointer-events-none"
                    aria-hidden
                  />
                  {/* chip → iPhone のフロー点線（モバイル） */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    viewBox="0 0 600 600"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="portalFlowLineMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#54bec3" stopOpacity="0" />
                        <stop offset="50%" stopColor="#54bec3" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#54bec3" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 70 110 Q 200 220 300 300" stroke="url(#portalFlowLineMobile)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                      <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M 530 80 Q 400 200 310 300" stroke="url(#portalFlowLineMobile)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                      <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 60 540 Q 200 420 295 340" stroke="url(#portalFlowLineMobile)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                      <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="4s" repeatCount="indefinite" />
                    </path>
                    <path d="M 510 510 Q 400 420 320 340" stroke="url(#portalFlowLineMobile)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                      <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3.2s" repeatCount="indefinite" />
                    </path>
                  </svg>
                  <img
                    src="/images/switch/dashboard-mockup.png?v=v4"
                    alt="SEKAI STAY オーナーポータル ダッシュボード"
                    className="relative w-[88%] max-w-[420px] sm:max-w-[560px] select-none pointer-events-none drop-shadow-2xl z-10"
                  />
                  <FloatingDataChip className="absolute top-4 left-2 sm:top-8 sm:left-[6%] z-20" label="新規予約" value="2件" trend="up" />
                  <FloatingDataChip className="absolute top-1 right-0 sm:top-2 sm:right-[-1%] z-20" label="清掃完了" value="3/3" trend="ok" />
                  <FloatingDataChip className="absolute bottom-1 left-0 sm:bottom-4 sm:left-[-1%] z-20" label="稼働率" value="74%" trend="up" />
                  <FloatingDataChip className="absolute bottom-6 right-2 sm:bottom-14 sm:right-[8%] z-20" label="ピーク売上" value="+18%" trend="up" />
                </div>
                <div className="mt-3 sm:mt-4 flex flex-col items-center gap-1.5 sm:gap-2 relative z-20">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-sm shadow-[0_0_14px_rgba(251,191,36,0.4)] tracking-[0.15em]">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    日本初
                  </span>
                  <p className="text-[11px] sm:text-sm text-white/80 tracking-wide font-semibold leading-relaxed text-center">
                    <span className="block">あなたの物件を、<span className="text-switch-teal-bright">リアルタイム</span>でみえる「専用ダッシュボード」で、</span>
                    <span className="block">透明性の高い民泊運用を</span>
                  </p>
                </div>
              </div>

              {/* 4. Trust ライン + footnote */}
              <div className="w-full">
                <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 pt-5 border-t border-white/10">
                  <Metric value="97" unit="%" label="継続率" />
                  <Divider />
                  <Metric value="4.8" unit="/5" label="満足度" />
                  <Divider />
                  <Metric value="61" unit="%" label="稼働率" />
                  <Divider />
                  <span className="text-[11px] text-white/75 font-bold tracking-wide">
                    住宅宿泊管理業 <span className="text-switch-teal-bright">第F05780号</span>
                  </span>
                </div>
                <p className="text-[10px] text-white/50 mt-2 leading-normal">
                  ※ 2026年4月時点 ｜ 継続6ヶ月以上の平均
                </p>
              </div>

              {/* 5. 8% pill → デモボタン → 60秒キャプション */}
              <div className="flex flex-col items-center w-full">
                <div className="relative inline-flex items-baseline gap-2 mb-4 px-4 py-2.5 rounded-md bg-white/5 border border-white/10 overflow-visible">
                  <span
                    className="absolute -inset-2 bg-switch-teal-bright/25 blur-[24px] rounded-full pointer-events-none"
                    style={{ left: "38%", right: "32%" }}
                    aria-hidden
                  />
                  <span className="relative text-[11px] text-white/55 tracking-wider">しかも手数料は業界最安の</span>
                  <span className="relative gradient-text-mega text-[24px] sm:text-[28px] font-bold tabular-nums leading-none">8%</span>
                  <span className="relative text-[11px] text-white/55">+ ¥10,000/月</span>
                </div>
                {!hideCta && (
                <>
                <a
                  href="#contact-form"
                  data-cta="contact-form"
                  data-cta-label="portal-primary"
                  className="group w-full inline-flex items-center justify-center whitespace-nowrap bg-switch-accent text-white font-bold text-[15px] px-4 py-3.5 rounded-md hover:bg-switch-accent-hover transition-all shadow hover:-translate-y-0.5 min-h-[48px]"
                >
                  SEKAI STAYアプリのデモ
                  <svg className="ml-2.5 w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <p className="text-[12px] text-white/55 mt-3 leading-relaxed">
                  入力60秒でアプリのデモ予約完了
                </p>
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingDataChip({
  className = "",
  label,
  value,
  trend,
}: {
  className?: string;
  label: string;
  value: string;
  trend: "up" | "down" | "ok";
}) {
  const trendColor = trend === "up" ? "text-switch-teal-bright" : trend === "down" ? "text-switch-accent" : "text-white";
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/40 px-2.5 py-2 sm:px-3.5 sm:py-2.5 ${className}`}>
      <span
        className="absolute -top-1.5 -right-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md"
        aria-hidden
      />

      <p className="text-[8px] sm:text-[9px] text-switch-charcoal/60 font-medium tracking-wider uppercase leading-none">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-[14px] sm:text-[18px] font-bold tabular-nums leading-none ${trend === "up" ? "text-switch-teal-deep" : trend === "down" ? "text-switch-accent" : "text-switch-charcoal"}`}>
          {value}
        </span>
        {trend === "up" && (
          <svg className={`w-2.5 h-2.5 ${trendColor}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" />
          </svg>
        )}
      </div>
    </div>
  );
}

function Metric({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg sm:text-xl font-bold text-switch-teal-bright tabular-nums tracking-tight">{value}</span>
      <span className="text-[11px] text-white/65 font-medium">{unit} {label}</span>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-white/15" aria-hidden />;
}
