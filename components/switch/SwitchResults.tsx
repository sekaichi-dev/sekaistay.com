"use client";

import Image from "next/image";
import CountUp from "./deco/CountUp";
import SectionHead from "./deco/SectionHead";

export default function SwitchResults() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-switch-teal-tint/30 to-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <SectionHead
            enLabel="SEKAI STAY改善実績"
            jaTitle={<>数字が、実力を証明する。</>}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-14">
          {[
            { value: 36, suffix: "年", label: "スタッフ平均運営歴", divide: 10 },
            { value: 48, suffix: "", label: "ゲスト満足度", divide: 10 },
            { value: 11, suffix: "%", label: "稼働率の平均改善幅" },
            { value: 97, suffix: "%", label: "オーナー継続率", highlight: true },
          ].map((s, i) => (
            <div
              key={i}
              className={`rounded-md p-4 sm:p-8 text-center shadow-sm ${
                s.highlight
                  ? "bg-gradient-to-br from-switch-teal to-switch-teal-deep text-white"
                  : "bg-gradient-to-b from-switch-teal-tint to-white"
              }`}
            >
              <div
                className={`text-[40px] sm:text-6xl font-bold leading-none tabular-nums ${
                  s.highlight ? "text-white" : "text-switch-teal"
                }`}
              >
                {s.divide ? (
                  <CountUpDecimal target={s.value} divide={s.divide} />
                ) : (
                  <CountUp target={s.value} suffix={s.suffix} />
                )}
                {s.divide && <span className="text-2xl sm:text-3xl ml-0.5">{s.suffix}</span>}
              </div>
              <p
                className={`text-xs sm:text-sm mt-3 font-bold ${
                  s.highlight ? "text-white/90" : "text-switch-gray-dark"
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Award callout */}
        <div className="mb-10 rounded-xl border border-yellow-400/70 bg-gradient-to-r from-yellow-50 via-yellow-100/40 to-yellow-50 px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-4 shadow-sm">
          <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-400 text-switch-charcoal flex items-center justify-center text-2xl sm:text-3xl shadow-md">
            🏆
          </div>
          <div className="leading-tight">
            <p className="text-[10px] sm:text-xs font-bold text-yellow-700 tracking-widest uppercase">BEST OF SAUNA STAY 2026</p>
            <p className="text-sm sm:text-base font-bold text-switch-charcoal mt-1">
              Lake House Nojiriko がサウナ付き部門 全国1位を受賞
            </p>
            <p className="text-[10px] sm:text-xs text-switch-gray-mid mt-0.5">民泊旅館簡易宿所業組合 主催</p>
          </div>
        </div>

        {/* Portfolio */}
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-switch-charcoal">
            弊社管理物件例
          </h3>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 mt-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-6 sm:mx-0 pl-14 pr-6 sm:px-0 scroll-pl-14 sm:scroll-pl-0 pb-3 sm:pb-0 touch-pan-x sm:touch-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex-shrink-0 w-[85%] sm:w-auto snap-start rounded-md overflow-hidden bg-white border border-switch-gray-light">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/switch/property-villa.jpg"
                alt="Lake House Nojiriko"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full">
                高級ヴィラ
              </span>
              <span className="absolute top-3 right-3 bg-yellow-400 text-switch-charcoal text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <span aria-hidden>🏆</span>サウナ部門 全国1位
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-lg text-switch-charcoal">
                  Lake House Nojiriko
                </p>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-switch-teal-bright">★</span>
                    <span className="text-sm font-bold">4.88</span>
                  </div>
                  <span className="text-[10px] text-switch-gray-mid mt-0.5">レビュー 41件</span>
                </div>
              </div>
              <p className="text-xs text-switch-gray-mid mb-3">220㎡ / 1日1組限定</p>
              <div className="bg-gradient-to-r from-switch-cloud to-switch-teal-tint rounded-lg p-3 grid grid-cols-2 gap-2 text-xs text-center">
                <div>
                  <p className="text-switch-gray-mid">導入前</p>
                  <p className="font-bold text-switch-charcoal line-through">稼働率 32%</p>
                </div>
                <div>
                  <p className="text-switch-teal font-bold">導入後</p>
                  <p className="font-bold text-switch-teal">
                    稼働率 67%{" "}
                    <span className="text-[10px]">(+35pt)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-[85%] sm:w-auto snap-start rounded-md overflow-hidden bg-white border border-switch-gray-light">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/switch/property-cabin.jpg"
                alt="The Lake Side INN"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-switch-teal text-white text-[10px] font-bold px-3 py-1 rounded-full">
                全4棟
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-lg text-switch-charcoal">
                  The Lake Side INN
                </p>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-switch-teal-bright">★</span>
                    <span className="text-sm font-bold">4.97</span>
                  </div>
                  <span className="text-[10px] text-switch-gray-mid mt-0.5">レビュー 61件</span>
                </div>
              </div>
              <p className="text-xs text-switch-gray-mid mb-3">全4棟 / ペットOK</p>
              <div className="bg-gradient-to-r from-switch-cloud to-switch-teal-tint rounded-lg p-3 grid grid-cols-2 gap-2 text-xs text-center">
                <div>
                  <p className="text-switch-gray-mid">導入前</p>
                  <p className="font-bold text-switch-charcoal line-through">レビュー 19件</p>
                </div>
                <div>
                  <p className="text-switch-teal font-bold">導入後</p>
                  <p className="font-bold text-switch-teal">
                    レビュー 61件{" "}
                    <span className="text-[10px]">(3倍↑)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-[85%] sm:w-auto snap-start rounded-md overflow-hidden bg-white border border-switch-gray-light">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/switch/property-niseko.jpg"
                alt="Mountain Villa Niseko"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-switch-teal-deep text-white text-[10px] font-bold px-3 py-1 rounded-full">
                ロッジ
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-lg text-switch-charcoal">
                  Mountain Villa Niseko
                </p>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-switch-teal-bright">★</span>
                    <span className="text-sm font-bold">4.95</span>
                  </div>
                  <span className="text-[10px] text-switch-gray-mid mt-0.5">レビュー 20件</span>
                </div>
              </div>
              <p className="text-xs text-switch-gray-mid mb-3">ゲレンデから10分</p>
              <div className="bg-gradient-to-r from-switch-cloud to-switch-teal-tint rounded-lg p-3 grid grid-cols-2 gap-2 text-xs text-center">
                <div>
                  <p className="text-switch-gray-mid">導入前</p>
                  <p className="font-bold text-switch-charcoal line-through">ピーク売上</p>
                </div>
                <div>
                  <p className="text-switch-teal font-bold">導入後</p>
                  <p className="font-bold text-switch-teal">
                    ピーク売上{" "}
                    <span className="text-[10px]">(+22%)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUpDecimal({
  target,
  divide,
}: {
  target: number;
  divide: number;
}) {
  // 36 → 3.6, 49 → 4.9 のような小数表示を CountUp で擬似的に
  return (
    <span className="inline-flex items-baseline">
      <CountUp target={Math.floor(target / divide)} />
      <span>.</span>
      <CountUp target={target % divide} />
    </span>
  );
}
