"use client";

/* コテコテ版 Hero — control の装飾密度を3段アップ。
 * A/Bテスト次元: 情報量・煽り・複数CTA・装飾多重化。
 * 配色は既存ブランドトークン (charcoal / teal / yellow / switch-accent) のみ使用 (赤系不使用)。
 */

import { useEffect, useState } from "react";
import CountUp from "./deco/CountUp";
import DotPattern from "./deco/DotPattern";

export default function SwitchHeroKotekote() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  return (
    <section className="relative">
      <KotekoteTopStrip />
      <UrgencyRibbon />

      <div className="bg-switch-charcoal text-white relative overflow-hidden">
        <div className="absolute top-[-15%] right-[-25%] w-[80%] h-[75%] bg-switch-teal-bright/22 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[65%] bg-switch-teal/16 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[35%] left-[40%] w-[40%] h-[40%] bg-yellow-400/8 blur-[120px] rounded-full pointer-events-none" />
        <DotPattern opacity={0.06} />

        <div className="relative max-w-7xl mx-auto px-6 py-6 sm:py-8 min-h-[calc(100svh-160px)] lg:min-h-[calc(100vh-160px)] flex items-center">
          <div
            className={`w-full transition-all duration-1000 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* バッジ列 — 4つ横並びでコテコテ感 */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
              <BadgeYellow icon="⚡">2026年4月 宿泊税改正対応</BadgeYellow>
              <BadgeOutline>住宅宿泊管理業 第F05780号</BadgeOutline>
              <BadgeOutline>東京都認可</BadgeOutline>
              <BadgeAccent>無料診断 申込3,000+件</BadgeAccent>
            </div>

            <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 items-start">
              {/* 左カラム: コピー */}
              <div className="text-center lg:text-left">
                <h1 className="font-bold leading-[1.18] mb-3 sm:mb-4 tracking-tight">
                  <span className="block text-[34px] sm:text-[44px] lg:text-[52px]">
                    <span className="gradient-highlight-box">民泊運用</span>
                    <span className="text-white">の</span>
                  </span>
                  <span className="block text-[34px] sm:text-[44px] lg:text-[52px] mt-1.5">
                    <span className="gradient-highlight-box">ぜんぶ</span>
                    <span className="text-white">を、</span>
                  </span>
                </h1>

                <div className="mb-4 sm:mb-5 relative">
                  <div className="absolute left-1/2 lg:left-[20%] top-[30%] -translate-x-1/2 lg:translate-x-0 w-[220px] h-[180px] bg-switch-teal-bright/22 blur-[80px] rounded-full pointer-events-none" aria-hidden />
                  <div className="relative flex items-end justify-center lg:justify-start gap-2 mb-1 overflow-visible">
                    <span className="inline-flex items-center bg-white/5 px-2.5 py-1 rounded-full sm:bg-transparent sm:px-0 sm:py-0 text-lg sm:text-xl lg:text-2xl font-bold text-white/80 tracking-wider leading-none">
                      手数料
                    </span>
                    <CountUp
                      target={8}
                      initialValue={8}
                      className="gradient-text-mega text-[5.5rem] sm:text-[8.5rem] lg:text-[10rem] font-bold leading-none tabular-nums pr-1"
                    />
                    <span className="gradient-text-mega text-6xl sm:text-8xl lg:text-[7.5rem] font-bold leading-none">%</span>
                  </div>
                  <p className="relative text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-white leading-[1.25] mt-1">
                    で、<span className="gradient-highlight-box">まるっと</span>お任せ。
                  </p>
                  <p className="relative text-[13px] sm:text-[15px] text-white/90 mt-2.5 tracking-wide font-semibold">
                    <span className="text-white">＋ ¥10,000</span>
                    <span className="text-white/60 text-[11px] sm:text-xs mx-1">/ 部屋 / 月</span>
                  </p>
                </div>

                {/* チェックリスト — コテコテ要素 */}
                <ul className="space-y-1.5 mb-5 mx-auto lg:mx-0 max-w-md">
                  <Check>OTA一括連携 ・ Airbnb / Booking / Vrbo / 一休 / 楽天</Check>
                  <Check>ダイナミックプライシング ・ 日次価格自動最適化</Check>
                  <Check>多言語ゲスト対応 ・ 即レス対応 24/7</Check>
                  <Check>清掃 / リネン / 消耗品 ・ 全国手配ネットワーク</Check>
                  <Check>専用ダッシュボード ・ リアルタイムKPI可視化</Check>
                </ul>

                {/* 2ボタン CTA */}
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <a
                    href="#simulator"
                    className="group flex-1 inline-flex items-center justify-center whitespace-nowrap bg-switch-accent text-white font-bold text-[15px] sm:text-base px-4 py-3.5 rounded-md hover:bg-switch-accent-hover transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5 min-h-[48px]"
                  >
                    🔥 10秒で年間損失額を診断
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </a>
                  <a
                    href="#contact-form"
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap bg-white/10 hover:bg-white/15 backdrop-blur-sm border-2 border-yellow-400/40 hover:border-yellow-400/70 text-yellow-400 font-bold text-[14px] sm:text-[15px] px-4 py-3.5 rounded-md transition-all min-h-[48px]"
                  >
                    📝 直接相談する
                  </a>
                </div>

                <p className="text-[12px] sm:text-sm text-white/85 mt-3 leading-relaxed">
                  <span className="inline-flex items-center gap-1.5 mr-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-yellow-400 font-bold">3,000+</span>
                  </span>
                  オーナーが既に診断 ・ 平均
                  <span className="font-bold text-white">¥744,000</span>
                  の年間削減見込み
                </p>
              </div>

              {/* 右カラム: iPhone mockup + Comparison **両方** 配置 */}
              <div className="flex flex-col gap-5">
                {/* iPhone mockup（control 同等） */}
                <div className="relative w-full">
                  <div className="absolute inset-0 bg-switch-teal-bright/15 blur-[80px] rounded-full scale-90 pointer-events-none" aria-hidden />
                  <img
                    src="/images/switch/dashboard-mockup.png?v=v4"
                    alt="SEKAI STAY オーナーポータル"
                    className="relative w-full max-w-[340px] mx-auto select-none pointer-events-none drop-shadow-2xl"
                    style={{
                      maskImage: "radial-gradient(ellipse 78% 88% at center, #000 60%, transparent 99%)",
                      WebkitMaskImage: "radial-gradient(ellipse 78% 88% at center, #000 60%, transparent 99%)",
                    }}
                  />
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-[0_0_14px_rgba(251,191,36,0.4)]">
                    日本初
                  </span>
                </div>

                {/* Comparison ミニ表 */}
                <KotekoteComparisonCard />
              </div>
            </div>

            {/* Trust metrics — 6数値 + license */}
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 pt-5 mt-5 border-t border-white/10">
              <BigMetric value="97" unit="%" label="継続率" />
              <Divider />
              <BigMetric value="4.8" unit="/5" label="満足度" />
              <Divider />
              <BigMetric value="61" unit="%" label="稼働率" />
              <Divider />
              <BigMetric value="200" unit="+" label="物件管理" />
              <Divider />
              <BigMetric value="¥1.4億" unit="" label="累計削減" />
              <Divider />
              <BigMetric value="24" unit="h" label="即レス" />
            </div>
            <p className="text-[10px] text-white/50 text-center mt-2 leading-normal">
              ※ 2026年4月時点 ｜ 継続6ヶ月以上の平均 ｜ 累計削減はオーナー全員の年間差額試算合計
            </p>
          </div>
        </div>
      </div>

      {/* サイドフローティングオファー（PC のみ）*/}
      <SideFloatingOffer />
    </section>
  );
}

/* ─────── Top strip + countdown ─────── */
function KotekoteTopStrip() {
  return (
    <div className="bg-gradient-to-r from-black via-[#0a0a0a] to-black text-white py-3 px-3 sm:px-4 relative overflow-hidden border-b border-yellow-400/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.12),transparent_60%)] pointer-events-none" aria-hidden />
      <div className="relative flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-base font-bold tracking-wide">
        <span className="inline-flex items-center gap-1 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-sm shrink-0 shadow-[0_0_14px_rgba(251,191,36,0.5)] whitespace-nowrap animate-pulse">
          🎯 5月限定
        </span>
        <span className="text-white whitespace-nowrap">先着10オーナー</span>
        <span className="hidden sm:inline text-white/40">／</span>
        <span className="inline-flex items-center gap-1 text-white/90 whitespace-nowrap">
          初期費用
          <span className="text-white/40 line-through decoration-[1.5px]">¥10万円</span>
          <span aria-hidden className="text-white/50">→</span>
          <span className="text-yellow-400 font-bold text-[15px] sm:text-lg tracking-wider">¥0</span>
        </span>
        <span className="hidden sm:inline text-white/40">／</span>
        <CountdownClock />
      </div>
    </div>
  );
}

/* ─────── 2段目のリボン: 緊急性追加 ─────── */
function UrgencyRibbon() {
  return (
    <div className="bg-switch-accent text-white py-2 px-3 text-center text-[11px] sm:text-[12px] font-bold tracking-wide">
      <span className="inline-flex items-center gap-2">
        <span>📢</span>
        2026年4月 宿泊税改正で利益率がさらに圧迫される今こそ、運用代行の見直しを
        <span className="hidden sm:inline">→ 無料診断はこちら</span>
      </span>
    </div>
  );
}

function CountdownClock() {
  const [parts, setParts] = useState({ d: "--", h: "--", m: "--", s: "--" });
  useEffect(() => {
    const target = new Date("2026-05-31T23:59:59+09:00").getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setParts({
        d: String(Math.floor(diff / 86_400_000)).padStart(2, "0"),
        h: String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60_000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-md px-2 py-0.5 whitespace-nowrap">
      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      <span className="text-[10px] sm:text-[11px] text-white/70">〆切まで</span>
      <span className="font-mono tabular-nums text-yellow-400 text-[12px] sm:text-[13px] font-bold tracking-wider">
        {parts.d}<span className="text-white/40 mx-0.5">日</span>
        {parts.h}:{parts.m}:{parts.s}
      </span>
    </span>
  );
}

/* ─────── Hero 内 Comparison ミニ表 ─────── */
function KotekoteComparisonCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-switch-teal-bright/15 blur-[80px] rounded-3xl pointer-events-none" aria-hidden />
      <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold text-yellow-400 tracking-[0.2em] uppercase">他社 vs SEKAI STAY</p>
          <span className="text-[10px] text-white/40">月売上¥80万 / 1部屋</span>
        </div>
        <table className="w-full text-[12px] sm:text-[13px]">
          <tbody className="divide-y divide-white/8">
            <Row label="代行手数料" left="20%" right="8%" highlight />
            <Row label="月固定費" left="¥30,000" right="¥10,000" />
            <Row label="価格最適化" left="手動 / 月1更新" right="日次自動" />
            <Row label="夜間対応" left="翌営業日" right="即レス" />
            <Row label="オーナーレポート" left="月次PDF" right="リアルタイム" />
          </tbody>
        </table>
        <div className="mt-5 pt-4 border-t border-yellow-400/30 bg-yellow-400/5 -mx-5 px-5 rounded-b-2xl">
          <p className="text-[11px] text-white/65 mb-1 font-medium">この物件での年間差額</p>
          <div className="flex items-baseline gap-2">
            <span className="gradient-text-mega text-[36px] sm:text-[44px] font-bold leading-none tabular-nums">+¥744,000</span>
            <span className="text-[12px] text-white/55">/ 年</span>
          </div>
          <p className="text-[11px] text-white/45 mt-1.5">
            ※ 1部屋・5部屋運営なら<span className="text-yellow-400 font-bold">+¥3,720,000/年</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────── サイドフローティングオファー（PC のみ） ─────── */
function SideFloatingOffer() {
  return (
    <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 z-30">
      <a
        href="#contact-form"
        className="group block bg-yellow-400 text-black font-bold rounded-2xl shadow-2xl p-4 max-w-[180px] hover:scale-105 transition-transform border-2 border-yellow-300"
      >
        <p className="text-[10px] tracking-[0.15em] uppercase mb-1 opacity-70">5月限定オファー</p>
        <p className="text-[13px] leading-tight mb-2">初期費用<br /><span className="text-2xl">¥0</span></p>
        <p className="text-[10px] opacity-80 mb-2">通常 ¥100,000</p>
        <span className="inline-flex items-center gap-1 text-[11px] underline group-hover:gap-2 transition-all">
          詳細を見る →
        </span>
      </a>
    </div>
  );
}

/* ─────── Building blocks ─────── */
function Row({ label, left, right, highlight }: { label: string; left: string; right: string; highlight?: boolean }) {
  return (
    <tr>
      <td className="py-2 text-white/85 font-medium">{label}</td>
      <td className="py-2 text-right text-white/55 line-through decoration-white/30">{left}</td>
      <td className={`py-2 text-right font-bold ${highlight ? "text-yellow-400 text-[15px] sm:text-base" : "text-switch-teal-bright"}`}>
        {right}
      </td>
    </tr>
  );
}

function BigMetric({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg sm:text-xl font-bold text-switch-teal-bright tabular-nums tracking-tight">{value}</span>
      <span className="text-[11px] text-white/65 font-medium">{unit && `${unit} `}{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-white/15" aria-hidden />;
}

function BadgeYellow({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-400 text-black text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[0_4px_12px_rgba(251,191,36,0.3)]">
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

function BadgeOutline({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 border border-white/30 text-white/85 text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full">
      {children}
    </span>
  );
}

function BadgeAccent({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-switch-accent/20 border border-switch-accent/40 text-switch-accent text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full">
      {children}
    </span>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[12px] sm:text-[13px] text-white/85 text-left">
      <svg className="w-4 h-4 mt-0.5 text-switch-teal-bright flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
