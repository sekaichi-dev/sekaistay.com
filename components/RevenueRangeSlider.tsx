"use client";

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
  // 両つまみが端で重なったとき、動かせる側を前面に出す
  const lowOnTop = low >= max - step;

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
          onChange={(e) => onChange(Math.min(parseInt(e.target.value, 10), high), high)}
          className="dual-range"
          style={{ zIndex: lowOnTop ? 3 : 2 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          aria-label={highLabel}
          aria-valuetext={format(high)}
          onChange={(e) => onChange(low, Math.max(parseInt(e.target.value, 10), low))}
          className="dual-range"
          style={{ zIndex: lowOnTop ? 2 : 3 }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-mid-gray">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
