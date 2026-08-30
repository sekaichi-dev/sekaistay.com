"use client";

import { useEffect, useState } from "react";

/**
 * HomeHero — 大胆ミニマルなシネマティック（sense-trust 参考・teal版）
 * 構成: 全面スライドショー ＋ 中央の大スローガン ＋ 下部の全幅巨大ワードマーク ＋ 回転バッジ。
 * 運用情報（8%/CTA/指標）はヒーロー直下の ValueBand に分離。装飾英語は構造ラベルのみ。
 */
const SLIDES = [
  "/images/service-marquee/e2.png",
  "/images/switch/property-villa.jpg",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1920&q=70&auto=format&fit=crop",
];

export default function HomeHero() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    SLIDES.slice(1).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
    const t = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative -mt-[76px] flex h-[100svh] w-full flex-col overflow-hidden bg-black text-white">
      {/* 背景スライドショー */}
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "low"}
          decoding="async"
          className={`hero-drift absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* シネマティックなスクリム（ニュートラルなモノクロ／青みなし） */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/35 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />

      {/* 受賞・手数料エンブレム（ヘッダー直下・右端に横並び） */}
      <div className="absolute right-4 top-[84px] z-20 flex items-start gap-2 sm:right-6 sm:top-[92px] sm:gap-3">
        <img src="/images/switch/badge-fee.png" alt="民泊運用代行 手数料8%＋1万円" className="h-auto w-[84px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] sm:w-[120px]" loading="lazy" />
        <img src="/images/switch/badge-sauna.png" alt="BEST OF SAUNA STAY 2026 No.1" className="h-auto w-[84px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] sm:w-[120px]" loading="lazy" />
      </div>

      {/* 回転バッジ（PLAY MOVIE 位置の動的アクセント） */}
      <div className="absolute right-6 top-1/2 z-20 hidden h-28 w-28 -translate-y-1/2 lg:right-14 lg:block lg:h-36 lg:w-36" aria-hidden>
        <svg className="spin-slow h-full w-full" viewBox="0 0 100 100">
          <defs>
            <path id="hero-badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <text fill="rgba(255,255,255,0.92)" fontSize="7.6" letterSpacing="3.1" style={{ fontFamily: "var(--font-space-mono), monospace" }}>
            <textPath href="#hero-badge-circle">無料収益診断 ● SCROLL ● 無料収益診断 ● SCROLL ●</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="bounce-arrow h-6 w-6 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </span>
      </div>

      {/* スローガン: 下部中央（ワードマークの上）— sense-trust 参考のバランス */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-6 pb-[62vw] text-center sm:pb-[15vw]">
        <h1 className="font-bold leading-[1.1] tracking-[0.03em] text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.45)]">
          <span className="mask-line">
            <span style={{ animationDelay: "0.12s" }} className="inline-flex items-baseline justify-center gap-[0.06em] text-[clamp(1.875rem,5.4vw,3rem)] leading-none">
              民泊運用のすべてを
              <span className="text-[clamp(3.25rem,9vw,5.5rem)] leading-none tracking-[0.01em]">8%</span>
              で
            </span>
          </span>
        </h1>
      </div>

      {/* 下部: 全幅の巨大ワードマーク（タイプ文字・白） */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[1.6vw] z-0 flex justify-center px-[2vw]" aria-hidden>
        <span className="wordmark-in label-giant block text-center text-[26.5vw] leading-[0.82] text-white/95 drop-shadow-[0_6px_50px_rgba(0,0,0,0.4)] sm:whitespace-nowrap sm:text-[16.5vw] sm:leading-[0.78]" style={{ animationDelay: "0.6s" }}>
          SEKAI STAY
        </span>
      </div>

      {/* スクロール誘導（モバイル） */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 lg:hidden" aria-hidden>
        <svg className="bounce-arrow h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
