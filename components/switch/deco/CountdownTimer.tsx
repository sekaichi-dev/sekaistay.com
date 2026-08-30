"use client";

import { useEffect, useState } from "react";

type Props = {
  /** ms from mount。例：72h なら 72*60*60*1000 */
  durationMs?: number;
  className?: string;
  labelClassName?: string;
};

/**
 * セッション開始時点から durationMs の残り時間を HH:MM:SS で表示。
 * Phase 1 では擬似的なカウントダウン（リロードでリセット）。
 * 本番では SSR された deadline をサーバから受け取る形に差し替える。
 */
export default function CountdownTimer({
  durationMs = 72 * 60 * 60 * 1000,
  className = "",
  labelClassName = "",
}: Props) {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remain, setRemain] = useState(durationMs);

  useEffect(() => {
    // セッション中は同じ deadline を共有（Hero と FinalCTA で差異が出ないように）
    const KEY = "sekai-stay:countdown-deadline";
    let d: number;
    try {
      const stored = sessionStorage.getItem(KEY);
      const parsed = stored ? Number(stored) : NaN;
      if (!Number.isFinite(parsed) || parsed <= Date.now()) {
        d = Date.now() + durationMs;
        sessionStorage.setItem(KEY, String(d));
      } else {
        d = parsed;
      }
    } catch {
      d = Date.now() + durationMs;
    }
    setDeadline(d);
  }, [durationMs]);

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      setRemain(Math.max(0, deadline - Date.now()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const totalSec = Math.floor(remain / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`text-[10px] tracking-widest font-bold uppercase ${labelClassName}`}>
        残り
      </span>
      <span className="font-mono font-bold tabular-nums text-2xl sm:text-3xl">
        {pad(h)}
      </span>
      <span className="text-xs opacity-70">h</span>
      <span className="font-mono font-bold tabular-nums text-2xl sm:text-3xl">
        {pad(m)}
      </span>
      <span className="text-xs opacity-70">m</span>
      <span className="font-mono font-bold tabular-nums text-2xl sm:text-3xl">
        {pad(s)}
      </span>
      <span className="text-xs opacity-70">s</span>
    </div>
  );
}
