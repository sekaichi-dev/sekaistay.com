"use client";

/* シンプル版 Hero — control の対極：明るい ivory/bone 背景のエディトリアル・ラグジュアリー。
 * A/Bテスト次元: トーン（dark vs light）、密度（高 vs 低）、雰囲気（営業 vs 静謐）。
 * 配色は既存ブランドトークン (ivory / bone / paper / rule / ink / sekai-teal / deep-teal) のみ使用。
 */

import { useEffect, useState } from "react";

export default function SwitchHeroSimple() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  return (
    <section className="relative bg-ivory overflow-hidden">
      {/* 細い罫線フレーム — エディトリアルな額装感 */}
      <div className="absolute top-6 left-6 right-6 h-px bg-rule opacity-50" aria-hidden />
      <div className="absolute bottom-6 left-6 right-6 h-px bg-rule opacity-50" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32 lg:py-36 min-h-[calc(100svh-80px)] flex items-center">
        <div
          className={`w-full transition-all duration-[1200ms] ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* キッカー — 全角スペースで雰囲気作り */}
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] tracking-[0.4em] text-deep-teal/70 font-medium uppercase mb-1.5">
              Sekai Stay　／　Hospitality Operating
            </p>
            <div className="inline-block w-12 h-px bg-deep-teal/40" />
          </div>

          {/* H1 — エディトリアル・タイポグラフィ。中央寄せ・余白広め */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="font-bold leading-[1.18] tracking-[-0.02em] text-ink mb-8">
              <span className="block text-[36px] sm:text-[56px] lg:text-[72px]">民泊運用は、</span>
              <span className="block text-[36px] sm:text-[56px] lg:text-[72px] mt-1">
                <span className="font-serif italic font-normal text-deep-teal">8</span>
                <span className="font-serif italic font-normal text-deep-teal text-[28px] sm:text-[42px] lg:text-[54px] align-baseline">%</span>
                <span> へ。</span>
              </span>
            </h1>
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-ink/70 leading-[2] tracking-wide max-w-xl mx-auto">
              業界平均15-25%の運用代行手数料を、上限8% + 月1万円/部屋へ。
              <br className="hidden sm:block" />
              余分な機能を持たず、本質的な収益最大化だけに集中する。
            </p>
          </div>

          {/* CTA — 上品な単一ボタン + リンク */}
          <div className="flex flex-col items-center gap-4 mb-16 sm:mb-20">
            <a
              href="#simulator"
              className="group inline-flex items-center justify-center bg-ink text-ivory font-medium text-[14px] sm:text-[15px] px-12 py-4 hover:bg-deep-teal transition-colors duration-300 tracking-wide"
            >
              損失額を試算する
              <span className="ml-3 inline-block w-5 h-px bg-current" />
              <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <p className="text-[11px] text-ink/45 tracking-wider">3項目入力 ・ 24時間以内にレポート</p>
          </div>

          {/* メインビジュアル — 単一の大きな建築写真 */}
          <div className="relative max-w-4xl mx-auto mb-16 sm:mb-20">
            <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-bone">
              <img
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=85&auto=format&fit=crop"
                alt="SEKAI STAY 管理物件 ・ ラグジュアリーヴィラ外観"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-ink/40 mt-3 tracking-wider">
              SEKAI STAY 管理物件 ・ MOUNTAIN VILLA ニセコ
            </p>
          </div>

          {/* Trust ライン — 横一列・控えめ */}
          <div className="border-t border-rule pt-8 sm:pt-10">
            <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-3xl mx-auto">
              <Stat value="97%" label="継続率" />
              <Stat value="4.8" suffix="/5" label="ゲスト評価" />
              <Stat value="61%" label="平均稼働率" />
            </div>
            <p className="text-center text-[10px] text-ink/35 mt-6 tracking-wider">
              ※ 2026年4月時点 ・ 6ヶ月以上継続オーナーの平均
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, suffix, label }: { value: string; suffix?: string; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
        <span className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-deep-teal tabular-nums tracking-tight">
          {value}
        </span>
        {suffix && <span className="text-[12px] sm:text-[13px] text-ink/40 font-medium">{suffix}</span>}
      </div>
      <p className="text-[10px] sm:text-[11px] text-ink/55 tracking-[0.15em] uppercase">{label}</p>
    </div>
  );
}
