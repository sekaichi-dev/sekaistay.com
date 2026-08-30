"use client";

/* /switch と同じ装飾セクションで、新フォーム (ReportRequestForm) を内包する。
 * A/Bテスト 5 variants が共通で使う。
 * lp_variant が Supabase / GA4 / Meta Pixel に伝播する。
 */

import type { ReactNode } from "react";
import { ReportRequestForm } from "@/components/report-request/ReportRequestForm";

type Props = {
  lpVariant: string;
  heading?: string;
  leadCopy?: ReactNode;
  subCopy?: ReactNode;
};

export default function LpVariantForm({
  lpVariant,
  heading = "無料パーソナライズ診断",
  leadCopy,
  subCopy,
}: Props) {
  return (
    <section
      id="contact-form"
      className="relative py-16 sm:py-20 overflow-hidden bg-[linear-gradient(135deg,#0d5a60_0%,#167b81_40%,#1a8f96_55%,#167b81_75%,#0d5a60_100%)]"
    >
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-switch-teal-deep/25 blur-[120px] rounded-full pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-40 w-[480px] h-[480px] bg-switch-accent/15 blur-[120px] rounded-full pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden
      />

      <div className="relative max-w-2xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="inline-flex items-center gap-2 bg-[#fde047] text-switch-charcoal font-bold text-lg sm:text-2xl leading-tight tracking-tight px-5 sm:px-7 py-2 sm:py-2.5 rounded-md mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-switch-accent shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {heading}
          </h2>
          {leadCopy && <p className="text-white font-bold text-base sm:text-lg leading-snug mb-2">{leadCopy}</p>}
          {subCopy && <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl mx-auto">{subCopy}</p>}
        </div>

        <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-2xl">
          <ReportRequestForm lpVariant={lpVariant} embed={false} />
        </div>
      </div>
    </section>
  );
}
