"use client";

import { useRef } from "react";

/* オフピーク〜ピークの月売上を 1 本のスライダー（つまみ 2 つ）で選ぶ。
 * つまみ同士は追い越せない（下 ≤ 上）。/contact と LP のフォームで共用。 */

type Props = {
  min: number;
  max: number;
  step: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  format: (v: number) => string;
  lowLabel?: string;
  highLabel?: string;
};

export function RevenueRangeSlider({ min, max, step, low, high, onChange, format, lowLabel = "オフピーク月", highLabel = "ピーク月" }: Props) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  // 上側の input を常に前面に置く。つまみが重なっているときは、ドラッグした方向にある側
  // （左へ動かせば下限・右へ動かせば上限）を動かし、指を離すまでその側を動かし続ける。
  // 相手を追い越したら押して動かす。キーボードは自分のつまみだけ動かす（相手で止まる）。
  const driving = useRef<"low" | "high" | null>(null);
  const viaKeyboard = useRef(false);
  const startPointer = () => { driving.current = null; viaKeyboard.current = false; };
  const startKey = () => { driving.current = null; viaKeyboard.current = true; };
  const endPointer = () => { driving.current = null; };
  const handleLow = (v: number) => {
    if (viaKeyboard.current) return onChange(Math.min(v, high), high);
    if (driving.current === "high") return onChange(low, Math.max(v, low));
    if (v <= high) { driving.current = "low"; return onChange(v, high); }
    if (low === high) { driving.current = "high"; return onChange(low, v); }
    onChange(high, high);
  };
  const handleHigh = (v: number) => {
    if (viaKeyboard.current) return onChange(low, Math.max(v, low));
    if (driving.current === "low") return onChange(Math.min(v, high), high);
    if (v >= low) { driving.current = "high"; return onChange(low, v); }
    if (low === high) { driving.current = "low"; return onChange(v, high); }
    onChange(low, low);
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sekai-teal">
        <div>
          <span className="block text-[11px] font-semibold text-mid-gray">{lowLabel}</span>
          <span className="text-[22px] font-bold tabular-nums">{format(low)}</span>
        </div>
        <span className="text-[16px] text-mid-gray">〜</span>
        <div className="text-right">
          <span className="block text-[11px] font-semibold text-mid-gray">{highLabel}</span>
          <span className="text-[22px] font-bold tabular-nums">{format(high)}</span>
        </div>
      </div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-rule" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sekai-teal"
          style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          aria-label={lowLabel}
          aria-valuetext={format(low)}
          onPointerDown={startPointer}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onBlur={endPointer}
          onKeyDown={startKey}
          onChange={(e) => handleLow(parseInt(e.target.value, 10))}
          className="dual-range"
          style={{ zIndex: 2 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          aria-label={highLabel}
          aria-valuetext={format(high)}
          onPointerDown={startPointer}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onBlur={endPointer}
          onKeyDown={startKey}
          onChange={(e) => handleHigh(parseInt(e.target.value, 10))}
          className="dual-range"
          style={{ zIndex: 3 }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-mid-gray">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
