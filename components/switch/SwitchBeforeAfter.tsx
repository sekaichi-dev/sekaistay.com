"use client";

import { useScrollFade } from "@/hooks/useScrollFade";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";
import CountUp from "./deco/CountUp";
import SectionHead from "./deco/SectionHead";

export default function SwitchBeforeAfter() {
  const ref = useScrollFade();
  const { primary: ctaLabel } = useSwitchCtaLabels();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-switch-cloud" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="fade-in mb-12">
          <SectionHead
            enLabel="Result"
            jaTitle={<>結局、どうなるの？</>}
            subtitle={<>稼働率が上がり、手取りが増える。──これが、すべてです。</>}
          />
        </div>

        <div className="fade-in grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
          {/* BEFORE */}
          <div className="bg-switch-gray-pale rounded-md p-6 sm:p-8 border-2 border-switch-gray-light">
            <p className="text-[10px] sm:text-xs text-switch-gray-mid font-bold tracking-widest mb-4">
              BEFORE｜今の代行
            </p>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-switch-gray-mid mb-1">手数料</p>
                <p className="text-3xl sm:text-4xl font-bold text-switch-gray-dark tabular-nums">
                  15〜25<span className="text-base">%</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-switch-gray-mid mb-1">稼働率</p>
                <p className="text-3xl sm:text-4xl font-bold text-switch-gray-dark tabular-nums">
                  38<span className="text-base">%</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-switch-gray-mid mb-1">年間手取り</p>
                <p className="text-3xl sm:text-4xl font-bold text-switch-gray-dark tabular-nums">
                  480<span className="text-base">万円</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-switch-gray-mid mb-1">月次レポート</p>
                <p className="text-sm font-bold text-switch-gray-dark">月1回PDF</p>
              </div>
              <div>
                <p className="text-[10px] text-switch-gray-mid mb-1">トラブル対応</p>
                <p className="text-sm font-bold text-switch-gray-dark">オーナーが対応</p>
              </div>
            </div>
            <img src="https://soco-st.com/wp-content/themes/socost/upload/16953_color.svg" alt="" className="mx-auto w-20 sm:w-24 opacity-50 mt-4" />
          </div>

          {/* ARROW */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-switch-accent to-switch-accent-hover shadow flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
          <div className="flex md:hidden items-center justify-center py-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-switch-accent to-switch-accent-hover shadow flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>

          {/* AFTER */}
          <div className="bg-gradient-to-br from-switch-teal via-switch-teal-deep to-switch-teal rounded-md p-6 sm:p-8 text-white shadow relative overflow-hidden">
            <p className="text-[10px] sm:text-xs text-switch-teal-bright font-bold tracking-widest mb-4">
              AFTER｜SEKAI STAY
            </p>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-white/70 mb-1">手数料</p>
                <p className="text-4xl sm:text-5xl font-bold tabular-nums">
                  <CountUp target={8} />
                  <span className="text-lg">%</span>
                  <span className="text-xs text-switch-teal-bright ml-2">+ ¥10,000/物件</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/70 mb-1">稼働率</p>
                <p className="text-4xl sm:text-5xl font-bold tabular-nums">
                  <CountUp target={76} />
                  <span className="text-lg">%</span>
                  <span className="text-xs text-switch-teal-bright ml-2">↑2倍</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/70 mb-1">年間手取り</p>
                <p className="text-4xl sm:text-5xl font-bold tabular-nums">
                  <CountUp target={820} />
                  <span className="text-lg">万円</span>
                </p>
                <p className="text-xs text-switch-teal-bright font-bold mt-1">
                  +340万円
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/70 mb-1">月次レポート</p>
                <p className="text-sm font-bold">リアルタイム・ダッシュボード</p>
              </div>
              <div>
                <p className="text-[10px] text-white/70 mb-1">トラブル対応</p>
                <p className="text-sm font-bold">24時間 SEKAI STAY</p>
              </div>
            </div>
            <img src="https://soco-st.com/wp-content/themes/socost/upload/16918_color.svg" alt="" className="mx-auto w-20 sm:w-24 opacity-50 mt-4" />
          </div>
        </div>

        <p className="fade-in text-[11px] text-switch-gray-mid text-center mt-6">
          ※ 実際の他オーナー様の平均的な改善例です。個別物件の結果を保証するものではありません。
        </p>

        <div className="fade-in mt-10 text-center">
          <a
            href="#contact-form"
            className="group inline-flex items-center justify-center bg-switch-accent text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-4 rounded-md hover:bg-switch-accent-hover transition-all shadow-sm cta-breath min-h-[44px]"
          >
            {ctaLabel}
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
