"use client";

import { useScrollFade } from "@/hooks/useScrollFade";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";
import HighlightMarker from "./deco/HighlightMarker";
import BounceArrow from "./deco/BounceArrow";

export default function SwitchSolution() {
  const ref = useScrollFade();
  const { primary: ctaLabel } = useSwitchCtaLabels();

  return (
    <section className="py-24 sm:py-32 bg-white relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="fade-in text-center mb-10">
          <p className="text-switch-teal font-bold text-sm tracking-widest mb-3">
            ▼ その損失、今日から止められます ▼
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
            その損失、<br />
            <HighlightMarker>今日から</HighlightMarker>止められます。
          </h2>
          <img src="https://soco-st.com/wp-content/themes/socost/upload/17467_color.svg" alt="" className="hidden sm:block mx-auto w-36 mt-4" />
          <p className="text-sm sm:text-base text-switch-gray-dark max-w-xl mx-auto">
            民泊運営のぜんぶを、SEKAI STAY が代わりにやります。
          </p>
        </div>

        {/* 価格の巨大表示 */}
        <div className="fade-in bg-gradient-to-br from-switch-teal-tint via-white to-switch-teal-tint rounded-3xl p-8 sm:p-12 border-2 border-switch-teal/30 shadow-xl text-center mb-8">
          <p className="text-xs text-switch-teal-deep font-bold tracking-widest mb-3">
            あなたが払うのは、たったひとつ
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="gradient-text-hero text-[6rem] sm:text-[10rem] lg:text-[12rem] font-bold leading-none tabular-nums tracking-tighter">
              8
            </span>
            <span className="text-4xl sm:text-6xl font-bold text-switch-accent">%</span>
          </div>
          <p className="text-sm sm:text-base text-switch-charcoal font-bold mb-1">
            ＋ ¥10,000 / 物件 / 月
          </p>
        </div>

        {/* 3つの約束 */}
        <div className="fade-in grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              title: "手数料 8%",
              sub: "業界最安水準",
              icon: "💰",
            },
            {
              title: "隠れ費用 ¥0",
              sub: "清掃・広告・レポート全て込み",
              icon: "🔒",
            },
            {
              title: "オーナー作業ほぼゼロ",
              sub: "全部まるっとおまかせ",
              icon: "🙌",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-5 border-2 border-switch-teal/20 shadow-sm text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">{p.icon}</div>
              <p className="text-base sm:text-lg font-bold text-switch-charcoal leading-tight mb-1">
                {p.title}
              </p>
              <p className="text-xs text-switch-gray-mid">{p.sub}</p>
            </div>
          ))}
        </div>

        <div className="fade-in flex flex-col items-center gap-3">
          <BounceArrow direction="down" colorClass="text-switch-accent" />
          <a
            href="#contact-form"
            className="group inline-flex items-center justify-center bg-switch-accent text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-4 rounded-full hover:bg-switch-accent-hover transition-all cta-glow cta-breath hover:-translate-y-0.5"
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
