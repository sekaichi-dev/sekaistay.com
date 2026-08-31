"use client";

import { useState } from "react";
import { useScrollFade } from "@/hooks/useScrollFade";
import SectionHead from "./deco/SectionHead";

const faqs = [
  {
    q: "本当に手数料8%だけですか？隠れた費用はありませんか？",
    a: "はい。毎月の料金は「売上の8% ＋ ¥10,000/物件/月」のみで、契約手数料・解約金（最低契約期間 6ヶ月）・広告費・レポート作成費はすべて ¥0 です。初期費用は乗り換えの場合 100,000円/物件（移行作業・リスティング最適化を含む）、新規立ち上げは別途お見積もりです。清掃費はゲストの宿泊料金内でカバーされるため、オーナー様への別請求は発生しません。",
  },
  {
    q: "途中で解約できますか？",
    a: "6ヶ月以降の解約は解約金 ¥0 です。6ヶ月以内に解約される場合は所定の解約手数料が発生します。解約ご希望の際は2ヶ月前にご連絡ください。受注済みのご予約分は弊社が責任を持って最後まで対応し、スムーズに運営を終了します。",
  },
  {
    q: "物件が遠方でも大丈夫ですか？",
    a: "全国対応しています。各エリアの清掃・点検パートナーと連携し、ゲスト対応・緊急トラブルまで現地で一貫してカバー。北海道から沖縄まで実績があります。",
  },
  {
    q: "既に他社に委託中ですが、切り替えできますか？",
    a: "可能です。引き継ぎには概ね2週間をいただきます。既存のご予約は弊社が並走して引き継ぐため、運営の空白期間は生まれません。",
  },
  {
    q: "なぜ手数料8%で実現できるのですか？",
    a: "自社開発のダッシュボード・自動価格調整・多言語自動対応などで現場の工数を徹底的に圧縮し、中間マージンを排除しているためです。オーナー様と直接ご契約する構造で、業界平均（15〜25%）を大きく下回る水準を実現しています。",
  },
  {
    q: "1物件だけでも依頼できますか？",
    a: "もちろん可能です。1物件から対応しています。物件タイプ・立地・稼働状況に応じて、最適な運用プランを個別にご提案します。",
  },
];

function FAQItem({ q, a, no }: { q: string; a: string; no: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-switch-gray-light last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-4 sm:py-5 text-left group gap-3"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-switch-teal to-switch-teal-deep text-white font-bold text-xs shadow-sm">
            Q{no}
          </span>
          <span className="text-sm sm:text-base font-bold text-switch-charcoal pr-2 group-hover:text-switch-teal transition-colors leading-snug pt-1.5">
            {q}
          </span>
        </div>
        <svg
          className={`w-6 h-6 text-switch-teal shrink-0 transition-transform duration-500 ease-in-out ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[480px] pb-5" : "max-h-0"
        }`}
      >
        <div className="pl-12 flex items-start gap-3">
          <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-switch-teal-tint text-switch-teal-deep font-bold text-xs -ml-12">
            A
          </span>
          <p className="text-xs sm:text-sm text-switch-gray-dark leading-relaxed">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SwitchFAQ() {
  const ref = useScrollFade();

  return (
    <section
      className="py-16 sm:py-20 bg-gradient-to-b from-switch-cloud via-white to-switch-teal-tint/20"
      ref={ref}
    >
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="fade-in text-switch-teal font-bold text-sm tracking-widest mb-3">
            ▼ よくあるご質問 ▼
          </p>
          <h2 className="fade-in text-2xl sm:text-3xl lg:text-4xl font-bold text-switch-charcoal leading-tight">
            乗り換えで気になるポイント
          </h2>
        </div>

        <div className="fade-in bg-white rounded-xl px-5 sm:px-8 border border-switch-gray-light shadow-sm">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} no={i + 1} />
          ))}
        </div>

        <p className="fade-in text-xs text-switch-gray-mid text-center mt-6">
          ※ その他のご質問は、無料診断フォームの備考欄からお気軽にお問い合わせください。
        </p>
      </div>
    </section>
  );
}
