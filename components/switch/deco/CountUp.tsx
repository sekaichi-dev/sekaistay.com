"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  target: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  className?: string;
  /**
   * true なら画面に入った時点で発火（IntersectionObserver）。
   * false なら props.target が変わるたびに現在値から再カウント。
   */
  observeOnce?: boolean;
  /**
   * 初期表示値。observeOnce=true時のみ有効。
   * 指定すると「0 → target」ではなく「initialValue → target」でカウントアップ。
   * ファーストビューで目立つ数字を0から始めて違和感を与えないために使う。
   */
  initialValue?: number;
};

/**
 * 数値カウントアップ。
 * observeOnce=true: 入場時に1回だけカウント
 * observeOnce=false: target変化ごとに再カウント（Simulatorの即時反映用）
 */
export default function CountUp({
  target,
  duration = 1200,
  prefix = "",
  suffix = "",
  className = "",
  observeOnce = true,
  initialValue,
}: Props) {
  const [value, setValue] = useState(
    observeOnce ? (initialValue ?? 0) : target,
  );
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const prevTarget = useRef(target);

  // 再カウントモード
  useEffect(() => {
    if (observeOnce) return;
    const from = prevTarget.current;
    prevTarget.current = target;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, observeOnce]);

  // 入場時1回モード
  useEffect(() => {
    if (!observeOnce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const from = initialValue ?? 0;
          let raf = 0;
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(from + (target - from) * eased));
            if (t < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
          return () => cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, observeOnce, initialValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("ja-JP")}
      {suffix}
    </span>
  );
}
