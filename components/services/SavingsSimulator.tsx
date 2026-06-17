"use client";

import { useId, useMemo, useState } from "react";

/**
 * 節約額シミュレーター（前向き・節約額ベース）。
 * 計算ロジックは components/switch/SwitchSimulator.tsx を流用（節約側のみ）。
 * 入力: 月商 / 現状の手数料率 / 今後の運用年数。出力: 年間節約額・累計節約額＋手数料バー比較。
 * 色はティール/インクのみ（赤・オレンジ不使用）。
 */
const SEKAI_FEE = 8; // %
const SEKAI_FIXED_MAN = 12; // 万円/年（¥10,000 × 12ヶ月）

export default function SavingsSimulator() {
  const [monthlyRev, setMonthlyRev] = useState(60); // 万円
  const [feePct, setFeePct] = useState(20); // %
  const [futureYears, setFutureYears] = useState(5); // 年

  const r = useMemo(() => {
    const annualRev = monthlyRev * 12;
    const otherFee = annualRev * (feePct / 100);
    const sekaiCost = annualRev * (SEKAI_FEE / 100) + SEKAI_FIXED_MAN;
    const annualSaving = Math.max(0, Math.round(otherFee - sekaiCost));
    const totalSaving = annualSaving * futureYears;
    const max = Math.max(otherFee, sekaiCost, 1);
    return {
      annualSaving,
      totalSaving,
      otherFee: Math.round(otherFee),
      sekaiCost: Math.round(sekaiCost),
      otherPct: Math.round((otherFee / max) * 100),
      sekaiPct: Math.round((sekaiCost / max) * 100),
    };
  }, [monthlyRev, feePct, futureYears]);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink/10 ring-1 ring-rule">
      <div className="grid lg:grid-cols-2">
        {/* 入力ボックス（左・明） */}
        <div className="space-y-7 p-7 sm:p-10">
          <Slider label="月間の売上" value={monthlyRev} min={10} max={500} step={5} onChange={setMonthlyRev} fmt={(v) => `${v}万円`} />
          <Slider label="今の手数料率" value={feePct} min={8} max={35} step={1} onChange={setFeePct} fmt={(v) => `${v}%`} />
          <Slider label="今後の運用予定" value={futureYears} min={1} max={20} step={1} onChange={setFutureYears} fmt={(v) => `${v}年`} />
        </div>

        {/* 結果ボックス（右・ダークnavy） */}
        <div className="flex flex-col justify-center bg-navy p-7 text-white sm:p-10">
          <p className="text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-snug text-white">SEKAI STAY に切り替えると</p>
          <p className="mt-2 text-[13px] font-bold text-white">今後{futureYears}年の累計で</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-grotesk text-[clamp(2.75rem,9vw,4.5rem)] font-bold leading-none tracking-tight text-white tabular-nums">+{r.totalSaving}</span>
            <span className="text-[16px] font-bold text-white">万円 おトク</span>
          </p>

          {/* 手数料バー比較 */}
          <div className="mt-7 space-y-4">
            <Bar label="一般的な代行" amount={r.otherFee} pct={r.otherPct} tone="muted" />
            <Bar label="SEKAI STAY" amount={r.sekaiCost} pct={r.sekaiPct} tone="teal" />
          </div>

          <p className="mt-5 text-[11px] leading-[1.7] text-white">
            ※ 年間の手数料（売上に対する手数料率＋固定費）の比較。手数料8%＋物件あたり月額¥10,000で試算。実際の金額は契約条件・物件により異なります。
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt: (v: number) => string;
}) {
  const id = useId();
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[14px] font-bold text-ink">
          {label}
        </label>
        <span className="font-grotesk text-[18px] font-bold tabular-nums text-sekai-teal">{fmt(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={fmt(value)}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-rule accent-sekai-teal"
      />
      <div className="mt-1 flex justify-between text-[10px] text-ink/40">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
    </div>
  );
}

function Bar({ label, amount, pct, tone }: { label: string; amount: number; pct: number; tone: "muted" | "teal" }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[12px]">
        <span className={`font-bold ${tone === "teal" ? "text-white" : "text-white/70"}`}>{label}</span>
        <span className="font-grotesk font-bold tabular-nums text-white">約 {amount}万円/年</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone === "teal" ? "bg-bright-teal" : "bg-white/35"}`}
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>
    </div>
  );
}
