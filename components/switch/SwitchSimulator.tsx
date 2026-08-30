"use client";

import { useId, useMemo, useState } from "react";
import CountUp from "./deco/CountUp";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";

type Props = {
  onApply: (v: {
    currentFeeRate: number;
    monthlyRevenue: number;
    pastYears: number;
    futureYears: number;
  }) => void;
};

const SEKAI_FEE = 8; // %
const SEKAI_FIXED_MAN = 1.0; // ¥10,000/月 = 1万円/月 = 12万円/年

export default function SwitchSimulator({ onApply }: Props) {
  const { primary: ctaLabel } = useSwitchCtaLabels();
  // 初期値は松本さん（PainPoints / FinalCTA と一貫）の設定。
  const [feePct, setFeePct] = useState(20);
  const [monthlyRev, setMonthlyRev] = useState(60); // 万円
  const [pastYears, setPastYears] = useState(3);
  const [futureYears, setFutureYears] = useState(5);
  // スライダ操作があったかどうか（初期は結果カードを半透明＋ガイド表示）
  const [touched, setTouched] = useState(false);
  // 折り畳み：初期は Q1・Q2 のみ表示
  const [expanded] = useState(true);
  // 部屋数は固定1で計算（入力UIからは削除）
  const rooms = 1;

  const markTouched = () => {
    if (!touched) setTouched(true);
  };

  const result = useMemo(() => {
    const diff = Math.max(0, feePct - SEKAI_FEE) / 100;
    const annualRevMan = monthlyRev * 12;
    const annualWasteMan = annualRevMan * diff;

    // SEKAI STAY 物件あたり月額固定費 ¥10,000 = 年12万円
    // 損失側も節約側も同じ annualSaving (四捨五入後) を掛け算するので、
    // 「今後N年の損失」と「N年で節約できる額」が常に完全一致する
    const sekaiFixedAnnualMan = SEKAI_FIXED_MAN * 12; // 12万円/年
    const annualNetDiffMan = Math.max(0, annualWasteMan - sekaiFixedAnnualMan);

    const annualSaving = Math.round(annualNetDiffMan);
    const pastLoss = annualSaving * pastYears;
    const futureLoss = annualSaving * futureYears;
    const totalLoss = pastLoss + futureLoss;
    const futureSaving = annualSaving * futureYears;

    return { pastLoss, futureLoss, totalLoss, annualSaving, futureSaving };
  }, [feePct, monthlyRev, pastYears, futureYears]);

  return (
    <section id="simulator" className="bg-switch-teal-deep py-10 sm:py-12 lg:py-10">
      <div className="max-w-2xl lg:max-w-xl mx-auto px-6">
        <div className="rounded-md shadow border border-switch-gray-light/50 overflow-hidden">
          {/* 見出しパネル（同じボックスの上部） */}
          <div className="bg-gradient-to-br from-switch-charcoal via-[#1a2e30] to-[#0d3d42] text-white px-6 py-4 sm:px-8 sm:py-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="inline-flex items-center gap-1.5 bg-switch-accent text-white text-[10px] sm:text-[11px] font-bold tracking-widest px-3 py-0.5 rounded-full mb-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                10秒で完了
              </p>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold leading-tight tracking-tight">
                あなたの物件、SEKAI STAYで
                <span className="text-switch-teal-bright">どう変わる</span>？
              </h2>
            </div>
          </div>

          {/* フォームパネル（同じボックスの下部） */}
          <div className="bg-white p-4 sm:p-6 space-y-3.5">
            {/* Q1 */}
            <Field label="Q1. 今の代行会社の手数料率は？" valueText={`${feePct}%`}>
              {(id) => (
                <Slider
                  id={id}
                  value={feePct}
                  onChange={(v) => {
                    setFeePct(v);
                    markTouched();
                  }}
                  min={8}
                  max={35}
                  step={1}
                  unit="%"
                  valueTextUnit="パーセント"
                  minLabel="8%"
                  maxLabel="35%"
                />
              )}
            </Field>

            {/* Q2 */}
            <Field label="Q2. 物件の月間総売上は？" valueText={`${monthlyRev}万円`}>
              {(id) => (
                <Slider
                  id={id}
                  value={monthlyRev}
                  onChange={(v) => {
                    setMonthlyRev(v);
                    markTouched();
                  }}
                  min={10}
                  max={500}
                  step={5}
                  unit="万円"
                  minLabel="10万円"
                  maxLabel="500万円"
                />
              )}
            </Field>

            {expanded && (
              <>
            {/* Q3 */}
            <Field label="Q3. これまでの運用期間は？" valueText={`${pastYears}年`}>
              {(id) => (
                <Slider
                  id={id}
                  value={pastYears}
                  onChange={(v) => {
                    setPastYears(v);
                    markTouched();
                  }}
                  min={0}
                  max={15}
                  step={1}
                  unit="年"
                  minLabel="0年"
                  maxLabel="15年"
                />
              )}
            </Field>

            {/* Q4 */}
            <Field label="Q4. 今後あと何年運用する予定？" valueText={`${futureYears}年`}>
              {(id) => (
                <Slider
                  id={id}
                  value={futureYears}
                  onChange={(v) => {
                    setFutureYears(v);
                    markTouched();
                  }}
                  min={1}
                  max={20}
                  step={1}
                  unit="年"
                  minLabel="1年"
                  maxLabel="20年"
                />
              )}
            </Field>

            {/* 結果：損失 × 節約 統合カード */}
            <div
              className={`relative mt-4 rounded-md overflow-hidden shadow border-2 border-red-800/40 transition-opacity duration-300 ${
                touched ? "opacity-100" : "opacity-60"
              }`}
            >
              {!touched && (
                <div className="absolute inset-x-0 top-0 z-20 flex justify-center pointer-events-none">
                  <div className="mt-2 bg-black/85 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                    ↑ スライダを動かすと、あなたの数字が出ます
                  </div>
                </div>
              )}
              {/* 上半分：損失（警告：レッドグラデ） */}
              <div className="bg-gradient-to-br from-[#dc2626] via-[#b91c1c] to-[#7f1d1d] text-white p-4 sm:p-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/20 blur-3xl rounded-full pointer-events-none"
                  aria-hidden
                />
                <div className="relative">
                  <p className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-3 py-0.5 rounded-full mb-2 whitespace-nowrap">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    今の代行業者のままだと
                  </p>
                  <p className="text-[40px] sm:text-5xl font-bold leading-none tracking-tight tabular-nums mb-2 flex items-baseline justify-center">
                    <span className="mr-1 text-[#fff7d6]">−</span>
                    <CountUp target={result.totalLoss} observeOnce={false} duration={900} className="text-[#fff7d6]" />
                    <span className="text-lg sm:text-xl ml-2 opacity-90">万円</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/20">
                    <div>
                      <p className="text-[10px] opacity-70 mb-0.5">過去 {pastYears} 年</p>
                      <p className="text-xs sm:text-sm font-medium tabular-nums opacity-90">
                        −<CountUp target={result.pastLoss} observeOnce={false} duration={600} />
                        <span className="text-[10px] ml-0.5 opacity-70">万円</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-70 mb-0.5">今後 {futureYears} 年</p>
                      <p className="text-xs sm:text-sm font-medium tabular-nums opacity-90">
                        −<CountUp target={result.futureLoss} observeOnce={false} duration={600} />
                        <span className="text-[10px] ml-0.5 opacity-70">万円</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 切替矢印 */}
              <div className="relative flex justify-center">
                <div className="absolute -top-3.5 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border-2 border-switch-teal/40">
                  <svg className="w-4 h-4 text-switch-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* 下半分：節約（ティール） */}
              <div className="bg-gradient-to-br from-switch-teal-tint via-white to-switch-teal-tint/60 p-4 sm:p-5 pt-5 sm:pt-6 text-center">
                <p className="flex items-center justify-center gap-1.5 mb-1.5">
                  <img
                    src="/images/switch/logo-text.png"
                    alt="SEKAI STAY"
                    className="h-3 sm:h-3.5 w-auto object-contain"
                  />
                  <span className="text-[10px] sm:text-[11px] text-switch-teal-deep font-bold tracking-wider">
                    に切り替えると
                  </span>
                </p>
                <p className="text-base sm:text-lg font-bold text-switch-charcoal leading-tight mb-0.5">
                  {futureYears}年で
                  <CountUp
                    target={result.futureSaving}
                    observeOnce={false}
                    duration={600}
                    className="text-[32px] sm:text-4xl text-switch-teal mx-1 align-baseline font-bold"
                  />
                  <span className="text-sm sm:text-base text-switch-teal">万円</span> 節約
                </p>
                <p className="text-xs sm:text-sm text-switch-teal-deep font-bold">
                  年間
                  <CountUp target={result.annualSaving} observeOnce={false} duration={600} className="text-xl sm:text-2xl text-switch-teal mx-1" />
                  <span className="text-xs">万円</span> が手元に戻る
                </p>
                <p className="text-[10px] text-switch-gray-mid mt-1.5 text-center">
                  ※ 手数料8% ＋ 物件あたり月額¥10,000 で計算
                </p>
              </div>
            </div>

            {/* フック：詳細診断への誘導（compact） */}
            <div className="flex items-start gap-3 rounded-md border border-switch-teal/20 bg-switch-teal-tint/40 p-3.5 sm:p-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-switch-teal/30 flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-switch-teal-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-switch-charcoal mb-0.5 leading-snug">
                  もっと詳細なレポートを、無料で。
                </p>
                <p className="text-[11px] sm:text-xs text-switch-gray-dark leading-relaxed">
                  立地・稼働・OTA掲載まで分析し、<span className="font-bold text-switch-teal-deep">詳細レポート</span>を担当者が次営業日中にメールでお送ります。
                  <span className="text-switch-gray-mid">無理な勧誘は致しません。</span>
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                onApply({
                  currentFeeRate: feePct / 100,
                  monthlyRevenue: monthlyRev,
                  pastYears,
                  futureYears,
                })
              }
              className="group w-full flex items-center justify-center bg-switch-accent text-white font-bold text-sm sm:text-base py-3.5 rounded-md hover:bg-switch-accent-hover transition-all shadow-sm min-h-[44px]"
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
            </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  valueText,
  children,
}: {
  label: string;
  valueText?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <label htmlFor={id} className="text-xs sm:text-sm font-bold text-switch-charcoal">
          {label}
        </label>
        {valueText && (
          <span className="text-xs sm:text-sm font-bold text-switch-teal-deep tabular-nums leading-tight whitespace-nowrap">
            {valueText}
          </span>
        )}
      </div>
      {children(id)}
    </div>
  );
}

function Slider({
  id,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  minLabel,
  maxLabel,
  format,
  valueTextUnit,
}: {
  id?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  minLabel: string;
  maxLabel: string;
  format?: (v: number) => string;
  valueTextUnit?: string;
}) {
  const spoken = valueTextUnit ?? unit;
  return (
    <>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${format ? format(value) : value}${spoken}`}
        className="w-full h-1.5 bg-switch-gray-light rounded-lg appearance-none cursor-pointer accent-switch-teal"
      />
      <div className="flex justify-between text-[11px] sm:text-[10px] text-switch-gray-mid mt-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </>
  );
}
