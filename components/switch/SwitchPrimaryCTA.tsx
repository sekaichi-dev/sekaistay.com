"use client";

import Image from "next/image";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";

/**
 * SwitchPrimaryCTA — /switch LP の最重要CTA（PainPoints直後に配置）
 *
 * SEKAI STAY トンマナに沿った濃いコバルトグレー基調のグラデ背景で
 * LP 全体の他セクションから視覚的に隔離し、「無料診断へ進ませる」
 * ためのヒーロー級セクションとして作り込む。
 */

const CHIPS = [
  { icon: "📝", text: "1分で入力" },
  { icon: "🆓", text: "完全無料" },
  { icon: "💰", text: "売上を算出" },
  { icon: "🎯", text: "改善ポイントを記載" },
];

type CompareStat = {
  leftLabel: string;
  leftValue: number;
  leftSuffix?: string;
  rightLabel: string;
  rightValue: number;
  rightSuffix?: string;
  diffLabel: string;
  diffValue: number;
  diffSuffix?: string;
  note?: string;
};

const fmt = (n: number) => `¥${new Intl.NumberFormat("ja-JP").format(n)}`;

export default function SwitchPrimaryCTA({
  title = "思い当たる項目が1つでもあった方へ",
  compareStat,
}: {
  title?: string;
  compareStat?: CompareStat;
} = {}) {
  const { primary } = useSwitchCtaLabels();
  return (
    <div className="relative">
    <section className="relative py-12 sm:py-16 overflow-hidden bg-[linear-gradient(135deg,#0d5a60_0%,#167b81_40%,#1a8f96_55%,#167b81_75%,#0d5a60_100%)] text-white">
      {/* 装飾 */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-switch-teal-deep/25 blur-[120px] rounded-full pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-40 w-[480px] h-[480px] bg-switch-accent/15 blur-[120px] rounded-full pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* メインタイトル（黄色バナー） */}
        <h2 className="inline-flex items-center gap-2 bg-[#fde047] text-switch-charcoal font-bold text-lg sm:text-2xl leading-tight tracking-tight px-5 sm:px-7 py-2 sm:py-2.5 rounded-md mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-switch-accent shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {title}
        </h2>

        {/* サブ見出し */}
        <p className="text-base sm:text-lg font-bold text-white leading-snug mb-2">
          まずは無料の診断レポート・ご相談から
        </p>

        {/* 補足 */}
        <p className="text-xs sm:text-sm text-white/70 mb-5 leading-relaxed max-w-xl mx-auto">
          民泊に強い専門の担当者が、あなたの物件を診断します。
        </p>

        {/* 数値比較ブロック（compareStat 指定時のみ） */}
        {compareStat && (
          <div className="mb-5 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3">
              <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 sm:px-4 sm:py-4 text-center">
                <p className="text-xs sm:text-xs text-white/70 font-semibold leading-tight mb-1">
                  {compareStat.leftLabel}
                </p>
                <p className="text-lg sm:text-xl font-bold text-white/60 line-through tabular-nums leading-tight">
                  {fmt(compareStat.leftValue)}
                  {compareStat.leftSuffix && (
                    <span className="text-[10px] sm:text-xs ml-0.5 no-underline">
                      {compareStat.leftSuffix}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center justify-center text-[#fde047] text-2xl sm:text-2xl font-bold leading-none">
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </div>
              <div className="bg-white/15 border border-[#fde047]/40 rounded-lg px-4 py-3 sm:px-4 sm:py-4 text-center">
                <p className="text-xs sm:text-xs text-[#fde047] font-bold leading-tight mb-1">
                  {compareStat.rightLabel}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#fff7d6] tabular-nums leading-tight">
                  {fmt(compareStat.rightValue)}
                  {compareStat.rightSuffix && (
                    <span className="text-[10px] sm:text-xs ml-0.5">
                      {compareStat.rightSuffix}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <span className="inline-flex items-baseline gap-2 bg-[#fde047] text-switch-charcoal font-bold px-4 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                <span className="text-[11px] sm:text-xs">{compareStat.diffLabel}</span>
                <span className="text-lg sm:text-xl tabular-nums">
                  {fmt(compareStat.diffValue)}
                  {compareStat.diffSuffix && (
                    <span className="text-[10px] sm:text-xs ml-0.5">
                      {compareStat.diffSuffix}
                    </span>
                  )}
                </span>
              </span>
            </div>
            {compareStat.note && (
              <p className="mt-2 text-[10px] sm:text-xs text-white/60 text-center leading-relaxed">
                {compareStat.note}
              </p>
            )}
          </div>
        )}

        {/* CTA button */}
        <div className="flex flex-col items-center">
          <a
            href="#contact-form"
            className="group relative inline-flex items-center justify-center w-full sm:w-auto bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-3.5 sm:py-4 rounded-md shadow-[0_0_40px_rgba(235,110,40,0.45)] hover:shadow-[0_0_56px_rgba(235,110,40,0.6)] hover:-translate-y-0.5 transition-all cta-breath min-h-[52px]"
          >
            <span>{primary}</span>
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        {/* Microcopy chips（Trust帯の位置に配置） */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap justify-center gap-2">
          {CHIPS.map((chip) => (
            <span
              key={chip.text}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20"
            >
              <span aria-hidden>{chip.icon}</span>
              {chip.text}
            </span>
          ))}
        </div>
      </div>
    </section>
      {/* 左側に営業マンイラスト（lg以上のみ表示、コンテンツ max-w-3xl と被らない位置） */}
      <div className="hidden lg:block absolute left-[5%] xl:left-[9%] bottom-0 translate-y-[8%] pointer-events-none z-20">
        <Image
          src="/images/switch/salesman-illust.png"
          alt=""
          width={220}
          height={440}
          className="w-[105px] lg:w-[120px] h-auto drop-shadow-[0_16px_28px_rgba(0,0,0,0.3)]"
          aria-hidden
        />
      </div>
    </div>
  );
}
