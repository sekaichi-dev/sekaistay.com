"use client";

/* /switch/portal 専用の Testimonials 差し替え版。
 * 「お金が戻った」系ではなく「数字が見える / 妻に説明できる / 放置されない」系。
 * 写真は使わず物件名 + 仮名 (M.S 様等) で構成（前提ルール準拠）。
 */

import { useScrollFade } from "@/hooks/useScrollFade";

const VOICES = [
  {
    quote: "毎朝、コーヒーを入れながら3秒で数字を確認。これだけで運営の主導権が戻った気がします。",
    name: "M.S 様",
    property: "LAKE HOUSE 野尻湖",
    point: "数字が見える",
  },
  {
    quote: "前は妻に『今月いくら？』と聞かれても答えられなかった。ダッシュボードを見せたら、はじめて『ちゃんと増えてるね』と。",
    name: "T.K 様",
    property: "MOUNTAIN VILLA ニセコ",
    point: "妻に説明できた",
  },
  {
    quote: "前の代行は質問すると2-3日返ってこなかった。今は遅くて当日中、だいたい30分以内です。放置されている感じがない。",
    name: "K.H 様",
    property: "都内民泊オーナー",
    point: "放置されない",
  },
  {
    quote: "OTA価格の自動調整も、清掃手配も、全部ダッシュボードで状態が見える。『運営してる感』があるのは初めて。",
    name: "Y.N 様",
    property: "京都町家オーナー",
    point: "全部が手元にある",
  },
];

export default function PortalTestimonials() {
  const ref = useScrollFade();
  return (
    <section ref={ref} className="py-16 sm:py-20 bg-gradient-to-b from-white via-switch-cloud/40 to-white">
      <div className="max-w-5xl mx-auto px-5">
        <div className="fade-in text-center mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-[12px] tracking-[0.3em] text-switch-teal-deep font-semibold uppercase mb-3">
            Owner Voices
          </p>
          <h2 className="text-[24px] sm:text-[32px] lg:text-[36px] font-bold tracking-tight text-switch-charcoal leading-tight">
            「毎朝、ダッシュボードを開くようになった」
          </h2>
          <p className="text-[13px] sm:text-[14px] text-switch-gray-mid mt-3 leading-relaxed">
            手数料の差は、出発点でした。本当の変化は、「待つ」運用が「いつでも見られる」運用に変わったこと。
          </p>
        </div>

        <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-5 overflow-x-auto md:overflow-visible -mx-5 px-5 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none pb-3 md:pb-0">
          {VOICES.map((v, i) => (
            <div key={i} className="fade-in bg-white rounded-2xl p-5 sm:p-7 border border-switch-stone-border shadow-sm hover:shadow-md transition-shadow shrink-0 w-[82%] md:w-auto snap-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2 py-0.5 rounded-full bg-switch-teal-tint text-switch-teal-deep text-[10px] font-bold tracking-wider">
                  {v.point}
                </span>
              </div>
              <p className="text-[14px] sm:text-[15px] text-switch-charcoal leading-relaxed mb-4">
                「{v.quote}」
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-switch-stone-border/60">
                <div className="w-8 h-8 rounded-full bg-switch-teal-tint flex items-center justify-center text-switch-teal-deep font-bold text-[11px] tracking-wider">
                  {v.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-switch-charcoal">{v.name}</p>
                  <p className="text-[11px] text-switch-gray-mid">{v.property}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-switch-gray-mid mt-8 tracking-wide">
          ※ プライバシー保護のため一部仮名で掲載しています
        </p>
      </div>
    </section>
  );
}
