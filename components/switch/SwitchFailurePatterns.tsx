"use client";

import { useScrollFade } from "@/hooks/useScrollFade";

const patterns = [
  {
    no: "01",
    title: "「15%が相場」と思い込み",
    detail:
      "10年前の情報のまま。仕組み化された運営なら8%で回ります。思い込みだけで年間数十万円払い続けています。",
  },
  {
    no: "02",
    title: "価格が固定のまま",
    detail:
      "ハイシーズンもオフシーズンも同じ価格。需要連動の自動価格設定をしていないだけで、年間で数十万円の機会損失。",
  },
  {
    no: "03",
    title: "OTA掲載文が1年以上更新されていない",
    detail:
      "写真・タイトル・説明文が当初のまま。Airbnb は更新頻度で上位表示を決めます。放置＝検索圏外。",
  },
  {
    no: "04",
    title: "ゲスト対応が日本語のみ",
    detail:
      "インバウンドの半分以上は英語・中国語が第一言語。日本語のみ対応の業者では、予約確定前に離脱されています。",
  },
  {
    no: "05",
    title: "「解約金が怖くて動けない」",
    detail:
      "動かないことが一番のコスト。今の業者の解約金が10万円でも、乗り換えで翌年100万円得するなら即断が正解です。",
  },
];

export default function SwitchFailurePatterns() {
  const ref = useScrollFade();

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-switch-cloud" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="fade-in text-center mb-12">
          <p className="text-switch-charcoal font-bold text-sm tracking-widest mb-3">
            ▼ よくある失敗 ▼
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-black mb-3 leading-tight">
            損している人の、<br className="sm:hidden" />共通パターン。
          </h2>
          <p className="text-sm text-switch-gray-dark">
            当てはまる項目が1つでもあれば、すでに損しています。
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 stagger">
          {patterns.map((p) => (
            <div
              key={p.no}
              className="fade-in bg-white rounded-2xl p-6 shadow-sm border-l-4 border-switch-teal-deep hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl sm:text-6xl font-bold text-switch-accent/60 leading-none tabular-nums">
                  {p.no}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-switch-charcoal mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-switch-gray-dark leading-relaxed">
                    {p.detail}
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
