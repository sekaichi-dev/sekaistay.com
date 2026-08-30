import type { Metadata } from "next";
import { ReportRequestForm } from "@/components/report-request/ReportRequestForm";

export const metadata: Metadata = {
  title: "無料物件診断レポート | SEKAI STAY",
  description:
    "現在の運営代行と SEKAI STAY 8% を比較。物件専用の収益改善レポートを24時間以内にメールでお届けします。",
  robots: { index: false, follow: false }, // LP用 — Google検索除外
};

export default function ReportRequestPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <div className="max-w-xl mx-auto px-5 pt-12 pb-20">
        <h1 className="text-[24px] font-bold mb-2 text-ink">無料・物件診断レポート</h1>
        <p className="text-[14px] text-dark-gray mb-8 leading-relaxed">
          約60秒のご入力で、現在の運営代行手数料（15-25%）と SEKAI STAY 8% の差額・年間損失見込み額を可視化したレポートをお送りします。
        </p>
      </div>
      <ReportRequestForm embed={false} />
    </main>
  );
}
