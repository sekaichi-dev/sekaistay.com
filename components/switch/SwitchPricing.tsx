"use client";

import { usePathname } from "next/navigation";
import { useScrollFade } from "@/hooks/useScrollFade";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";
import SectionHead from "./deco/SectionHead";

const zeroItems = [
  "初期費用 ※1",
  "契約手数料",
  "解約金 ※2",
  "清掃費の別請求",
  "広告費の別請求",
  "レポート作成費",
];

export default function SwitchPricing() {
  const ref = useScrollFade();
  const pathname = usePathname();
  const { primary: ctaLabel } = useSwitchCtaLabels();
  const showCta = !pathname?.startsWith("/switch/founder");

  return (
    <section
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-switch-teal-tint/30 to-white"
      ref={ref}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="fade-in mb-12">
          <SectionHead
            enLabel="料金プラン"
            jaTitle={<>料金は、たったひとつ。</>}
            subtitle="成果報酬 ＋ 物件固定費。シンプルな料金体系です。"
          />
        </div>

        {/* 料金ヒーローカード */}
        <div className="fade-in relative bg-gradient-to-br from-switch-teal-tint via-white to-switch-teal-tint rounded-xl p-5 sm:p-10 mb-8 border-2 border-switch-teal/40 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-switch-teal-bright via-switch-teal to-switch-teal-deep rounded-t-xl" />

          {/* シンプルバッジ */}
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-switch-teal to-switch-teal-deep text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm mb-5">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            シンプルな料金体系
          </span>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            {/* 左: メイン価格 */}
            <div>
              <p className="text-xs sm:text-sm text-switch-teal-deep font-bold tracking-widest mb-3">
                SEKAI STAY の料金
              </p>
              <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                <span className="text-sm sm:text-base text-switch-gray-mid font-bold">
                  売上の
                </span>
                <span className="gradient-text-hero text-[44px] sm:text-7xl font-bold leading-none tabular-nums">
                  8
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-switch-charcoal">
                  %
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-switch-charcoal mb-5 leading-tight">
                ＋ ¥10,000
                <span className="text-sm text-switch-gray-mid ml-1 font-semibold">
                  / 物件 / 月
                </span>
              </div>
            </div>

            {/* 右: 試算の例 */}
            <div className="bg-white rounded-lg p-5 sm:p-6 border border-switch-teal/20 shadow-sm">
              <p className="text-[11px] sm:text-xs font-bold text-switch-gray-mid tracking-widest mb-4">
                例：月100万円の売上の場合
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-switch-gray-light">
                  <span className="text-switch-gray-dark">手数料（8%）</span>
                  <span className="font-bold text-switch-charcoal tabular-nums">
                    ¥80,000
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-switch-gray-light">
                  <span className="text-switch-gray-dark">物件固定費</span>
                  <span className="font-bold text-switch-charcoal tabular-nums">
                    ¥10,000
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-switch-teal-deep text-sm">
                    お支払い合計
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-switch-teal-deep tabular-nums">
                    ¥90,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 「ない」もの一覧 */}
        <div className="fade-in bg-switch-charcoal rounded-xl p-6 sm:p-8 mb-10 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-switch-teal-bright/10 blur-3xl rounded-full pointer-events-none" />
          <p className="relative text-base sm:text-lg text-white font-bold tracking-wide mb-5 text-center leading-snug">
            他社でよくある「隠れ費用」—
            <span className="text-switch-teal-bright"> SEKAI STAY はすべてゼロ</span>
          </p>
          <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {zeroItems.map((item) => (
              <div
                key={item}
                className="bg-white/5 backdrop-blur-sm rounded-md px-3 py-2.5 flex items-center gap-2 border border-white/15"
              >
                <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-switch-teal-bright text-switch-charcoal font-bold text-[11px] tabular-nums">
                  ¥0
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="relative grid grid-cols-2 gap-x-8 gap-y-3 text-[11px] text-white/60 mt-5 leading-relaxed max-w-2xl mx-auto">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-switch-teal-bright font-bold shrink-0">※1</span>
                <span>
                  初期費用は運用中の物件のみ期間限定無料
                  <br />
                  <span className="text-white/45">（新規立ち上げ物件は別途お見積もり）</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-switch-teal-bright font-bold shrink-0">※2</span>
                <span>最低契約期間（6ヶ月）以降は解約金 ¥0</span>
              </li>
            </ul>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-white/40 font-bold shrink-0">※</span>
                <span>清掃費はゲスト宿泊料金内でカバー</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 font-bold shrink-0">※</span>
                <span>広告費・レポート費は手数料 8% 内に含まれます</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA — /founder では非表示 */}
        {showCta && (
          <div className="fade-in text-center">
            <a
              href="#contact-form"
              className="group inline-flex items-center justify-center bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-base sm:text-lg px-10 sm:px-12 py-4 rounded-md shadow-[0_0_40px_rgba(235,110,40,0.35)] hover:shadow-[0_0_56px_rgba(235,110,40,0.5)] hover:-translate-y-0.5 transition-all min-h-[52px]"
            >
              {ctaLabel}
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
