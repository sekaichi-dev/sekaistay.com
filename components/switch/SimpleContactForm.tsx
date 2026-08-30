"use client";

/* /switch/simple 専用のフォームセクション。LpVariantForm の teal-gradient burst を排除し、
 * ivory 背景 + 白カード + 細い罫線だけのエディトリアル・ラグジュアリー版。
 * フォーム本体は ReportRequestForm を共通使用 (lp_variant=switch-simple)。
 */

import { ReportRequestForm } from "@/components/report-request/ReportRequestForm";

export default function SimpleContactForm() {
  return (
    <section id="contact-form" className="relative bg-ivory py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-[10px] sm:text-[11px] tracking-[0.4em] text-deep-teal/70 font-medium uppercase mb-3">
            Contact
          </p>
          <div className="inline-block w-12 h-px bg-deep-teal/40 mb-6" />
          <h2 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-ink leading-tight mb-3">
            まずはご相談だけでもどうぞ
          </h2>
          <p className="text-[13px] sm:text-[14px] text-ink/65 leading-[2] tracking-wide max-w-md mx-auto">
            お名前・メール・電話の30秒入力で、
            <br className="hidden sm:block" />
            24時間以内に担当者からご連絡いたします。
          </p>
        </div>

        <div className="bg-paper border border-rule rounded-none">
          <ReportRequestForm lpVariant="switch-simple" embed={false} />
        </div>

        <p className="text-center text-[11px] text-ink/40 mt-6 tracking-wide">
          物件情報の入力は不要 ・ 無理な勧誘は致しません
        </p>
      </div>
    </section>
  );
}
