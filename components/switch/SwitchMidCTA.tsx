"use client";

import BounceArrow from "./deco/BounceArrow";
import CountUp from "./deco/CountUp";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";

type Chip = {
  icon: string;
  text: string;
};

type BigStat = {
  label?: string;
  value: number;
  prefix?: string;
  suffix?: string;
  note?: string;
};

type CompareStat = {
  leftLabel: string;
  leftValue: number;
  leftSuffix?: string;
  rightLabel: string;
  rightValue: number;
  rightSuffix?: string;
  diffLabel?: string; // 例: "年間差額"
  diffValue?: number;
  diffSuffix?: string;
};

type Props = {
  headline: string;
  subline?: string;
  eyebrow?: string;
  ctaLabel?: string;
  variant?: "light" | "dark" | "accent" | "deep";
  withArrow?: boolean;
  layout?: "simple" | "card" | "stat" | "split";
  chips?: Chip[];
  bigStat?: BigStat;
  compareStat?: CompareStat;
  features?: string[]; // stat layoutのミニチェックリスト
};

export default function SwitchMidCTA({
  headline,
  subline,
  eyebrow,
  ctaLabel,
  variant = "light",
  withArrow = true,
  layout = "simple",
  chips,
  bigStat,
  compareStat,
  features,
}: Props) {
  const { primary } = useSwitchCtaLabels();
  const finalCtaLabel = ctaLabel ?? primary;
  const isOnDark = variant === "dark" || variant === "deep";
  const bgClass =
    variant === "dark"
      ? "bg-gradient-to-br from-switch-charcoal to-black text-white"
      : variant === "deep"
        ? "bg-gradient-to-br from-switch-teal-deep via-switch-teal to-switch-teal-deep text-white"
        : variant === "accent"
          ? "bg-gradient-to-br from-switch-accent/15 via-white to-switch-accent/10"
          : "bg-gradient-to-br from-switch-teal-tint via-white to-switch-teal-tint";

  const headlineColor = isOnDark ? "text-white" : "text-switch-charcoal";
  const sublineColor = isOnDark ? "text-white/80" : "text-switch-gray-dark";
  const eyebrowColor = isOnDark ? "text-switch-teal-bright" : "text-switch-accent";

  const ctaButton = (
    <a
      href="#contact-form"
      className="group inline-flex items-center justify-center bg-switch-accent text-white font-bold text-sm sm:text-base px-7 sm:px-9 py-3.5 rounded-md hover:bg-switch-accent-hover transition-all shadow-sm cta-breath hover:-translate-y-0.5 min-h-[44px]"
    >
      {finalCtaLabel}
      <svg
        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
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
  );

  const chipsRow = chips && chips.length > 0 && (
    <div className="flex flex-wrap justify-center gap-2 mb-5">
      {chips.map((chip) => (
        <span
          key={chip.text}
          className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${
            isOnDark
              ? "bg-white/10 text-white border border-white/20"
              : "bg-white text-switch-charcoal border border-switch-gray-light shadow-sm"
          }`}
        >
          <span aria-hidden>{chip.icon}</span>
          {chip.text}
        </span>
      ))}
    </div>
  );

  const eyebrowEl = eyebrow && (
    <p
      className={`text-[11px] sm:text-xs font-bold tracking-[0.12em] mb-2 ${eyebrowColor}`}
    >
      {eyebrow}
    </p>
  );

  // -------- card layout --------
  if (layout === "card") {
    // card layoutは白い内側カードを持つので、内部のテキストは常にon-white色を使う
    const cardEyebrowEl = eyebrow && (
      <p className="text-[11px] sm:text-xs font-bold tracking-[0.12em] mb-2 text-switch-accent">
        {eyebrow}
      </p>
    );
    return (
      <section className={`py-10 sm:py-14 ${bgClass}`}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-[0_6px_28px_rgba(22,123,129,0.10)] border border-switch-teal-tint p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-switch-teal-tint border border-switch-teal/30 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-switch-teal-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h4m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            {cardEyebrowEl}
            <h3 className="text-lg sm:text-xl font-bold mb-2 leading-snug text-switch-charcoal">
              {headline}
            </h3>
            {subline && (
              <p className="text-xs sm:text-sm mb-5 text-switch-gray-dark leading-relaxed">{subline}</p>
            )}
            {chips && chips.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {chips.map((chip) => (
                  <span
                    key={chip.text}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-switch-charcoal border border-switch-gray-light shadow-sm"
                  >
                    <span aria-hidden>{chip.icon}</span>
                    {chip.text}
                  </span>
                ))}
              </div>
            )}
            {withArrow && (
              <div className="flex justify-center mb-3">
                <BounceArrow direction="down" colorClass="text-switch-accent" />
              </div>
            )}
            {ctaButton}
          </div>
        </div>
      </section>
    );
  }

  // -------- stat layout --------
  if (layout === "stat" && bigStat) {
    return (
      <section className={`py-12 sm:py-16 ${bgClass}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          {eyebrowEl}
          <h3
            className={`text-xl sm:text-2xl font-bold mb-4 leading-tight ${headlineColor}`}
          >
            {headline}
          </h3>
          <div className="inline-flex flex-col items-center bg-white rounded-xl shadow-sm border border-switch-accent/20 px-8 py-6 mb-5">
            {bigStat.label && (
              <span className={`text-xs font-bold mb-1 ${eyebrowColor}`}>
                {bigStat.label}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <CountUp
                target={bigStat.value}
                prefix={bigStat.prefix ?? "¥"}
                className="text-4xl sm:text-5xl font-bold text-switch-accent tabular-nums"
                observeOnce
              />
              {bigStat.suffix && (
                <span className="text-base sm:text-lg font-bold text-switch-charcoal">
                  {bigStat.suffix}
                </span>
              )}
            </div>
            {bigStat.note && (
              <span className="text-[10px] sm:text-xs text-switch-gray-dark mt-1">
                {bigStat.note}
              </span>
            )}
          </div>
          {features && features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-5 max-w-lg mx-auto">
              {features.map((f) => (
                <span
                  key={f}
                  className={`inline-flex items-center gap-1 text-xs sm:text-sm ${sublineColor}`}
                >
                  <svg
                    className="w-3.5 h-3.5 text-switch-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f}
                </span>
              ))}
            </div>
          )}
          {chipsRow}
          {ctaButton}
          {subline && (
            <p className={`text-xs sm:text-sm mt-4 ${sublineColor}`}>
              {subline}
            </p>
          )}
        </div>
      </section>
    );
  }

  // -------- split layout --------
  if (layout === "split" && compareStat) {
    return (
      <section className={`py-12 sm:py-16 ${bgClass}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          {eyebrowEl}
          <h3
            className={`text-xl sm:text-2xl font-bold mb-5 leading-tight ${headlineColor}`}
          >
            {headline}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-xl mx-auto mb-4">
            {/* 他社 */}
            <div className="bg-switch-gray-light/40 border border-switch-gray-light rounded-lg p-4 sm:p-5">
              <div className="text-[10px] sm:text-xs font-bold text-switch-gray-dark mb-1">
                {compareStat.leftLabel}
              </div>
              <div className="flex items-baseline justify-center gap-0.5">
                <CountUp
                  target={compareStat.leftValue}
                  prefix="¥"
                  className="text-2xl sm:text-3xl font-bold text-switch-gray-dark line-through decoration-2 tabular-nums"
                  observeOnce
                />
                {compareStat.leftSuffix && (
                  <span className="text-xs sm:text-sm text-switch-gray-dark">
                    {compareStat.leftSuffix}
                  </span>
                )}
              </div>
            </div>
            {/* SEKAI STAY */}
            <div className="bg-switch-teal-tint border-2 border-switch-accent rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(22,123,129,0.15)]">
              <div className="text-[10px] sm:text-xs font-bold text-switch-accent mb-1">
                {compareStat.rightLabel}
              </div>
              <div className="flex items-baseline justify-center gap-0.5">
                <CountUp
                  target={compareStat.rightValue}
                  prefix="¥"
                  className="text-2xl sm:text-3xl font-bold text-switch-accent tabular-nums"
                  observeOnce
                />
                {compareStat.rightSuffix && (
                  <span className="text-xs sm:text-sm text-switch-accent font-bold">
                    {compareStat.rightSuffix}
                  </span>
                )}
              </div>
            </div>
          </div>
          {compareStat.diffValue !== undefined && (
            <div className="inline-flex items-center gap-2 bg-switch-accent/10 border border-switch-accent/30 rounded-full px-4 py-1.5 mb-5">
              <span className="text-xs font-bold text-switch-accent">
                {compareStat.diffLabel ?? "差額"}
              </span>
              <CountUp
                target={compareStat.diffValue}
                prefix="¥"
                className="text-base sm:text-lg font-bold text-switch-accent tabular-nums"
                observeOnce
              />
              {compareStat.diffSuffix && (
                <span className="text-xs sm:text-sm font-bold text-switch-accent">
                  {compareStat.diffSuffix}
                </span>
              )}
            </div>
          )}
          {subline && (
            <p className={`text-[11px] sm:text-xs mb-4 ${sublineColor}`}>
              {subline}
            </p>
          )}
          {chipsRow}
          {ctaButton}
        </div>
      </section>
    );
  }

  // -------- simple (既存互換) --------
  return (
    <section className={`py-12 sm:py-16 ${bgClass}`}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        {eyebrowEl}
        <h3
          className={`text-xl sm:text-2xl font-bold mb-2 leading-tight ${headlineColor}`}
        >
          {headline}
        </h3>
        {subline && (
          <p className={`text-xs sm:text-sm mb-5 ${sublineColor}`}>{subline}</p>
        )}
        {chipsRow}
        {withArrow && (
          <div className="flex justify-center mb-3">
            <BounceArrow
              direction="down"
              colorClass={variant === "dark" ? "text-switch-teal-bright" : "text-switch-accent"}
            />
          </div>
        )}
        {ctaButton}
      </div>
    </section>
  );
}
