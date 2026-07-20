"use client";

import { useEffect, useRef, useState } from "react";

/**
 * OUR BUSINESS スライダー（sense-trust 挙動を踏襲）。
 * 入ってくる画像が右からワイプイン。直前の画像は背面で全面表示のまま残すため、
 * 左側に背景色が出ない（参考サイトと同じ挙動）。コピーは固定。
 */
const SLIDES = [
  { img: "/images/service-marquee/e1.png" },
  { img: "/images/service-marquee/e3.png" },
  { img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1400&q=70&auto=format&fit=crop" },
];

export default function BusinessSlider() {
  const [active, setActive] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setActive((p) => {
        prevRef.current = p;
        return (p + 1) % SLIDES.length;
      });
    }, 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-[0.8125rem] bg-navy-deep" style={{ aspectRatio: "1400 / 900" }}>
      {SLIDES.map((s, i) => {
        const isActive = i === active;
        const isPrev = i === prevRef.current && !isActive;
        return (
          <div
            key={isActive ? `active-${active}` : `s-${i}`}
            className="absolute inset-0"
            style={{
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              opacity: isActive || isPrev ? 1 : 0,
              animation: isActive ? "biz-wipe 1s cubic-bezier(0.65,0,0.35,1) both" : undefined,
            }}
          >
            <img src={s.img} alt="" aria-hidden loading={i === 0 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        );
      })}

      <div className="absolute right-[7%] top-[11%] z-10 text-right text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
        <span className="label-giant block text-[12px] leading-[1.4] tracking-[0.1em] text-white/80">
          Vacation
          <br />
          rental
          <br />
          service
        </span>
        <h3 className="mt-3 text-[clamp(1rem,2.1vw,1.625rem)] font-bold leading-[1.5]">
          「適正な価格設計」と「運営の透明化」で
          <br />
          物件の観光資産としての価値を最大化
        </h3>
      </div>
    </div>
  );
}
