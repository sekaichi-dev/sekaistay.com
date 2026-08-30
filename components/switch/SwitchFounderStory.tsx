"use client";

/* /switch/founder 専用「なぜこのサービスを作ったのか」セクション。
 * Hero の語りかけを継承し、ストーリーで信頼を積み上げる。
 */

import { useScrollFade } from "@/hooks/useScrollFade";

export default function SwitchFounderStory() {
  const ref = useScrollFade();
  return (
    <section ref={ref} className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-3xl mx-auto px-6">
        <div className="fade-in">
          <p className="text-[11px] tracking-[0.4em] text-deep-teal/80 font-medium uppercase mb-3 text-center">
            Why We Built This
          </p>
          <h2 className="text-center text-[24px] sm:text-[34px] lg:text-[40px] font-bold tracking-tight text-ink leading-[1.3] mb-12 sm:mb-14">
            なぜ、このサービスを作ったのか。
          </h2>

          <div className="space-y-6 text-[14px] sm:text-[15px] lg:text-[16px] leading-[2] text-ink/75 tracking-wide">
            <p>
              3年前、私たち自身も民泊のオーナーとして、代行業者に物件を任せていました。
              <span className="font-bold text-ink">手数料20%、月額固定費 ¥20,000</span>。手元に残るのは売上の半分以下、運用の中身は完全にブラックボックスで、届くレポートは月1回のPDFだけ。
            </p>
            <p>
              業界平均15〜25%という手数料率は、相場というより<mark className="bg-deep-teal/10 text-deep-teal px-1 rounded-sm">「情報の非対称性で成立してきた価格」</mark>だと気づきました。テクノロジーと運用設計を一から組み直せば、業界平均の半額ほどにできる確信がありました。
            </p>
            <p>
              ──だから私たちは、<mark className="bg-deep-teal/10 text-deep-teal font-bold px-1 rounded-sm">手数料 8% + 月額1万円</mark>。そしてオーナー専用のダッシュボードで、運用の中身をぜんぶ可視化しました。
            </p>
            <p>
              「お任せください」ではなく、「いつでも見られます」をプロダクトの軸に据えています。
            </p>
            <p>
              切り替えてくださったオーナー様の中には、<span className="font-bold text-deep-teal">稼働率 58% → 82%</span>、<span className="font-bold text-deep-teal">月売上 ¥45万 → ¥76万</span>に伸ばされた方もいます。<span className="font-bold text-ink">2倍安くて、2倍良い</span>。これが SEKAI STAY の哲学です。
            </p>
            <p>
              切り替えは、心理的にもオペレーション的にも重い決断です。だからこそ、入り口は軽くしました。
            </p>
            <p>
              <mark className="bg-deep-teal/10 text-deep-teal font-bold px-1 rounded-sm">初期費用 ¥0<sup className="text-[10px] font-normal ml-0.5">※1</sup></mark>、<mark className="bg-deep-teal/10 text-deep-teal font-bold px-1 rounded-sm">解約金 ¥0<sup className="text-[10px] font-normal ml-0.5">※2</sup></mark>。
            </p>
            <p>
              運用が変わって、結果としてお付き合いが続いたら嬉しいです。
            </p>
            <p className="text-right text-[13px] text-ink/55 italic">
              ── 劉 添毅・明神 洸次郎
            </p>
          </div>

          {/* セクション末の CTA — ボタン化 */}
          <div className="mt-12 sm:mt-14 pt-8 border-t border-rule text-center">
            <p className="text-[12px] sm:text-[13px] leading-[1.8] text-ink/55 tracking-normal text-left mb-8">
              ※1 運用中物件のみ期間限定無料（新規立ち上げ物件は別途お見積もり）<br />
              ※2 最低契約期間（6ヶ月）以降は解約金 ¥0
            </p>
            <a
              href="https://timerex.net/s/sekai-stay/d61b424d"
              target="_blank"
              rel="noreferrer"
              data-cta="founder-meeting"
              data-cta-label="founder-story-cta"
              className="group inline-flex items-center justify-center bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-[14px] sm:text-[15px] px-7 sm:px-9 py-3.5 sm:py-4 rounded-md transition-colors duration-300 shadow-md tracking-wide"
            >
              無料面談を予約する
              <svg className="ml-2.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
