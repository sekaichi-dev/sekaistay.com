"use client";

import { useState } from "react";

function PrivacyContent() {
  return (
    <div className="space-y-8 text-sm text-switch-gray-dark leading-relaxed">
      <p>
        株式会社セカイチ（以下「当社」）は、SEKAI STAY（以下「本サービス」）の提供にあたり、お客様の個人情報の保護を重要な責務と考え、個人情報の保護に関する法律およびその他関連法令を遵守し、以下のとおりプライバシーポリシーを定めます。
      </p>

      <section>
        <h3 className="text-base font-bold text-black mb-2">1. 取得する個人情報</h3>
        <p>当社は、本サービスの提供にあたり、以下の個人情報を取得します。</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>氏名</li>
          <li>メールアドレス</li>
          <li>電話番号</li>
          <li>物件情報（所在地、物件種別等）</li>
          <li>お問い合わせ内容</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-bold text-black mb-2">2. 利用目的</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>本サービスの提供・運営・改善</li>
          <li>お問い合わせへの対応</li>
          <li>本サービスに関するご案内・ご連絡</li>
          <li>契約の締結・履行</li>
          <li>利用状況の分析・統計処理（個人を特定しない形式）</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-bold text-black mb-2">3. 第三者提供</h3>
        <p>当社は、法令に基づく場合等を除き、お客様の同意なく個人情報を第三者に提供しません。</p>
      </section>

      <section>
        <h3 className="text-base font-bold text-black mb-2">4. 安全管理措置</h3>
        <p>当社は、個人情報の漏えい、滅失またはき損の防止のために、適切な安全管理措置を講じます。</p>
      </section>

      <section>
        <h3 className="text-base font-bold text-black mb-2">5. 開示・訂正・削除の請求</h3>
        <p>お客様は、個人情報保護法に基づき、ご自身の個人情報について開示、訂正、削除等を請求できます。下記お問い合わせ先までご連絡ください。</p>
      </section>

      <section>
        <h3 className="text-base font-bold text-black mb-2">6. Cookieの利用</h3>
        <p>本サービスでは、利便性向上のためにCookieを使用する場合があります。ブラウザ設定でCookieの受入れを拒否できます。</p>
      </section>

      <section>
        <h3 className="text-base font-bold text-black mb-2">7. お問い合わせ先</h3>
        <p>株式会社セカイチ（SEKAICHI Inc.）</p>
        <p>〒153-0042 東京都目黒区青葉台2-20-7 KM中目黒ビル1F</p>
        <p>メール: info@sekaichi.org</p>
      </section>
    </div>
  );
}

function TokushohoContent() {
  return (
    <div className="text-sm text-switch-gray-dark">
      <table className="w-full">
        <tbody className="divide-y divide-switch-gray-light">
          {[
            ["販売事業者", "株式会社セカイチ（SEKAICHI Inc.）"],
            ["法人番号", "4011001162956"],
            ["代表者", "劉 添毅、明神 洸次郎"],
            ["所在地", "〒153-0042 東京都目黒区青葉台2-20-7 KM中目黒ビル1F"],
            ["連絡先", "info@sekaichi.org"],
            ["サービス名", "SEKAI STAY（民泊運用代行サービス）"],
            ["料金", "運用代行手数料: 売上の8%\n月額管理費: 10,000円（税別）/ 物件"],
            ["支払方法", "銀行振込"],
            ["支払時期", "月末締め、翌月末払い"],
            ["解約条件", "解約希望日の2ヶ月前までに通知\n解約金: ¥0（※最低契約期間 6ヶ月）"],
            ["返金", "提供済みサービスに対する返金は原則不可"],
          ].map(([label, value]) => (
            <tr key={label}>
              <td className="font-bold text-black py-3 pr-4 w-28 sm:w-36 align-top whitespace-nowrap">{label}</td>
              <td className="py-3 whitespace-pre-line">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LegalModal() {
  const [open, setOpen] = useState<"privacy" | "tokushoho" | null>(null);

  return (
    <>
      {/* Trigger links */}
      <button onClick={() => setOpen("privacy")} className="hover:text-white transition-colors cursor-pointer">
        プライバシーポリシー
      </button>
      <button onClick={() => setOpen("tokushoho")} className="hover:text-white transition-colors cursor-pointer">
        特定商取引法に基づく表記
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-switch-gray-light shrink-0">
              <h2 className="text-lg font-bold text-black">
                {open === "privacy" ? "プライバシーポリシー" : "特定商取引法に基づく表記"}
              </h2>
              <button
                onClick={() => setOpen(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-switch-gray-pale transition-colors text-switch-gray-mid"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-6">
              {open === "privacy" ? <PrivacyContent /> : <TokushohoContent />}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-switch-gray-light text-center shrink-0">
              <button
                onClick={() => setOpen(null)}
                className="text-sm text-switch-gray-mid hover:text-switch-charcoal transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
