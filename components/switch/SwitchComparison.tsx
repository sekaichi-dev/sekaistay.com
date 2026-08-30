"use client";

import { usePathname } from "next/navigation";
import { useScrollFade } from "@/hooks/useScrollFade";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";
import SectionHead from "./deco/SectionHead";

type Row = {
  label: string;
  others: string;
  sekai: string;
  sekaiHighlight?: boolean;
};

const rows: Row[] = [
  { label: "手数料率", others: "15〜25%", sekai: "8%", sekaiHighlight: true },
  { label: "月額固定費", others: "別途数万円", sekai: "¥10,000/物件 のみ" },
  { label: "オーナー向けダッシュボード", others: "なし 〜 月次PDF", sekai: "リアルタイム統合型（オーナー専用設計）", sekaiHighlight: true },
  { label: "オーナー自身の予約機能", others: "毎度相談", sekai: "ダッシュボードから1タップ" },
  { label: "税理士用データ書き出し", others: "手作業で数日", sekai: "ワンタップで即時" },
  { label: "需要連動の自動価格調整", others: "手動 or なし", sekai: "数万件データで毎日自動" },
  { label: "OTA 写真・文章最適化", others: "初回のみ", sekai: "毎月見直し" },
  { label: "ゲスト対応言語", others: "日本語のみが多い", sekai: "日・英・中・韓 24時間" },
  { label: "専任スタッフとのミーティング", others: "なし", sekai: "3ヶ月ごと" },
];

export default function SwitchComparison() {
  const ref = useScrollFade();
  const pathname = usePathname();
  const { primary: ctaLabel } = useSwitchCtaLabels();
  const showCta = pathname !== "/switch" && pathname !== "/switch/portal";

  return (
    <section className="py-16 sm:py-20 bg-switch-cloud" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="fade-in mb-10">
          <SectionHead
            enLabel="徹底比較"
            jaTitle={<>他社と SEKAI STAY の違い</>}
            subtitle="同じ「民泊運用代行」でも、中身はこれだけ違います。"
          />
        </div>

        {/* モバイル：超コンパクトなカード形式（黒ヘッダー削除・密度↑） */}
        <div className="fade-in sm:hidden space-y-1.5 mb-6">
          {/* カラムラベル（1回だけ表示・スティッキー風） */}
          <div className="grid grid-cols-[34%_1fr_1fr] gap-1 px-2 mb-1">
            <span className="text-[9px] text-switch-gray-mid font-bold tracking-wider" />
            <span className="text-[9px] text-switch-gray-mid font-bold tracking-wider text-center">
              一般的な他社
            </span>
            <span className="text-[9px] text-switch-teal-deep font-bold tracking-wider text-center">
              SEKAI STAY
            </span>
          </div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="bg-white rounded-md border border-switch-gray-light/60 overflow-hidden flex"
            >
              <span className="w-[3px] bg-switch-teal-deep flex-shrink-0" aria-hidden />
              <div className="flex-1 grid grid-cols-[calc(34%-3px)_1fr_1fr] gap-1 items-center px-2 py-1.5">
                <p className="text-[11px] font-bold text-switch-charcoal leading-tight">
                  {row.label}
                </p>
                <p className="text-[11px] text-switch-gray-dark leading-snug">
                  <span className="text-switch-gray-mid mr-0.5">✗</span>
                  {row.others}
                </p>
                <p
                  className={`text-[11px] leading-snug font-bold ${
                    row.sekaiHighlight ? "text-switch-teal-deep" : "text-switch-charcoal"
                  }`}
                >
                  <span className="text-switch-teal mr-0.5">✓</span>
                  {row.sekai}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PC：テーブル形式 */}
        <div className="fade-in hidden sm:block overflow-x-auto mb-6">
          <table className="w-full min-w-[640px] border-collapse bg-white rounded-md shadow overflow-hidden">
            <thead>
              <tr className="bg-switch-charcoal">
                <th className="text-left text-xs sm:text-sm font-bold text-white px-2 sm:px-6 py-5">
                  比較項目
                </th>
                <th className="text-center text-xs sm:text-sm font-bold text-white/70 px-2 sm:px-6 py-5">
                  一般的な他社
                </th>
                <th className="text-center text-xs sm:text-sm font-bold text-white bg-gradient-to-b from-switch-teal to-switch-teal-deep px-2 sm:px-6 py-5">
                  SEKAI STAY
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-switch-gray-light/60 last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-switch-cloud/50"
                  }`}
                >
                  <td className="text-xs sm:text-sm font-bold text-switch-charcoal px-2 sm:px-6 py-4">
                    {row.label}
                  </td>
                  <td className="text-center text-xs sm:text-sm text-switch-gray-mid px-2 sm:px-6 py-4">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-switch-teal-deep">✗</span>
                      {row.others}
                    </span>
                  </td>
                  <td
                    className={`text-center text-xs sm:text-sm font-bold px-2 sm:px-6 py-4 ${
                      row.sekaiHighlight
                        ? "text-switch-teal-deep bg-switch-teal-tint"
                        : "text-switch-charcoal bg-switch-teal-tint/40"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <span className="text-switch-teal">✓</span>
                      {row.sekai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fade-in flex justify-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-switch-teal via-switch-teal-deep to-switch-teal text-white font-bold text-sm sm:text-base px-6 py-3 rounded-full shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            10項目すべてで SEKAI STAY が優位
          </div>
        </div>

        {/* CTA — バッジ直下（/switch では非表示） */}
        {showCta && (
          <div className="fade-in mt-6 flex justify-center">
            <a
              href="#contact-form"
              className="group inline-flex items-center justify-center bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-4 rounded-md shadow-[0_0_32px_rgba(235,110,40,0.3)] hover:shadow-[0_0_48px_rgba(235,110,40,0.45)] hover:-translate-y-0.5 transition-all min-h-[48px]"
            >
              {ctaLabel}
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}

        <p className="fade-in text-xs text-switch-gray-mid text-center mt-6">
          ※ 他社の相場は2026年4月時点で当社調べ。契約内容により異なります。
        </p>
      </div>
    </section>
  );
}
