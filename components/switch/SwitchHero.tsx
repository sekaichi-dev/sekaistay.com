"use client";

import { useEffect, useState } from "react";
import CountUp from "./deco/CountUp";
import DotPattern from "./deco/DotPattern";


export default function SwitchHero({
  showUrgencyStrip = true,
  ctaMode = "diagnose",
  badgeText = "他社で運営中のオーナー様へ",
  showBadge = true,
  showCta = true,
}: {
  showUrgencyStrip?: boolean;
  ctaMode?: "diagnose" | "meeting" | "home";
  badgeText?: string;
  showBadge?: boolean;
  showCta?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  const ctaConfig = ctaMode === "home"
    ? {
        href: "/audit",
        target: undefined,
        rel: undefined,
        label: "無料で物件診断を受ける",
        bridgeCopy: (
          <>
            入力3分・無料・営業連絡なし
          </>
        ),
        dataCta: "audit",
        dataCtaLabel: "home-hero",
      }
    : ctaMode === "meeting"
    ? {
        href: "#contact-form",
        target: undefined,
        rel: undefined,
        label: "無料面談はこちら",
        bridgeCopy: (
          <>
            専門チームが、丁寧にお話を伺います。
          </>
        ),
        dataCta: "contact-form",
        dataCtaLabel: "switch-short-hero",
      }
    : {
        href: "#simulator",
        target: undefined,
        rel: undefined,
        label: "まずは10秒で損失額を診断する",
        bridgeCopy: (
          <>
            まずは今の代行で
            <span className="font-bold text-white">"いくら損しているか"</span>
            を診断
          </>
        ),
        dataCta: "simulator",
        dataCtaLabel: "switch-hero",
      };

  return (
    <section className="relative">
      {/* Top strip — 黒ベース + 究極のプレミアム感 */}
      {showUrgencyStrip && <div className="bg-gradient-to-r from-black via-[#1a1a1a] to-black text-white py-2.5 sm:py-3 px-3 sm:px-4 relative overflow-hidden border-b border-white/10">
        {/* ゴールドのアクセント光 */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.08),transparent_60%)] pointer-events-none"
          aria-hidden
        />
        <p className="relative flex items-center justify-center flex-wrap gap-x-2 gap-y-1 sm:gap-x-3 text-[11px] sm:text-base font-bold tracking-wide">
          <span className="inline-flex items-center gap-1 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 rounded-sm shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.4)] whitespace-nowrap">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            限定
          </span>
          <span className="text-white whitespace-nowrap">先着10オーナー</span>
          <span className="hidden sm:inline text-white/40">／</span>
          <span className="inline-flex items-center gap-1 text-white/90 whitespace-nowrap">
            初期費用
            <span className="text-white/40 line-through decoration-[1.5px]">¥10万円</span>
            <span aria-hidden className="text-white/50">→</span>
            <span className="text-yellow-400 font-bold text-[15px] sm:text-lg tracking-wider">¥0</span>
            <span className="text-[9px] sm:text-[10px] text-white/45 font-normal tracking-normal ml-0.5">※運用中の物件</span>
          </span>
          <span className="hidden sm:inline text-white/40">／</span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-[11px] sm:text-xs text-white/90">〆切 <span className="text-yellow-400 font-bold tracking-wider">5/31</span></span>
          </span>
        </p>
      </div>}

      <div className="bg-switch-charcoal text-white relative overflow-hidden">
        {/* Ambient teal glow */}
        <div className="absolute top-[-10%] right-[-20%] w-[70%] h-[70%] bg-switch-teal-bright/18 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[55%] h-[60%] bg-switch-teal/12 blur-[140px] rounded-full pointer-events-none" />
        <DotPattern opacity={0.04} />

        <div className="relative max-w-6xl mx-auto px-6 py-5 sm:py-8 lg:py-6 min-h-[calc(100svh-100px)] lg:min-h-[calc(100vh-100px)] flex items-center">
          <div
            className={`w-full transition-all duration-1000 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-10 items-center">
              {/* 左カラム: コピー */}
              <div className="text-center lg:text-left">
                {/* ターゲット宣言バッジ — 乗り換えLPの自分事化 */}
                {showBadge && (
                <div className="inline-flex items-center gap-2 bg-white/8 border border-switch-teal-bright/40 rounded-full px-3 py-1 mb-3 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-switch-teal-bright rounded-full" aria-hidden />
                  <span className="text-[12px] sm:text-xs font-bold tracking-wider text-switch-teal-bright">
                    {badgeText}
                  </span>
                </div>
                )}

                {/* H1 — モバイル: 1行「民泊運用のぜんぶを」/ sm+: 2行「民泊運用の / ぜんぶを、」 */}
                <h1 className="font-bold leading-[1.2] mb-3 sm:mb-4 tracking-tight">
                  {/* モバイル（〜640px）: 1行表示 */}
                  <span className="block sm:hidden text-[34px] whitespace-nowrap">
                    <span className="text-white font-bold">民泊運用</span>
                    <span className="text-white">の</span>
                    <span className="gradient-highlight-box">ぜんぶ</span>
                    <span className="text-white">を</span>
                  </span>
                  {/* sm+: 2行表示（既存デザイン） */}
                  <span className="hidden sm:block text-[44px] lg:text-[52px]">
                    <span className="text-white font-bold">民泊運用</span>
                    <span className="text-white">の</span>
                  </span>
                  <span className="hidden sm:block text-[44px] lg:text-[52px] mt-1.5">
                    <span className="gradient-highlight-box">ぜんぶ</span>
                    <span className="text-white">を、</span>
                  </span>
                </h1>

                {/* 8% ブロック */}
                <div className="mb-4 sm:mb-5 relative">
                  {/* 背景グロー（コンパクトで文字の直下のみ） */}
                  <div
                    className="absolute left-1/2 lg:left-[20%] top-[30%] -translate-x-1/2 lg:translate-x-0 w-[180px] h-[140px] bg-switch-teal-bright/15 blur-[70px] rounded-full pointer-events-none"
                    aria-hidden
                  />
                  <div className="relative flex items-end justify-center lg:justify-start gap-2 mb-1 overflow-visible">
                    <span className="inline-flex items-center bg-white/5 px-2.5 py-1 rounded-full sm:bg-transparent sm:px-0 sm:py-0 text-lg sm:text-xl lg:text-2xl font-bold text-white/80 tracking-wider leading-none">
                      手数料
                    </span>
                    <CountUp
                      target={8}
                      initialValue={8}
                      className="gradient-text-mega text-[5.5rem] sm:text-[8.5rem] lg:text-[10rem] font-bold leading-none tabular-nums pr-1"
                    />
                    <span className="gradient-text-mega text-6xl sm:text-8xl lg:text-[7.5rem] font-bold leading-none">
                      %
                    </span>
                  </div>
                  <p className="relative text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-white leading-[1.25] whitespace-normal sm:whitespace-nowrap mt-1">
                    で、
                    <span className="gradient-highlight-box">まるっと</span>
                    <span className="whitespace-nowrap">お任せ。</span>
                  </p>
                  <p className="relative text-[13px] sm:text-[15px] text-white/90 mt-2.5 tracking-wide font-semibold">
                    <span className="text-white">＋ ¥10,000</span>
                    <span className="text-white/60 text-[11px] sm:text-xs mx-1">/ 物件 / 月</span>
                  </p>
                </div>

                {/* CTA */}
                {showCta && (
                <div className="flex flex-col lg:items-start items-center mb-2 sm:mb-3">
                  <a
                    href={ctaConfig.href}
                    target={ctaConfig.target}
                    rel={ctaConfig.rel}
                    data-cta={ctaConfig.dataCta}
                    data-cta-label={ctaConfig.dataCtaLabel}
                    className="group w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap bg-switch-accent text-white font-bold text-[15px] sm:text-lg px-4 sm:px-10 py-3.5 sm:py-4 rounded-md hover:bg-switch-accent-hover transition-all shadow-sm hover:-translate-y-0.5 min-h-[48px]"
                  >
                    {ctaConfig.label}
                    <svg
                      className="ml-2.5 w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {ctaMode !== "diagnose" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      )}
                    </svg>
                  </a>
                  {/* CTA 直下のブリッジコピー */}
                  <p className="text-[13px] sm:text-sm text-white/85 mt-3 sm:mt-3.5 mb-2 sm:mb-3 text-center lg:text-left leading-relaxed">
                    {ctaConfig.bridgeCopy}
                  </p>
                </div>
                )}

              </div>

              {/* 右カラム: iPhoneモックアップ + 全国物件データ集約ビジュアル */}
              <div className="flex flex-col items-center w-full">
                {/* iPhone + 物件カードエリア */}
                <div className="relative flex justify-center items-center w-full min-h-[320px] sm:min-h-[440px] lg:min-h-[480px]">
                  {/* グロー */}
                  <div
                    className="absolute inset-0 bg-switch-teal-bright/22 blur-[110px] rounded-full scale-90 pointer-events-none"
                    aria-hidden
                  />

                {/* 物件カード → iPhone へのフロー線 */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 600 600"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#54bec3" stopOpacity="0" />
                      <stop offset="50%" stopColor="#54bec3" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#54bec3" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 90 120 Q 220 220 300 300" stroke="url(#flowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                    <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3s" repeatCount="indefinite" />
                  </path>
                  <path d="M 510 115 Q 380 215 310 300" stroke="url(#flowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                    <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M 80 455 Q 220 400 295 340" stroke="url(#flowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                    <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="4s" repeatCount="indefinite" />
                  </path>
                  <path d="M 520 475 Q 400 410 325 340" stroke="url(#flowLine)" strokeWidth="1.3" fill="none" strokeDasharray="3 6">
                    <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="3.2s" repeatCount="indefinite" />
                  </path>
                </svg>

                {/* iPhoneモックアップ（さらに拡大） */}
                <img
                  src="/images/switch/dashboard-mockup.png?v=v4"
                  alt="SEKAI STAY オーナーポータル ダッシュボード"
                  className="relative w-[82%] max-w-[320px] sm:max-w-md lg:max-w-[600px] select-none pointer-events-none drop-shadow-2xl z-10"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 78% 88% at center, #000 60%, transparent 99%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 78% 88% at center, #000 60%, transparent 99%)",
                  }}
                />

                {/* 物件カード（集約元）— 全て物件の外観 or リビングに固定 */}
                <PropertyChip
                  className="absolute top-2 left-0 lg:top-6 lg:left-[-2%] z-20"
                  imageUrl="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=360&h=260&fit=crop&q=80&auto=format"
                  location="北海道"
                  category="一棟"
                />
                <PropertyChip
                  className="absolute top-4 right-0 lg:top-10 lg:right-[-2%] z-20"
                  imageUrl="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=360&h=260&fit=crop&q=80&auto=format"
                  location="東京"
                  category="マンション"
                />
                <PropertyChip
                  className="absolute bottom-12 left-0 lg:bottom-20 lg:left-[-4%] z-20"
                  imageUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=360&h=260&fit=crop&q=80&auto=format"
                  location="名古屋"
                  category="マンション"
                />
                <PropertyChip
                  className="absolute bottom-14 right-0 lg:bottom-16 lg:right-[-4%] z-20"
                  imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=360&h=260&fit=crop&q=80&auto=format"
                  location="沖縄"
                  category="ヴィラ"
                />

                </div>

                {/* 右カラム意図のキャプション — 日本初バッジ付き（2行レイアウト） */}
                <div className="-mt-1.5 sm:-mt-4 lg:-mt-6 flex flex-col items-center gap-1.5 sm:gap-2 relative z-20">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-sm shadow-[0_0_14px_rgba(251,191,36,0.4)] tracking-[0.15em]">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    日本初
                  </span>
                  <p className="text-[11px] sm:text-sm text-white/80 tracking-wide font-semibold leading-relaxed text-center">
                    <span className="block">あなたの物件を、<span className="text-switch-teal-bright">リアルタイム</span>でみえる「専用ダッシュボード」で、</span>
                    <span className="block">透明性の高い民泊運用を</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 実績ミニバッジ — 3数値 + ライセンス に整理 */}
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-white/10">
              <TrustMetric value="97" unit="%" label="継続率" />
              <TrustDivider />
              <TrustMetric value="4.8" unit="/5" label="満足度" />
              <TrustDivider />
              <TrustMetric value="61" unit="%" label="稼働率" />
              <TrustDivider />
              <span className="text-[11px] text-white/75 font-bold tracking-wide">
                住宅宿泊管理業 <span className="text-switch-teal-bright">第F05780号</span>
              </span>
            </div>
            <p className="text-[10px] text-white/50 text-center mt-2 leading-normal">
              ※ 2026年4月時点 ｜ 継続6ヶ月以上の平均
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 実績ミニバッジの1項目 */
function TrustMetric({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg sm:text-xl font-bold text-switch-teal-bright tabular-nums tracking-tight">
        {value}
      </span>
      <span className="text-[11px] text-white/65 font-medium">
        {unit} {label}
      </span>
    </div>
  );
}

function TrustDivider() {
  return <div className="w-px h-4 bg-white/15" aria-hidden />;
}

/** iPhone周辺に浮かぶ物件カード（画像 ＋ 上に場所・カテゴリーのみ） */
function PropertyChip({
  className = "",
  imageUrl,
  location,
  category,
}: {
  className?: string;
  imageUrl: string;
  location: string;
  category: string;
}) {
  return (
    <div
      className={`w-[82px] h-[58px] sm:w-[150px] sm:h-[108px] lg:w-[180px] lg:h-[128px] rounded-md overflow-hidden shadow-md border border-white/30 ${className}`}
    >
      <img
        src={imageUrl}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover select-none"
      />
      {/* 上部にグラデーションオーバーレイでラベルを読みやすく */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 text-white">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wide leading-none">
          {location}
        </span>
        <span className="w-px h-2.5 bg-white/50" />
        <span className="text-[10px] sm:text-[11px] font-medium tracking-wide leading-none opacity-90">
          {category}
        </span>
      </div>
    </div>
  );
}
