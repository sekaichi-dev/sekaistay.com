"use client";

import { useScrollFade } from "@/hooks/useScrollFade";
import Image from "next/image";
import SectionHead from "../deco/SectionHead";

export default function CompanyInfo() {
  const ref = useScrollFade();

  return (
    <section id="company" className="py-16 sm:py-20 bg-white" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="fade-in mb-10">
          <SectionHead
            enLabel="Company"
            jaTitle={<>会社概要</>}
          />
        </div>

        <div className="fade-in bg-switch-cloud rounded-2xl p-6 sm:p-8 border border-switch-gray-light">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-switch-gray-light">
            <Image src="/images/switch/logo-symbol.png" alt="SEKAI STAY" width={32} height={43} className="h-10 w-auto object-contain" />
            <div>
              <p className="font-bold text-black text-lg">SEKAI STAY</p>
              <p className="text-xs text-switch-gray-mid">株式会社セカイチ（SEKAICHI Inc.）が運営</p>
            </div>
          </div>

          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-switch-gray-light">
                <td className="py-3 pr-4 text-switch-gray-mid font-bold w-28 sm:w-36 align-top">会社名</td>
                <td className="py-3 text-switch-charcoal">株式会社セカイチ（SEKAICHI Inc.）</td>
              </tr>
              <tr className="border-b border-switch-gray-light">
                <td className="py-3 pr-4 text-switch-gray-mid font-bold align-top">代表者</td>
                <td className="py-3 text-switch-charcoal">劉 添毅（リュウ テンイチ）<br />明神 洸次郎（ミョウジン コウジロウ）</td>
              </tr>
              <tr className="border-b border-switch-gray-light">
                <td className="py-3 pr-4 text-switch-gray-mid font-bold align-top">所在地</td>
                <td className="py-3 text-switch-charcoal">〒153-0042<br />東京都目黒区青葉台2-20-7 KM中目黒ビル1F</td>
              </tr>
              <tr className="border-b border-switch-gray-light">
                <td className="py-3 pr-4 text-switch-gray-mid font-bold align-top">資本金<br /><span className="font-normal text-[10px]">(資本準備金含む)</span></td>
                <td className="py-3 text-switch-charcoal">3,200万円</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-switch-gray-mid font-bold align-top">法人番号</td>
                <td className="py-3 text-switch-charcoal">4011001162956</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
