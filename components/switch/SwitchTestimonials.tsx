"use client";

import { useScrollFade } from "@/hooks/useScrollFade";
import SectionHead from "./deco/SectionHead";

const testimonials = [
  {
    name: "Y.A. 様",
    age: "48歳",
    type: "戸建て2棟 / 神奈川県",
    years: "オーナー歴2年",
    impact: "-102",
    impactUnit: "万円/年",
    impactSub: "",
    impactLabel: "手数料削減額",
    color: "from-switch-accent to-switch-accent-hover",
    text: "前の代行は18%で、正直「民泊ってこんなに引かれるものなのか」と諦めていた。SEKAI STAYは数字が全部アプリで見える。はじめて『自分の事業』として数字を追う感覚を持てました。",
  },
  {
    name: "S.U. 様",
    age: "42歳",
    type: "マンション2室 / 大阪府",
    years: "オーナー歴1年",
    impact: "1.8",
    impactUnit: "倍",
    impactSub: "",
    impactLabel: "稼働率 32%→58%",
    color: "from-switch-teal to-switch-teal-deep",
    text: "副業で始めたけど、自分で運営する時間がなくて稼働率がボロボロだった。SEKAI STAYに任せてからは予約サイトの掲載が見違えた。スマホで撮った普通の写真がAI加工でプロ撮影と見紛う仕上がりになる—あの変わり方は本当に衝撃で、そこから予約が一気に入り始めました。",
  },
  {
    name: "S.A. 様",
    age: "61歳",
    type: "一棟アパート / 福岡県",
    years: "オーナー歴5年",
    impact: "4.8",
    impactUnit: "",
    impactSub: "★",
    impactLabel: "ゲスト評価 4.2→4.8",
    color: "from-switch-teal-deep to-switch-teal",
    text: "月1レポートだけで物件の状況を把握できていなかった。SEKAI STAYに切り替えてから運用の細かいところまで改善され、ゲストレビューが自然に上がりました。単価も引き上げられるようになって、妻にも「任せてよかったね」と言われました。",
  },
];

export default function SwitchTestimonials() {
  const ref = useScrollFade();

  return (
    <section className="py-12 sm:py-16 bg-switch-cloud" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="fade-in mb-8">
          <SectionHead
            enLabel="実際のオーナー様の声"
            jaTitle={<>切り替えた人の、リアルな結果。</>}
          />
        </div>

        {/* 改善実績バナー */}
        <div className="fade-in grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          {[
            { label: "稼働率改善（実例）", value: "58%→82%", sub: "+24pt" },
            { label: "月売上改善（実例）", value: "45万→76万", sub: "+69%" },
            { label: "ゲスト評価平均", value: "4.8", sub: "/ 5.0" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-switch-teal/20 shadow-sm px-2 py-3 sm:px-3 text-center"
            >
              <p className="text-[12px] sm:text-xl font-bold text-switch-teal-deep leading-none tabular-nums whitespace-nowrap">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-switch-teal mt-1 tabular-nums">
                {stat.sub}
              </p>
              <p className="text-[9px] sm:text-[10px] text-switch-gray-mid mt-1 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* モバイル: 横スクロール / md以上: 3カラムグリッド */}
        <div className="stagger flex md:grid md:grid-cols-3 gap-5 overflow-x-auto overflow-y-hidden md:overflow-visible touch-pan-x md:touch-auto overscroll-y-none md:overscroll-auto -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-thin pb-2 md:pb-0">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="fade-in bg-white rounded-md overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col shrink-0 w-[85%] sm:w-[60%] md:w-auto snap-center"
            >
              {/* Impact */}
              <div
                className={`bg-gradient-to-br ${t.color} p-3 sm:p-5 text-center text-white relative overflow-hidden`}
              >
                <p className="text-[36px] sm:text-5xl font-bold leading-none tabular-nums tracking-tight">
                  {t.impactSub && <span className="text-xl mr-1">{t.impactSub}</span>}
                  {t.impact}
                  {t.impactUnit && (
                    <span className="text-lg sm:text-xl ml-0.5">
                      {t.impactUnit}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-white/90 font-bold tracking-widest mt-2">
                  {t.impactLabel}
                </p>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-4 h-4 text-switch-teal-bright"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-[15px] text-switch-charcoal leading-relaxed mb-3">
                  「{t.text}」
                </p>

                <div className="mt-auto pt-2.5 border-t border-switch-gray-light">
                  <p className="text-sm font-bold text-switch-charcoal">
                    {t.name}{" "}
                    <span className="text-xs text-switch-gray-mid">
                      ({t.age})
                    </span>
                  </p>
                  <p className="text-xs text-switch-gray-mid">
                    {t.type} / {t.years}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
